# Simple Heating Schedule

A Home Assistant custom integration for managing a weekly heating schedule for each climate entity from a dedicated sidebar panel. It is a full panel, not a Lovelace card.

## Features

- One independent schedule and enable toggle per thermostat.
- Add setpoint changes by time for each weekday.
- Copy one day's schedule to another.
- View a read-only graph of the day's setpoints.
- Manual thermostat adjustments remain in effect until the next scheduled change.
- Disabling a schedule stops scheduled commands without changing the current thermostat setpoint.

## Installation

Install **Simple Heating Schedule** as a custom repository in HACS, then restart Home Assistant. Alternatively, copy `custom_components/simple_heating_schedule` into the `custom_components` directory in your Home Assistant configuration and restart.

In Home Assistant, go to **Settings → Devices & services → Add integration**, search for **Simple Heating Schedule**, and select the climate entities to manage. The **Heating schedules** panel will appear in the sidebar.

## Using schedules

Select a thermostat and weekday, then add the times and target temperatures for that day. Changes are saved with **Save schedule**. Use **Copy day** to duplicate a day to another weekday. The chart previews the setpoint steps and is not editable.

Each schedule is enabled independently. While enabled, the integration applies the active scheduled setpoint at startup and when saving or enabling a schedule, then applies each later change at its scheduled local time. If someone adjusts the thermostat manually, that setpoint is not changed again until the next scheduled change. When disabled, the integration sends no scheduled temperature commands and leaves the current setpoint unchanged.

New schedules start empty and do not send a setpoint until a temperature change has been added.
Climate entities must support a target temperature. Temperature limits advertised by an entity are enforced when saving its schedule.


## Development

The schedule validation and time-evaluation helpers have standard-library tests:

```sh
python3 -m unittest discover -s tests
```
