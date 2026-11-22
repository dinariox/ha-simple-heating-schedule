const PANEL_TRANSLATIONS = {
  en: {
    menu: "Menu",
    openMenu: "Open sidebar menu",
    title: "Heating schedules",
    intro: "Set a comfortable temperature for every part of your day.",
    thermostat: "Thermostat",
    scheduleEnabled: "Schedule enabled",
    scheduleOn: "Schedule on",
    scheduleOff: "Schedule paused",
    manualOverrideHint: "Manual changes last until the next scheduled change",
    pausedHint: "The current temperature is left unchanged while paused",
    currentTarget: "Current target",
    temperatureUnavailable: "Temperature unavailable",
    weekday: "Weekday",
    changesCount: "{count} changes",
    changeCount: "{count} change",
    savedState: "All changes saved",
    unsavedState: "You have unsaved changes",
    addTimes: "Add the times when this thermostat should change its target temperature.",
    addChange: "Add temperature change",
    copyTo: "Copy this day to",
    copyDay: "Copy day",
    save: "Save schedule",
    discard: "Discard changes",
    chartTitle: "Temperature through the day",
    chartDescription: "This chart is a preview only. Edit setpoints using the list above.",
    chartLabel: "Setpoint temperature over the selected day",
    preview: "Preview",
    removeChange: "Remove change at {time}",
    emptyDay: "No temperature changes for this day yet.",
    emptyHint: "Start with the time you wake up, then add changes for later in the day.",
    at: "At ",
    setTo: "set to ",
    remove: "Remove",
    chartEmpty: "Add a temperature change to preview the schedule.",
    loadingError: "Could not load heating schedules.",
    fullDay: "This day already has a change every hour. Remove one before adding another.",
    copied: "Copied {source} to {target}. Save to apply the change.",
    discarded: "Unsaved changes discarded.",
    unsaved: "Unsaved changes.",
    switchWarning: "Save or discard your unsaved changes before switching thermostats.",
    saved: "Schedule saved.",
    saveError: "Could not save this schedule.",
    enableError: "Could not change the schedule state.",
    enabled: "Schedule enabled. The current scheduled temperature was applied if one is configured.",
    disabled: "Schedule disabled. The thermostat's current setpoint was left unchanged.",
    invalidDays: "A schedule must contain all seven weekdays.",
    invalidRows: "Each day must contain a list of temperature changes.",
    invalidRow: "Each temperature change must have a time and temperature.",
    invalidTime: "Times must use the 24-hour HH:MM format.",
    duplicateTime: "Only one temperature change is allowed at {time}.",
    invalidTemperature: "Temperatures must be numeric.",
    temperatureRange: "Temperatures must be between -100 and 100 degrees.",
    belowMinimum: "{temperature}° is below {entity}'s minimum temperature of {limit}°.",
    aboveMaximum: "{temperature}° is above {entity}'s maximum temperature of {limit}°.",
    invalidEnabled: "The enabled state must be true or false.",
    notConfigured: "{entity} is not configured for heating schedules.",
    unavailable: "{entity} is not currently available.",
    unsupportedTemperature: "{entity} does not support a target temperature.",
    applyError: "The current temperature could not be applied: {error}",
    savedButApplyFailed: "Schedule saved, but {error}",
    enabledButApplyFailed: "Schedule enabled, but {error}",
  },
  de: {
    menu: "Menü",
    openMenu: "Seitenmenü öffnen",
    title: "Heizpläne",
    intro: "Stelle für jeden Tagesabschnitt deine Wohlfühltemperatur ein.",
    thermostat: "Thermostat",
    scheduleEnabled: "Zeitplan aktiviert",
    scheduleOn: "Zeitplan aktiv",
    scheduleOff: "Zeitplan pausiert",
    manualOverrideHint: "Manuelle Änderungen gelten bis zur nächsten geplanten Änderung",
    pausedHint: "Während der Pause bleibt die aktuelle Temperatur unverändert",
    currentTarget: "Aktuelle Zieltemperatur",
    temperatureUnavailable: "Temperatur nicht verfügbar",
    weekday: "Wochentag",
    changesCount: "{count} Änderungen",
    changeCount: "{count} Änderung",
    savedState: "Alle Änderungen gespeichert",
    unsavedState: "Du hast ungespeicherte Änderungen",
    addTimes: "Lege fest, wann dieses Thermostat seine Zieltemperatur ändern soll.",
    addChange: "Temperaturänderung hinzufügen",
    copyTo: "Diesen Tag kopieren nach",
    copyDay: "Tag kopieren",
    save: "Zeitplan speichern",
    discard: "Änderungen verwerfen",
    chartTitle: "Temperatur im Tagesverlauf",
    chartDescription: "Diese Grafik dient nur zur Vorschau. Bearbeite die Werte in der Liste oben.",
    chartLabel: "Zieltemperatur am ausgewählten Tag",
    preview: "Vorschau",
    removeChange: "Änderung um {time} entfernen",
    emptyDay: "Für diesen Tag sind noch keine Temperaturänderungen festgelegt.",
    emptyHint: "Beginne mit deiner Aufstehzeit und füge danach weitere Änderungen für den Tag hinzu.",
    at: "Um ",
    setTo: "einstellen auf ",
    remove: "Entfernen",
    chartEmpty: "Füge eine Temperaturänderung hinzu, um eine Vorschau zu sehen.",
    loadingError: "Heizpläne konnten nicht geladen werden.",
    fullDay: "Für diesen Tag gibt es bereits zu jeder Stunde eine Änderung. Entferne zuerst eine.",
    copied: "{source} wurde nach {target} kopiert. Speichere, um die Änderung zu übernehmen.",
    discarded: "Nicht gespeicherte Änderungen verworfen.",
    unsaved: "Nicht gespeicherte Änderungen.",
    switchWarning: "Speichere oder verwirf deine Änderungen, bevor du das Thermostat wechselst.",
    saved: "Zeitplan gespeichert.",
    saveError: "Der Zeitplan konnte nicht gespeichert werden.",
    enableError: "Der Status des Zeitplans konnte nicht geändert werden.",
    enabled: "Zeitplan aktiviert. Die aktuell geplante Temperatur wurde übernommen, sofern eine festgelegt ist.",
    disabled: "Zeitplan deaktiviert. Die aktuelle Zieltemperatur des Thermostats bleibt unverändert.",
    invalidDays: "Ein Zeitplan muss alle sieben Wochentage enthalten.",
    invalidRows: "Für jeden Tag muss eine Liste von Temperaturänderungen angegeben werden.",
    invalidRow: "Jede Temperaturänderung benötigt eine Uhrzeit und eine Temperatur.",
    invalidTime: "Uhrzeiten müssen im 24-Stunden-Format HH:MM angegeben werden.",
    duplicateTime: "Um {time} ist nur eine Temperaturänderung zulässig.",
    invalidTemperature: "Temperaturen müssen numerisch sein.",
    temperatureRange: "Temperaturen müssen zwischen -100 und 100 Grad liegen.",
    belowMinimum: "{temperature}° liegt unter der Mindesttemperatur von {entity} ({limit}°).",
    aboveMaximum: "{temperature}° liegt über der Höchsttemperatur von {entity} ({limit}°).",
    invalidEnabled: "Der Aktivierungsstatus muss wahr oder falsch sein.",
    notConfigured: "{entity} ist nicht für Heizpläne eingerichtet.",
    unavailable: "{entity} ist derzeit nicht verfügbar.",
    unsupportedTemperature: "{entity} unterstützt keine Zieltemperatur.",
    applyError: "Die aktuelle Temperatur konnte nicht übernommen werden: {error}",
    savedButApplyFailed: "Zeitplan gespeichert, aber {error}",
    enabledButApplyFailed: "Zeitplan aktiviert, aber {error}",
  },
};

class SimpleHeatingSchedulePanel extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this._state = null;
    this._selectedEntity = null;
    this._selectedDay = 0;
    this._initialDaySet = false;
    this._draftDays = null;
    this._dirty = false;
  }

  set hass(hass) {
    this._hass = hass;
    const language = (hass.locale?.language || "en").toLowerCase().split("-")[0];
    if (language !== this._language) {
      this._language = language;
      this._weekdays = Array.from({ length: 7 }, (_, index) =>
        new Intl.DateTimeFormat(this._language, { weekday: "long", timeZone: "UTC" }).format(
          new Date(Date.UTC(2026, 0, 5 + index)),
        ),
      );
      this._shortWeekdays = Array.from({ length: 7 }, (_, index) =>
        new Intl.DateTimeFormat(this._language, { weekday: "short", timeZone: "UTC" }).format(
          new Date(Date.UTC(2026, 0, 5 + index)),
        ),
      );
      if (this._ready) {
        this._renderShell();
        this._render();
      }
    }
    if (
      !this._ready &&
      !this._loading &&
      this.isConnected &&
      this.shadowRoot.getElementById("status")
    ) {
      this._load();
    }
  }

  set narrow(narrow) {
    this._narrow = narrow;
    const menu = this.shadowRoot.getElementById("menu");
    if (menu) {
      menu.hidden = !narrow;
    }
  }

  connectedCallback() {
    this._renderShell();
    this.shadowRoot.getElementById("menu").hidden = !this._narrow;
    if (!this._eventsRegistered) {
      this.shadowRoot.addEventListener("click", (event) => this._handleClick(event));
      this.shadowRoot.addEventListener("change", (event) => this._handleChange(event));
      this.shadowRoot.addEventListener("input", (event) => this._handleInput(event));
      this._eventsRegistered = true;
    }
    this._load();
  }

  async _load() {
    if (!this._hass || this._loading) {
      return;
    }
    this._loading = true;
    try {
      this._state = await this._hass.callWS({
        type: "simple_heating_schedule/get",
      });
      if (!this._initialDaySet) {
        const timeZone = this._hass.config?.time_zone;
        const options = timeZone
          ? { weekday: "long", timeZone }
          : { weekday: "long" };
        const today = new Intl.DateTimeFormat(
          this._language || "en",
          options,
        ).format(new Date());
        this._selectedDay = Math.max(0, this._weekdays.indexOf(today));
        this._initialDaySet = true;
      }
      const entities = Object.keys(this._state.entities);
      if (!entities.includes(this._selectedEntity)) {
        this._selectedEntity = entities[0] || null;
      }
      this._copySelectedDays();
      this._ready = true;
      this._render();
    } catch (error) {
      this._showStatus(this._backendMessage(error, "loadingError"), true);
    } finally {
      this._loading = false;
    }
  }

  _renderShell() {
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          --schedule-accent: var(--primary-color, #03a9f4);
          --schedule-card: var(--card-background-color, var(--primary-background-color, #fff));
          --schedule-soft: var(--secondary-background-color, #f3f5f7);
          display: block;
          color: var(--primary-text-color);
          font-family: var(--paper-font-body1_-_font-family, sans-serif);
        }
        * { box-sizing: border-box; }
        main { max-width: 960px; margin: 0 auto; padding: 30px 24px 56px; }
        header { position: relative; display: flex; align-items: center; gap: 16px; margin-bottom: 25px; }
        .hero-icon { display: grid; width: 54px; height: 54px; flex: 0 0 54px; place-items: center; border-radius: 17px; color: var(--schedule-accent); background: color-mix(in srgb, var(--schedule-accent) 13%, var(--schedule-card)); }
        .hero-icon svg { width: 29px; height: 29px; }
        h1 { margin: 0; font-size: clamp(1.55rem, 3vw, 2rem); font-weight: 650; letter-spacing: -.035em; }
        .intro { margin: 5px 0 0; color: var(--secondary-text-color); font-size: .98rem; }
        .menu { display: none; }
        .menu:not([hidden]) { display: inline-block; }
        h2 { margin: 0; font-size: 1.2rem; font-weight: 620; letter-spacing: -.015em; }
        p { line-height: 1.55; }
        button, select, input { font: inherit; }
        button { display: inline-flex; min-height: 42px; align-items: center; justify-content: center; gap: 8px; border: 0; border-radius: 11px; padding: 9px 16px; color: var(--text-primary-color, #fff); background: var(--schedule-accent); font-weight: 600; cursor: pointer; transition: filter .15s ease, transform .15s ease, background .15s ease; }
        button:hover:not(:disabled) { filter: brightness(1.06); transform: translateY(-1px); }
        button:focus-visible, select:focus-visible, input:focus-visible { outline: 3px solid color-mix(in srgb, var(--schedule-accent) 45%, transparent); outline-offset: 2px; }
        button.secondary { color: var(--primary-text-color); background: var(--schedule-soft); }
        button.danger { min-height: 38px; padding: 7px 11px; color: var(--secondary-text-color); background: transparent; }
        button.danger:hover:not(:disabled) { color: var(--error-color, #b3261e); background: var(--schedule-soft); }
        button:disabled { opacity: .48; cursor: default; transform: none; }
        select, input { min-height: 44px; border: 1px solid var(--divider-color); border-radius: 10px; padding: 8px 12px; color: var(--primary-text-color); background: var(--schedule-card); }
        select { cursor: pointer; }
        .device-card, .card { border: 1px solid var(--divider-color); border-radius: 18px; background: var(--schedule-card); box-shadow: 0 3px 14px rgba(0, 0, 0, .035); }
        .device-card { display: flex; align-items: center; justify-content: space-between; gap: 20px; padding: 18px 20px; }
        .device-picker { display: grid; min-width: min(100%, 360px); gap: 6px; }
        .current-target { display: flex; align-items: baseline; gap: 7px; color: var(--secondary-text-color); font-size: .82rem; }
        .current-target strong { color: var(--primary-text-color); font-size: .95rem; font-weight: 650; }
        .field-label { color: var(--secondary-text-color); font-size: .8rem; font-weight: 650; letter-spacing: .045em; text-transform: uppercase; }
        .device-picker select { width: 100%; font-size: 1rem; font-weight: 550; }
        .enabled { display: inline-flex; align-items: center; gap: 11px; cursor: pointer; }
        .enabled input { position: relative; width: 48px; height: 28px; min-height: 0; flex: 0 0 48px; margin: 0; appearance: none; border: 0; border-radius: 99px; padding: 3px; background: var(--disabled-color, #929292); cursor: pointer; transition: background .2s ease; }
        .enabled input::before { display: block; width: 22px; height: 22px; border-radius: 50%; background: white; box-shadow: 0 1px 3px rgba(0,0,0,.22); content: ""; transition: transform .2s ease; }
        .enabled input:checked { background: var(--schedule-accent); }
        .enabled input:checked::before { transform: translateX(20px); }
        .enabled input:focus-visible { outline: 3px solid color-mix(in srgb, var(--schedule-accent) 45%, transparent); outline-offset: 2px; }
        .enabled-copy { display: grid; gap: 3px; }
        .enabled-copy strong { font-size: .95rem; font-weight: 620; }
        .enabled-copy span { color: var(--secondary-text-color); font-size: .82rem; }
        .status { min-height: 0; margin: 0; color: var(--success-color, #26734d); }
        .status:not(:empty) { margin-top: 12px; padding: 11px 14px; border: 1px solid color-mix(in srgb, var(--success-color, #26734d) 24%, transparent); border-radius: 11px; background: color-mix(in srgb, var(--success-color, #26734d) 8%, var(--schedule-card)); }
        .status.error:not(:empty) { color: var(--error-color, #b3261e); border-color: color-mix(in srgb, var(--error-color, #b3261e) 24%, transparent); background: color-mix(in srgb, var(--error-color, #b3261e) 7%, var(--schedule-card)); }
        .tabs { display: grid; grid-template-columns: repeat(7, minmax(0, 1fr)); gap: 8px; margin: 22px 0 15px; }
        .tabs button { min-height: 62px; flex-direction: column; gap: 3px; border: 1px solid transparent; border-radius: 13px; padding: 7px 4px; color: var(--secondary-text-color); background: transparent; }
        .tabs button:hover:not(:disabled) { color: var(--primary-text-color); background: var(--schedule-soft); transform: none; }
        .tabs button.selected { border-color: color-mix(in srgb, var(--schedule-accent) 28%, transparent); color: var(--schedule-accent); background: color-mix(in srgb, var(--schedule-accent) 10%, var(--schedule-card)); }
        .day-name { font-size: .9rem; font-weight: 650; }
        .day-count { min-height: 17px; color: var(--secondary-text-color); font-size: .72rem; }
        .tabs button.selected .day-count { color: var(--schedule-accent); }
        .card { margin: 15px 0; padding: 22px 24px; }
        .section-head { display: flex; align-items: flex-start; justify-content: space-between; gap: 14px; }
        .section-head p { margin: 5px 0 0; color: var(--secondary-text-color); }
        .day-summary { flex: 0 0 auto; border-radius: 99px; padding: 6px 10px; color: var(--schedule-accent); background: color-mix(in srgb, var(--schedule-accent) 10%, var(--schedule-card)); font-size: .82rem; font-weight: 600; }
        .rows { display: grid; gap: 10px; margin: 21px 0 17px; }
        .row { display: grid; grid-template-columns: minmax(145px, 1fr) 30px minmax(185px, 1.2fr) auto; align-items: center; gap: 12px; border: 1px solid var(--divider-color); border-radius: 14px; padding: 10px 12px; background: color-mix(in srgb, var(--schedule-soft) 52%, var(--schedule-card)); }
        .row label { display: grid; gap: 5px; color: var(--secondary-text-color); font-size: .78rem; font-weight: 600; }
        .row input { width: 100%; min-height: 42px; color: var(--primary-text-color); font-size: 1.02rem; font-weight: 650; }
        .row input[type="time"] { font-variant-numeric: tabular-nums; }
        .temperature-input { display: flex; align-items: center; gap: 8px; }
        .temperature-input input { min-width: 0; flex: 1; }
        .row input[type="number"] { max-width: 142px; }
        .row-arrow { color: var(--secondary-text-color); text-align: center; font-size: 1.15rem; }
        .row-unit { margin-left: -5px; color: var(--secondary-text-color); font-size: .9rem; }
        .empty-day { display: flex; align-items: flex-start; gap: 14px; margin: 20px 0 15px; border: 1px dashed color-mix(in srgb, var(--schedule-accent) 35%, var(--divider-color)); border-radius: 14px; padding: 16px; background: color-mix(in srgb, var(--schedule-accent) 5%, var(--schedule-card)); }
        .empty-icon { display: grid; width: 38px; height: 38px; flex: 0 0 38px; place-items: center; border-radius: 12px; color: var(--schedule-accent); background: color-mix(in srgb, var(--schedule-accent) 13%, var(--schedule-card)); font-size: 1.15rem; }
        .empty-day p { margin: 0; }
        .empty-hint { margin-top: 4px !important; color: var(--secondary-text-color); font-size: .88rem; }
        .editor-actions { display: flex; flex-wrap: wrap; align-items: center; gap: 10px; }
        .copy-row { display: flex; flex-wrap: wrap; align-items: center; gap: 10px; margin-top: 19px; border-top: 1px solid var(--divider-color); padding-top: 17px; }
        .copy-row label { color: var(--secondary-text-color); font-size: .9rem; }
        .copy-row select { min-width: 160px; }
        .save-row { display: flex; flex-wrap: wrap; align-items: center; gap: 10px; margin-top: 18px; border-top: 1px solid var(--divider-color); padding-top: 17px; }
        .save-row .save-note { flex: 1; color: var(--secondary-text-color); font-size: .87rem; }
        .chart-card { overflow: hidden; }
        .chart-head { display: flex; align-items: center; justify-content: space-between; gap: 12px; }
        .chart-head p { margin: 5px 0 0; color: var(--secondary-text-color); }
        .preview-badge { border-radius: 99px; padding: 6px 10px; color: var(--secondary-text-color); background: var(--schedule-soft); font-size: .75rem; font-weight: 650; }
        .chart-wrap { margin-top: 16px; border-radius: 12px; padding: 10px 8px 0; background: color-mix(in srgb, var(--schedule-soft) 45%, var(--schedule-card)); }
        .chart { display: block; width: 100%; height: auto; overflow: visible; }
        .chart text { fill: var(--secondary-text-color); font-size: 12px; }
        .chart .grid { stroke: var(--divider-color); stroke-width: 1; stroke-dasharray: 4 5; }
        .chart .step { fill: none; stroke: var(--schedule-accent); stroke-width: 4; stroke-linejoin: round; stroke-linecap: round; }
        .muted { color: var(--secondary-text-color); }
        @media (max-width: 680px) {
          main { padding: 20px 14px 36px; }
          .device-card { align-items: flex-start; flex-direction: column; gap: 15px; padding: 16px; }
          .device-picker { width: 100%; }
          .enabled { align-self: stretch; }
          .tabs { gap: 3px; }
          .tabs button { min-height: 56px; }
          .day-name { font-size: .78rem; }
          .card { padding: 17px 15px; }
          .row { grid-template-columns: minmax(105px, 1fr) 20px minmax(120px, 1fr) auto; gap: 7px; padding: 9px; }
          .row label { font-size: .72rem; }
          .row input { padding: 7px; font-size: .95rem; }
          .row input[type="number"] { max-width: 110px; }
          .row-unit { font-size: .8rem; }
          .row .danger { padding: 5px; font-size: .78rem; }
          .row-arrow { font-size: .95rem; }
          .copy-row select { flex: 1; }
          .save-row .save-note { flex-basis: 100%; }
        }
        @media (max-width: 390px) {
          .hero-icon { width: 44px; height: 44px; flex-basis: 44px; border-radius: 14px; }
          .tabs button { padding-inline: 1px; }
          .day-name { font-size: .71rem; }
          .day-count { font-size: .66rem; }
          .row { grid-template-columns: minmax(0, 1fr) auto; gap: 7px; }
          .row-arrow { display: none; }
          .row label:first-child { grid-column: 1; grid-row: 1; }
          .row label:nth-of-type(2) { grid-column: 1; grid-row: 2; }
          .row .danger { grid-column: 2; grid-row: 1 / 3; align-self: center; }
        }
      </style>
      <main>
        <header>
          <button id="menu" class="menu secondary" type="button" aria-label="${this._t("openMenu")}" hidden>${this._t("menu")}</button>
          <div class="hero-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"/><path d="M12 7v2m-1 1a2 2 0 0 0 2 0m-2 2a2 2 0 0 0 2 0"/></svg>
          </div>
          <div><h1>${this._t("title")}</h1><p class="intro">${this._t("intro")}</p></div>
        </header>
        <section class="device-card" aria-label="${this._t("thermostat")}">
          <label class="device-picker"><span class="field-label">${this._t("thermostat")}</span><select id="entity"></select><span class="current-target"><span id="current-target-label"></span><strong id="current-target-value"></strong></span></label>
          <label class="enabled"><input id="enabled" type="checkbox"><span class="enabled-copy"><strong id="enabled-title"></strong><span id="enabled-subtitle"></span></span></label>
        </section>
        <div id="status" class="status" role="status" aria-live="polite"></div>
        <nav id="days" class="tabs" aria-label="${this._t("weekday")}"></nav>
        <section class="card">
          <div class="section-head">
            <div><h2 id="day-title"></h2><p>${this._t("addTimes")}</p></div>
            <span id="day-summary" class="day-summary"></span>
          </div>
          <div id="rows" class="rows"></div>
          <div class="editor-actions">
            <button id="add" class="secondary" type="button"><span aria-hidden="true">＋</span>${this._t("addChange")}</button>
          </div>
          <div class="copy-row">
            <label for="copy-target">${this._t("copyTo")}</label>
            <select id="copy-target"></select>
            <button id="copy" class="secondary" type="button">${this._t("copyDay")}</button>
          </div>
          <div class="save-row">
            <span id="save-note" class="save-note"></span>
            <button id="save" type="button" disabled>${this._t("save")}</button>
            <button id="discard" class="secondary" type="button" disabled>${this._t("discard")}</button>
          </div>
        </section>
        <section class="card chart-card">
          <div class="chart-head"><div><h2>${this._t("chartTitle")}</h2><p>${this._t("chartDescription")}</p></div><span class="preview-badge">${this._t("preview")}</span></div>
          <div class="chart-wrap"><svg id="chart" class="chart" viewBox="0 0 720 240" role="img" aria-label="${this._t("chartLabel")}"></svg></div>
          <p id="chart-empty" class="muted"></p>
        </section>
      </main>`;
  }

  _render() {
    if (!this._ready || !this._state) {
      return;
    }
    const entities = this._state.entities;
    const entitySelect = this.shadowRoot.getElementById("entity");
    entitySelect.replaceChildren();
    Object.keys(entities).forEach((entityId) => {
      const option = document.createElement("option");
      option.value = entityId;
      option.textContent =
        this._hass.states[entityId]?.attributes?.friendly_name || entityId;
      entitySelect.append(option);
    });
    entitySelect.value = this._selectedEntity || "";
    entitySelect.disabled = Object.keys(entities).length === 0;
    const targetTemperature =
      this._hass.states[this._selectedEntity]?.attributes?.temperature;
    this.shadowRoot.getElementById("current-target-label").textContent =
      this._t("currentTarget");
    this.shadowRoot.getElementById("current-target-value").textContent =
      typeof targetTemperature === "number"
        ? `${targetTemperature} ${this._entityAttribute("temperature_unit", "°C")}`
        : this._t("temperatureUnavailable");

    const schedule = entities[this._selectedEntity];
    const enabled = this.shadowRoot.getElementById("enabled");
    enabled.checked = schedule?.enabled || false;
    enabled.disabled = !schedule;
    this.shadowRoot.getElementById("enabled-title").textContent = this._t(
      schedule?.enabled ? "scheduleOn" : "scheduleOff",
    );
    this.shadowRoot.getElementById("enabled-subtitle").textContent = this._t(
      schedule?.enabled ? "manualOverrideHint" : "pausedHint",
    );

    const daysNav = this.shadowRoot.getElementById("days");
    daysNav.replaceChildren();
    this._weekdays.forEach((day, index) => {
      const count = this._draftDays?.[index]?.length || 0;
      const countLabel = this._countLabel(count);
      const button = document.createElement("button");
      button.type = "button";
      button.className = index === this._selectedDay ? "selected" : "";
      button.innerHTML = `<span class="day-name"></span><span class="day-count"></span>`;
      button.querySelector(".day-name").textContent = this._shortWeekdays[index];
      button.querySelector(".day-count").textContent =
        count === 0 ? "—" : String(count);
      button.setAttribute("aria-label", `${day}, ${countLabel}`);
      button.setAttribute(
        "aria-pressed",
        index === this._selectedDay ? "true" : "false",
      );
      button.dataset.day = index;
      daysNav.append(button);
    });

    const dayName = this._weekdays[this._selectedDay];
    this.shadowRoot.getElementById("day-title").textContent = dayName;
    const dayCount = this._draftDays?.[this._selectedDay]?.length || 0;
    this.shadowRoot.getElementById("day-summary").textContent =
      this._countLabel(dayCount);
    const rows = this.shadowRoot.getElementById("rows");
    rows.replaceChildren();
    (this._draftDays?.[this._selectedDay] || []).forEach((row, index) => {
      rows.append(this._createRow(row, index));
    });
    if ((this._draftDays?.[this._selectedDay] || []).length === 0) {
      const empty = document.createElement("div");
      empty.className = "empty-day";
      empty.innerHTML = `<span class="empty-icon" aria-hidden="true">＋</span><div><p></p><p class="empty-hint"></p></div>`;
      empty.querySelector("p").textContent = this._t("emptyDay");
      empty.querySelector(".empty-hint").textContent = this._t("emptyHint");
      rows.append(empty);
    }

    const copyTarget = this.shadowRoot.getElementById("copy-target");
    copyTarget.replaceChildren();
    this._weekdays.forEach((day, index) => {
      if (index === this._selectedDay) {
        return;
      }
      const option = document.createElement("option");
      option.value = index;
      option.textContent = day;
      copyTarget.append(option);
    });
    copyTarget.disabled = !schedule;
    this.shadowRoot.getElementById("add").disabled = !schedule;
    this.shadowRoot.getElementById("copy").disabled = !schedule;
    this.shadowRoot.getElementById("save").disabled = !schedule || !this._dirty;
    this.shadowRoot.getElementById("discard").disabled = !this._dirty;
    this.shadowRoot.getElementById("save-note").textContent = this._t(
      this._dirty ? "unsavedState" : "savedState",
    );
    this._renderChart();
  }

  _createRow(row, index) {
    const wrapper = document.createElement("div");
    wrapper.className = "row";
    wrapper.dataset.row = index;

    const timeLabel = document.createElement("label");
    timeLabel.textContent = this._t("at");
    const time = document.createElement("input");
    time.type = "time";
    time.value = row.time;
    time.required = true;
    time.dataset.field = "time";
    timeLabel.append(time);

    const temperatureLabel = document.createElement("label");
    temperatureLabel.textContent = this._t("setTo");
    const temperatureInput = document.createElement("span");
    temperatureInput.className = "temperature-input";
    const temperature = document.createElement("input");
    temperature.type = "number";
    temperature.step = this._entityAttribute("target_temp_step", 0.5);
    temperature.min = this._entityAttribute("min_temp", 7);
    temperature.max = this._entityAttribute("max_temp", 35);
    temperature.value = row.temperature;
    temperature.required = true;
    temperature.dataset.field = "temperature";
    temperatureInput.append(temperature);

    const unit = document.createElement("span");
    unit.className = "row-unit";
    unit.textContent = this._entityAttribute("temperature_unit", "°C");
    temperatureInput.append(unit);
    temperatureLabel.append(temperatureInput);
    const arrow = document.createElement("span");
    arrow.className = "row-arrow";
    arrow.setAttribute("aria-hidden", "true");
    arrow.textContent = "→";

    const remove = document.createElement("button");
    remove.type = "button";
    remove.className = "danger";
    remove.textContent = this._t("remove");
    remove.dataset.remove = index;
    remove.setAttribute(
      "aria-label",
      this._t("removeChange", { time: row.time }),
    );

    wrapper.append(timeLabel, arrow, temperatureLabel, remove);
    return wrapper;
  }

  _entityAttribute(name, fallback) {
    return (
      this._hass.states[this._selectedEntity]?.attributes?.[name] ?? fallback
    );
  }

  _countLabel(count) {
    const key = count === 1 ? "changeCount" : "changesCount";
    return this._t(key, { count: String(count) });
  }

  _renderChart() {
    const svg = this.shadowRoot.getElementById("chart");
    svg.replaceChildren();
    const days = this._draftDays;
    if (!days) {
      return;
    }
    const rows = (days[this._selectedDay] || [])
      .filter(
        (row) =>
          /^\d{2}:\d{2}$/.test(row.time) && Number.isFinite(row.temperature),
      )
      .sort((left, right) => left.time.localeCompare(right.time));
    let temperature = null;
    for (let offset = 1; offset <= 7 && temperature === null; offset++) {
      const priorDay = (this._selectedDay - offset + 7) % 7;
      const priorRows = (days[priorDay] || [])
        .filter(
          (row) =>
            /^\d{2}:\d{2}$/.test(row.time) && Number.isFinite(row.temperature),
        )
        .sort((left, right) => left.time.localeCompare(right.time));
      if (priorRows.length) {
        temperature = priorRows[priorRows.length - 1].temperature;
      }
    }

    const points = [];
    if (temperature !== null) {
      points.push({ minute: 0, temperature });
    }
    rows.forEach((row) => {
      const [hour, minute] = row.time.split(":").map(Number);
      points.push({ minute: hour * 60 + minute, temperature: row.temperature });
    });
    if (points.length === 0) {
      this.shadowRoot.getElementById("chart-empty").textContent = this._t("chartEmpty");
      return;
    }
    this.shadowRoot.getElementById("chart-empty").textContent = "";
    const values = points.map((point) => point.temperature);
    let low = Math.min(...values);
    let high = Math.max(...values);
    if (low === high) {
      low -= 1;
      high += 1;
    }
    const left = 48;
    const right = 700;
    const top = 18;
    const bottom = 198;
    const x = (minute) => left + (minute / 1440) * (right - left);
    const y = (value) => bottom - ((value - low) / (high - low)) * (bottom - top);

    [0, 0.5, 1].forEach((fraction) => {
      const lineY = top + fraction * (bottom - top);
      const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
      line.setAttribute("x1", left);
      line.setAttribute("x2", right);
      line.setAttribute("y1", lineY);
      line.setAttribute("y2", lineY);
      line.setAttribute("class", "grid");
      svg.append(line);
      const label = document.createElementNS("http://www.w3.org/2000/svg", "text");
      label.setAttribute("x", 4);
      label.setAttribute("y", lineY + 4);
      label.textContent = `${(high - fraction * (high - low)).toFixed(1)} ${this._entityAttribute("temperature_unit", "°C")}`;
      svg.append(label);
    });

    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    let pathData = "";
    pathData = `M ${x(points[0].minute)} ${y(points[0].temperature)}`;
    for (const point of points.slice(1)) {
      pathData += ` H ${x(point.minute)} V ${y(point.temperature)}`;
    }
    pathData += ` H ${right}`;
    path.setAttribute("d", pathData);
    path.setAttribute("class", "step");
    svg.append(path);

    [0, 6, 12, 18, 24].forEach((hour) => {
      const label = document.createElementNS("http://www.w3.org/2000/svg", "text");
      label.setAttribute("x", x(hour * 60));
      label.setAttribute("y", 224);
      label.setAttribute("text-anchor", hour === 0 ? "start" : hour === 24 ? "end" : "middle");
      label.textContent = `${String(hour).padStart(2, "0")}:00`;
      svg.append(label);
    });
  }

  _handleClick(event) {
    const target = event.target.closest("button");
    if (!target) {
      return;
    }
    if (target.id === "menu") {
      this.dispatchEvent(
        new CustomEvent("hass-toggle-menu", { bubbles: true, composed: true }),
      );
      return;
    }
    if (target.dataset.day !== undefined) {
      this._selectedDay = Number(target.dataset.day);
      this._render();
      return;
    }
    if (target.dataset.remove !== undefined) {
      this._draftDays[this._selectedDay].splice(Number(target.dataset.remove), 1);
      this._markDirty();
      this._render();
      return;
    }
    if (target.id === "add") {
      const rows = this._draftDays[this._selectedDay];
      const times = new Set(rows.map((row) => row.time));
      let nextMinute = 8 * 60;
      let attempts = 0;
      while (
        times.has(
          `${String(Math.floor(nextMinute / 60)).padStart(2, "0")}:${String(
            nextMinute % 60,
          ).padStart(2, "0")}`,
        ) &&
        attempts < 24
      ) {
        nextMinute = (nextMinute + 60) % (24 * 60);
        attempts += 1;
      }
      if (attempts === 24) {
        this._showStatus(this._t("fullDay"), true);
        return;
      }
      const time = `${String(Math.floor(nextMinute / 60)).padStart(2, "0")}:${String(
        nextMinute % 60,
      ).padStart(2, "0")}`;
      rows.push({ time, temperature: 20 });
      rows.sort((a, b) => a.time.localeCompare(b.time));
      this._markDirty();
      this._render();
      return;
    }
    if (target.id === "copy") {
      const targetDay = Number(this.shadowRoot.getElementById("copy-target").value);
      this._draftDays[targetDay] = this._draftDays[this._selectedDay].map((row) => ({
        ...row,
      }));
      this._markDirty();
      this._showStatus(
        this._t("copied", {
          source: this._weekdays[this._selectedDay],
          target: this._weekdays[targetDay],
        }),
      );
      this._render();
      return;
    }
    if (target.id === "save") {
      this._save();
      return;
    }
    if (target.id === "discard") {
      this._copySelectedDays();
      this._dirty = false;
      this._showStatus(this._t("discarded"));
      this._render();
    }
  }

  _handleChange(event) {
    const target = event.target;
    if (target.id === "entity") {
      if (this._dirty) {
        target.value = this._selectedEntity;
        this._showStatus(this._t("switchWarning"), true);
        return;
      }
      this._selectedEntity = target.value;
      this._copySelectedDays();
      this._render();
      return;
    }
    if (target.id === "enabled") {
      this._setEnabled(target.checked);
      return;
    }
    if (target.dataset.field) {
      this._readRowsFromDom();
      this._markDirty();
    }
  }

  _handleInput(event) {
    if (event.target.dataset.field) {
      this._readRowsFromDom();
      this._markDirty();
    }
  }

  _readRowsFromDom() {
    const rows = [...this.shadowRoot.querySelectorAll(".row[data-row]")];
    const values = rows.map((row) => ({
      time: row.querySelector('[data-field="time"]').value,
      temperature:
        row.querySelector('[data-field="temperature"]').value === ""
          ? Number.NaN
          : Number(row.querySelector('[data-field="temperature"]').value),
    }));
    this._draftDays[this._selectedDay] = values;
    this._renderChart();
  }

  _markDirty() {
    this._dirty = true;
    this._showStatus(this._t("unsaved"));
    this.shadowRoot.getElementById("save").disabled = false;
    this.shadowRoot.getElementById("discard").disabled = false;
  }

  _copySelectedDays() {
    const schedule = this._state?.entities?.[this._selectedEntity];
    this._draftDays = schedule
      ? Object.fromEntries(
          Object.entries(schedule.days).map(([day, rows]) => [
            Number(day),
            rows.map((row) => ({ ...row })),
          ]),
        )
      : null;
  }

  async _save() {
    if (!this._draftDays) {
      return;
    }
    try {
      const days = Object.fromEntries(
        Object.entries(this._draftDays).map(([day, rows]) => [
          String(day),
          rows.map((row) => ({
            time: row.time,
            temperature: Number(row.temperature),
          })),
        ]),
      );
      const result = await this._hass.callWS({
        type: "simple_heating_schedule/set_schedule",
        entity_id: this._selectedEntity,
        days,
      });
      this._state = result;
      this._dirty = false;
      this._copySelectedDays();
      this._showStatus(
        result.warning ? this._backendMessage(result.warning) : this._t("saved"),
        Boolean(result.warning),
      );
      this._render();
    } catch (error) {
      this._showStatus(this._backendMessage(error, "saveError"), true);
    }
  }

  async _setEnabled(enabled) {
    try {
      const result = await this._hass.callWS({
        type: "simple_heating_schedule/set_enabled",
        entity_id: this._selectedEntity,
        enabled,
      });
      this._state = result;
      this._showStatus(
        (result.warning && this._backendMessage(result.warning)) ||
          (enabled
            ? this._t("enabled")
            : this._t("disabled")),
        Boolean(result.warning),
      );
      this._render();
    } catch (error) {
      this._showStatus(this._backendMessage(error, "enableError"), true);
      this._render();
    }
  }

  _showStatus(message, isError = false) {
    const status = this.shadowRoot.getElementById("status");
    if (status) {
      status.textContent = message;
      status.classList.toggle("error", isError);
    }
  }

  _t(key, replacements = {}) {
    const language = PANEL_TRANSLATIONS[this._language] ? this._language : "en";
    return Object.entries(replacements).reduce(
      (text, [name, value]) => text.replaceAll(`{${name}}`, value),
      PANEL_TRANSLATIONS[language][key],
    );
  }

  _backendMessage(error, fallback) {
    let message = typeof error === "string" ? error : error?.message || "";
    message = message.replace(/^(invalid_schedule|schedule_error):\s*/, "");
    const simpleErrors = [
      ["A schedule must contain all seven weekdays.", "invalidDays"],
      ["Each day must contain a list of setpoint changes.", "invalidRows"],
      ["Each setpoint change must have a time and temperature.", "invalidRow"],
      ["Times must use the 24-hour HH:MM format.", "invalidTime"],
      ["Temperatures must be numeric.", "invalidTemperature"],
      ["Temperatures must be between -100 and 100 degrees.", "temperatureRange"],
      ["The enabled state must be true or false.", "invalidEnabled"],
    ];
    for (const [source, key] of simpleErrors) {
      if (message.includes(source)) {
        return this._t(key);
      }
    }

    let match = message.match(/Only one setpoint change is allowed at ([0-9:]+)\./);
    if (match) {
      return this._t("duplicateTime", { time: match[1] });
    }
    match = message.match(/^(-?\d+(?:\.\d+)?)° is below (.+)'s minimum temperature of (-?\d+(?:\.\d+)?)°\./);
    if (match) {
      return this._t("belowMinimum", {
        temperature: match[1],
        entity: match[2],
        limit: match[3],
      });
    }
    match = message.match(/^(-?\d+(?:\.\d+)?)° is above (.+)'s maximum temperature of (-?\d+(?:\.\d+)?)°\./);
    if (match) {
      return this._t("aboveMaximum", {
        temperature: match[1],
        entity: match[2],
        limit: match[3],
      });
    }
    match = message.match(/^(.+) is not configured for heating schedules\.$/);
    if (match) {
      return this._t("notConfigured", { entity: match[1] });
    }
    match = message.match(/^(.+) is not currently available\.$/);
    if (match) {
      return this._t("unavailable", { entity: match[1] });
    }
    match = message.match(/^(.+) does not support a target temperature\.$/);
    if (match) {
      return this._t("unsupportedTemperature", { entity: match[1] });
    }
    match = message.match(/^(Schedule saved|Schedule enabled), but the current setpoint could not be applied: (.+)$/);
    if (match) {
      const errorText = this._backendMessage(match[2]) || this._t("applyError", { error: match[2] });
      return this._t(
        match[1] === "Schedule saved" ? "savedButApplyFailed" : "enabledButApplyFailed",
        { error: errorText },
      );
    }
    return message || this._t(fallback || "saveError");
  }
}

customElements.define("simple-heating-schedule-panel", SimpleHeatingSchedulePanel);
