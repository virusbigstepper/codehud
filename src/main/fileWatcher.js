import chokidar from "chokidar";
import path from "path";
import StorageManager from "./storageManager.js";

class FileWatcher {

    constructor() {

        this.watcher = null;

        this.mainWindow = null;

        this.trackedFolder = null;

        this.sessionTimer = null;

        // Throttle: batch events and send periodically
        this.pendingEvents = [];

        this.flushTimer = null;

        this.FLUSH_INTERVAL_MS = 2000;

    }

    start(mainWindow) {

        this.mainWindow = mainWindow;

        // Load tracked folder from settings
        const settings = StorageManager.load("settings.json");
        this.trackedFolder = settings?.trackedFolder || "C:\\Code";

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

            // Only watch 3 levels deep to avoid memory explosion
            depth: 3,

            // Use polling with longer interval to reduce CPU/memory
            usePolling: false,

            awaitWriteFinish: {
                stabilityThreshold: 500,
                pollInterval: 200
            }

        });

        this.watcher.on("change", (filePath) => {

            this.queueEvent(filePath, "change");

        });

        this.watcher.on("add", (filePath) => {

            this.queueEvent(filePath, "add");

        });

        // Start the flush timer
        this.startFlushTimer();

    }

    queueEvent(filePath, eventType) {

        // Only track code files
        const language = this.detectLanguage(filePath);

        if (language === "Other") return;

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

        if (!this.mainWindow || this.mainWindow.isDestroyed()) return;

        // Deduplicate: only count each file once per flush
        const uniqueFiles = new Map();

        for (const event of this.pendingEvents) {

            uniqueFiles.set(event.filePath, event);

        }

        const events = Array.from(uniqueFiles.values());

        // Send a single batched event to renderer
        this.mainWindow.webContents.send(
            "file-changed",
            {
                files: events,
                count: events.length
            }
        );

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

        // Send a coding-minute tick every 60 seconds
        this.sessionTimer = setInterval(() => {

            if (this.mainWindow && !this.mainWindow.isDestroyed()) {

                this.mainWindow.webContents.send(
                    "coding-tick",
                    { minutes: 1, timestamp: Date.now() }
                );

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
