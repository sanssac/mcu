# 📜 Changelog — MCU Nexus

All notable changes, additions, removals, and repository patches for **MCU Nexus** will be documented in this file. This project adheres to [Semantic Versioning](https://semver.org/).

---

## [1.4.0] — 2026-05-24
### ✨ Features & Upgrades
- **Interactive Changelog Hub**: Added a premium, fully interactive, offline-capable `changelog.html` dashboard detailing additions and removals.
- **Dynamic Timeline Filters**: Enabled button controls (`All`, `Added`, `Removed`, `Improved`, `Fixed`) to filter development timeline entries instantly with smooth transitions.
- **Full-Text Changelog Search**: Integrated localized search bar matching version tags, date fields, metadata, or bullet details in real-time.
- **Custom SVG Asset**: Created a custom `changelog.svg` menu item icon inside `assets/menubar/` to fit the sleek visual profile of the navigation panels.

### 🌐 Navigation Enhancements
- **Global Sidebar Sync**: Enhanced primary desktop topbars and mobile collapsible menus across `index.html`, `upcoming.html`, `shows.html`, and `faq.html` to integrate the active link leading seamlessly to the new hub.
- **MCU Mood Theme Synced**: Bound changelog styling elements, timeline lines, and category tags to local storage variables to allow instant theme styling (Wakanda Gold, Stark Red, TVA Orange, Sorcerer Supreme emerald, or Spider-Man blue).

---

## [1.3.5] — 2026-04-12
### ➕ Added
- **Disney+ Show Countdowns**: Implemented automated live show status countdown tracking columns inside `shows.html` using localized date metrics.

### ⚙️ Improved
- **Print View PDF Layout**: Upgraded `@media print` directives in `style.css` to format watch list print-outs in highly legible two-column columns, removing redundant visual assets during export.

### ➖ Removed
- **Redundant Inline Assets**: Deprecated outdated inline countdown vectors in favor of streamlined, responsive CSS tag rendering blocks.

---

## [1.3.0] — 2026-02-20
### ➕ Added
- **Quantum Radar Banner**: Launched the glassmorphic spotlight component on the home tracker page, calculating the user's recommended next chronological watch in real-time.
- **Character & Infinity Journeys**: Built horizontal scrolling journeys tags to allow watches to filter chronological paths solely targeting specified characters (Iron Man, Wanda, Thor, etc.) or Infinity Stones (Space Stone).
- **Progress Sharing Engine**: Engineered import/export dialog boxes to compress watch data patterns into copyable text strings.

### 🛠️ Fixed
- **Mobile Avatar Layouts**: Resolved a rendering bug where character avatar circles would stretch or distort horizontally on smaller responsive widths in Stark Red theme.

---

## [1.2.0] — 2026-01-05
### ➕ Added
- **Premium Theme Engine**: Added Wakanda Gold, Stark Red, TVA Orange, Sorcerer Violet, and Spider-Man theme set configurations.

### ⚙️ Improved
- **Select-All Filtering Panel Actions**: Introduced single-click controls to check or clear all studio lists inside search panels instantly.

### 🛠️ Fixed
- **Theme Contrast Transitions**: Fixed a bug where switching theme styles under dark/light settings caused search text parameters to briefly highlight in low-contrast white.

---

## [1.0.0] — 2025-11-10
### ✨ Core Foundations
- **Chronological & Release Timelines**: Initialized comprehensive offline Marvel tracker spanning Phase 1 to Phase 5.
- **Trophy & Milestone Achievements**: Designed six unique badges that unlock upon watch milestones (e.g. TVA Agent, Avenger Assembled, Iron Man Initiate).
- **Offline localStorage Sync**: Programmed full offline capabilities storing preferences and checked progress securely inside browser variables.

---
*Built with ❤️ for the Marvel fandom*
