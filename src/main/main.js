import { app, BrowserWindow, ipcMain } from "electron";
import path from "path";
import { fileURLToPath } from "url";

import { createTray } from "./tray.js";
import { openWidget } from "./windowManager.js";
import StorageManager from "./storageManager.js";
import FileWatcher from "./fileWatcher.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let mainWindow;

function createWindow() {

    mainWindow = new BrowserWindow({
        width: 1400,
        height: 900,

        webPreferences: {
            preload: path.join(__dirname, "preload.cjs"),
            contextIsolation: true,
            nodeIntegration: false
        }
    });

    mainWindow.loadURL("http://localhost:5173");
}

// Register all IPC handlers immediately (before window loads)
function registerIpcHandlers() {

    ipcMain.on("open-widget", (_, name) => {
        openWidget(name);
    });

    ipcMain.handle(
        "storage-save",
        (_, fileName, data) => {
            return StorageManager.save(fileName, data);
        }
    );

    ipcMain.handle(
        "storage-load",
        (_, fileName) => {
            return StorageManager.load(fileName);
        }
    );

    ipcMain.handle(
        "storage-delete",
        (_, fileName) => {
            return StorageManager.deleteFile(fileName);
        }
    );

    ipcMain.handle(
        "storage-exists",
        (_, fileName) => {
            return StorageManager.exists(fileName);
        }
    );

    ipcMain.on("update-tracked-folder", (_, folder) => {
        FileWatcher.updateTrackedFolder(folder);
    });

    ipcMain.handle("fetch-leetcode", async (_, username) => {

        const query = `
            query getUserProfile($username: String!) {
                matchedUser(username: $username) {
                    username
                    submitStats: submitStatsGlobal {
                        acSubmissionNum {
                            difficulty
                            count
                            submissions
                        }
                    }
                }
            }
        `;

        try {

            const response = await fetch("https://leetcode.com/graphql", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Referer": "https://leetcode.com",
                    "Origin": "https://leetcode.com"
                },
                body: JSON.stringify({
                    query,
                    variables: { username }
                })
            });

            if (!response.ok) {
                return {
                    totalSolved: 0, easySolved: 0,
                    mediumSolved: 0, hardSolved: 0,
                    error: `LeetCode API error: ${response.status}`
                };
            }

            const data = await response.json();

            if (!data.data || !data.data.matchedUser) {
                return {
                    totalSolved: 0, easySolved: 0,
                    mediumSolved: 0, hardSolved: 0,
                    error: "LeetCode user not found"
                };
            }

            const submissions =
                data.data.matchedUser.submitStats.acSubmissionNum;

            let totalSolved = 0;
            let easySolved = 0;
            let mediumSolved = 0;
            let hardSolved = 0;

            for (const entry of submissions) {
                switch (entry.difficulty) {
                    case "All": totalSolved = entry.count; break;
                    case "Easy": easySolved = entry.count; break;
                    case "Medium": mediumSolved = entry.count; break;
                    case "Hard": hardSolved = entry.count; break;
                }
            }

            return { totalSolved, easySolved, mediumSolved, hardSolved, error: null };

        } catch (e) {
            return {
                totalSolved: 0, easySolved: 0,
                mediumSolved: 0, hardSolved: 0,
                error: "Network error fetching LeetCode data"
            };
        }

    });

}

app.whenReady().then(() => {

    // Register handlers FIRST, before any window loads
    registerIpcHandlers();

    createWindow();

    createTray(mainWindow);

    // Start file system monitoring
    FileWatcher.start(mainWindow);

});
