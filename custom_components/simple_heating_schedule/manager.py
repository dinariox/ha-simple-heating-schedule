"""Persist schedules and apply their setpoints to climate entities."""

from datetime import datetime
import logging
from typing import Any

from homeassistant.components.climate import ClimateEntityFeature
from homeassistant.components.climate.const import DEFAULT_MAX_TEMP, DEFAULT_MIN_TEMP
from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant, callback
from homeassistant.exceptions import HomeAssistantError
from homeassistant.helpers.event import async_track_time_change
from homeassistant.helpers.storage import Store
from homeassistant.util import dt as dt_util

from .const import CONF_ENTITY_IDS, DOMAIN
from .schedule import changes_at, current_temperature, empty_days, normalize_days

_LOGGER = logging.getLogger(__name__)


class ScheduleManager:
    """Manage a persisted set of per-thermostat weekly schedules."""

    def __init__(self, hass: HomeAssistant, entry: ConfigEntry) -> None:
        self.hass = hass
        self.entity_ids: list[str] = entry.data[CONF_ENTITY_IDS]
        self.store = Store(hass, 1, f"{DOMAIN}.{entry.entry_id}")
        self.schedules: dict[str, dict[str, Any]] = {}
        self.global_enabled = True
        self._unsubscribe_time: Any = None
        self._switch_entities: list[Any] = []

    async def async_load(self) -> None:
        """Load stored schedules and initialize newly selected thermostats."""
        saved = await self.store.async_load()
        if saved is not None and not isinstance(saved, dict):
            raise HomeAssistantError("Stored heating schedules have an invalid format.")

        stored_entities = saved.get("entities", {}) if saved is not None else {}
        if not isinstance(stored_entities, dict):
            raise HomeAssistantError("Stored heating schedules have an invalid format.")
        global_enabled = saved.get("global_enabled", True) if saved is not None else True
        if not isinstance(global_enabled, bool):
            raise HomeAssistantError("The stored global schedule state is invalid.")
        self.global_enabled = global_enabled

        for entity_id in self.entity_ids:
            stored = stored_entities.get(entity_id)
            if stored is None:
                self.schedules[entity_id] = {"enabled": True, "days": empty_days()}
                continue
            try:
                if not isinstance(stored, dict) or not isinstance(stored.get("enabled"), bool):
                    raise ValueError("Invalid enabled state.")
                self.schedules[entity_id] = {
                    "enabled": stored["enabled"],
                    "days": normalize_days(stored.get("days")),
                }
            except ValueError as err:
                raise HomeAssistantError(
                    f"Stored schedule for {entity_id} is invalid: {err}"
                ) from err

        await self._async_save()

    async def async_start(self) -> None:
        """Apply the current setpoint and listen for minute changes."""
        self._unsubscribe_time = async_track_time_change(
            self.hass, self._handle_time_change, second=0
        )
        await self._async_apply_current_schedules()

    async def async_stop(self) -> None:
        """Stop the schedule clock."""
        if self._unsubscribe_time is not None:
            self._unsubscribe_time()
            self._unsubscribe_time = None

    def register_switch_entity(self, entity: Any) -> None:
        """Register the global switch entity for state updates."""
        self._switch_entities.append(entity)

    def unregister_switch_entity(self, entity: Any) -> None:
        """Unregister the global switch entity."""
        if entity in self._switch_entities:
            self._switch_entities.remove(entity)

    def _notify_switch_entities(self) -> None:
        for entity in self._switch_entities:
            entity.async_write_ha_state()

    async def async_get_state(self) -> dict[str, Any]:
        """Return a copy of all schedules for the panel."""
        return {
            "global_enabled": self.global_enabled,
            "entities": {
                entity_id: {
                    "enabled": schedule["enabled"],
                    "days": {
                        day: [dict(row) for row in rows]
                        for day, rows in schedule["days"].items()
                    },
                }
                for entity_id, schedule in self.schedules.items()
            }
        }

    async def async_set_schedule(
        self, entity_id: str, raw_days: Any
    ) -> dict[str, Any]:
        """Validate and save an entity's weekly schedule."""
        self._require_entity(entity_id)
        days = normalize_days(raw_days)
        self._validate_entity_temperature_limits(entity_id, days)
        previous_days = self.schedules[entity_id]["days"]
        self.schedules[entity_id]["days"] = days
        try:
            await self._async_save()
        except (HomeAssistantError, OSError):
            self.schedules[entity_id]["days"] = previous_days
            raise

        warning = None
        if self.global_enabled and self.schedules[entity_id]["enabled"]:
            temperature = current_temperature(days, dt_util.now())
            if temperature is not None:
                try:
                    await self._async_apply_temperature(entity_id, temperature)
                except HomeAssistantError as err:
                    warning = f"Schedule saved, but the current setpoint could not be applied: {err}"
        return await self._state_with_warning(warning)

    async def async_set_enabled(
        self, entity_id: str, enabled: bool
    ) -> dict[str, Any]:
        """Set an entity's schedule enabled state."""
        self._require_entity(entity_id)
        if not isinstance(enabled, bool):
            raise ValueError("The enabled state must be true or false.")

        previous_enabled = self.schedules[entity_id]["enabled"]
        self.schedules[entity_id]["enabled"] = enabled
        try:
            await self._async_save()
        except (HomeAssistantError, OSError):
            self.schedules[entity_id]["enabled"] = previous_enabled
            raise
        warning = None
        if self.global_enabled and enabled:
            temperature = current_temperature(
                self.schedules[entity_id]["days"], dt_util.now()
            )
            if temperature is not None:
                try:
                    await self._async_apply_temperature(entity_id, temperature)
                except HomeAssistantError as err:
                    warning = f"Schedule enabled, but the current setpoint could not be applied: {err}"
        return await self._state_with_warning(warning)

    async def async_set_global_enabled(self, enabled: bool) -> dict[str, Any]:
        """Enable or disable schedules globally."""
        if not isinstance(enabled, bool):
            raise ValueError("The enabled state must be true or false.")

        previous_enabled = self.global_enabled
        self.global_enabled = enabled
        try:
            await self._async_save()
        except (HomeAssistantError, OSError):
            self.global_enabled = previous_enabled
            raise

        warning = None
        if enabled:
            now = dt_util.now()
            for entity_id, schedule in self.schedules.items():
                if not schedule["enabled"]:
                    continue
                temperature = current_temperature(schedule["days"], now)
                if temperature is None:
                    continue
                try:
                    await self._async_apply_temperature(entity_id, temperature)
                except HomeAssistantError as err:
                    warning = (
                        f"Heating schedules enabled, but {entity_id}'s "
                        f"setpoint could not be applied: {err}"
                    )
                    break

        self._notify_switch_entities()
        return await self._state_with_warning(warning)

    async def _state_with_warning(self, warning: str | None) -> dict[str, Any]:
        state = await self.async_get_state()
        if warning is not None:
            state["warning"] = warning
        return state

    async def _async_save(self) -> None:
        await self.store.async_save(
            {"global_enabled": self.global_enabled, "entities": self.schedules}
        )

    def _require_entity(self, entity_id: str) -> None:
        if entity_id not in self.schedules:
            raise ValueError(f"{entity_id} is not configured for heating schedules.")

    def _validate_entity_temperature_limits(
        self, entity_id: str, days: dict[str, list[dict[str, Any]]]
    ) -> None:
        state = self.hass.states.get(entity_id)
        minimum = (
            state.attributes.get("min_temp", DEFAULT_MIN_TEMP)
            if state is not None
            else DEFAULT_MIN_TEMP
        )
        maximum = (
            state.attributes.get("max_temp", DEFAULT_MAX_TEMP)
            if state is not None
            else DEFAULT_MAX_TEMP
        )
        minimum = DEFAULT_MIN_TEMP if minimum is None else float(minimum)
        maximum = DEFAULT_MAX_TEMP if maximum is None else float(maximum)
        for rows in days.values():
            for row in rows:
                temperature = row["temperature"]
                if minimum is not None and temperature < minimum:
                    raise ValueError(
                        f"{temperature:g}° is below {entity_id}'s minimum "
                        f"temperature of {minimum}°."
                    )
                if maximum is not None and temperature > maximum:
                    raise ValueError(
                        f"{temperature:g}° is above {entity_id}'s maximum "
                        f"temperature of {maximum}°."
                    )

    async def _async_apply_temperature(
        self, entity_id: str, temperature: float
    ) -> None:
        state = self.hass.states.get(entity_id)
        if state is None or state.state in ("unknown", "unavailable"):
            raise HomeAssistantError(f"{entity_id} is not currently available.")

        features = int(state.attributes.get("supported_features", 0) or 0)
        if not (
            features & ClimateEntityFeature.TARGET_TEMPERATURE
            or "temperature" in state.attributes
        ):
            raise HomeAssistantError(
                f"{entity_id} does not support a target temperature."
            )

        await self.hass.services.async_call(
            "climate",
            "set_temperature",
            {"entity_id": entity_id, "temperature": temperature},
            blocking=True,
        )

    async def _async_apply_current_schedules(self) -> None:
        if not self.global_enabled:
            return
        now = dt_util.now()
        for entity_id, schedule in self.schedules.items():
            if not schedule["enabled"]:
                continue
            temperature = current_temperature(schedule["days"], now)
            if temperature is None:
                continue
            try:
                await self._async_apply_temperature(entity_id, temperature)
            except HomeAssistantError:
                _LOGGER.exception("Unable to apply the schedule for %s", entity_id)

    async def _async_handle_time_change(self, now: datetime) -> None:
        """Apply only changes scheduled for this minute."""
        if not self.global_enabled:
            return
        for entity_id, schedule in self.schedules.items():
            if not schedule["enabled"]:
                continue
            for change in changes_at(schedule["days"], now):
                try:
                    await self._async_apply_temperature(
                        entity_id, change["temperature"]
                    )
                except HomeAssistantError:
                    _LOGGER.exception(
                        "Unable to apply the scheduled change for %s", entity_id
                    )

    @callback
    def _handle_time_change(self, now: datetime) -> None:
        """Schedule the async setpoint updates for this minute."""
        self.hass.async_create_task(self._async_handle_time_change(now))
