"""Global switch for Simple Heating Schedule."""

from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant
from homeassistant.helpers.entity import DeviceInfo
from homeassistant.helpers.entity_platform import AddEntitiesCallback
from homeassistant.components.select import SelectEntity

from .const import DOMAIN
from .manager import ScheduleManager


async def async_setup_entry(
    hass: HomeAssistant,
    entry: ConfigEntry,
    async_add_entities: AddEntitiesCallback,
) -> None:
    """Set up the global heating mode select."""
    manager: ScheduleManager = hass.data[DOMAIN]
    async_add_entities([GlobalHeatingModeSelect(manager, entry)])


class GlobalHeatingModeSelect(SelectEntity):
    """Select that chooses On, Away, or Off for every heating schedule."""

    _attr_has_entity_name = True
    _attr_icon = "mdi:calendar-clock"
    _attr_translation_key = "heating_mode"
    _attr_options = ["on", "away", "off"]

    def __init__(self, manager: ScheduleManager, entry: ConfigEntry) -> None:
        self._manager = manager
        self._attr_unique_id = f"{entry.entry_id}_global_mode"
        self._attr_device_info = DeviceInfo(
            identifiers={(DOMAIN, entry.entry_id)},
            name="Simple Heating Schedule",
            manufacturer="Simple Heating Schedule",
        )

    @property
    def current_option(self) -> str:
        """Return the current global mode."""
        return self._manager.global_mode

    async def async_select_option(self, option: str) -> None:
        """Select a global heating mode."""
        await self._manager.async_set_global_mode(option.lower())

    async def async_added_to_hass(self) -> None:
        await super().async_added_to_hass()
        self._manager.register_switch_entity(self)

    async def async_will_remove_from_hass(self) -> None:
        self._manager.unregister_switch_entity(self)
        await super().async_will_remove_from_hass()
