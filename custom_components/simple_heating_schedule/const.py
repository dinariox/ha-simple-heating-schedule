"""Constants for the Simple Heating Schedule integration."""

DOMAIN = "simple_heating_schedule"
CONF_ENTITY_IDS = "entity_ids"

PANEL_URL_PATH = "simple-heating-schedule"
PANEL_WEB_COMPONENT = "simple-heating-schedule-panel"
PANEL_STATIC_PATH = "/simple_heating_schedule/panel.js"
PANEL_MODULE_URL = PANEL_STATIC_PATH

WEEKDAYS = (
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
)

MODE_ON = "on"
MODE_AWAY = "away"
MODE_OFF = "off"
GLOBAL_MODES = (MODE_ON, MODE_AWAY, MODE_OFF)
