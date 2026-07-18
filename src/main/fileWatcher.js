import chokidar from "chokidar";
import path from "path";
import { BrowserWindow } from "electron";
import StorageManager from "./storageManager.js";

class FileWatcher {

    constructor() {

        this.watcher = null;

        this.mainWindow = null;

        this.trackedFolder = null;

        this.sessionTimer = null;

        this.pendingEvents = [];

        this.flushTimer = null;

        this.FLUSH_INTERVAL_MS = 2000;

    }

    start(mainWindow) {

        this.mainWindow = mainWindow;

        const settings = StorageManager.load("settings.json");
        this.trackedFolder = settings?.trackedFolder || "";

        if (!this.trackedFolder) {
            console.log("[FileWatcher] No tracked folder configured, skipping.");
            return;
        }

        console.log(`[FileWatcher] Watching: ${this.trackedFolder}`);

        this.startWatching();
        this.startCodingSession();

    }

    stop() {

        if (this.watcher) {

            this.watcher.close();
            this.watcher = null;

        }

        this.stopCodingSession();
        this.stopFlushTimer();

    }

    startWatching() {

        if (this.watcher) {

            this.watcher.close();

        }

        const ignored = [
            "**/node_modules/**",
            "**/.git/**",
            "**/dist/**",
            "**/build/**",
            "**/out/**",
            "**/.cache/**",
            "**/target/**",
            "**/__pycache__/**",
            "**/*.lock",
            "**/package-lock.json",
            "**/.next/**",
            "**/.nuxt/**",
            "**/coverage/**",
            "**/.vscode/**",
            "**/.idea/**"
        ];

        this.watcher = chokidar.watch(this.trackedFolder, {

            ignored,

            persistent: true,

            ignoreInitial: true,

            depth: 3,

            usePolling: false,

            awaitWriteFinish: {
                stabilityThreshold: 200,
                pollInterval: 100
            }

        });

        this.watcher.on("change", (filePath) => {

            this.queueEvent(filePath, "change");

        });

        this.watcher.on("add", (filePath) => {

            this.queueEvent(filePath, "add");

        });

        this.startFlushTimer();

    }

    queueEvent(filePath, eventType) {

        const language = this.detectLanguage(filePath);

        if (language === "Other") return;

        this.lastActivityTime = Date.now();

        this.pendingEvents.push({
            filePath,
            fileName: path.basename(filePath),
            language,
            eventType,
            timestamp: Date.now()
        });

    }

    startFlushTimer() {

        this.stopFlushTimer();

        this.flushTimer = setInterval(() => {

            this.flushEvents();

        }, this.FLUSH_INTERVAL_MS);

    }

    stopFlushTimer() {

        if (this.flushTimer) {

            clearInterval(this.flushTimer);
            this.flushTimer = null;

        }

    }

    flushEvents() {

        if (this.pendingEvents.length === 0) return;

        const uniqueFiles = new Map();

        for (const event of this.pendingEvents) {

            uniqueFiles.set(event.filePath, event);

        }

        const events = Array.from(uniqueFiles.values());

        const payload = {
            files: events,
            count: events.length
        };

        BrowserWindow.getAllWindows().forEach(win => {
            if (!win.isDestroyed()) {
                win.webContents.send("file-changed", payload);
            }
        });

        this.pendingEvents = [];

    }

    detectLanguage(filePath) {

        const ext = path.extname(filePath).toLowerCase();

        const languageMap = {

            ".js": "JavaScript",
            ".jsx": "React",
            ".ts": "TypeScript",
            ".tsx": "React",
            ".py": "Python",
            ".cpp": "C++",
            ".c": "C",
            ".h": "C++",
            ".hpp": "C++",
            ".java": "Java",
            ".rs": "Rust",
            ".go": "Go",
            ".rb": "Ruby",
            ".php": "PHP",
            ".cs": "C#",
            ".swift": "Swift",
            ".kt": "Kotlin",
            ".vue": "Vue",
            ".svelte": "Svelte",
            ".dart": "Dart",
            ".lua": "Lua",
            ".sql": "SQL",
            ".sh": "Shell",
            ".bash": "Shell",
            ".ps1": "PowerShell"

        };

        return languageMap[ext] || "Other";

    }

    startCodingSession() {

        this.lastActivityTime = null;

        this.sessionTimer = setInterval(() => {

            if (this.lastActivityTime && (Date.now() - this.lastActivityTime) < 120000) {

                BrowserWindow.getAllWindows().forEach(win => {
                    if (!win.isDestroyed()) {
                        win.webContents.send("coding-tick", { minutes: 1, timestamp: Date.now() });
                    }
                });

            }

        }, 60000);

    }

    stopCodingSession() {

        if (this.sessionTimer) {

            clearInterval(this.sessionTimer);
            this.sessionTimer = null;

        }

    }

    updateTrackedFolder(folder) {

        this.trackedFolder = folder;

        this.startWatching();

    }

}

export default new FileWatcher();
