"""WebSocket API for the heating schedule panel."""

from typing import Any

import voluptuous as vol

from homeassistant.components import websocket_api
from homeassistant.core import HomeAssistant
from homeassistant.exceptions import HomeAssistantError

from .const import DOMAIN
from .manager import ScheduleManager


def async_register_websocket_commands(hass: HomeAssistant) -> None:
    """Register panel commands."""
    websocket_api.async_register_command(hass, websocket_get_schedules)
    websocket_api.async_register_command(hass, websocket_set_schedule)
    websocket_api.async_register_command(hass, websocket_set_enabled)
    websocket_api.async_register_command(hass, websocket_set_global_enabled)


@websocket_api.websocket_command({vol.Required("type"): f"{DOMAIN}/get"})
@websocket_api.async_response
async def websocket_get_schedules(
    hass: HomeAssistant, connection: websocket_api.ActiveConnection, msg: dict[str, Any]
) -> None:
    """Return configured entities and schedules."""
    manager = _get_manager(hass, connection, msg)
    if manager is not None:
        connection.send_result(msg["id"], await manager.async_get_state())


@websocket_api.websocket_command(
    {
        vol.Required("type"): f"{DOMAIN}/set_schedule",
        vol.Required("entity_id"): str,
        vol.Required("days"): dict,
    }
)
@websocket_api.async_response
async def websocket_set_schedule(
    hass: HomeAssistant, connection: websocket_api.ActiveConnection, msg: dict[str, Any]
) -> None:
    """Save an entity's weekly schedule."""
    manager = _get_manager(hass, connection, msg)
    if manager is None:
        return
    try:
        result = await manager.async_set_schedule(msg["entity_id"], msg["days"])
    except ValueError as err:
        connection.send_error(msg["id"], "invalid_schedule", str(err))
        return
    except (HomeAssistantError, OSError) as err:
        connection.send_error(msg["id"], "schedule_error", str(err))
        return
    connection.send_result(msg["id"], result)


@websocket_api.websocket_command(
    {
        vol.Required("type"): f"{DOMAIN}/set_enabled",
        vol.Required("entity_id"): str,
        vol.Required("enabled"): bool,
    }
)
@websocket_api.async_response
async def websocket_set_enabled(
    hass: HomeAssistant, connection: websocket_api.ActiveConnection, msg: dict[str, Any]
) -> None:
    """Enable or disable an entity's schedule."""
    manager = _get_manager(hass, connection, msg)
    if manager is None:
        return
    try:
        result = await manager.async_set_enabled(
            msg["entity_id"], msg["enabled"]
        )
    except ValueError as err:
        connection.send_error(msg["id"], "invalid_schedule", str(err))
        return
    except (HomeAssistantError, OSError) as err:
        connection.send_error(msg["id"], "schedule_error", str(err))
        return
    connection.send_result(msg["id"], result)


@websocket_api.websocket_command(
    {
        vol.Required("type"): f"{DOMAIN}/set_global_enabled",
        vol.Required("enabled"): bool,
    }
)
@websocket_api.async_response
async def websocket_set_global_enabled(
    hass: HomeAssistant, connection: websocket_api.ActiveConnection, msg: dict[str, Any]
) -> None:
    """Enable or disable heating schedules globally."""
    manager = _get_manager(hass, connection, msg)
    if manager is None:
        return
    try:
        result = await manager.async_set_global_enabled(msg["enabled"])
    except ValueError as err:
        connection.send_error(msg["id"], "invalid_schedule", str(err))
        return
    except (HomeAssistantError, OSError) as err:
        connection.send_error(msg["id"], "schedule_error", str(err))
        return
    connection.send_result(msg["id"], result)


def _get_manager(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> ScheduleManager | None:
    manager = hass.data.get(DOMAIN)
    if manager is None:
        connection.send_error(
            msg["id"], "not_loaded", "The heating schedule integration is not loaded."
        )
        return None
    return manager
