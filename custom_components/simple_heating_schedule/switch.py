"""Global switch for Simple Heating Schedule."""

from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant
from homeassistant.helpers.entity import DeviceInfo
from homeassistant.helpers.entity_platform import AddEntitiesCallback
from homeassistant.components.switch import SwitchEntity

from .const import DOMAIN
from .manager import ScheduleManager


async def async_setup_entry(
    hass: HomeAssistant,
    entry: ConfigEntry,
    async_add_entities: AddEntitiesCallback,
) -> None:
    """Set up the global heating schedules switch."""
    manager: ScheduleManager = hass.data[DOMAIN]
    async_add_entities([GlobalHeatingSchedulesSwitch(manager, entry)])


class GlobalHeatingSchedulesSwitch(SwitchEntity):
    """Switch that enables or disables every heating schedule."""

    _attr_has_entity_name = True
    _attr_icon = "mdi:calendar-clock"
    _attr_name = "Heating schedules"
    _attr_translation_key = "heating_schedules"

    def __init__(self, manager: ScheduleManager, entry: ConfigEntry) -> None:
        self._manager = manager
        self._attr_unique_id = f"{entry.entry_id}_global_enabled"
        self._attr_device_info = DeviceInfo(
            identifiers={(DOMAIN, entry.entry_id)},
            name="Simple Heating Schedule",
            manufacturer="Simple Heating Schedule",
        )

    @property
    def is_on(self) -> bool:
        """Return whether all schedules are globally enabled."""
        return self._manager.global_enabled

    async def async_turn_on(self, **kwargs) -> None:
        await self._manager.async_set_global_enabled(True)

    async def async_turn_off(self, **kwargs) -> None:
        await self._manager.async_set_global_enabled(False)

    async def async_added_to_hass(self) -> None:
        await super().async_added_to_hass()
        self._manager.register_switch_entity(self)

    async def async_will_remove_from_hass(self) -> None:
        self._manager.unregister_switch_entity(self)
        await super().async_will_remove_from_hass()
