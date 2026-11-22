"""Config flow for Simple Heating Schedule."""

from typing import Any

import voluptuous as vol

from homeassistant import config_entries
from homeassistant.components.climate import ClimateEntityFeature
from homeassistant.data_entry_flow import FlowResult
from homeassistant.helpers import selector

from .const import CONF_ENTITY_IDS, DOMAIN


class SimpleHeatingScheduleConfigFlow(config_entries.ConfigFlow, domain=DOMAIN):
    """Configure climate entities managed by the integration."""

    VERSION = 1

    async def async_step_user(
        self, user_input: dict[str, Any] | None = None
    ) -> FlowResult:
        """Select thermostats to manage."""
        if user_input is not None:
            await self.async_set_unique_id(DOMAIN)
            self._abort_if_unique_id_configured()

            entity_ids = list(dict.fromkeys(user_input.get(CONF_ENTITY_IDS) or []))
            if not entity_ids:
                return self.async_show_form(
                    step_id="user",
                    data_schema=self._schema(),
                    errors={"base": "select_at_least_one"},
                )

            unsupported = []
            for entity_id in entity_ids:
                state = self.hass.states.get(entity_id)
                if state is None or state.state in ("unknown", "unavailable"):
                    continue
                features = int(state.attributes.get("supported_features", 0) or 0)
                if not (
                    features & ClimateEntityFeature.TARGET_TEMPERATURE
                    or "temperature" in state.attributes
                ):
                    unsupported.append(entity_id)
            if unsupported:
                return self.async_show_form(
                    step_id="user",
                    data_schema=self._schema(),
                    errors={"base": "unsupported_entities"},
                    description_placeholders={"entity_ids": ", ".join(unsupported)},
                )

            return self.async_create_entry(
                title="Simple Heating Schedule",
                data={CONF_ENTITY_IDS: entity_ids},
            )

        return self.async_show_form(step_id="user", data_schema=self._schema())

    @staticmethod
    def _schema() -> vol.Schema:
        return vol.Schema(
            {
                vol.Required(CONF_ENTITY_IDS): selector.EntitySelector(
                    selector.EntitySelectorConfig(domain="climate", multiple=True)
                )
            }
        )
