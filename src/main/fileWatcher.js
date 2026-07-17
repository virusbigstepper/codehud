import chokidar from "chokidar";
import path from "path";
import StorageManager from "./storageManager.js";

class FileWatcher {

    constructor() {

        this.watcher = null;

        this.mainWindow = null;

        this.trackedFolder = null;

        this.sessionStartTime = null;

        this.sessionTimer = null;

        // Debounce tracking: avoid duplicate events
        this.recentChanges = new Map();

        this.DEBOUNCE_MS = 1000;

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
            "**/package-lock.json"
        ];

        this.watcher = chokidar.watch(this.trackedFolder, {

            ignored,

            persistent: true,

            ignoreInitial: true,

            awaitWriteFinish: {
                stabilityThreshold: 300,
                pollInterval: 100
            }

        });

        this.watcher.on("change", (filePath) => {

            this.handleFileChange(filePath, "change");

        });

        this.watcher.on("add", (filePath) => {

            this.handleFileChange(filePath, "add");

        });

        this.watcher.on("unlink", (filePath) => {

            this.handleFileChange(filePath, "unlink");

        });

    }

    handleFileChange(filePath, eventType) {

        // Debounce: ignore duplicate events for same file within window
        const now = Date.now();
        const lastChange = this.recentChanges.get(filePath);

        if (lastChange && (now - lastChange) < this.DEBOUNCE_MS) {

            return;

        }

        this.recentChanges.set(filePath, now);

        // Clean old entries periodically
        if (this.recentChanges.size > 500) {

            for (const [key, time] of this.recentChanges) {

                if (now - time > 5000) {

                    this.recentChanges.delete(key);

                }

            }

        }

        const language = this.detectLanguage(filePath);
        const fileName = path.basename(filePath);

        const event = {
            filePath,
            fileName,
            language,
            eventType,
            timestamp: now
        };

        // Send to renderer
        if (this.mainWindow && !this.mainWindow.isDestroyed()) {

            this.mainWindow.webContents.send(
                "file-changed",
                event
            );

        }

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
            ".html": "HTML",
            ".css": "CSS",
            ".scss": "CSS",
            ".less": "CSS",
            ".json": "JSON",
            ".yaml": "YAML",
            ".yml": "YAML",
            ".md": "Markdown",
            ".sql": "SQL",
            ".sh": "Shell",
            ".bash": "Shell",
            ".ps1": "PowerShell",
            ".vue": "Vue",
            ".svelte": "Svelte",
            ".dart": "Dart",
            ".lua": "Lua"

        };

        return languageMap[ext] || "Other";

    }

    startCodingSession() {

        this.sessionStartTime = Date.now();

        // Send a coding-minute tick every 60 seconds
        this.sessionTimer = setInterval(() => {

            if (this.mainWindow && !this.mainWindow.isDestroyed()) {

                this.mainWindow.webContents.send(
                    "coding-tick",
                    { minutes: 1, timestamp: Date.now() }
                );

            }

        }, 60000); // every 60 seconds

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
