# CodeHUD

CodeHUD is a desktop productivity dashboard designed for developers. It combines task management, coding analytics, competitive programming statistics, and coding activity tracking into a single customizable workspace.

The project is currently built with React and is being migrated to Electron to support desktop widgets, system tray integration, startup services, and local file system monitoring.

---

## Features

### Task Management

* Create and manage tasks
* Mark tasks as completed
* Delete completed tasks
* Track overall completion percentage
* Persistent task storage

### Analytics Dashboard

* Total problems solved
* Coding activity statistics
* Task completion analytics
* Progress visualization

### Coding Tracker

* Track coding sessions
* Track file modifications
* Store coding statistics locally
* Persistent activity data

### Platform Analyzer

* GitHub integration
* Codeforces integration
* Repository statistics
* Rating tracking
* Solved problem tracking

### Settings System

* Widget visibility controls
* Platform username configuration
* Display name customization
* Theme preferences
* Startup preferences
* Persistent application settings

---

## Current Integrations

### GitHub

* Public repository count
* User profile statistics

### Codeforces

* Current rating
* Rank
* Solved problem count

### LeetCode

* Mock data (planned integration)

### GeeksForGeeks

* Mock data (planned integration)

---

## Tech Stack

### Frontend

* React
* Vite
* JavaScript
* CSS

### Services

* Local Storage
* GitHub REST API
* Codeforces API

### Planned Desktop Stack

* Electron
* Node.js
* System Tray APIs
* File System Watchers

---

## Project Structure

```text
src
├── main
│   ├── main.js
│   ├── tray.js
│   └── windowManager.js
│
├── renderer
│   ├── components
│   ├── pages
│   ├── styles
│   └── App.jsx
│
├── services
│   ├── analyticsService.js
│   ├── codeTrackerService.js
│   ├── codeforcesService.js
│   ├── githubService.js
│   ├── leetcodeService.js
│   ├── platformAnalyzerService.js
│   ├── settingsService.js
│   ├── storageService.js
│   └── taskService.js
│
└── widgets
    ├── AnalyticsWidget
    ├── CodingTrackerWidget
    ├── PlatformAnalyzerWidget
    └── TaskWidget
```

---

## Roadmap

### Phase 1 — Dashboard MVP

* [x] Task widget
* [x] Analytics widget
* [x] Coding tracker
* [x] Platform analyzer
* [x] Settings persistence
* [x] GitHub integration
* [x] Codeforces integration

### Phase 2 — Electron Migration

* [ ] Electron wrapper
* [ ] Native desktop window
* [ ] System tray integration
* [ ] Startup support

### Phase 3 — Productivity Features

* [ ] File system monitoring
* [ ] Real coding activity tracking
* [ ] Activity heatmaps
* [ ] Native notifications

### Phase 4 — Advanced Widgets

* [ ] Draggable widgets
* [ ] Resizable widgets
* [ ] Multi-window widget mode
* [ ] Saved layouts

### Phase 5 — Platform Expansion

* [ ] LeetCode integration
* [ ] GeeksForGeeks integration
* [ ] Contribution analytics
* [ ] Competitive programming insights

---

## Installation

```bash
git clone https://github.com/virusbigstepper/codehud.git

cd codehud

npm install

npm run dev
```

---

## Vision

CodeHUD aims to become a lightweight desktop companion for developers by combining productivity tracking, coding analytics, competitive programming statistics, and customizable desktop widgets into a single application.

The long-term goal is to provide a developer-focused dashboard that lives on the desktop, launches automatically on startup, and gives instant visibility into coding activity, tasks, and progress across multiple platforms.

```
```
