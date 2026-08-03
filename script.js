let fullData = [];
let sortMode = "release";
let sortDirection = "asc";
let viewMode = "comfortable";
let activeJourney = null;
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

function matchesJourney(item, journey) {
  if (!journey) return false;
  const title = (item.title || "").toLowerCase();
  const show = (item.show || "").toLowerCase();
  const id = (item.id || "").toLowerCase();
  
  if (journey === "stark") {
    return (
      title.includes("iron man") || title.includes("stark") || title.includes("haztech") || title.includes("iron patriot") ||
      show.includes("iron man") || show.includes("stark") || show.includes("haztech") || show.includes("iron patriot") ||
      id.includes("iron_man") || id.includes("stark") || id.includes("haztech") || id.includes("iron_patriot") ||
      title.includes("homecoming") || id.includes("homecoming") ||
      title.includes("far from home") || id.includes("far_from_home") ||
      title.includes("civil war") || id.includes("civil_war") ||
      id.includes("ironheart") || show.includes("ironheart") || title.includes("ironheart") ||
      id.includes("armor_wars") || title.includes("armor wars") ||
      id.includes("the_consultant") || id.includes("the_incredible_hulk") ||
      id.includes("avengers") || id.includes("avengers_age_of_ultron") || 
      id.includes("avengers_infinity_war") || id.includes("avengers_endgame")
    );
  }
  
  if (journey === "cap") {
    return (
      title.includes("captain america") || title.includes("first avenger") || title.includes("falcon") ||
      show.includes("captain america") || show.includes("first avenger") || show.includes("falcon") ||
      id.includes("captain_america") || id.includes("first_avenger") || id.includes("falcon") ||
      title.includes("winter soldier") || id.includes("winter_soldier") ||
      title.includes("bucky") || id.includes("bucky") ||
      title.includes("captain carter") || id.includes("captain_carter") ||
      id.includes("agent_carter") || title.includes("agent carter") || show.includes("agent carter") ||
      id.includes("avengers") || id.includes("avengers_age_of_ultron") || 
      id.includes("avengers_infinity_war") || id.includes("avengers_endgame") ||
      id.includes("captain_america_civil_war") || id.includes("rappin_with_captain_america")
    );
  }
  
  if (journey === "thor") {
    return (
      title.includes("thor") || title.includes("loki") || title.includes("ragnarok") || title.includes("lightning") ||
      show.includes("thor") || show.includes("loki") || show.includes("ragnarok") || show.includes("lightning") ||
      id.includes("thor") || id.includes("loki") || id.includes("ragnarok") || id.includes("lightning") ||
      title.includes("hela") || id.includes("hela") ||
      title.includes("asgard") || id.includes("asgard") ||
      id.includes("team_darryl") || id.includes("thor_is_fine_guys") ||
      id.includes("avengers") || id.includes("avengers_age_of_ultron") || 
      id.includes("avengers_infinity_war") || id.includes("avengers_endgame")
    );
  }
  
  if (journey === "wanda") {
    return (
      title.includes("wandavision") || title.includes("agatha") || title.includes("multiverse of madness") ||
      show.includes("wandavision") || show.includes("agatha") || show.includes("multiverse of madness") ||
      id.includes("wandavision") || id.includes("agatha") || id.includes("multiverse_of_madness") ||
      title.includes("visionquest") || show.includes("visionquest") || id.includes("vision_quest") ||
      (/\bvision\b/.test(title) && !id.includes("television") && !id.includes("division")) ||
      (/\bvision\b/.test(show) && !id.includes("television") && !id.includes("division")) ||
      (/\bvision\b/.test(id.replace(/_/g, " ")) && !id.includes("television") && !id.includes("division")) ||
      id.includes("avengers_age_of_ultron") || id.includes("avengers_infinity_war") || 
      id.includes("avengers_endgame") || id.includes("captain_america_civil_war") ||
      id.includes("what_if_s1_e5") || id.includes("what_if_s1_e8") || id.includes("what_if_s1_e9") || 
      id.includes("what_if_s2_e8") || id.includes("what_if_s3_e1") || id.includes("what_if_s3_e2")
    );
  }
  
  if (journey === "tesseract") {
    return (
      id.includes("captain_america_the_first_avenger") ||
      id.includes("captain_marvel") ||
      id.includes("avengers") ||
      id.includes("thor_the_dark_world") ||
      id.includes("thor_ragnarok") ||
      id.includes("avengers_infinity_war") ||
      id.includes("avengers_endgame") || 
      id.includes("what_if_s1_e1") || 
      id.includes("what_if_s2_e6") ||
      id.includes("loki") || show.includes("loki") || title.includes("tesseract") || id.includes("tesseract")
    );
  }

  if (journey === "spiderman") {
    return (
      title.includes("spider-man") || title.includes("spider-noir") || title.includes("spider-verse") || title.includes("spiderverse") ||
      show.includes("spider-man") || show.includes("spider-noir") || show.includes("spider-verse") || show.includes("spiderverse") ||
      id.includes("spider_man") || id.includes("spider_noir") || id.includes("spider_verse") || id.includes("spiderverse") ||
      title.includes("peter parker") || title.includes("miles morales") || title.includes("gwen stacy") ||
      title.includes("homecoming") || id.includes("homecoming") ||
      title.includes("far from home") || id.includes("far_from_home") ||
      title.includes("no way home") || id.includes("no_way_home") ||
      id.includes("captain_america_civil_war") || id.includes("avengers_infinity_war") || 
      id.includes("avengers_endgame") || id.includes("what_if_s1_e5") || id.includes("what_if_s1_e9")
    );
  }

  if (journey === "guardians") {
    return (
      title.includes("guardians of the galaxy") || title.includes("star-lord") || title.includes("gamora") || title.includes("drax") || title.includes("rocket") || title.includes("groot") || title.includes("mantis") || title.includes("nebula") ||
      show.includes("guardians of the galaxy") || show.includes("star-lord") || show.includes("gamora") || show.includes("drax") || show.includes("rocket") || show.includes("groot") || show.includes("mantis") || show.includes("nebula") ||
      id.includes("guardians") || id.includes("star_lord") || id.includes("gamora") || id.includes("drax") || id.includes("rocket") || id.includes("groot") || id.includes("mantis") || id.includes("nebula") ||
      title.includes("ravager") || id.includes("ravager") ||
      title.includes("awesome mix") || title.includes("yondu") || id.includes("yondu") ||
      title.includes("cosmo") || id.includes("cosmo") ||
      id.includes("holiday_special") || title.includes("holiday special") ||
      id.includes("avengers_infinity_war") || id.includes("avengers_endgame") || 
      id.includes("thor_love_and_thunder") ||
      id.includes("what_if_s1_e2") || id.includes("what_if_s2_e1") || id.includes("what_if_s2_e2")
    );
  }

  if (journey === "strange") {
    return (
      title.includes("doctor strange") || title.includes("strange supreme") || title.includes("eye of agamotto") || title.includes("kamara-taj") || title.includes("wong") || title.includes("ancient one") || title.includes("clea") || title.includes("dormammu") ||
      show.includes("doctor strange") || show.includes("strange supreme") || show.includes("eye of agamotto") || show.includes("kamara-taj") || show.includes("wong") || show.includes("ancient one") || show.includes("clea") || show.includes("dormammu") ||
      id.includes("doctor_strange") || id.includes("strange_supreme") || id.includes("eye_of_agamotto") || id.includes("kamara_taj") || id.includes("wong") || id.includes("ancient_one") || id.includes("clea") || id.includes("dormammu") ||
      title.includes("multiverse of madness") || id.includes("multiverse_of_madness") ||
      title.includes("no way home") || id.includes("no_way_home") ||
      id.includes("avengers_infinity_war") || id.includes("avengers_endgame") || 
      id.includes("thor_ragnarok") || id.includes("what_if_s1_e4") || id.includes("what_if_s2_e9")
    );
  }
  
  return false;
}

function getItemPhase(item) {
  if (item.multiverse !== 0) {
    return "Multiverse & Others";
  }
  if (item.type !== "Marvel Studios" && item.type !== "Disney+" && item.type !== "One Shot") {
    return "Multiverse & Others";
  }
  const d = item.release_date || "";
  if (!d) return "Multiverse & Others";
  if (d <= "2012-12-31") return "Phase 1";
  if (d <= "2015-12-31") return "Phase 2";
  if (d <= "2019-12-31") return "Phase 3";
  if (d <= "2022-12-31") return "Phase 4";
  return "Phase 5";
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
  if (window.MCU_DATA) {
    fullData = window.MCU_DATA;
  } else {
    try {
      const res = await fetch("mcu.json");
      fullData = await res.json();
    } catch (e) {
      console.warn("Fetch failed, falling back to window.MCU_DATA:", e);
      fullData = window.MCU_DATA || [];
    }
  }
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
  
  const debouncedSearch = debounce(() => {
    saveFilterState();
    renderList(filteredData());
  }, 150);

  searchInput.addEventListener("input", () => {
    searchClear.hidden = searchInput.value === "";
    debouncedSearch();
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
  initDashboard();
  initScrollMap();
  initFloatingProgressPill();
  initJourneyTracker();
  initTimelineCanvas();
  initFloatingThemePill();
  initNebulaParticles();

  document.getElementById("clearAllBtn").addEventListener("click", () => {
    document.querySelectorAll(
      "#typeFilter input, #canonFilter input, #multiverseFilter input:not(.filter-group-toggle)"
    ).forEach(cb => cb.checked = false);
    syncFilterSubmenus();
    saveFilterState();
    renderList(filteredData());
  });

  // Handle actions redirected from secondary pages
  const actionParam = new URLSearchParams(window.location.search).get("action");
  if (actionParam) {
    setTimeout(() => {
      if (actionParam === "print") {
        document.getElementById("printBtn")?.click();
      } else if (actionParam === "export") {
        document.getElementById("exportProgressBtn")?.click();
      } else if (actionParam === "import") {
        document.getElementById("importProgressBtn")?.click();
      }
      // Clean query parameter from address bar
      const cleanParams = new URLSearchParams(window.location.search);
      cleanParams.delete("action");
      const cleanUrl = `${window.location.pathname}${cleanParams.toString() ? `?${cleanParams.toString()}` : ""}${window.location.hash}`;
      try {
        window.history.replaceState(null, "", cleanUrl);
      } catch (e) {}
    }, 400);
  }
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

  if (activeJourney && matchesJourney(item, activeJourney)) {
    card.classList.add("card-journey-match");
  }

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

  card.setAttribute("data-phase", getItemPhase(item));

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
  if (activeJourney && items.some(item => matchesJourney(item, activeJourney))) {
    card.classList.add("card-journey-match");
  }
  if (color) card.style.setProperty("--mv-color", color);
  if (studioColor) card.style.setProperty("--studio-color", studioColor);
  card.setAttribute("data-phase", getItemPhase(items[0]));

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
    if (activeJourney && matchesJourney(it, activeJourney)) {
      row.classList.add("row-journey-match");
    }

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
    toggle.setAttribute("data-id", it.id);
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
      if (typeof window.updateJourneyUI === "function") {
        window.updateJourneyUI();
      }
      updateNextUpBanner(filteredData());
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
  if (typeof window.updateJourneyUI === "function") {
    window.updateJourneyUI();
  }
  updateNextUpBanner(data);
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

function renderPhaseProgress() {
  const phases = ["Phase 1", "Phase 2", "Phase 3", "Phase 4", "Phase 5", "Multiverse & Others"];
  const counts = {};
  phases.forEach(p => {
    counts[p] = { total: 0, watched: 0 };
  });

  fullData.forEach(item => {
    const p = getItemPhase(item);
    if (counts[p]) {
      counts[p].total++;
      if (localStorage.getItem(`watched_${item.id}`) === "true") {
        counts[p].watched++;
      }
    }
  });

  const grid = document.getElementById("phaseProgressGrid");
  if (grid) {
    grid.innerHTML = phases.map(p => {
      const c = counts[p];
      const pct = c.total ? Math.round((c.watched / c.total) * 100) : 0;
      return `
        <div class="phase-progress-row">
          <div class="phase-label-info">
            <span>${p}</span>
            <span>${c.watched}/${c.total} (${pct}%)</span>
          </div>
          <div class="phase-bar-bg">
            <div class="phase-bar-fill" style="width: ${pct}%"></div>
          </div>
        </div>
      `;
    }).join("");
  }

  const badgeIronMan = ["captain_america_the_first_avenger", "captain_marvel", "iron_man"].every(
    id => localStorage.getItem(`watched_${id}`) === "true"
  );

  const badgeAvengers = ["avengers", "avengers_age_of_ultron", "avengers_infinity_war", "avengers_endgame"].every(
    id => localStorage.getItem(`watched_${id}`) === "true"
  );

  const watchedMultiverseCount = fullData.filter(
    item => item.multiverse !== 0 && localStorage.getItem(`watched_${item.id}`) === "true"
  ).length;
  const badgeMultiverse = watchedMultiverseCount >= 5;

  const badgeTva = counts["Phase 4"].total > 0 && counts["Phase 4"].watched === counts["Phase 4"].total;

  const totalInfinity = counts["Phase 1"].total + counts["Phase 2"].total + counts["Phase 3"].total;
  const watchedInfinity = counts["Phase 1"].watched + counts["Phase 2"].watched + counts["Phase 3"].watched;
  const badgeInfinity = totalInfinity > 0 && watchedInfinity === totalInfinity;

  const totalAll = fullData.length;
  const watchedAll = fullData.filter(item => localStorage.getItem(`watched_${item.id}`) === "true").length;
  const badgeWatcher = totalAll > 0 && watchedAll === totalAll;

  const updateBadgeClass = (id, unlocked) => {
    const el = document.getElementById(id);
    if (el) el.classList.toggle("unlocked", unlocked);
  };

  updateBadgeClass("badge-iron-man", badgeIronMan);
  updateBadgeClass("badge-avengers", badgeAvengers);
  updateBadgeClass("badge-multiverse", badgeMultiverse);
  updateBadgeClass("badge-tva", badgeTva);
  updateBadgeClass("badge-infinity", badgeInfinity);
  updateBadgeClass("badge-watcher", badgeWatcher);
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

  // Bind to compact floating progress pill
  const pillPercent = el("floating-pill-percent");
  const pillTime = el("floating-pill-time");
  if (pillPercent) {
    pillPercent.textContent = `${percent}%`;
  }
  if (pillTime) {
    pillTime.textContent = `${formatRuntimeShort(totalRuntime - watchedRuntime)} left`;
  }

  renderPhaseProgress();
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
    const journeyMatch = !activeJourney || matchesJourney(item, activeJourney);
    
    return getDisplayTitle(item).toLowerCase().includes(query)
      && (!hideWatched || !isWatched)
      && typeMatch && canonMatch && mvMatch
      && journeyMatch;
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
  if (theme === "light") {
    applyMoodTheme("classic");
  }
};

const storedTheme = localStorage.getItem("theme");
const preferredScheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
applyTheme(storedTheme || preferredScheme);

function toggleTheme() {
  const current = document.body.classList.contains("dark") ? "dark" : "light";
  applyTheme(current === "dark" ? "light" : "dark");
}

const THEME_DETAILS = {
  classic: { name: "Classic Nexus", emoji: "🌌" },
  stark: { name: "Stark Tech", emoji: "🦾" },
  captain: { name: "Super Soldier", emoji: "🛡️" },
  spiderman: { name: "Web Slinger", emoji: "🕸️" },
  tva: { name: "TVA Chronicle", emoji: "⏳" },
  wakanda: { name: "Wakanda Vibranium", emoji: "🐾" },
  sorcerer: { name: "Sorcerer Supreme", emoji: "🔮" }
};

function applyMoodTheme(mood) {
  document.body.classList.remove("theme-stark", "theme-tva", "theme-wakanda", "theme-sorcerer", "theme-captain", "theme-spiderman");
  if (mood && mood !== "classic") {
    document.body.classList.add(`theme-${mood}`);
    if (!document.body.classList.contains("dark")) {
      applyTheme("dark");
    }
  }
  localStorage.setItem("mcu_mood_theme", mood);
  
  // Update all dot states
  document.querySelectorAll(".theme-dot").forEach(dot => {
    dot.classList.toggle("active", dot.getAttribute("data-theme") === mood);
  });

  // Sync floating switcher pill text and emoji
  const details = THEME_DETAILS[mood] || THEME_DETAILS.classic;
  const emojiEl = document.getElementById("floating-theme-emoji");
  const titleEl = document.getElementById("floating-theme-title");
  if (emojiEl) emojiEl.textContent = details.emoji;
  if (titleEl) titleEl.textContent = details.name;
}

const savedMood = localStorage.getItem("mcu_mood_theme") || "classic";
applyMoodTheme(savedMood);

document.querySelectorAll(".theme-dot").forEach(dot => {
  dot.addEventListener("click", event => {
    applyMoodTheme(dot.getAttribute("data-theme"));
  });
});

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

function initDashboard() {
  const toggleHeader = document.getElementById("dashboardToggle");
  const toggleBtn = document.getElementById("dashboardToggleBtn");
  const content = document.getElementById("dashboardContent");
  if (!toggleHeader || !toggleBtn || !content) return;

  // Load saved state
  const isCollapsed = localStorage.getItem("mcu_dashboard_collapsed") !== "false"; // default to collapsed
  if (isCollapsed) {
    content.classList.add("collapsed");
    toggleBtn.classList.remove("expanded");
  } else {
    content.classList.remove("collapsed");
    toggleBtn.classList.add("expanded");
  }

  toggleHeader.addEventListener("click", () => {
    const currentlyCollapsed = content.classList.contains("collapsed");
    if (currentlyCollapsed) {
      content.classList.remove("collapsed");
      toggleBtn.classList.add("expanded");
      localStorage.setItem("mcu_dashboard_collapsed", "false");
    } else {
      content.classList.add("collapsed");
      toggleBtn.classList.remove("expanded");
      localStorage.setItem("mcu_dashboard_collapsed", "true");
    }
  });

  // Bind click events to all badges
  document.querySelectorAll(".mcu-badge").forEach(badge => {
    badge.addEventListener("click", () => {
      const badgeId = badge.id;
      showBadgeDetails(badgeId);
    });
  });
}

function showBadgeDetails(badgeId) {
  // 1. Data mapping for badges
  const badgeMap = {
    "badge-iron-man": {
      name: "Iron Man Initiate",
      icon: "🛡️",
      criteriaText: "Watch the first 3 chronological MCU titles: Captain America: The First Avenger, Captain Marvel, and Iron Man.",
      type: "checklist",
      items: ["captain_america_the_first_avenger", "captain_marvel", "iron_man"]
    },
    "badge-avengers": {
      name: "Avenger Assembled",
      icon: "⚡",
      criteriaText: "Watch all core Avengers team-up films: The Avengers, Avengers: Age of Ultron, Avengers: Infinity War, and Avengers: Endgame.",
      type: "checklist",
      items: ["avengers", "avengers_age_of_ultron", "avengers_infinity_war", "avengers_endgame"]
    },
    "badge-multiverse": {
      name: "Multiverse Walker",
      icon: "🔮",
      criteriaText: "Explore the Multiverse by watching 5 or more non-Earth-616 timeline entries.",
      type: "progress",
      filterFn: item => item.multiverse !== 0,
      targetCount: 5
    },
    "badge-tva": {
      name: "TVA Agent",
      icon: "⏳",
      criteriaText: "Fully complete Phase 4 (where the Multiverse Saga begins).",
      type: "progress",
      filterFn: item => getItemPhase(item) === "Phase 4"
    },
    "badge-infinity": {
      name: "Infinity Conqueror",
      icon: "🌟",
      criteriaText: "Fully complete Phases 1, 2, and 3 (The complete Infinity Saga).",
      type: "progress",
      filterFn: item => ["Phase 1", "Phase 2", "Phase 3"].includes(getItemPhase(item))
    },
    "badge-watcher": {
      name: "Ultimate Watcher",
      icon: "🛸",
      criteriaText: "Watch 100% of all entries in the timeline database!",
      type: "progress",
      filterFn: item => true
    }
  };

  const badge = badgeMap[badgeId];
  if (!badge) return;

  // Remove existing modal if any
  const existingModal = document.getElementById("badgeDetailModal");
  if (existingModal) {
    existingModal.remove();
  }

  // Calculate status
  let unlocked = false;
  let progressHtml = "";

  if (badge.type === "checklist") {
    // Check watched status for all checklist items
    const checklistData = badge.items.map(id => {
      const item = fullData.find(d => d.id === id);
      const title = item ? getDisplayTitle(item) : id;
      const isWatched = localStorage.getItem("watched_" + id) === "true";
      return { title, isWatched };
    });

    unlocked = checklistData.every(c => c.isWatched);

    const checklistItemsHtml = checklistData.map(c => `
      <div class="checklist-item ${c.isWatched ? 'checked' : 'locked'}">
        <span class="chk-status">${c.isWatched ? '✅' : '🔒'}</span>
        <span>${c.title}</span>
      </div>
    `).join("");

    progressHtml = `
      <div class="badge-detail-progress-card">
        <h4>Required Items Checklist</h4>
        <div class="badge-modal-checklist">
          ${checklistItemsHtml}
        </div>
      </div>
    `;
  } else if (badge.type === "progress") {
    // Count stats
    const qualifyingItems = fullData.filter(badge.filterFn);
    const watchedQualifying = qualifyingItems.filter(item => localStorage.getItem("watched_" + item.id) === "true");

    const totalCount = badge.targetCount !== undefined ? badge.targetCount : qualifyingItems.length;
    const watchedCount = watchedQualifying.length;
    
    // Check unlock
    if (badge.targetCount !== undefined) {
      unlocked = watchedCount >= badge.targetCount;
    } else {
      unlocked = totalCount > 0 && watchedCount === totalCount;
    }

    const percent = totalCount ? Math.min(Math.round((watchedCount / totalCount) * 100), 100) : 0;

    // Compile recently/qualifying watched items (up to 5)
    const recentWatchedHtml = watchedQualifying.slice(-5).reverse().map(item => `
      <div class="recent-item" title="${getDisplayTitle(item)}">✓ ${getDisplayTitle(item)}</div>
    `).join("") || `<div class="recent-item" style="font-style: italic; opacity: 0.6;">No qualifying entries watched yet.</div>`;

    progressHtml = `
      <div class="badge-detail-progress-card">
        <h4>Progress</h4>
        <div class="badge-modal-progress-section">
          <div class="badge-modal-progress-label">
            <span>Completion</span>
            <span>${watchedCount} / ${totalCount} (${percent}%)</span>
          </div>
          <div class="badge-modal-progress-bar">
            <div class="badge-modal-progress-fill" style="width: ${percent}%"></div>
          </div>
          <div class="badge-modal-sub-label">Qualifying Watched Items</div>
          <div class="badge-modal-recent-list">
            ${recentWatchedHtml}
          </div>
        </div>
      </div>
    `;
  }

  // Create modal element
  const modal = document.createElement("div");
  modal.className = "badge-detail-modal";
  modal.id = "badgeDetailModal";
  modal.setAttribute("role", "dialog");
  modal.setAttribute("aria-modal", "true");

  modal.innerHTML = `
    <div class="badge-detail-backdrop"></div>
    <div class="badge-detail-box">
      <button class="badge-detail-close" aria-label="Close modal">&times;</button>
      <div class="badge-detail-header">
        <div class="badge-detail-icon-glow ${unlocked ? 'unlocked' : ''}">${badge.icon}</div>
        <h3 class="badge-detail-name">${badge.name}</h3>
        <span class="badge-detail-status-pill ${unlocked ? 'status-unlocked' : 'status-locked'}">
          ${unlocked ? '🔓 Unlocked' : '🔒 Locked'}
        </span>
      </div>
      <div class="badge-detail-body">
        <div class="badge-detail-criteria-card">
          <h4>Unlock Criteria</h4>
          <p>${badge.criteriaText}</p>
        </div>
        ${progressHtml}
      </div>
    </div>
  `;

  document.body.appendChild(modal);

  // Trigger browser paint to transition in
  requestAnimationFrame(() => {
    modal.classList.add("active");
  });

  // Closing animation and removal
  const closeModal = () => {
    modal.classList.remove("active");
    // Wait for transition to complete before removing from DOM
    modal.addEventListener("transitionend", function handler(e) {
      if (e.propertyName === "opacity") {
        modal.removeEventListener("transitionend", handler);
        modal.remove();
      }
    }, { once: true });
    
    // Safety fallback in case transitionend fails
    setTimeout(() => {
      if (modal.parentNode) {
        modal.remove();
      }
    }, 400);
  };

  // Bind close triggers
  modal.querySelector(".badge-detail-close").addEventListener("click", closeModal);
  modal.querySelector(".badge-detail-backdrop").addEventListener("click", closeModal);
}


function initScrollMap() {
  const needle = document.getElementById("scrollMapNeedle");
  const track = document.querySelector(".scroll-map-track");
  const nodes = document.querySelectorAll(".scroll-map-node");
  if (!track) return;

  // Scroll listener to update needle and active node
  window.addEventListener("scroll", () => {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const percent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    
    if (needle) {
      needle.style.top = `${percent}%`;
    }

    // Viewport phase tracking: check which [data-phase] card is closest to the vertical center of the viewport
    let cards = Array.from(document.querySelectorAll(".mcu-card[data-phase]"));
    if (activeJourney) {
      cards = cards.filter(card => card.classList.contains("card-journey-match"));
    }
    if (cards.length === 0) return;

    let closestPhase = "";
    let minDistance = Infinity;
    const viewportCenter = window.innerHeight / 2;

    cards.forEach(card => {
      const rect = card.getBoundingClientRect();
      const cardCenter = rect.top + rect.height / 2;
      const distance = Math.abs(cardCenter - viewportCenter);
      if (distance < minDistance) {
        minDistance = distance;
        closestPhase = card.getAttribute("data-phase");
      }
    });

    if (closestPhase) {
      nodes.forEach(node => {
        const label = node.getAttribute("data-phase-label");
        node.classList.toggle("active", label === closestPhase);
      });
    }
  });

  // Global smooth scroll anchor lookup
  window.scrollToPhase = function(phaseNum) {
    const selector = activeJourney 
      ? `.mcu-card.card-journey-match[data-phase="Phase ${phaseNum}"]`
      : `.mcu-card[data-phase="Phase ${phaseNum}"]`;
    const firstCard = document.querySelector(selector);
    if (firstCard) {
      firstCard.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };
}

function initFloatingProgressPill() {
  const floatingPill = document.getElementById("floatingProgressPill");
  const themePill = document.getElementById("floatingThemePill");
  if (!floatingPill) return;

  // Initial update
  updateStats();

  const handleScroll = () => {
    if (window.innerWidth <= 820) {
      if (themePill) themePill.style.right = ""; // Let CSS handle mobile layout
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      if (scrollTop > 250) {
        floatingPill.classList.add("visible");
      } else {
        floatingPill.classList.remove("visible");
      }
      return;
    }

    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    if (scrollTop > 250) {
      floatingPill.classList.add("visible");
      if (themePill) {
        const progressWidth = floatingPill.getBoundingClientRect().width || 60;
        themePill.style.right = `${24 + progressWidth + 12}px`;
      }
    } else {
      floatingPill.classList.remove("visible");
      if (themePill) {
        themePill.style.right = "24px";
      }
    }
  };

  window.addEventListener("scroll", handleScroll);
  window.addEventListener("resize", () => {
    if (window.innerWidth <= 820 && themePill) {
      themePill.style.right = "";
    } else {
      handleScroll();
    }
  });
  handleScroll(); // Initial check
}

function initJourneyTracker() {
  const journeyPills = document.querySelectorAll(".journey-pill");
  const clearJourneyBtn = document.getElementById("clearJourneyBtn");
  const listElement = document.getElementById("list");

  const journeyColors = {
    stark: { color: "#e63946", soft: "rgba(230, 57, 70, 0.35)", softBg: "rgba(230, 57, 70, 0.12)" },
    cap: { color: "#5ab2ff", soft: "rgba(90, 178, 255, 0.35)", softBg: "rgba(90, 178, 255, 0.12)" },
    thor: { color: "#ff9f1c", soft: "rgba(255, 159, 28, 0.35)", softBg: "rgba(255, 159, 28, 0.12)" },
    wanda: { color: "#9d4edd", soft: "rgba(157, 78, 221, 0.35)", softBg: "rgba(157, 78, 221, 0.12)" },
    spiderman: { color: "#ff2a2a", soft: "rgba(255, 42, 42, 0.35)", softBg: "rgba(255, 42, 42, 0.12)" },
    guardians: { color: "#06b6d4", soft: "rgba(6, 182, 212, 0.35)", softBg: "rgba(6, 182, 212, 0.12)" },
    strange: { color: "#ff7a00", soft: "rgba(255, 122, 0, 0.35)", softBg: "rgba(255, 122, 0, 0.12)" },
    tesseract: { color: "#2ec4b6", soft: "rgba(46, 196, 182, 0.35)", softBg: "rgba(46, 196, 182, 0.12)" }
  };

  window.updateJourneyUI = function() {
    journeyPills.forEach(pill => {
      const journey = pill.dataset.journey;
      if (activeJourney === journey) {
        pill.classList.add("active");
        const colors = journeyColors[journey];
        pill.style.setProperty("--journey-color", colors.color);
        pill.style.setProperty("--journey-color-soft", colors.softBg);
      } else {
        pill.classList.remove("active");
        pill.style.removeProperty("--journey-color");
        pill.style.removeProperty("--journey-color-soft");
      }
    });

    if (activeJourney) {
      clearJourneyBtn?.classList.remove("hidden");
      listElement?.classList.add("journey-active");
      const colors = journeyColors[activeJourney];
      listElement?.style.setProperty("--journey-glow-color", colors.color);
      listElement?.style.setProperty("--journey-glow-color-soft", colors.soft);
    } else {
      clearJourneyBtn?.classList.add("hidden");
      listElement?.classList.remove("journey-active");
      listElement?.style.removeProperty("--journey-glow-color");
      listElement?.style.removeProperty("--journey-glow-color-soft");
    }

    const statsBadge = document.getElementById("journeyStatsBadge");
    if (statsBadge) {
      if (activeJourney) {
        const journeyItems = fullData.filter(item => matchesJourney(item, activeJourney));
        const total = journeyItems.length;
        const watched = journeyItems.filter(item => localStorage.getItem(`watched_${item.id}`) === "true").length;
        const unwatchedRuntime = journeyItems
          .filter(item => localStorage.getItem(`watched_${item.id}`) !== "true")
          .reduce((sum, item) => sum + (Number(item.runtime) || 0), 0);
        const timeStr = formatRuntimeLong(unwatchedRuntime);
        const journeyNames = {
          stark: "Iron Man",
          cap: "Captain America",
          thor: "Thor",
          wanda: "Scarlet Witch",
          spiderman: "Spider-Man",
          guardians: "Guardians of the Galaxy",
          strange: "Doctor Strange",
          tesseract: "Tesseract"
        };
        const jName = journeyNames[activeJourney] || "Journey";
        statsBadge.textContent = `⚡ ${jName}: ${watched} / ${total} Watched (${timeStr} remaining)`;
        statsBadge.classList.remove("hidden");
        const colors = journeyColors[activeJourney];
        if (colors) {
          statsBadge.style.setProperty("--journey-glow-color", colors.color);
        }
      } else {
        statsBadge.classList.add("hidden");
        statsBadge.textContent = "";
        statsBadge.style.removeProperty("--journey-glow-color");
      }
    }

    // Dynamic scroll map node dimming based on rendered cards in each phase
    const scrollNodes = document.querySelectorAll(".scroll-map-node");
    scrollNodes.forEach(node => {
      const label = node.getAttribute("data-phase-label");
      const selector = activeJourney 
        ? `.mcu-card.card-journey-match[data-phase="${label}"]`
        : `.mcu-card[data-phase="${label}"]`;
      const hasCards = document.querySelector(selector) !== null;
      node.style.opacity = hasCards ? "" : "0.15";
      node.style.pointerEvents = hasCards ? "" : "none";
      if (!hasCards) {
        node.classList.remove("active");
      }
    });
  };

  journeyPills.forEach(pill => {
    pill.addEventListener("click", () => {
      const journey = pill.dataset.journey;
      if (activeJourney === journey) {
        activeJourney = null;
      } else {
        activeJourney = journey;
      }
      window.updateJourneyUI();
      renderList(filteredData());

      if (activeJourney) {
        setTimeout(() => {
          const firstMatch = document.querySelector(".card-journey-match");
          if (firstMatch) {
            firstMatch.scrollIntoView({ behavior: "smooth", block: "center" });
          }
        }, 50);
      }
    });
  });

  clearJourneyBtn?.addEventListener("click", () => {
    activeJourney = null;
    window.updateJourneyUI();
    renderList(filteredData());
  });

  window.updateJourneyUI();
}

function updateNextUpBanner(data) {
  const banner = document.getElementById("nextUpBanner");
  const floatingPill = document.getElementById("floatingNextUpPill");
  if (!banner) return;

  if (!data || data.length === 0) {
    banner.classList.add("hidden");
    if (floatingPill) floatingPill.classList.remove("visible");
    return;
  }

  const nextUnwatched = data.find(item => localStorage.getItem(`watched_${item.id}`) !== "true");

  // Dynamic floating Next Up pill updates
  if (floatingPill) {
    if (!nextUnwatched) {
      floatingPill.classList.remove("visible");
    } else {
      floatingPill.classList.add("visible");
      
      const pillTitle = document.getElementById("floating-next-title");
      if (pillTitle) {
        pillTitle.textContent = nextUnwatched.title;
        pillTitle.title = `Next: ${nextUnwatched.title}`;
      }

      const pillIcon = document.getElementById("floating-next-icon");
      if (pillIcon) {
        if (activeJourney) {
          pillIcon.innerHTML = `<img src="assets/journeys/${activeJourney}.webp" alt="" style="width: 100%; height: 100%; object-fit: cover; border-radius: 50%;">`;
        } else {
          pillIcon.innerHTML = `🛰️`;
        }
      }

      const nextContent = document.getElementById("floating-next-content");
      if (nextContent) {
        nextContent.onclick = () => {
          const card = document.querySelector(`.mcu-card[data-id="${nextUnwatched.id}"]`);
          if (card) {
            card.scrollIntoView({ behavior: "smooth", block: "center" });
            card.style.transform = "scale(1.04)";
            card.style.borderColor = "var(--accent)";
            setTimeout(() => {
              card.style.transform = "";
              card.style.borderColor = "";
            }, 1200);
          }
        };
      }

      const nextCheck = document.getElementById("floating-next-check");
      if (nextCheck) {
        nextCheck.onclick = (e) => {
          e.stopPropagation();
          localStorage.setItem(`watched_${nextUnwatched.id}`, "true");
          nextCheck.style.transform = "scale(0.8)";
          setTimeout(() => {
            nextCheck.style.transform = "";
            renderList(filteredData());
            updateStats();
          }, 150);
        };
      }
    }
  }

  if (!nextUnwatched) {
    banner.classList.remove("hidden");
    let title = "Timeline Restored! 🌟";
    let desc = "You are the Ultimate Watcher! You have completed this timeline.";
    if (activeJourney) {
      const journeyNames = {
        stark: "Iron Man's Journey",
        cap: "Captain America's Journey",
        thor: "Thor's Journey",
        wanda: "Scarlet Witch's Journey",
        spiderman: "Spider-Man's Journey",
        guardians: "Guardians of the Galaxy's Journey",
        strange: "Doctor Strange's Journey",
        tesseract: "Space Stone (Tesseract) Journey"
      };
      const jName = journeyNames[activeJourney] || "this Journey";
      title = `${jName} Complete! 🌟`;
      desc = `You have completed all milestones in ${jName}!`;
    }
    banner.innerHTML = `
      <div class="next-up-congrats">
        <h3 class="congrats-title">${title}</h3>
        <p class="congrats-desc">${desc}</p>
      </div>
    `;
    return;
  }

  banner.classList.remove("hidden");
  const releaseDate = new Date(nextUnwatched.release_date);
  const formattedDate = releaseDate.toLocaleDateString(undefined, {
    year: "numeric", month: "short", day: "numeric"
  });
  const formattedRuntime = formatRuntimeLong(nextUnwatched.runtime);
  const phase = getItemPhase(nextUnwatched);
  const isShow = isEpisode(nextUnwatched);

  let tagLabel = "🛰️ QUANTUM RADAR";
  if (activeJourney) {
    const journeyLabels = {
      stark: "🛰️ NEXT UP IN IRON MAN'S JOURNEY",
      cap: "🛰️ NEXT UP IN CAPTAIN AMERICA'S JOURNEY",
      thor: "🛰️ NEXT UP IN THOR'S JOURNEY",
      wanda: "🛰️ NEXT UP IN SCARLET WITCH'S JOURNEY",
      spiderman: "🛰️ NEXT UP IN SPIDER-MAN'S JOURNEY",
      guardians: "🛰️ NEXT UP IN GUARDIANS OF THE GALAXY'S JOURNEY",
      strange: "🛰️ NEXT UP IN DOCTOR STRANGE'S JOURNEY",
      tesseract: "🛰️ NEXT UP IN TESSERACT'S JOURNEY"
    };
    tagLabel = journeyLabels[activeJourney] || "🛰️ NEXT UP IN JOURNEY";
  }

  let showTitleBlock = "";
  if (isShow) {
    showTitleBlock = `<div class="next-up-show-title">${escapeAttribute(nextUnwatched.show)} S${Math.trunc(Number(nextUnwatched.season))} - E${Math.trunc(Number(nextUnwatched.episode))}</div>`;
  }

  banner.innerHTML = `
    <div class="next-up-header">
      <span class="next-up-tag">${tagLabel}</span>
      <span class="next-up-meta-pill">${phase}</span>
    </div>
    <div class="next-up-body">
      <div class="next-up-details">
        <div class="next-up-title-row">
          ${showTitleBlock}
          <h3 class="next-up-title">${escapeAttribute(nextUnwatched.title)}</h3>
          <div class="next-up-meta">${formattedDate} · ${formattedRuntime}</div>
        </div>
      </div>
      <div class="next-up-actions">
        <button class="next-up-btn next-up-btn-primary" id="nextUpWatchedBtn">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
          <span>Mark Watched</span>
        </button>
      </div>
    </div>
  `;

  const watchedBtn = banner.querySelector("#nextUpWatchedBtn");

  watchedBtn.addEventListener("click", () => {
    localStorage.setItem(`watched_${nextUnwatched.id}`, "true");
    watchedBtn.style.transform = "scale(0.9)";
    setTimeout(() => {
      renderList(filteredData());
      updateStats();
    }, 150);
  });
}

function initTimelineCanvas() {
  const canvas = document.createElement("canvas");
  canvas.id = "timelineCanvas";
  canvas.className = "timeline-canvas";
  document.body.prepend(canvas);

  const ctx = canvas.getContext("2d");
  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener("resize", () => {
    width = (canvas.width = window.innerWidth);
    height = (canvas.height = window.innerHeight);
  });

  let activeState = activeJourney ? 1.0 : 0.0;
  let targetState = activeJourney ? 1.0 : 0.0;

  function getThemeColor() {
    const style = getComputedStyle(document.body);
    const jColor = style.getPropertyValue("--journey-glow-color").trim();
    if (jColor) return jColor;
    const accent = style.getPropertyValue("--accent").trim();
    if (accent) return accent;
    return "#3643f4";
  }

  const numBranches = 5;
  const branches = [];
  for (let i = 0; i < numBranches; i++) {
    branches.push({
      seed: Math.random() * 100,
      offset: (Math.random() - 0.5) * 350,
      amplitude: 60 + Math.random() * 100,
      frequency: 0.0015 + Math.random() * 0.002,
      speed: 0.15 + Math.random() * 0.3
    });
  }

  const particles = [];
  const numParticles = 40;
  for (let i = 0; i < numParticles; i++) {
    particles.push({
      progress: Math.random(),
      branchIndex: Math.floor(Math.random() * numBranches),
      size: 1 + Math.random() * 2.5,
      speed: 0.0006 + Math.random() * 0.001
    });
  }

  let lastTime = 0;
  function animate(timestamp) {
    if (!lastTime) lastTime = timestamp;
    lastTime = timestamp;

    ctx.clearRect(0, 0, width, height);

    targetState = activeJourney ? 1.0 : 0.0;
    activeState += (targetState - activeState) * 0.06;

    const accentColor = getThemeColor();
    ctx.shadowBlur = activeJourney ? 16 : 8;
    ctx.shadowColor = accentColor;

    const timeScale = timestamp * 0.001;

    // Draw main timeline
    ctx.beginPath();
    ctx.globalAlpha = activeJourney ? 0.45 : 0.22;
    ctx.strokeStyle = accentColor;
    ctx.lineWidth = activeJourney ? 3.5 : 2;

    for (let y = 0; y <= height; y += 10) {
      const x = width / 2 + Math.sin(y * 0.0025 + timeScale * 0.4) * 25;
      if (y === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();

    // Draw branches
    branches.forEach((b) => {
      ctx.beginPath();
      ctx.globalAlpha = (1 - activeState * 0.85) * 0.14;
      ctx.strokeStyle = accentColor;
      ctx.lineWidth = 1.5;

      for (let y = 0; y <= height; y += 10) {
        const noiseX = Math.sin(y * b.frequency + timeScale * b.speed + b.seed) * b.amplitude;
        const branchX = width / 2 + b.offset + noiseX;
        const mainX = width / 2 + Math.sin(y * 0.0025 + timeScale * 0.4) * 25;

        const finalX = branchX + (mainX - branchX) * activeState;

        if (y === 0) ctx.moveTo(finalX, y);
        else ctx.lineTo(finalX, y);
      }
      ctx.stroke();
    });

    // Draw particles flowing
    particles.forEach(p => {
      p.progress += p.speed;
      if (p.progress > 1) {
        p.progress = 0;
        p.branchIndex = Math.floor(Math.random() * numBranches);
      }

      const y = p.progress * height;
      const mainX = width / 2 + Math.sin(y * 0.0025 + timeScale * 0.4) * 25;

      let finalX = mainX;
      if (activeState < 0.95) {
        const b = branches[p.branchIndex];
        const noiseX = Math.sin(y * b.frequency + timeScale * b.speed + b.seed) * b.amplitude;
        const branchX = width / 2 + b.offset + noiseX;
        finalX = branchX + (mainX - branchX) * activeState;
      }

      ctx.beginPath();
      ctx.globalAlpha = activeJourney ? 0.75 : 0.45;
      ctx.fillStyle = accentColor;
      ctx.shadowBlur = 10;
      ctx.shadowColor = accentColor;
      ctx.arc(finalX, y, p.size, 0, Math.PI * 2);
      ctx.fill();
    });

    ctx.globalAlpha = 1.0;
    ctx.shadowBlur = 0;
    requestAnimationFrame(animate);
  }

  requestAnimationFrame(animate);
}

function initNebulaParticles() {
  const canvas = document.getElementById("nebulaParticles");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  
  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);
  
  window.addEventListener("resize", () => {
    width = (canvas.width = window.innerWidth);
    height = (canvas.height = window.innerHeight);
  });
  
  const particles = [];
  const numParticles = 40;
  
  for (let i = 0; i < numParticles; i++) {
    particles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      size: 2 + Math.random() * 4,
      speedX: (Math.random() - 0.5) * 0.3,
      speedY: -0.15 - Math.random() * 0.25,
      alpha: 0.15 + Math.random() * 0.35,
      pulseSpeed: 0.005 + Math.random() * 0.015,
      pulsePhase: Math.random() * Math.PI
    });
  }
  
  function getThemeColors() {
    const style = getComputedStyle(document.body);
    const accent = style.getPropertyValue("--accent").trim() || "#818cf8";
    const accentSec = style.getPropertyValue("--accent-secondary").trim() || "#f472b6";
    return { accent, accentSec };
  }
  
  let colors = getThemeColors();
  setInterval(() => {
    colors = getThemeColors();
  }, 1000);
  
  let isTabActive = true;
  document.addEventListener("visibilitychange", () => {
    isTabActive = !document.hidden;
  });
  
  function animate() {
    if (!isTabActive) {
      requestAnimationFrame(animate);
      return;
    }
    
    ctx.clearRect(0, 0, width, height);
    
    particles.forEach(p => {
      p.x += p.speedX;
      p.y += p.speedY;
      
      if (p.x < 0) p.x = width;
      if (p.x > width) p.x = 0;
      if (p.y < 0) p.y = height;
      if (p.y > height) p.y = 0;
      
      p.pulsePhase += p.pulseSpeed;
      const currentAlpha = p.alpha + Math.sin(p.pulsePhase) * 0.12;
      const useSecColor = p.size > 4.2;
      
      ctx.beginPath();
      ctx.globalAlpha = Math.max(0.02, Math.min(0.65, currentAlpha));
      
      const color = useSecColor ? colors.accentSec : colors.accent;
      ctx.fillStyle = color;
      ctx.shadowBlur = 15;
      ctx.shadowColor = color;
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    });
    
    ctx.shadowBlur = 0;
    ctx.globalAlpha = 1.0;
    requestAnimationFrame(animate);
  }
  
  animate();
}

function initFloatingThemePill() {
  const pillContent = document.getElementById("floating-theme-content");
  const dropdown = document.getElementById("floatingThemeDropdown");
  const floatingPill = document.getElementById("floatingThemePill");
  
  if (!pillContent || !dropdown || !floatingPill) return;
  
  pillContent.addEventListener("click", event => {
    event.stopPropagation();
    const isHidden = dropdown.classList.toggle("hidden");
    pillContent.setAttribute("aria-expanded", String(!isHidden));
  });
  
  dropdown.addEventListener("click", event => {
    event.stopPropagation();
  });
  
  document.addEventListener("click", () => {
    dropdown.classList.add("hidden");
    pillContent.setAttribute("aria-expanded", "false");
  });
  
  dropdown.querySelectorAll(".theme-dot").forEach(dot => {
    dot.addEventListener("click", () => {
      applyMoodTheme(dot.getAttribute("data-theme"));
      dropdown.classList.add("hidden");
      pillContent.setAttribute("aria-expanded", "false");
    });
  });
}

window.addEventListener("beforeprint", preparePrintView);
window.addEventListener("afterprint", () => {
  document.body.classList.remove("print-mode");
  document.getElementById("printView")?.setAttribute("aria-hidden", "true");
});

function initKeyboardShortcuts() {
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      const searchInput = document.getElementById("search");
      if (searchInput && document.activeElement === searchInput) {
        searchInput.value = "";
        searchInput.dispatchEvent(new Event("input"));
        searchInput.blur();
        return;
      }
      const dropdown = document.getElementById("dropdown");
      if (dropdown && !dropdown.classList.contains("hidden")) {
        dropdown.classList.add("hidden");
        document.getElementById("hamburger")?.setAttribute("aria-expanded", "false");
      }
      const filtersPanel = document.getElementById("filtersPanel");
      if (filtersPanel && !filtersPanel.classList.contains("hidden")) {
        filtersPanel.classList.add("hidden");
      }
      return;
    }

    if ((e.key === "/" && document.activeElement.tagName !== "INPUT" && document.activeElement.tagName !== "TEXTAREA") ||
        ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k")) {
      const searchInput = document.getElementById("search");
      if (searchInput) {
        e.preventDefault();
        searchInput.focus();
        searchInput.select();
      }
    }
  });
}

initKeyboardShortcuts();
loadData();
