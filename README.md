# CodeHUD

CodeHUD is a desktop productivity dashboard for developers. It provides floating desktop widgets that track coding activity, tasks, competitive programming stats, and more.

Built with React + Electron. Widgets live as independent frameless windows on your desktop — drag them anywhere, resize them, and they remember their position.

---

## Features

### Task Widget
- Create, complete, and delete tasks
- Priority levels (Low, Medium, High)
- Persistent storage across sessions
- Real-time sync with analytics

### Analytics Widget
- Total problems solved (aggregated from all platforms)
- Task completion progress bar
- Coding time today
- Files changed count

### Coding Tracker Widget
- Tracks real coding time (only counts when files are actively being edited)
- Detects languages automatically from file extensions
- Shows top 5 most-used languages with icons
- Files changed counter

### Heatmap Widget
- Monthly activity heatmap built from real file monitoring data
- Current and best coding streaks
- Activity intensity levels

### Platform Analyzer Widget
- GitHub (public repos)
- Codeforces (rating, rank, problems solved)
- LeetCode (problems solved via GraphQL API)
- GeeksForGeeks (problems solved via community API)

### System Features
- System tray with widget toggles and quit
- Close-to-tray (app stays running in background)
- Startup widget selection (choose which widgets auto-open)
- Launch on system startup
- Remember widget positions
- File system monitoring via chokidar
- Cross-window real-time sync
- Native notifications for streak milestones
- Theme support (Dark, Light, Glass)
- Browse folder picker for tracked directory

---

## Tech Stack

### Frontend
- React 19
- Vite 8
- react-router-dom (HashRouter)
- react-icons
- CSS Variables (theming)

### Desktop
- Electron 42
- electron-builder (NSIS installer)
- chokidar (file system watching)
- IPC for cross-window communication

### APIs
- GitHub REST API
- Codeforces API
- LeetCode GraphQL API
- GeeksForGeeks Stats API (community)

---

## Project Structure

```
src/
├── main/
│   ├── main.js              # Electron entry, IPC handlers
│   ├── preload.cjs          # Context bridge (renderer ↔ main)
│   ├── windowManager.js     # Widget window lifecycle
│   ├── tray.js              # System tray menu
│   ├── fileWatcher.js       # Chokidar file monitoring
│   ├── storageManager.js    # JSON file persistence
│   └── notificationManager.js
│
├── renderer/
│   ├── App.jsx              # Router + service initialization
│   ├── main.jsx             # React entry
│   ├── pages/
│   │   ├── Dashboard.jsx    # Launcher (Electron) / embedded (browser)
│   │   └── widgets/         # Standalone widget page wrappers
│   ├── components/
│   │   ├── WidgetFrame.jsx  # Frameless drag container
│   │   └── SettingsModal.jsx
│   └── styles/
│       └── globals.css      # Theme variables
│
├── services/
│   ├── taskService.js
│   ├── codeTrackerService.js
│   ├── heatmapService.js
│   ├── settingsService.js
│   ├── analyticsService.js
│   ├── platformAnalyzerService.js
│   ├── githubService.js
│   ├── codeforcesService.js
│   ├── leetcodeService.js
│   └── gfgService.js
│
└── widgets/
    ├── AnalyticsWidget/
    ├── CodingTrackerWidget/
    ├── HeatmapWidget/
    ├── PlatformAnalyzerWidget/
    └── TaskWidget/
```

---

## Installation

### Development

```bash
git clone https://github.com/virusbigstepper/codehud.git
cd codehud
npm install
```

Run the React dev server:
```bash
npm run dev
```

Run Electron (requires dev server running):
```bash
npm run electron
```

Or build + run Electron together:
```bash
npm run electron:dev
```

### Build Installer

```bash
npm run dist:win
```

Output goes to `release/` directory as an NSIS installer.

---

## Usage

1. Launch CodeHUD — the dashboard opens
2. Click widget cards to open them on your desktop
3. Drag widgets anywhere, resize them
4. Close the dashboard — it minimizes to system tray
5. Right-click tray → toggle widgets, quit
6. Settings → configure platforms, tracked folder, theme, startup widgets

---

## Configuration

Open Settings (⚙ button) to configure:

- **Connections** — GitHub, Codeforces, LeetCode, GeeksForGeeks usernames
- **Tracking** — Select which folder to monitor for coding activity
- **Widgets** — Toggle visibility + auto-start on launch
- **Appearance** — Dark / Light / Glass theme
- **General** — Launch on startup, remember positions

---

## License

MIT
