"""Simple Heating Schedule integration."""

from pathlib import Path

from homeassistant.components import frontend
from homeassistant.components.http import StaticPathConfig
from homeassistant.components.panel_custom import async_register_panel
from homeassistant.config_entries import ConfigEntry
from homeassistant.const import Platform
from homeassistant.core import HomeAssistant
from homeassistant.exceptions import HomeAssistantError
from homeassistant.helpers.typing import ConfigType

from .const import (
    DOMAIN,
    PANEL_MODULE_URL,
    PANEL_STATIC_PATH,
    PANEL_URL_PATH,
    PANEL_WEB_COMPONENT,
)
from .manager import ScheduleManager
from .websocket import async_register_websocket_commands


async def async_setup(hass: HomeAssistant, config: ConfigType) -> bool:
    """Set up the integration."""
    return True


async def async_setup_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    """Set up a configured schedule manager and its panel."""
    manager = ScheduleManager(hass, entry)
    await manager.async_load()

    if not hass.data.get(f"{DOMAIN}_websocket_registered"):
        async_register_websocket_commands(hass)
        hass.data[f"{DOMAIN}_websocket_registered"] = True

    if not hass.data.get(f"{DOMAIN}_static_registered"):
        panel_path = Path(__file__).parent / "www" / "panel.js"
        await hass.http.async_register_static_paths(
            [StaticPathConfig(PANEL_STATIC_PATH, str(panel_path), cache_headers=False)]
        )
        hass.data[f"{DOMAIN}_static_registered"] = True

    if frontend.async_panel_exists(hass, PANEL_URL_PATH):
        raise HomeAssistantError(
            f"The panel URL path {PANEL_URL_PATH} is already in use."
        )

    hass.data[DOMAIN] = manager
    try:
        await async_register_panel(
            hass,
            frontend_url_path=PANEL_URL_PATH,
            webcomponent_name=PANEL_WEB_COMPONENT,
            sidebar_title="Heating schedules",
            sidebar_icon="mdi:calendar-clock",
            module_url=PANEL_MODULE_URL,
            require_admin=False,
        )
    except ValueError:
        hass.data.pop(DOMAIN, None)
        raise
    await manager.async_start()
    await hass.config_entries.async_forward_entry_setups(entry, [Platform.SELECT])
    return True


async def async_unload_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    """Unload a configured schedule manager."""
    manager: ScheduleManager = hass.data[DOMAIN]
    await manager.async_stop()
    await hass.config_entries.async_unload_platforms(entry, [Platform.SELECT])
    hass.data.pop(DOMAIN)
    frontend.async_remove_panel(hass, PANEL_URL_PATH, warn_if_unknown=False)
    return True
