"""Pure helpers for validating and evaluating weekly schedules."""

from datetime import datetime
import math
import re
from typing import Any

_TIME_PATTERN = re.compile(r"^(?:[01]\d|2[0-3]):[0-5]\d$")
_DAY_KEYS = {str(day) for day in range(7)}
GLOBAL_MODES = {"on", "away", "off"}


def empty_days() -> dict[str, list[dict[str, Any]]]:
    """Return an empty schedule for all weekdays."""
    return {str(day): [] for day in range(7)}


def normalize_mode(mode: Any) -> str:
    """Validate a global operating mode."""
    if mode not in GLOBAL_MODES:
        raise ValueError("Mode must be on, away, or off.")
    return mode


def normalize_days(raw_days: Any) -> dict[str, list[dict[str, Any]]]:
    """Validate and sort all weekly schedule entries."""
    if not isinstance(raw_days, dict) or set(raw_days) != _DAY_KEYS:
        raise ValueError("A schedule must contain all seven weekdays.")

    days: dict[str, list[dict[str, Any]]] = {}
    for day in range(7):
        key = str(day)
        rows = raw_days[key]
        if not isinstance(rows, list):
            raise ValueError("Each day must contain a list of setpoint changes.")

        normalized: list[dict[str, Any]] = []
        seen_times: set[str] = set()
        for row in rows:
            if not isinstance(row, dict):
                raise ValueError("Each setpoint change must have a time and temperature.")
            time_value = row.get("time")
            temperature = row.get("temperature")
            if not isinstance(time_value, str) or not _TIME_PATTERN.fullmatch(time_value):
                raise ValueError("Times must use the 24-hour HH:MM format.")
            if time_value in seen_times:
                raise ValueError(f"Only one setpoint change is allowed at {time_value}.")
            if isinstance(temperature, bool) or not isinstance(temperature, (int, float)):
                raise ValueError("Temperatures must be numeric.")
            temperature = float(temperature)
            if not math.isfinite(temperature) or not -100 <= temperature <= 100:
                raise ValueError("Temperatures must be between -100 and 100 degrees.")
            seen_times.add(time_value)
            normalized.append({"time": time_value, "temperature": temperature})

        days[key] = sorted(normalized, key=lambda item: item["time"])

    return days


def current_temperature(days: dict[str, list[dict[str, Any]]], when: datetime) -> float | None:
    """Return the most recent setpoint at or before the given local time."""
    weekday = when.weekday()
    current_minute = when.hour * 60 + when.minute

    for days_ago in range(8):
        day_key = str((weekday - days_ago) % 7)
        rows = days[day_key]
        for row in reversed(rows):
            hour, minute = (int(part) for part in row["time"].split(":"))
            if days_ago > 0 or hour * 60 + minute <= current_minute:
                return row["temperature"]

    return None


def changes_at(
    days: dict[str, list[dict[str, Any]]], when: datetime
) -> list[dict[str, Any]]:
    """Return changes scheduled for this exact local minute."""
    day_key = str(when.weekday())
    target_time = f"{when.hour:02d}:{when.minute:02d}"
    return [row for row in days[day_key] if row["time"] == target_time]
