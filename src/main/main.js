import { app, BrowserWindow, ipcMain, dialog } from "electron";
import path from "path";
import { fileURLToPath } from "url";

import { createTray } from "./tray.js";
import { openWidget } from "./windowManager.js";
import StorageManager from "./storageManager.js";
import FileWatcher from "./fileWatcher.js";
import NotificationManager from "./notificationManager.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const isDev = !app.isPackaged;

let mainWindow;
let isQuitting = false;

function createWindow() {

    const iconPath = isDev
        ? path.join(process.cwd(), "public", "codehud.png")
        : path.join(process.resourcesPath, "codehud.png");

    mainWindow = new BrowserWindow({
        width: 1400,
        height: 900,
        show: false,
        icon: iconPath,

        webPreferences: {
            preload: path.join(__dirname, "preload.cjs"),
            contextIsolation: true,
            nodeIntegration: false
        }
    });

    if (isDev) {
        mainWindow.loadURL("http://localhost:5173");
    } else {
        mainWindow.loadFile(path.join(__dirname, "../../dist/index.html"));
    }

    mainWindow.on("close", (e) => {

        if (!isQuitting) {

            e.preventDefault();
            mainWindow.hide();

        }

    });

}

export function quitApp() {

    isQuitting = true;
    app.quit();

}

function registerIpcHandlers() {

    ipcMain.on("open-widget", (_, name) => {
        openWidget(name);
    });

    ipcMain.on("tasks-changed", (event) => {
        const senderWebContents = event.sender;
        BrowserWindow.getAllWindows().forEach(win => {
            if (win.webContents !== senderWebContents && !win.isDestroyed()) {
                win.webContents.send("tasks-updated");
            }
        });
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

    ipcMain.handle("browse-folder", async () => {
        const result = await dialog.showOpenDialog({
            properties: ["openDirectory"],
            title: "Select Tracked Folder"
        });
        if (result.canceled || result.filePaths.length === 0) {
            return null;
        }
        return result.filePaths[0];
    });

    ipcMain.on("set-launch-on-startup", (_, enabled) => {
        app.setLoginItemSettings({
            openAtLogin: enabled,
            path: process.execPath
        });
    });

    ipcMain.on("send-notification", (_, { title, body }) => {
        NotificationManager.send(title, body);
    });

    ipcMain.on("notify-streak", (_, days) => {
        NotificationManager.streakMilestone(days);
    });

    ipcMain.on("notify-task-reminder", (_, taskTitle) => {
        NotificationManager.taskReminder(taskTitle);
    });

    ipcMain.on("notify-session-summary", (_, { minutes, filesChanged }) => {
        NotificationManager.sessionSummary(minutes, filesChanged);
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

    registerIpcHandlers();

    createWindow();

    createTray(mainWindow);

    FileWatcher.start(mainWindow);

    const settings = StorageManager.load("settings.json");

    if (settings && settings.startupWidgets) {

        const hasAnyStartupWidget = Object.values(settings.startupWidgets).some(v => v);

        if (hasAnyStartupWidget) {

            setTimeout(() => {

                for (const [name, enabled] of Object.entries(settings.startupWidgets)) {

                    if (enabled) {
                        openWidget(name);
                    }

                }

            }, 1500);

        } else {
            mainWindow.show();
        }

    } else {
        mainWindow.show();
    }

});

app.on("window-all-closed", (e) => {

    if (!isQuitting) {
        e.preventDefault();
    }

});

app.on("before-quit", () => {

    isQuitting = true;

});
