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
    if (this._ready && !this._dirty) {
      this._render();
    } else if (
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
        const today = new Intl.DateTimeFormat("en-US", options).format(new Date());
        this._selectedDay = Math.max(0, WEEKDAYS.indexOf(today));
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
      this._showStatus(error.message || "Could not load heating schedules.", true);
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
          <button id="menu" class="menu secondary" type="button" aria-label="Open sidebar menu" hidden>Menu</button>
          <h1>Heating schedules</h1>
        </header>
        <div class="toolbar">
          <label>Thermostat<select id="entity"></select></label>
          <label class="enabled"><input id="enabled" type="checkbox"><span>Schedule enabled</span></label>
        </div>
        <div id="status" class="status" role="status" aria-live="polite"></div>
        <nav id="days" class="tabs" aria-label="Weekday"></nav>
        <section class="card">
          <h2 id="day-title"></h2>
          <p class="muted">Add the times when this thermostat should change its target temperature.</p>
          <div id="rows"></div>
          <div class="actions">
            <button id="add" class="secondary" type="button">Add temperature change</button>
          </div>
          <div class="copy-row" style="margin-top: 20px">
            <label for="copy-target">Copy this day to</label>
            <select id="copy-target"></select>
            <button id="copy" class="secondary" type="button">Copy day</button>
          </div>
          <div class="actions" style="margin-top: 20px">
            <button id="save" type="button" disabled>Save schedule</button>
            <button id="discard" class="secondary" type="button" disabled>Discard changes</button>
          </div>
        </section>
        <section class="card">
          <h2>Temperature through the day</h2>
          <p class="muted">This chart is a preview only. Edit setpoints using the list above.</p>
          <svg id="chart" class="chart" viewBox="0 0 720 240" role="img" aria-label="Setpoint temperature over the selected day"></svg>
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
    WEEKDAYS.forEach((day, index) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = index === this._selectedDay ? "selected" : "";
      button.textContent = day;
      button.dataset.day = index;
      daysNav.append(button);
    });

    const dayName = WEEKDAYS[this._selectedDay];
    this.shadowRoot.getElementById("day-title").textContent = dayName;
    const rows = this.shadowRoot.getElementById("rows");
    rows.replaceChildren();
    (this._draftDays?.[this._selectedDay] || []).forEach((row, index) => {
      rows.append(this._createRow(row, index));
    });
    if ((this._draftDays?.[this._selectedDay] || []).length === 0) {
      const empty = document.createElement("p");
      empty.className = "muted";
      empty.textContent = "No temperature changes for this day yet.";
      rows.append(empty);
    }

    const copyTarget = this.shadowRoot.getElementById("copy-target");
    copyTarget.replaceChildren();
    WEEKDAYS.forEach((day, index) => {
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
    timeLabel.textContent = "At ";
    const time = document.createElement("input");
    time.type = "time";
    time.value = row.time;
    time.required = true;
    time.dataset.field = "time";
    timeLabel.append(time);

    const temperatureLabel = document.createElement("label");
    temperatureLabel.textContent = "set to ";
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
    remove.textContent = "Remove";
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
      this.shadowRoot.getElementById("chart-empty").textContent =
        "Add a temperature change to preview the schedule.";
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
        this._showStatus("This day already has a change every hour. Remove one before adding another.", true);
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
        `Copied ${WEEKDAYS[this._selectedDay]} to ${WEEKDAYS[targetDay]}. Save to apply the change.`,
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
      this._showStatus("Unsaved changes discarded.");
      this._render();
    }
  }

  _handleChange(event) {
    const target = event.target;
    if (target.id === "entity") {
      if (this._dirty) {
        target.value = this._selectedEntity;
        this._showStatus("Save or discard your unsaved changes before switching thermostats.", true);
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
    this._showStatus("Unsaved changes.");
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
      this._showStatus(result.warning || "Schedule saved.", Boolean(result.warning));
      this._render();
    } catch (error) {
      this._showStatus(error.message || "Could not save this schedule.", true);
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
        result.warning ||
          (enabled
            ? "Schedule enabled. The current scheduled temperature was applied if one is configured."
            : "Schedule disabled. The thermostat's current setpoint was left unchanged."),
        Boolean(result.warning),
      );
      this._render();
    } catch (error) {
      this._showStatus(error.message || "Could not change the schedule state.", true);
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
}

const WEEKDAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

customElements.define("simple-heating-schedule-panel", SimpleHeatingSchedulePanel);
