/**
 * MCU Nexus — Automated State & Logic Regression Test Suite
 * Run with: node tests/state-audit.test.js
 */

const assert = require("assert");

console.log("⚡ Starting MCU Nexus Regression Test Suite...\n");

// ─── 1. Mock LocalStorage Environment ───
const store = new Map();
const mockLocalStorage = {
  getItem: (key) => store.get(key) ?? null,
  setItem: (key, val) => store.set(key, String(val)),
  removeItem: (key) => store.delete(key),
  clear: () => store.clear()
};

// ─── 2. SafeStorage Implementation Under Test ───
const safeStorage = {
  get(key, fallback = null) {
    try {
      const val = mockLocalStorage.getItem(key);
      return val !== null ? val : fallback;
    } catch (e) {
      return fallback;
    }
  },
  getJSON(key, fallback = null) {
    try {
      const raw = mockLocalStorage.getItem(key);
      if (!raw) return fallback;
      return JSON.parse(raw);
    } catch (e) {
      return fallback;
    }
  },
  set(key, value) {
    try {
      mockLocalStorage.setItem(key, typeof value === "object" ? JSON.stringify(value) : String(value));
      return true;
    } catch (e) {
      return false;
    }
  },
  remove(key) {
    try {
      mockLocalStorage.removeItem(key);
      return true;
    } catch (e) {
      return false;
    }
  },
  isWatched(id) {
    return this.get(`watched_${id}`) === "true";
  },
  setWatched(id, watched) {
    if (watched) {
      return this.set(`watched_${id}`, "true");
    } else {
      return this.remove(`watched_${id}`);
    }
  }
};

// Test safeStorage basic operations
store.clear();
assert.strictEqual(safeStorage.get("non_existent", "default_val"), "default_val", "safeStorage fallback failed");
safeStorage.setWatched("iron_man", true);
assert.strictEqual(safeStorage.isWatched("iron_man"), true, "safeStorage isWatched check failed");
safeStorage.setWatched("iron_man", false);
assert.strictEqual(safeStorage.isWatched("iron_man"), false, "safeStorage unwatch failed");

// Test safeStorage malformed JSON resilience
mockLocalStorage.setItem("bad_json", "{corrupt:json,");
assert.deepStrictEqual(safeStorage.getJSON("bad_json", { fallback: true }), { fallback: true }, "Corrupt JSON did not return fallback");
console.log("✅ 1. safeStorage Core & JSON Resilience Tests Passed");

// ─── 3. V2 Backup Codec & Protection Tests ───
function encodeProgressV2(watchedIds, totalItems) {
  const payload = {
    version: 2,
    app: "MCUNEXUS",
    timestamp: Date.now(),
    watchedCount: watchedIds.length,
    totalCount: totalItems,
    watched: watchedIds
  };
  const jsonStr = JSON.stringify(payload);
  const base64Str = Buffer.from(jsonStr, "utf8").toString("base64");
  return `MCUNEXUS:v2:${base64Str}`;
}

function decodeProgressSafely(code, fullData) {
  if (!code || typeof code !== "string") {
    return { success: false, reason: "EMPTY_OR_INVALID" };
  }
  const cleanCode = code.trim();
  if (cleanCode.length < 4) {
    return { success: false, reason: "TOO_SHORT" };
  }

  // Format 1: v2 JSON structured payload
  if (cleanCode.startsWith("MCUNEXUS:v2:")) {
    try {
      const b64 = cleanCode.slice("MCUNEXUS:v2:".length);
      const raw = Buffer.from(b64, "base64").toString("utf8");
      const parsed = JSON.parse(raw);
      if (parsed && parsed.version === 2 && Array.isArray(parsed.watched)) {
        const fullIdSet = new Set(fullData.map(d => d.id));
        fullData.forEach(item => safeStorage.setWatched(item.id, false));
        parsed.watched.forEach(id => {
          if (fullIdSet.has(id)) {
            safeStorage.setWatched(id, true);
          }
        });
        return { success: true, count: parsed.watched.length, version: 2 };
      }
    } catch (e) {
      return { success: false, reason: "MALFORMED_V2_PAYLOAD" };
    }
  }

  // Format 2: Legacy bitmask with strict length validation
  try {
    const raw = Buffer.from(cleanCode, "base64");
    const minBytesExpected = Math.ceil(fullData.length / 8);
    // Reject empty or truncated bitmasks
    if (!raw || raw.length < Math.min(80, minBytesExpected)) {
      return { success: false, reason: "LEGACY_BITMASK_TOO_SHORT" };
    }
    let restoredCount = 0;
    fullData.forEach((item, index) => {
      const byteIndex = Math.floor(index / 8);
      const bitIndex = index % 8;
      if (byteIndex < raw.length) {
        const isWatched = (raw[byteIndex] >> bitIndex) & 1;
        safeStorage.setWatched(item.id, Boolean(isWatched));
        if (isWatched) restoredCount++;
      }
    });
    return { success: true, count: restoredCount, version: 1 };
  } catch (e) {
    return { success: false, reason: "DECODE_ERROR" };
  }
}

const mockCatalog = [
  { id: "iron_man", runtime: 126, order: 1, chronological: 3 },
  { id: "the_incredible_hulk", runtime: 112, order: 2, chronological: 4 },
  { id: "iron_man_2", runtime: 124, order: 3, chronological: 5 },
  { id: "thor", runtime: 115, order: 4, chronological: 6 },
  { id: "captain_america_first_avenger", runtime: 124, order: 5, chronological: 1 }
];

// Test empty / whitespace string rejection (verifies data is NOT wiped)
safeStorage.setWatched("iron_man", true);
const emptyResult = decodeProgressSafely("   ", mockCatalog);
assert.strictEqual(emptyResult.success, false, "Empty string was incorrectly accepted");
assert.strictEqual(safeStorage.isWatched("iron_man"), true, "Empty string wiped user state!");

// Test v2 encode and decode
const v2Code = encodeProgressV2(["iron_man", "thor"], mockCatalog.length);
assert.strictEqual(v2Code.startsWith("MCUNEXUS:v2:"), true, "v2 code format prefix missing");
const v2Result = decodeProgressSafely(v2Code, mockCatalog);
assert.strictEqual(v2Result.success, true, "v2 decode failed");
assert.strictEqual(safeStorage.isWatched("iron_man"), true);
assert.strictEqual(safeStorage.isWatched("thor"), true);
assert.strictEqual(safeStorage.isWatched("iron_man_2"), false);

console.log("✅ 2. V2 Backup Codec & Protection Tests Passed");

// ─── 4. Next-Up Candidate Ordering Tests ───
function getNextUpCandidate(data, sortMode) {
  const viewingCandidates = [...data].sort((a, b) => {
    const aVal = sortMode === "chronological" ? (a.chronological ?? a.order ?? 0) : (a.order ?? 0);
    const bVal = sortMode === "chronological" ? (b.chronological ?? b.order ?? 0) : (b.order ?? 0);
    return aVal - bVal;
  });
  return viewingCandidates.find(item => !safeStorage.isWatched(item.id)) || null;
}

// Reset watch state
mockCatalog.forEach(it => safeStorage.setWatched(it.id, false));

// In chronological mode, Captain America: First Avenger (chronological: 1) should be first
const nextChronological = getNextUpCandidate(mockCatalog, "chronological");
assert.strictEqual(nextChronological.id, "captain_america_first_avenger", "Chronological Next Up mismatch");

// Mark Cap watched; next should be Iron Man (chronological: 3)
safeStorage.setWatched("captain_america_first_avenger", true);
const nextChronological2 = getNextUpCandidate(mockCatalog, "chronological");
assert.strictEqual(nextChronological2.id, "iron_man", "Second chronological Next Up mismatch");

// In release order mode, Iron Man (order: 1) should be recommended
safeStorage.setWatched("captain_america_first_avenger", false);
const nextRelease = getNextUpCandidate(mockCatalog, "release");
assert.strictEqual(nextRelease.id, "iron_man", "Release Next Up mismatch");

console.log("✅ 3. Next-Up Queue Sort Logic Tests Passed");

// ─── 5. Dynamic Runtime Accumulator & NaN Protection ───
const edgeRuntimeCatalog = [
  { id: "valid_movie", runtime: 120 },
  { id: "string_runtime", runtime: "45" },
  { id: "null_runtime", runtime: null },
  { id: "undefined_runtime" },
  { id: "nan_runtime", runtime: "TBD" }
];

const totalRuntime = edgeRuntimeCatalog.reduce((sum, item) => sum + (Number(item.runtime) || 0), 0);
assert.strictEqual(totalRuntime, 165, `Runtime calculation produced unexpected value: ${totalRuntime}`);
assert.strictEqual(!isNaN(totalRuntime), true, "Runtime produced NaN");

console.log("✅ 4. Dynamic Stats & NaN Protection Tests Passed");

console.log("\n🎉 ALL TESTS PASSED SUCCESSFULLY (4/4 test groups).");
