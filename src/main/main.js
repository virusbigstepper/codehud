import { app, BrowserWindow, ipcMain } from "electron";
import path from "path";
import { fileURLToPath } from "url";

import { createTray } from "./tray.js";
import { openWidget } from "./windowManager.js";
import StorageManager from "./storageManager.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let mainWindow;

function createWindow() {

    mainWindow = new BrowserWindow({
        width: 1400,
        height: 900,

        webPreferences: {
            preload : path.join(__dirname, "preload.cjs"),
            contextIsolation : true,
            nodeIntegration : false
        }
    });



    mainWindow.loadURL("http://localhost:5173");
}

app.whenReady().then(() => {

    createWindow();

    createTray(mainWindow);

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

            return StorageManager.delete(fileName);

        }
    );

    ipcMain.handle(
        "storage-exists",
        (_, fileName) => {

            return StorageManager.exists(fileName);

        }
    );

});