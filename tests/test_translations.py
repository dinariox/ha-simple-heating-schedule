"""Tests for the integration's custom translation files."""

import json
from pathlib import Path
import unittest

TRANSLATIONS = (
    Path(__file__).resolve().parents[1]
    / "custom_components"
    / "simple_heating_schedule"
    / "translations"
)


class TranslationTests(unittest.TestCase):
    def test_english_and_german_have_matching_keys(self) -> None:
        english = json.loads((TRANSLATIONS / "en.json").read_text())
        german = json.loads((TRANSLATIONS / "de.json").read_text())

        self.assertEqual(_key_shape(english), _key_shape(german))

    def test_setup_entity_selector_has_a_human_friendly_label_and_description(self) -> None:
        for language in ("en", "de"):
            with self.subTest(language=language):
                translations = json.loads((TRANSLATIONS / f"{language}.json").read_text())
                step = translations["config"]["step"]["user"]
                self.assertNotEqual(step["data"]["entity_ids"], "entity_ids")
                self.assertTrue(step["data_description"]["entity_ids"])
                self.assertTrue(step["description"])


def _key_shape(value: object) -> object:
    if isinstance(value, dict):
        return {key: _key_shape(child) for key, child in value.items()}
    return None


if __name__ == "__main__":
    unittest.main()
