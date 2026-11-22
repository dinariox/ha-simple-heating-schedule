const PANEL_TRANSLATIONS = {
  en: {
    menu: "Menu",
    openMenu: "Open sidebar menu",
    title: "Heating schedules",
    thermostat: "Thermostat",
    scheduleEnabled: "Schedule enabled",
    weekday: "Weekday",
    addTimes: "Add the times when this thermostat should change its target temperature.",
    addChange: "Add temperature change",
    copyTo: "Copy this day to",
    copyDay: "Copy day",
    save: "Save schedule",
    discard: "Discard changes",
    chartTitle: "Temperature through the day",
    chartDescription: "This chart is a preview only. Edit setpoints using the list above.",
    chartLabel: "Setpoint temperature over the selected day",
    emptyDay: "No temperature changes for this day yet.",
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
    thermostat: "Thermostat",
    scheduleEnabled: "Zeitplan aktiviert",
    weekday: "Wochentag",
    addTimes: "Lege fest, wann dieses Thermostat seine Zieltemperatur ändern soll.",
    addChange: "Temperaturänderung hinzufügen",
    copyTo: "Diesen Tag kopieren nach",
    copyDay: "Tag kopieren",
    save: "Zeitplan speichern",
    discard: "Änderungen verwerfen",
    chartTitle: "Temperatur im Tagesverlauf",
    chartDescription: "Diese Grafik dient nur zur Vorschau. Bearbeite die Werte in der Liste oben.",
    chartLabel: "Zieltemperatur am ausgewählten Tag",
    emptyDay: "Für diesen Tag sind noch keine Temperaturänderungen festgelegt.",
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
        :host { display: block; color: var(--primary-text-color); font-family: var(--paper-font-body1_-_font-family, sans-serif); }
        main { box-sizing: border-box; max-width: 1000px; margin: 0 auto; padding: 28px 20px 48px; }
        header { display: flex; align-items: center; gap: 12px; margin-bottom: 20px; }
        h1 { font-size: 1.8rem; margin: 0; }
        .menu { display: none; }
        .menu:not([hidden]) { display: inline-block; }
        h2 { font-size: 1.15rem; margin: 0 0 14px; }
        .toolbar, .copy-row, .actions, .row { display: flex; align-items: center; gap: 12px; }
        .toolbar { flex-wrap: wrap; margin-bottom: 20px; }
        .toolbar label { display: flex; flex-direction: column; gap: 5px; font-size: .9rem; }
        select, input, button { font: inherit; }
        select, input { box-sizing: border-box; min-height: 40px; padding: 7px 10px; border: 1px solid var(--divider-color); border-radius: 6px; color: var(--primary-text-color); background: var(--card-background-color, var(--primary-background-color)); }
        button { min-height: 40px; border: 0; border-radius: 6px; padding: 8px 14px; cursor: pointer; color: var(--text-primary-color, #fff); background: var(--primary-color); }
        button.secondary { color: var(--primary-text-color); background: var(--secondary-background-color); }
        button.danger { color: var(--error-color, #b3261e); background: transparent; }
        button:disabled { opacity: .5; cursor: default; }
        .status { min-height: 24px; margin: 8px 0; color: var(--success-color, #26734d); }
        .status.error { color: var(--error-color, #b3261e); }
        .tabs { display: flex; flex-wrap: wrap; gap: 8px; margin: 20px 0; }
        .tabs button { color: var(--primary-text-color); background: var(--secondary-background-color); }
        .tabs button.selected { color: var(--text-primary-color, #fff); background: var(--primary-color); }
        .card { margin: 18px 0; padding: 20px; border: 1px solid var(--divider-color); border-radius: 10px; background: var(--card-background-color, var(--primary-background-color)); }
        .row { flex-wrap: wrap; margin: 10px 0; }
        .row input[type="time"] { width: 140px; }
        .row input[type="number"] { width: 130px; }
        .copy-row { flex-wrap: wrap; }
        .copy-row select { min-width: 150px; }
        .enabled { display: flex; align-items: center; gap: 9px; }
        .enabled input { width: 20px; height: 20px; accent-color: var(--primary-color); }
        .chart { width: 100%; height: auto; overflow: visible; }
        .chart text { fill: var(--secondary-text-color); font-size: 12px; }
        .chart .grid { stroke: var(--divider-color); stroke-width: 1; }
        .chart .step { fill: none; stroke: var(--primary-color); stroke-width: 4; stroke-linejoin: round; }
        .muted { color: var(--secondary-text-color); }
        @media (max-width: 600px) {
          main { padding: 20px 14px 36px; }
          .card { padding: 15px; }
          .row { align-items: flex-start; }
        }
      </style>
      <main>
        <header>
          <button id="menu" class="menu secondary" type="button" aria-label="${this._t("openMenu")}" hidden>${this._t("menu")}</button>
          <h1>${this._t("title")}</h1>
        </header>
        <div class="toolbar">
          <label>${this._t("thermostat")}<select id="entity"></select></label>
          <label class="enabled"><input id="enabled" type="checkbox"><span>${this._t("scheduleEnabled")}</span></label>
        </div>
        <div id="status" class="status" role="status" aria-live="polite"></div>
        <nav id="days" class="tabs" aria-label="${this._t("weekday")}"></nav>
        <section class="card">
          <h2 id="day-title"></h2>
          <p class="muted">${this._t("addTimes")}</p>
          <div id="rows"></div>
          <div class="actions">
            <button id="add" class="secondary" type="button">${this._t("addChange")}</button>
          </div>
          <div class="copy-row" style="margin-top: 20px">
            <label for="copy-target">${this._t("copyTo")}</label>
            <select id="copy-target"></select>
            <button id="copy" class="secondary" type="button">${this._t("copyDay")}</button>
          </div>
          <div class="actions" style="margin-top: 20px">
            <button id="save" type="button" disabled>${this._t("save")}</button>
            <button id="discard" class="secondary" type="button" disabled>${this._t("discard")}</button>
          </div>
        </section>
        <section class="card">
          <h2>${this._t("chartTitle")}</h2>
          <p class="muted">${this._t("chartDescription")}</p>
          <svg id="chart" class="chart" viewBox="0 0 720 240" role="img" aria-label="${this._t("chartLabel")}"></svg>
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

    const schedule = entities[this._selectedEntity];
    const enabled = this.shadowRoot.getElementById("enabled");
    enabled.checked = schedule?.enabled || false;
    enabled.disabled = !schedule;

    const daysNav = this.shadowRoot.getElementById("days");
    daysNav.replaceChildren();
    this._weekdays.forEach((day, index) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = index === this._selectedDay ? "selected" : "";
      button.textContent = day;
      button.dataset.day = index;
      daysNav.append(button);
    });

    const dayName = this._weekdays[this._selectedDay];
    this.shadowRoot.getElementById("day-title").textContent = dayName;
    const rows = this.shadowRoot.getElementById("rows");
    rows.replaceChildren();
    (this._draftDays?.[this._selectedDay] || []).forEach((row, index) => {
      rows.append(this._createRow(row, index));
    });
    if ((this._draftDays?.[this._selectedDay] || []).length === 0) {
      const empty = document.createElement("p");
      empty.className = "muted";
      empty.textContent = this._t("emptyDay");
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
    this.shadowRoot.getElementById("save").disabled = !schedule || !this._dirty;
    this.shadowRoot.getElementById("discard").disabled = !this._dirty;
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
    const temperature = document.createElement("input");
    temperature.type = "number";
    temperature.step = this._entityAttribute("target_temp_step", 0.5);
    temperature.min = this._entityAttribute("min_temp", 7);
    temperature.max = this._entityAttribute("max_temp", 35);
    temperature.value = row.temperature;
    temperature.required = true;
    temperature.dataset.field = "temperature";
    temperatureLabel.append(temperature);

    const unit = document.createElement("span");
    unit.textContent = this._entityAttribute("temperature_unit", "°C");

    const remove = document.createElement("button");
    remove.type = "button";
    remove.className = "danger";
    remove.textContent = this._t("remove");
    remove.dataset.remove = index;
    remove.setAttribute("aria-label", `Remove change at ${row.time}`);

    wrapper.append(timeLabel, temperatureLabel, unit, remove);
    return wrapper;
  }

  _entityAttribute(name, fallback) {
    return (
      this._hass.states[this._selectedEntity]?.attributes?.[name] ?? fallback
    );
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
      label.textContent = `${(high - fraction * (high - low)).toFixed(1)}°`;
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
    const target = event.target;
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
