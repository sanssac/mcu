let fullData = [];
let sortMode = "release";
let sortDirection = "asc";
let viewMode = "comfortable";
const expandedGroups = new Set();
const VIEW_MODES = new Set(["comfortable", "compact", "list"]);
const FILTER_URL_KEYS = ["q", "sort", "direction", "type", "canon", "universe", "hide", "view"];

const MULTIVERSE_LABELS = {
  "0":  "Earth-616 (MCU)",
  "1":  "Earth-688 (SSU)",
  "2":  "Earth-26320 (Blade)",
  "3":  "Earth-10005 (X-Men)",
  "4":  "Earth-96283 (Spider-Man)",
  "5":  "Earth-120703 (The Amazing Spider-Man)",
  "6":  "Earth-701306 (Daredevil - Fox)",
  "7":  "Earth-121698 (Fantastic Four 2005)",
  "8":  "Earth-TRN554 (Fantastic Four 2015)",
  "9":  "What If...? - An Immersive Story",
  "10": "Earth-1610 (Spiderverse)",
  "11": "Loki",
  "12": "Earth-828 (Fantastic Four: First Steps)",
  "13": "Earth-TRN414 (X-Men Days Of Future Past)",
  "14": "Earth-82111 (Super Soldier Peggy Carter)",
  "15": "Earth-21818 (Ravager T'Challa)",
  "16": "Earth-51825 (Avengers Assassinated)",
  "17": "Earth-91233 (Corrupted Doctor Strange)",
  "18": "Earth-89521 (Zombie Outbreak)",
  "19": "Earth-32938 (Killmonger's War)",
  "20": "Earth-72124 (Party Prince Thor)",
  "21": "Earth-29929 (Age of Ultron)",
  "22": "Barren Wasteland",
  "23": "Earth-625 (Nova Corps Nebula)",
  "24": "Celestial Invader Ego Universe",
  "25": "Gamma Enhanced Happy Hogan Universe",
  "26": "Sakaarian Iron Man Universe",
  "27": "Earth-43166 (Tesseract Powered Kahhori)",
  "28": "Merciful Hela Universe",
  "29": "Forerunner Steve Rogers Universe",
  "30": "Reforged Universe",
  "31": "Invading Gamma Beasts Universe",
  "32": "Cosmic Queen Agatha Harkness Universe",
  "33": "Stark Assassination Prevented Universe",
  "34": "Emergence Destroyed Earth Universe",
  "35": "Wild West Heroes Universe",
  "36": "Reflective Infinity Ultron Universe",
  "37": "Earth-86445 (Your Friendly Neighborhood Spider-Man)",
  "38": "Earth-92131 (X-Men '97)"
};

function multiverseName(val) {
  return MULTIVERSE_LABELS[String(val)] || `Multiverse ${val}`;
}

function createMultiverseChip(mv) {
  const label = document.createElement("label");
  label.className = "filter-chip mv-chip";
  const color = MV_TINTS[String(mv)];
  if (color) label.style.setProperty("--chip-color", color);

  const cb = document.createElement("input");
  cb.type = "checkbox";
  cb.value = mv;

  const span = document.createElement("span");
  span.textContent = multiverseName(mv);

  label.appendChild(cb);
  label.appendChild(span);
  return label;
}

function multiverseFilterInputs(selector = "") {
  return document.querySelectorAll(`#multiverseFilter input:not(.filter-group-toggle)${selector}`);
}

function syncFilterSubmenus() {
  document.querySelectorAll(".filter-submenu").forEach(menu => {
    const groupToggle = menu.querySelector(".filter-group-toggle");
    const childInputs = Array.from(menu.querySelectorAll(".filter-submenu-options input"));
    if (!groupToggle || childInputs.length === 0) return;

    const checkedCount = childInputs.filter(input => input.checked).length;
    groupToggle.checked = checkedCount === childInputs.length;
    groupToggle.indeterminate = checkedCount > 0 && checkedCount < childInputs.length;
  });
}

const STUDIO_TINTS = {
  "Marvel Studios":   "#e71912",
  "Disney+":          "#7b7cf8",
  "ABC":              "#0ea36a",
  "Netflix":          "#e87722",
  "Hulu":             "#1ce783",
  "Freeform":         "#9b5de5",
  "One Shot":         "#14b8a6",
  "Sony":             "#5b9cf6",
  "Fox":              "#f4a100",
  "New Line Cinema":  "#00b4d8",
  "YouTube":          "#ff2d7e",
  "WHIH":             "#607d8b",
  "Daily Bugle":      "#eab308",
  "Other":            "#8d99ae"
};

const MV_TINTS = {
  "0":  "#e71912",
  "1":  "#ff9800",
  "2":  "#a7b027",
  "3":  "#0d8c12",
  "4":  "#3643f4",
  "5":  "#a33fb5",
  "6":  "#cd795a",
  "7":  "#673ab7",
  "8":  "#607d8b",
  "9":  "#009688",
  "10": "#b8c22a",
  "11": "#ff5722",
  "12": "#e91e63",
  "13": "#73a53a",
  "14": "#2f80ed",
  "15": "#27ae60",
  "16": "#f2994a",
  "17": "#9b51e0",
  "18": "#6fcf97",
  "19": "#eb5757",
  "20": "#f2c94c",
  "21": "#56ccf2",
  "22": "#828282",
  "23": "#00a7a7",
  "24": "#8f5f2a",
  "25": "#d96c06",
  "26": "#6d5dfc",
  "27": "#0099ff",
  "28": "#b3427a",
  "29": "#795548",
  "30": "#455a64",
  "31": "#00bcd4",
  "32": "#c2185b",
  "33": "#7cb342",
  "34": "#d84315",
  "35": "#8d6e63",
  "36": "#607d8b",
  "37": "#1565c0",
  "38": "#ffb300"
};

function normalizeSortMode(value) {
  return value === "chronological" ? "chronological" : "release";
}

function normalizeSortDirection(value) {
  return value === "desc" ? "desc" : "asc";
}

function normalizeViewMode(value) {
  return VIEW_MODES.has(value) ? value : "comfortable";
}

function getUrlValues(params, key) {
  return params.getAll(key)
    .flatMap(value => value.split(","))
    .map(value => value.trim())
    .filter(Boolean);
}

function hasUrlFilterState(params = new URLSearchParams(window.location.search)) {
  return FILTER_URL_KEYS.some(key => params.has(key));
}

function setSearchValue(value) {
  const searchInput = document.getElementById("search");
  const searchClear = document.getElementById("searchClear");
  if (!searchInput) return;
  searchInput.value = value || "";
  if (searchClear) searchClear.hidden = searchInput.value === "";
}

function setPanelValues(panelSelector, values) {
  const selected = new Set(values.map(String));
  document.querySelectorAll(`${panelSelector} input:not(.filter-group-toggle)`).forEach(input => {
    input.checked = selected.has(String(input.value));
  });
}

function getFilterState() {
  return {
    search: document.getElementById("search")?.value.trim() || "",
    typeVals: Array.from(document.querySelectorAll("#typeFilter input:checked")).map(c => c.value),
    canonVals: Array.from(document.querySelectorAll("#canonFilter input:checked")).map(c => c.value),
    mvVals: Array.from(multiverseFilterInputs(":checked")).map(c => c.value),
    sortMode,
    sortDirection,
    viewMode,
    hideWatched: document.getElementById("hideWatched")?.checked === true
  };
}

function updateUrlFromState(state = getFilterState()) {
  const params = new URLSearchParams(window.location.search);
  FILTER_URL_KEYS.forEach(key => params.delete(key));

  if (state.search) params.set("q", state.search);
  if (state.sortMode !== "release") params.set("sort", state.sortMode);
  if (state.sortDirection !== "asc") params.set("direction", state.sortDirection);
  state.typeVals.forEach(value => params.append("type", value));
  state.canonVals.forEach(value => params.append("canon", value));
  state.mvVals.forEach(value => params.append("universe", value));
  if (state.hideWatched) params.set("hide", "1");
  if (state.viewMode !== "comfortable") params.set("view", state.viewMode);

  const query = params.toString();
  const nextUrl = `${window.location.pathname}${query ? `?${query}` : ""}${window.location.hash}`;
  try {
    window.history.replaceState(null, "", nextUrl);
  } catch {
    // Some local file previews may block replaceState; filters still work.
  }
}

function updateViewControls() {
  document.body.classList.toggle("view-compact", viewMode === "compact");
  document.body.classList.toggle("view-list",    viewMode === "list");
  document.querySelectorAll("[data-view-mode]").forEach(button => {
    button.setAttribute("aria-pressed", String(button.dataset.viewMode === viewMode));
  });
  updateSortControls();
}

function setViewMode(mode, { save = false } = {}) {
  viewMode = normalizeViewMode(mode);
  updateViewControls();
  if (save) {
    saveFilterState();
    renderList(filteredData());
  }
}

function saveFilterState({ updateUrl = true } = {}) {
  const state = getFilterState();
  localStorage.setItem("filter_search",     state.search);
  localStorage.setItem("filter_type",       JSON.stringify(state.typeVals));
  localStorage.setItem("filter_canon",      JSON.stringify(state.canonVals));
  localStorage.setItem("filter_multiverse", JSON.stringify(state.mvVals));
  localStorage.setItem("filter_sort",       state.sortMode);
  localStorage.setItem("filter_sortDirection", state.sortDirection);
  localStorage.setItem("filter_hideWatched", state.hideWatched);
  localStorage.setItem("filter_viewMode",   state.viewMode);
  if (updateUrl) updateUrlFromState(state);
}

function updateSortControls() {
  const btn = document.getElementById("sortFilterBtn");
  if (!btn) return;

  const isAscending = sortDirection === "asc";
  const directionLabel = isAscending ? "Old → New" : "New → Old";
  const ariaDirectionLabel = isAscending ? "Old to New" : "New to Old";
  const summary = btn.querySelector(".sort-summary");
  const hideWatched = document.getElementById("hideWatched")?.checked === true;
  const hasActiveOption = sortDirection !== "asc" || hideWatched || viewMode !== "comfortable";

  btn.setAttribute("aria-label", `View: ${ariaDirectionLabel}`);
  btn.classList.toggle("has-active", hasActiveOption);
  if (summary) summary.textContent = directionLabel;

  document.querySelectorAll("[data-sort-mode]").forEach(button => {
    button.setAttribute("aria-pressed", String(button.dataset.sortMode === sortMode));
  });
  document.querySelectorAll("[data-sort-direction]").forEach(button => {
    button.setAttribute("aria-pressed", String(button.dataset.sortDirection === sortDirection));
  });
}

function restoreFilterState() {
  const restore = (storageKey, panelSelector) => {
    const saved = JSON.parse(localStorage.getItem(storageKey) || "[]");
    saved.forEach(val => {
      const cb = document.querySelector(`${panelSelector} input[value=${CSS.escape(val)}]`);
      if (cb) cb.checked = true;
    });
  };
  restore("filter_type",       "#typeFilter");
  restore("filter_canon",      "#canonFilter");
  restore("filter_multiverse", "#multiverseFilter");
  setSearchValue(localStorage.getItem("filter_search") || "");

  const savedSort = localStorage.getItem("filter_sort");
  if (savedSort) {
    sortMode = normalizeSortMode(savedSort);
  }
  sortDirection = normalizeSortDirection(localStorage.getItem("filter_sortDirection") || "asc");

  const savedHide = localStorage.getItem("filter_hideWatched");
  if (savedHide !== null) {
    document.getElementById("hideWatched").checked = savedHide === "true";
  }
  setViewMode(localStorage.getItem("filter_viewMode") || "comfortable");

  const params = new URLSearchParams(window.location.search);
  if (hasUrlFilterState(params)) {
    setSearchValue(params.get("q") || "");
    sortMode = normalizeSortMode(params.get("sort") || "release");
    sortDirection = normalizeSortDirection(params.get("direction") || "asc");
    document.getElementById("hideWatched").checked =
      params.get("hide") === "1" || params.get("hide") === "true";
    setPanelValues("#typeFilter", getUrlValues(params, "type"));
    setPanelValues("#canonFilter", getUrlValues(params, "canon"));
    setPanelValues("#multiverseFilter", getUrlValues(params, "universe"));
    setViewMode(params.get("view") || "comfortable");
    saveFilterState({ updateUrl: false });
  }

  updateSortControls();
  updateViewControls();

  document.querySelectorAll(".filter-submenu").forEach(menu => {
    menu.open = menu.querySelector(".filter-submenu-options input:checked") !== null;
  });
  syncFilterSubmenus();
}

function setFilterPanelChecked(panelSelector, checked) {
  document.querySelectorAll(`${panelSelector} input:not(.filter-group-toggle)`).forEach(cb => {
    cb.checked = checked;
  });
  syncFilterSubmenus();
  saveFilterState();
  renderList(filteredData());
}

function selectFilterPanel(panelSelector) {
  setFilterPanelChecked(panelSelector, true);
}

function clearFilterPanel(panelSelector) {
  setFilterPanelChecked(panelSelector, false);
}


async function loadData() {
  const res = await fetch("mcu.json");
  fullData = await res.json();
  populateFilters();
  restoreFilterState();
  renderList(filteredData());

  document.querySelectorAll("[data-sort-mode]").forEach(button => {
    button.addEventListener("click", () => {
      sortMode = normalizeSortMode(button.dataset.sortMode);
      updateSortControls();
      saveFilterState();
      renderList(filteredData());
    });
  });

  document.querySelectorAll("[data-sort-direction]").forEach(button => {
    button.addEventListener("click", () => {
      sortDirection = normalizeSortDirection(button.dataset.sortDirection);
      updateSortControls();
      saveFilterState();
      renderList(filteredData());
    });
  });

  document.getElementById("printBtn")?.addEventListener("click", () => {
    closeAllDropdowns();
    const dropdown = document.getElementById("dropdown");
    const hamburger = document.getElementById("hamburger");
    const hamburgerIcon = document.getElementById("hamburger-icon");
    dropdown?.classList.add("hidden");
    hamburger?.setAttribute("aria-expanded", "false");
    hamburgerIcon?.classList.remove("open");
    preparePrintView();
    window.print();
  });

  ["typeFilter", "canonFilter", "multiverseFilter"].forEach(id => {
    document.getElementById(id).addEventListener("change", event => {
      if (event.target.classList.contains("filter-group-toggle")) return;
      syncFilterSubmenus();
      saveFilterState();
      renderList(filteredData());
    });
  });

  const searchInput = document.getElementById("search");
  const searchClear = document.getElementById("searchClear");
  searchInput.addEventListener("input", () => {
    searchClear.hidden = searchInput.value === "";
    saveFilterState();
    renderList(filteredData());
  });
  searchClear.addEventListener("click", () => {
    searchInput.value = "";
    searchClear.hidden = true;
    searchInput.focus();
    saveFilterState();
    renderList(filteredData());
  });

  document.getElementById("hideWatched").addEventListener("change", () => {
    updateSortControls();
    saveFilterState();
    renderList(filteredData());
  });

  document.querySelectorAll("[data-view-mode]").forEach(button => {
    button.addEventListener("click", () => {
      setViewMode(button.dataset.viewMode, { save: true });
    });
  });

initFilterDropdowns();

  document.getElementById("clearAllBtn").addEventListener("click", () => {
    document.querySelectorAll(
      "#typeFilter input, #canonFilter input, #multiverseFilter input:not(.filter-group-toggle)"
    ).forEach(cb => cb.checked = false);
    syncFilterSubmenus();
    saveFilterState();
    renderList(filteredData());
  });
}

function populateFilters() {
  const preferredOrder = [
    "Marvel Studios", "Disney+", "ABC", "Netflix", "Hulu", "Freeform",
    "One Shot", "Sony", "Fox", "New Line Cinema", "YouTube", "WHIH",
    "Daily Bugle", "Other"
  ];

  const types = [...new Set(fullData.map(item => item.type))]
    .filter(Boolean)
    .sort((a, b) => {
      const ia = preferredOrder.indexOf(a), ib = preferredOrder.indexOf(b);
      if (ia === -1 && ib === -1) return a.localeCompare(b);
      return (ia === -1 ? 999 : ia) - (ib === -1 ? 999 : ib);
    });

  const multiverses = [...new Set(fullData.map(item => item.multiverse))]
    .filter(v => v !== undefined && v !== null)
    .sort((a, b) => a - b);

  const typeChips = document.querySelector("#typeFilter .type-checkboxes");
  types.forEach(type => {
    const label = document.createElement("label");
    label.className = "filter-chip studio-chip";
    const color = STUDIO_TINTS[type];
    if (color) label.style.setProperty("--chip-color", color);
    const cb = document.createElement("input");
    cb.type = "checkbox";
    cb.value = type;
    const span = document.createElement("span");
    span.textContent = type;
    label.appendChild(cb);
    label.appendChild(span);
    typeChips.appendChild(label);
  });

  const mvChips = document.querySelector("#multiverseFilter .multiverse-checkboxes");
  const whatIfMultiverseIds = new Set(
    fullData
      .filter(item => item.show === "What If...?" || item.id === "what_if_an_immersive_story")
      .map(item => item.multiverse)
  );
  const mainMultiverses = multiverses.filter(mv => !whatIfMultiverseIds.has(mv));
  const whatIfMultiverses = multiverses.filter(mv => whatIfMultiverseIds.has(mv));

  mainMultiverses.forEach(mv => mvChips.appendChild(createMultiverseChip(mv)));

  if (whatIfMultiverses.length > 0) {
    const whatIfMenu = document.createElement("details");
    whatIfMenu.className = "filter-submenu";

    const summary = document.createElement("summary");
    const title = document.createElement("span");
    title.textContent = "What If...?";

    const groupLabel = document.createElement("label");
    groupLabel.className = "filter-submenu-toggle";
    groupLabel.addEventListener("click", event => event.stopPropagation());

    const groupToggle = document.createElement("input");
    groupToggle.type = "checkbox";
    groupToggle.className = "filter-group-toggle";
    groupToggle.setAttribute("aria-label", "Select all What If...? universes");

    const groupMark = document.createElement("span");
    groupMark.className = "filter-submenu-check";

    groupLabel.appendChild(groupToggle);
    groupLabel.appendChild(groupMark);

    const count = document.createElement("span");
    count.className = "filter-submenu-count";
    count.textContent = whatIfMultiverses.length;

    const chevron = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    chevron.classList.add("submenu-chevron");
    chevron.setAttribute("width", "10");
    chevron.setAttribute("height", "10");
    chevron.setAttribute("viewBox", "0 0 10 10");
    chevron.setAttribute("fill", "none");
    chevron.setAttribute("stroke", "currentColor");
    chevron.setAttribute("stroke-width", "2");
    chevron.setAttribute("stroke-linecap", "round");
    chevron.setAttribute("stroke-linejoin", "round");
    const polyline = document.createElementNS("http://www.w3.org/2000/svg", "polyline");
    polyline.setAttribute("points", "2,3 5,7 8,3");
    chevron.appendChild(polyline);

    const options = document.createElement("div");
    options.className = "filter-submenu-options";
    whatIfMultiverses.forEach(mv => options.appendChild(createMultiverseChip(mv)));

    groupToggle.addEventListener("change", () => {
      options.querySelectorAll("input").forEach(input => {
        input.checked = groupToggle.checked;
      });
      syncFilterSubmenus();
      saveFilterState();
      renderList(filteredData());
    });

    summary.appendChild(title);
    summary.appendChild(groupLabel);
    summary.appendChild(count);
    summary.appendChild(chevron);
    whatIfMenu.appendChild(summary);
    whatIfMenu.appendChild(options);
    mvChips.appendChild(whatIfMenu);
  }

}

function isEpisode(item) {
  return typeof item.show === "string" && item.show.trim() !== ""
    && item.season != null && !Number.isNaN(Number(item.season))
    && item.episode != null && !Number.isNaN(Number(item.episode));
}

function buildRenderGroups(data) {
  const result = [];
  let i = 0;
  while (i < data.length) {
    const item = data[i];
    if (isEpisode(item)) {
      let j = i + 1;
      while (j < data.length && isEpisode(data[j]) && data[j].show === item.show) j++;
      const run = data.slice(i, j);
      if (run.length >= 2) {
        result.push({ type: "group", show: item.show, items: run });
      } else {
        result.push({ type: "single", item: run[0] });
      }
      i = j;
    } else {
      result.push({ type: "single", item });
      i++;
    }
  }
  return result;
}

function escapeAttribute(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function normalizeExternalUrl(url) {
  if (typeof url !== "string" || url.trim() === "") return "";
  try {
    const parsed = new URL(url, window.location.href);
    return /^https?:$/.test(parsed.protocol) ? parsed.href : "";
  } catch {
    return "";
  }
}

function externalLinkIcon() {
  return `
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <path d="M15 3h6v6"/>
      <path d="M10 14 21 3"/>
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
    </svg>
  `;
}

function createSourceLinkHtml(url, label) {
  const normalizedUrl = normalizeExternalUrl(url);
  if (!normalizedUrl) return "";
  return `
    <a class="source-link card-source-link" href="${escapeAttribute(normalizedUrl)}" target="_blank" rel="noopener noreferrer" aria-label="${escapeAttribute(label)}" title="${escapeAttribute(label)}">
      ${externalLinkIcon()}
      <span class="source-link-label">View</span>
    </a>
  `;
}

function createSourceLinkElement(url, label) {
  const normalizedUrl = normalizeExternalUrl(url);
  if (!normalizedUrl) return null;

  const link = document.createElement("a");
  link.className = "source-link episode-source-link";
  link.href = normalizedUrl;
  link.target = "_blank";
  link.rel = "noopener noreferrer";
  link.setAttribute("aria-label", label);
  link.title = label;
  link.innerHTML = `${externalLinkIcon()}<span class="source-link-label">View</span>`;
  link.addEventListener("click", event => event.stopPropagation());
  return link;
}

function createSingleCard(item) {
  const card = document.createElement("div");
  card.classList.add("mcu-card");

  const checked = localStorage.getItem(`watched_${item.id}`) === "true";
  if (checked) card.classList.add("is-watched");

  const color = MV_TINTS[String(item.multiverse)];
  if (color) card.style.setProperty("--mv-color", color);

  const studioColor = STUDIO_TINTS[item.type];
  if (studioColor) card.style.setProperty("--studio-color", studioColor);

  const releaseDate = new Date(item.release_date);
  const formattedDate = releaseDate.toLocaleDateString(undefined, {
    year: "numeric", month: "short", day: "numeric"
  });
  const formattedRuntime = formatRuntimeLong(item.runtime);

  const mvLabelFull = multiverseName(item.multiverse);
  const earthMatch  = mvLabelFull.match(/(Earth-[^\s(]+)/);
  const mvLabel     = earthMatch ? earthMatch[1] : mvLabelFull;

  const nonCanonTag = item.canon === false
    ? `<span class="non-canon-tag">Non-Canon</span>`
    : "";

  const isShow = isEpisode(item);

  const epBadge = isShow
    ? `<span class="card-ep-badge">S${Math.trunc(Number(item.season))} - E${Math.trunc(Number(item.episode))}</span>`
    : "";

  const titleBlock = isShow
    ? `<div class="card-show">${item.show}</div><div class="card-ep-title">${item.title}${nonCanonTag}</div>`
    : `<div class="card-title">${item.title}${nonCanonTag}</div>`;
  const sourceLink = createSourceLinkHtml(item.url, `Open ${getDisplayTitle(item)}`);

  card.innerHTML = `
    <div class="card-top">
      <span class="card-type">${item.type}</span>
      ${epBadge}
    </div>
    ${titleBlock}
    <div class="card-bottom">
      <div class="card-info">
        <span class="card-meta">${formattedDate} · ${formattedRuntime}</span>
        <span class="card-universe"><span class="card-universe-label">${mvLabel}</span></span>
      </div>
      <div class="card-actions">
        ${sourceLink}
        <input type="checkbox" class="watched-toggle" ${checked ? "checked" : ""} data-id="${item.id}" aria-label="Mark as watched">
      </div>
    </div>
  `;

  card.querySelectorAll(".source-link").forEach(link => {
    link.addEventListener("click", event => event.stopPropagation());
  });

  card.addEventListener("click", () => {
    const isWatched = localStorage.getItem(`watched_${item.id}`) === "true";
    localStorage.setItem(`watched_${item.id}`, !isWatched);
    renderList(filteredData());
  });

  return card;
}

function createGroupCard(group) {
  const key = `${group.show}|${group.items[0].id}`;
  const expanded = expandedGroups.has(key);
  const items = group.items;
  const type = items[0].type;

  const studioColor = STUDIO_TINTS[type];
  const color = MV_TINTS[String(items[0].multiverse)];

  const seasons = [...new Set(items.map(it => Math.trunc(Number(it.season))))].sort((a, b) => a - b);
  const seasonLabel = seasons.length === 1
    ? `Season ${seasons[0]}`
    : `S${seasons[0]}–S${seasons[seasons.length - 1]}`;

  const totalRuntime = items.reduce((s, it) => s + (Number(it.runtime) || 0), 0);
  const firstDate = new Date(items[0].release_date);
  const lastDate  = new Date(items[items.length - 1].release_date);
  const fmtShort  = d => d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
  const fmtFull   = d => d.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
  const sameYear  = firstDate.getFullYear() === lastDate.getFullYear();
  const dateRange = `${sameYear ? fmtShort(firstDate) : fmtFull(firstDate)} – ${fmtFull(lastDate)}`;

  const universes = [...new Set(items.map(it => String(it.multiverse)))];
  let mvLabel;
  if (universes.length === 1) {
    const full = multiverseName(items[0].multiverse);
    const m = full.match(/(Earth-[^\s(]+)/);
    mvLabel = m ? m[1] : full;
  } else {
    mvLabel = `${universes.length} Universes`;
  }

  const watchedCount = () =>
    items.filter(it => localStorage.getItem(`watched_${it.id}`) === "true").length;

  const card = document.createElement("div");
  card.className = `mcu-card group-card${expanded ? " is-expanded" : ""}`;
  if (color) card.style.setProperty("--mv-color", color);
  if (studioColor) card.style.setProperty("--studio-color", studioColor);

  const renderBadge = () => {
    const wc = watchedCount();
    const badge = card.querySelector(".group-watched-badge");
    if (!badge) return;
    badge.className = `group-watched-badge${wc === items.length ? " is-complete" : ""}`;
    badge.innerHTML = `${wc}<span class="group-watched-sep">/</span>${items.length}`;
  };

  const wc0 = watchedCount();
  card.innerHTML = `
    <div class="card-top">
      <span class="card-type">${type}</span>
      <span class="group-ep-count">${items.length} episodes</span>
    </div>
    <div class="card-show">${group.show}</div>
    <div class="group-season-label">${seasonLabel}</div>
    <div class="card-bottom">
      <div class="card-info">
        <span class="card-meta">${dateRange} · ${formatRuntimeLong(totalRuntime)}</span>
        <span class="card-universe"><span class="card-universe-label">${mvLabel}</span></span>
      </div>
      <div class="group-right">
        <span class="group-watched-badge${wc0 === items.length ? " is-complete" : ""}">${wc0}<span class="group-watched-sep">/</span>${items.length}</span>
        <span class="group-chevron">
          <svg width="12" height="12" viewBox="0 0 10 10" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="2,3 5,7 8,3"/>
          </svg>
        </span>
      </div>
    </div>
  `;

  // Episode list
  const epList = document.createElement("div");
  epList.className = "episode-list";
  if (!expanded) epList.hidden = true;

  items.forEach(it => {
    const isWatched = localStorage.getItem(`watched_${it.id}`) === "true";
    const row = document.createElement("div");
    row.className = `episode-row${isWatched ? " is-watched" : ""}`;

    const badge    = document.createElement("span");
    badge.className = "ep-badge";
    badge.textContent = `S${Math.trunc(Number(it.season))}E${Math.trunc(Number(it.episode))}`;

    const titleSpan = document.createElement("span");
    titleSpan.className = "ep-title";
    titleSpan.textContent = it.title;
    if (it.canon === false) {
      const nc = document.createElement("span");
      nc.className = "non-canon-tag";
      nc.textContent = "NC";
      nc.style.marginLeft = "5px";
      titleSpan.appendChild(nc);
    }

    const runtime = document.createElement("span");
    runtime.className = "ep-runtime";
    runtime.textContent = formatRuntimeLong(it.runtime);

    const sourceLink = createSourceLinkElement(it.url, `Open ${getDisplayTitle(it)}`);

    const toggle = document.createElement("input");
    toggle.type = "checkbox";
    toggle.className = "watched-toggle ep-toggle";
    toggle.checked = isWatched;
    toggle.setAttribute("aria-label", "Mark as watched");

    row.append(badge, titleSpan, runtime);
    if (sourceLink) row.appendChild(sourceLink);
    row.appendChild(toggle);

    row.addEventListener("click", e => {
      e.stopPropagation();
      const nowWatched = localStorage.getItem(`watched_${it.id}`) === "true";
      localStorage.setItem(`watched_${it.id}`, !nowWatched);
      row.classList.toggle("is-watched", !nowWatched);
      toggle.checked = !nowWatched;
      renderBadge();
      updateStats();
    });

    epList.appendChild(row);
  });

  epList.addEventListener("click", e => e.stopPropagation());

  card.addEventListener("click", () => {
    if (expandedGroups.has(key)) {
      expandedGroups.delete(key);
      card.classList.remove("is-expanded");
      epList.hidden = true;
    } else {
      expandedGroups.add(key);
      card.classList.add("is-expanded");
      epList.hidden = false;
    }
  });

  card.appendChild(epList);
  return card;
}

const mobileQuery = window.matchMedia("(max-width: 820px)");
mobileQuery.addEventListener("change", () => renderList(filteredData()));

function renderList(data) {
  const list = document.getElementById("list");
  list.innerHTML = "";

  const groups = (mobileQuery.matches && viewMode !== "list")
    ? buildRenderGroups(data)
    : data.map(item => ({ type: "single", item }));
  let singles = [];

  const flushSingles = () => {
    if (singles.length === 0) return;
    const grid = document.createElement("div");
    grid.className = "card-grid";
    singles.forEach(item => grid.appendChild(createSingleCard(item)));
    list.appendChild(grid);
    singles = [];
  };

  groups.forEach(entry => {
    if (entry.type === "single") {
      singles.push(entry.item);
    } else {
      flushSingles();
      list.appendChild(createGroupCard(entry));
    }
  });
  flushSingles();

  updateStats();
  updateFilterButtons();
}

function formatRuntime(minutes) {
  const totalSeconds = Math.round(minutes * 60);
  const days  = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const mins  = Math.floor((totalSeconds % 3600) / 60);
  const secs  = totalSeconds % 60;
  const parts = [];
  if (days)  parts.push(`${days}d`);
  if (hours) parts.push(`${hours}h`);
  if (mins)  parts.push(`${mins}m`);
  if (secs)  parts.push(`${secs}s`);
  return parts.join(" ");
}

function formatRuntimeLong(minutes) {
  const mins = Math.round(Number(minutes) || 0);
  const h = Math.floor(mins / 60), m = mins % 60;
  if (h <= 0) return `${m}m`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}m`;
}

function getDisplayTitle(item) {
  const hasShow    = typeof item.show === "string" && item.show.trim() !== "";
  const hasSeason  = item.season  != null && !Number.isNaN(Number(item.season));
  const hasEpisode = item.episode != null && !Number.isNaN(Number(item.episode));
  if (hasShow && hasSeason && hasEpisode) {
    return `${item.show} S${Math.trunc(Number(item.season))}E${Math.trunc(Number(item.episode))}: ${item.title}`;
  }
  return item.title;
}

function updateStats() {
  const watchedItems    = fullData.filter(item => localStorage.getItem(`watched_${item.id}`) === "true");
  const totalRuntime    = fullData.reduce((s, item) => s + item.runtime, 0);
  const watchedRuntime  = watchedItems.reduce((s, item) => s + item.runtime, 0);
  const percent         = totalRuntime ? Math.round((watchedRuntime / totalRuntime) * 100) : 0;

  const el = id => document.getElementById(id);
  el("stat-percent").textContent       = `${percent}%`;
  el("stat-time").textContent          = formatRuntimeShort(watchedRuntime);
  el("stat-time-remaining").textContent = formatRuntimeShort(totalRuntime - watchedRuntime);
  el("progressBar").style.width        = `${percent}%`;
}

function formatRuntimeShort(minutes) {
  const totalSeconds = Math.round(minutes * 60);
  const days  = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const mins  = Math.floor((totalSeconds % 3600) / 60);
  const parts = [];
  if (days)  parts.push(`${days}d`);
  if (hours) parts.push(`${hours}h`);
  if (mins)  parts.push(`${mins}m`);
  return parts.join(" ") || "0m";
}

function getProgressStats(items = fullData) {
  const watchedItems = items.filter(item => localStorage.getItem(`watched_${item.id}`) === "true");
  const totalRuntime = items.reduce((s, item) => s + (Number(item.runtime) || 0), 0);
  const watchedRuntime = watchedItems.reduce((s, item) => s + (Number(item.runtime) || 0), 0);

  return {
    totalCount: items.length,
    watchedCount: watchedItems.length,
    totalRuntime,
    watchedRuntime,
    remainingRuntime: Math.max(totalRuntime - watchedRuntime, 0),
    percent: totalRuntime ? Math.round((watchedRuntime / totalRuntime) * 100) : 0
  };
}

function filteredData() {
  const query       = document.getElementById("search").value.toLowerCase();
  const hideWatched = document.getElementById("hideWatched")?.checked;
  const typeVals    = Array.from(document.querySelectorAll("#typeFilter input:checked")).map(c => c.value);
  const canonVals   = Array.from(document.querySelectorAll("#canonFilter input:checked")).map(c => c.value);
  const mvVals      = Array.from(multiverseFilterInputs(":checked")).map(c => c.value);

  return fullData.filter(item => {
    const isWatched  = localStorage.getItem(`watched_${item.id}`) === "true";
    const typeMatch  = typeVals.length  === 0 || typeVals.includes(item.type);
    const canonMatch = canonVals.length === 0 || canonVals.includes(String(item.canon));
    const mvMatch    = mvVals.length    === 0 || mvVals.includes(String(item.multiverse));
    return getDisplayTitle(item).toLowerCase().includes(query)
      && (!hideWatched || !isWatched)
      && typeMatch && canonMatch && mvMatch;
  }).sort((a, b) => {
    let result;
    if (sortMode === "chronological") {
      result = (a.chronology ?? Infinity) - (b.chronology ?? Infinity);
    } else {
      result = new Date(a.release_date) - new Date(b.release_date);
    }
    return sortDirection === "desc" ? -result : result;
  });
}

function appendPrintText(parent, tag, className, text) {
  const el = document.createElement(tag);
  if (className) el.className = className;
  el.textContent = text;
  parent.appendChild(el);
  return el;
}

function formatPrintDate(dateValue) {
  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString(undefined, {
    year: "numeric", month: "short", day: "numeric"
  });
}

function summarizePrintValues(label, values) {
  if (values.length === 0) return "";
  if (values.length > 4) return `${label}: ${values.length} selected`;
  return `${label}: ${values.join(", ")}`;
}

function getPrintFilterSummary(dataCount) {
  const details = [
    `Order: ${sortMode === "release" ? "Release" : "Chronological"} (${sortDirection === "asc" ? "Old → New" : "New → Old"})`,
    `Showing: ${dataCount} of ${fullData.length}`
  ];

  const query = document.getElementById("search")?.value.trim();
  if (query) details.push(`Search: "${query}"`);
  if (document.getElementById("hideWatched")?.checked) details.push("Hide watched: on");

  const typeVals = Array.from(document.querySelectorAll("#typeFilter input:checked"))
    .map(input => input.closest("label")?.querySelector("span")?.textContent || input.value);
  const canonVals = Array.from(document.querySelectorAll("#canonFilter input:checked"))
    .map(input => input.closest("label")?.querySelector("span")?.textContent || input.value);
  const mvVals = Array.from(multiverseFilterInputs(":checked"))
    .map(input => multiverseName(input.value));

  [summarizePrintValues("Studio", typeVals),
   summarizePrintValues("Canon", canonVals),
   summarizePrintValues("Multiverse", mvVals)]
    .filter(Boolean)
    .forEach(detail => details.push(detail));

  return details.join(" | ");
}

function createPrintSummaryCard(label, value) {
  const card = document.createElement("div");
  card.className = "print-summary-card";
  appendPrintText(card, "span", "print-summary-value", value);
  appendPrintText(card, "span", "print-summary-label", label);
  return card;
}

function createPrintRow(item, index) {
  const watched = localStorage.getItem(`watched_${item.id}`) === "true";
  const row = document.createElement("div");
  row.className = `print-row${watched ? " is-watched" : ""}`;
  row.style.setProperty(
    "--print-row-color",
    MV_TINTS[String(item.multiverse)] || STUDIO_TINTS[item.type] || "#6b7280"
  );

  appendPrintText(row, "span", "print-row-number", String(index + 1));

  const check = appendPrintText(row, "span", "print-check", watched ? "✓" : "");
  check.setAttribute("aria-label", watched ? "Watched" : "Not watched");

  const content = document.createElement("div");
  content.className = "print-row-content";
  appendPrintText(content, "span", "print-row-title", getDisplayTitle(item));

  const metaParts = [
    item.type,
    item.canon === false ? "Non-Canon" : "",
    multiverseName(item.multiverse),
    formatPrintDate(item.release_date)
  ].filter(Boolean);
  appendPrintText(content, "span", "print-row-meta", metaParts.join(" | "));
  row.appendChild(content);

  appendPrintText(row, "span", "print-row-runtime", formatRuntimeLong(item.runtime));
  appendPrintText(row, "span", "print-row-status", watched ? "Watched" : "To watch");

  return row;
}

function preparePrintView() {
  const printView = document.getElementById("printView");
  if (!printView || fullData.length === 0) return;

  document.body.classList.add("print-mode");

  const data = filteredData();
  const stats = getProgressStats(fullData);
  const printedAt = new Date().toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit"
  });

  printView.innerHTML = "";
  printView.setAttribute("aria-hidden", "false");

  const header = document.createElement("div");
  header.className = "print-header";
  appendPrintText(header, "p", "print-kicker", "MCU Viewing Order");
  appendPrintText(header, "h1", "", "Watch Order Checklist");
  appendPrintText(header, "p", "print-meta", `${getPrintFilterSummary(data.length)} | Generated: ${printedAt}`);
  printView.appendChild(header);

  const summary = document.createElement("div");
  summary.className = "print-summary";
  summary.appendChild(createPrintSummaryCard("Complete", `${stats.percent}%`));
  summary.appendChild(createPrintSummaryCard("Watched", `${stats.watchedCount}/${stats.totalCount}`));
  summary.appendChild(createPrintSummaryCard("Time Watched", formatRuntimeShort(stats.watchedRuntime)));
  summary.appendChild(createPrintSummaryCard("Time Remaining", formatRuntimeShort(stats.remainingRuntime)));
  printView.appendChild(summary);

  const progressTrack = document.createElement("div");
  progressTrack.className = "print-progress-track";
  const progressBar = document.createElement("div");
  progressBar.className = "print-progress-bar";
  progressBar.style.width = `${stats.percent}%`;
  progressTrack.appendChild(progressBar);
  printView.appendChild(progressTrack);

  const listHeader = document.createElement("div");
  listHeader.className = "print-list-header";
  appendPrintText(listHeader, "h2", "", "Watch Order");
  appendPrintText(listHeader, "span", "", `${data.length} titles`);
  printView.appendChild(listHeader);

  const list = document.createElement("div");
  list.className = "print-list";
  if (data.length === 0) {
    appendPrintText(list, "p", "print-empty", "No titles match the current filters.");
  } else {
    data.forEach((item, index) => list.appendChild(createPrintRow(item, index)));
  }
  printView.appendChild(list);
}

// ─── Filter button count badges ───
function updateFilterButtons() {
  syncFilterSubmenus();

  const filterCount = document.querySelectorAll(
    "#typeFilter input:checked, #canonFilter input:checked"
  ).length + multiverseFilterInputs(":checked").length;
  const filtersBtn = document.getElementById("filtersBtn");
  if (filtersBtn) {
    const badge = filtersBtn.querySelector(".filter-count");
    if (badge) {
      badge.textContent = filterCount;
      badge.hidden = filterCount === 0;
    }
    filtersBtn.classList.toggle("has-active", filterCount > 0);
  }

  const anyActive = filterCount > 0;
  const clearAll = document.getElementById("clearAllBtn");
  if (clearAll) clearAll.hidden = !anyActive;
}

// ─── Filter dropdown toggle ───
function initFilterDropdowns() {
  document.querySelectorAll(".filter-pill").forEach(btn => {
    btn.addEventListener("click", e => {
      e.stopPropagation();
      const panel   = btn.nextElementSibling;
      const isOpen  = !panel.classList.contains("hidden");
      closeAllDropdowns();
      if (!isOpen) {
        panel.classList.remove("hidden");
        btn.classList.add("open");
        if (panel.id === "filtersPanel") setTimeout(matchMultiverseHeight, 0);
      }
    });
  });

  // Clicking inside a panel shouldn't close it
  document.querySelectorAll(".filter-dropdown-panel").forEach(panel => {
    panel.addEventListener("click", e => e.stopPropagation());
  });

  // Click outside closes all
  document.addEventListener("click", closeAllDropdowns);
}

function closeAllDropdowns() {
  document.querySelectorAll(".filter-dropdown-panel").forEach(p => p.classList.add("hidden"));
  document.querySelectorAll(".filter-pill").forEach(b => b.classList.remove("open"));
}

function matchMultiverseHeight() {
  if (mobileQuery.matches) return;
  const studio = document.getElementById("typeFilter");
  const mv     = document.getElementById("multiverseFilter");
  if (!studio || !mv) return;
  mv.style.height = studio.offsetHeight + "px";
}

// ─── Theme — mirrors main site logic exactly ───
const applyTheme = (theme) => {
  document.documentElement.classList.toggle("dark", theme === "dark");
  document.body.classList.toggle("dark", theme === "dark");
  const light = document.getElementById("theme-color-light");
  const dark  = document.getElementById("theme-color-dark");
  if (light) { light.media = theme === "dark" ? "not all" : "all"; light.content = "#eef1f6"; }
  if (dark)  { dark.media  = theme === "dark" ? "all" : "not all"; dark.content  = "#090b10"; }
  localStorage.setItem("theme", theme);
};

const storedTheme = localStorage.getItem("theme");
const preferredScheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
applyTheme(storedTheme || preferredScheme);

function toggleTheme() {
  const current = document.body.classList.contains("dark") ? "dark" : "light";
  applyTheme(current === "dark" ? "light" : "dark");
}

document.getElementById("floating-theme-toggle")?.addEventListener("click", event => {
  event.preventDefault();
  toggleTheme();
});

document.getElementById("hamburger")?.addEventListener("click", event => {
  event.stopPropagation();

  const dropdown = document.getElementById("dropdown");
  const hamburger = document.getElementById("hamburger");
  const hamburgerIcon = document.getElementById("hamburger-icon");
  const isOpen = !dropdown.classList.toggle("hidden");

  hamburger.setAttribute("aria-expanded", String(isOpen));
  hamburgerIcon.classList.toggle("open", isOpen);
});

document.getElementById("dropdown")?.addEventListener("click", event => {
  event.stopPropagation();
});

document.addEventListener("click", () => {
  const dropdown = document.getElementById("dropdown");
  const hamburger = document.getElementById("hamburger");
  const hamburgerIcon = document.getElementById("hamburger-icon");
  if (!dropdown || !hamburger || !hamburgerIcon) return;

  dropdown.classList.add("hidden");
  hamburger.setAttribute("aria-expanded", "false");
  hamburgerIcon.classList.remove("open");
});

document.querySelectorAll("[data-coming-soon]").forEach(link => {
  link.addEventListener("click", event => {
    event.preventDefault();
  });
});

// ─── Progress export / import ───
function encodeProgress() {
  const bytes = new Uint8Array(Math.ceil(fullData.length / 8));
  fullData.forEach((item, i) => {
    if (localStorage.getItem(`watched_${item.id}`) === "true") {
      bytes[Math.floor(i / 8)] |= 1 << (i % 8);
    }
  });
  return btoa(String.fromCharCode(...bytes));
}

function decodeProgress(code) {
  let bytes;
  try {
    bytes = Uint8Array.from(atob(code.trim()), c => c.charCodeAt(0));
  } catch {
    return false;
  }
  fullData.forEach((item, i) => {
    const watched = (bytes[Math.floor(i / 8)] >> (i % 8)) & 1;
    if (watched) {
      localStorage.setItem(`watched_${item.id}`, "true");
    } else {
      localStorage.removeItem(`watched_${item.id}`);
    }
  });
  return true;
}

function openProgressModal(mode) {
  const modal = document.getElementById("progressModal");
  const title = document.getElementById("progressModalTitle");
  const exportContent = document.getElementById("exportContent");
  const importContent = document.getElementById("importContent");

  title.textContent = mode === "export" ? "Export Progress" : "Import Progress";
  exportContent.classList.toggle("hidden", mode !== "export");
  importContent.classList.toggle("hidden", mode !== "import");

  if (mode === "export") {
    document.getElementById("progressCode").value = encodeProgress();
  } else {
    document.getElementById("importCode").value = "";
  }

  modal.classList.remove("hidden");
  document.body.style.overflow = "hidden";
}

function closeProgressModal() {
  document.getElementById("progressModal").classList.add("hidden");
  document.body.style.overflow = "";
}

document.getElementById("exportProgressBtn")?.addEventListener("click", () => {
  closeAllDropdowns();
  openProgressModal("export");
});

document.getElementById("importProgressBtn")?.addEventListener("click", () => {
  closeAllDropdowns();
  openProgressModal("import");
});

document.querySelector(".progress-modal-close")?.addEventListener("click", closeProgressModal);

document.getElementById("progressModal")?.querySelector(".progress-modal-backdrop")?.addEventListener("click", closeProgressModal);

document.getElementById("copyCodeBtn")?.addEventListener("click", () => {
  const textarea = document.getElementById("progressCode");
  navigator.clipboard.writeText(textarea.value).then(() => {
    const btn = document.getElementById("copyCodeBtn");
    btn.textContent = "Copied!";
    setTimeout(() => { btn.textContent = "Copy Code"; }, 2000);
  });
});

document.getElementById("applyCodeBtn")?.addEventListener("click", () => {
  const code = document.getElementById("importCode").value;
  if (!decodeProgress(code)) {
    document.getElementById("importCode").setCustomValidity("Invalid code");
    document.getElementById("importCode").reportValidity();
    return;
  }
  closeProgressModal();
  renderList(filteredData());
  updateStats();
});

window.addEventListener("beforeprint", preparePrintView);
window.addEventListener("afterprint", () => {
  document.body.classList.remove("print-mode");
  document.getElementById("printView")?.setAttribute("aria-hidden", "true");
});

loadData();
