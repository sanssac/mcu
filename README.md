# 🎬 MCU Nexus — The Ultimate Marvel Cinematic Universe Tracker

> A stunning, fully offline-capable MCU viewing order tracker with real-time watch progress, interactive timelines, character journeys, and a premium dark-mode experience.

---

## ✨ Features

- **Complete MCU Timeline** — Every movie, TV show, one-shot, and special presentation in recommended viewing order, organized by Marvel's official Phases & Sagas.
- **Watch Progress Tracking** — Check off titles as you watch. Your progress is saved locally in your browser (localStorage) and persists across sessions.
- **Real-Time Dashboard** — See total hours watched vs. remaining, percentage completion, and a live progress bar — all updating instantly as you mark titles.
- **Character & Infinity Journeys** — Filter the timeline by character arcs (Iron Man, Captain America, Thor, etc.) or follow the Infinity Saga / Multiverse Saga storylines.
- **Quantum Radar Search** — Instant full-text search across all titles, with highlighted matches.
- **Sorting & Filtering** — Sort by timeline order (old → new / new → old), hide watched titles, and toggle between Comfortable / Compact / List view modes.
- **Scroll Map Navigation** — A floating sidebar rail (desktop) that gives a bird's-eye view of your position in the timeline, with clickable Phase nodes.
- **Mood Themes** — Switch between Classic, Stark Red, TVA Orange, Wakanda Gold, and Sorcerer Violet color themes.
- **Dark / Light Mode** — Seamless theme toggle with system-preference detection.
- **Print View** — Generate a clean, print-optimized layout of the entire watch order.
- **Show Status Tracker** — Track the broadcast status of all MCU Disney+ shows.
- **Upcoming Releases** — A dedicated page for future MCU titles with countdowns.
- **Fully Offline** — No external APIs, no CDN dependencies, no server required. Open the HTML files directly and everything works.

---

## 🚀 Getting Started

### Quick Start (No Build Required)

1. Clone or download this repository:
   ```bash
   git clone https://github.com/your-username/mcu-nexus.git
   ```
2. Open `index.html` in your browser. That's it!

### With a Local Server (Optional)

If you prefer using a local dev server:
```bash
# Using Python
python -m http.server 8000

# Using Node.js (npx)
npx serve .

# Using VS Code
# Install the "Live Server" extension and click "Go Live"
```

---

## 📁 Project Structure

```
mcu/
├── index.html          # Main viewing order page with timeline & dashboard
├── shows.html          # Disney+ show status tracker
├── upcoming.html       # Upcoming MCU releases
├── faq.html            # Frequently asked questions
├── style.css           # Complete stylesheet (themes, layouts, animations)
├── script.js           # Main application logic (tracking, filtering, UI)
├── data.js             # MCU titles database (movies, shows, specials)
├── data.json           # Raw JSON data source
├── mcu.json            # Extended MCU metadata
├── ref_script.js       # Reference/utility script
├── assets/             # Images, icons, and media assets
└── README.md           # This file
```

---

## 🎨 Themes

| Theme | Description |
|-------|-------------|
| **Classic** | Clean dark/light default with blue-violet accents |
| **Stark** | Iron Man-inspired deep red and gold tones |
| **TVA** | Time Variance Authority amber and burnt orange |
| **Wakanda** | Vibranium gold with royal purple undertones |
| **Sorcerer** | Mystic violet with ethereal green accents |

---

## 🔒 Privacy

MCU Nexus stores all data locally in your browser's `localStorage`. No data is ever sent to any server. No cookies, no analytics, no tracking.

---

## 📄 Credits & Acknowledgments

### Original Reference

This project was built using data and inspiration from:

**[MCU Viewing Order by Aaron Perris (@aaronp613)](https://aaronperris.com/mcu/)**

Aaron's comprehensive MCU viewing order site served as the primary reference for the timeline data, viewing order, and title information used throughout MCU Nexus. Massive thanks to Aaron for maintaining such an accurate and up-to-date resource for the Marvel community.

### Disclaimer

Marvel, the Marvel logo, and all Marvel characters, titles, and related content are trademarks and © of Marvel Entertainment, LLC. All rights reserved. This site is an unofficial fan resource and is not affiliated with, endorsed by, or connected to Marvel Entertainment, LLC, The Walt Disney Company, or any of their subsidiaries. All film, television, and streaming content referenced belongs to their respective owners.

---

## 🤝 Contributing

Contributions are welcome! If you spot a missing title, incorrect order, or want to suggest a feature:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📝 License

This project is open source and available for personal, non-commercial use. See the credits section for attribution requirements.

---

<p align="center">
  <em>Built with ❤️ for the Marvel fandom</em>
</p>
