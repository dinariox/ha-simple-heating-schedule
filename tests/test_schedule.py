"""Tests for the schedule evaluation helpers."""

from datetime import datetime
from pathlib import Path
import sys
import unittest

sys.path.insert(
    0,
    str(
        Path(__file__).resolve().parents[1]
        / "custom_components"
        / "simple_heating_schedule"
    ),
)

from schedule import (
    changes_at,
    current_temperature,
    empty_days,
    normalize_days,
)


class ScheduleTests(unittest.TestCase):
    def test_normalize_sorts_changes_and_converts_temperature(self) -> None:
        days = empty_days()
        days["0"] = [
            {"time": "16:00", "temperature": 23},
            {"time": "06:00", "temperature": 22},
        ]

        result = normalize_days(days)

        self.assertEqual(
            result["0"],
            [
                {"time": "06:00", "temperature": 22.0},
                {"time": "16:00", "temperature": 23.0},
            ],
        )

    def test_rejects_duplicate_times(self) -> None:
        days = empty_days()
        days["1"] = [
            {"time": "09:00", "temperature": 19},
            {"time": "09:00", "temperature": 20},
        ]

        with self.assertRaisesRegex(ValueError, "Only one setpoint"):
            normalize_days(days)

    def test_rejects_invalid_time_format(self) -> None:
        days = empty_days()
        days["1"] = [{"time": "25:00", "temperature": 19}]

        with self.assertRaisesRegex(ValueError, "24-hour HH:MM"):
            normalize_days(days)

    def test_rejects_non_finite_temperature(self) -> None:
        days = empty_days()
        days["1"] = [{"time": "09:00", "temperature": float("nan")}]

        with self.assertRaisesRegex(ValueError, "between -100 and 100"):
            normalize_days(days)

    def test_current_temperature_uses_latest_change_today(self) -> None:
        days = empty_days()
        days["0"] = [
            {"time": "06:00", "temperature": 22},
            {"time": "09:00", "temperature": 19},
        ]

        self.assertEqual(
            current_temperature(days, datetime(2026, 11, 23, 10, 0)), 19.0
        )

    def test_current_temperature_carries_forward_from_previous_day(self) -> None:
        days = empty_days()
        days["6"] = [{"time": "22:00", "temperature": 16}]

        self.assertEqual(
            current_temperature(days, datetime(2026, 11, 23, 6, 0)), 16.0
        )

    def test_current_temperature_repeats_the_weekly_schedule(self) -> None:
        days = empty_days()
        days["0"] = [{"time": "08:00", "temperature": 20}]

        self.assertEqual(
            current_temperature(days, datetime(2026, 11, 23, 7, 0)), 20.0
        )
        self.assertEqual(
            current_temperature(days, datetime(2026, 11, 30, 7, 0)), 20.0
        )

    def test_current_temperature_is_empty_without_any_changes(self) -> None:
        self.assertIsNone(
            current_temperature(empty_days(), datetime(2026, 11, 23, 7, 0))
        )

    def test_changes_at_matches_only_the_current_minute(self) -> None:
        days = empty_days()
        days["2"] = [{"time": "16:00", "temperature": 23}]

        self.assertEqual(
            changes_at(days, datetime(2026, 11, 25, 16, 0)),
            [{"time": "16:00", "temperature": 23}],
        )
        self.assertEqual(changes_at(days, datetime(2026, 11, 25, 16, 1)), [])


if __name__ == "__main__":
    unittest.main()
