import { app, BrowserWindow, ipcMain } from "electron";import {createTray} from "./tray.js";
import path from "path";
import { fileURLToPath } from "url";
import { createAnalyticsWindow } from "./windowManager.js";
import fs from "fs";


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let mainWindow;
// console.log("PRELOAD PATH:", path.join(__dirname, "preload.cjs"));
// console.log(
//     "EXISTS:",
//     fs.existsSync(path.join(__dirname, "preload.cjs"))
// );
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

    mainWindow.on("close", (e)=>{
        e.preventDefault();
        mainWindow.hide();
    });
}

app.whenReady().then(() => {
    createWindow();
    createTray(mainWindow);
    ipcMain.on("open-analytics-widget", () => {
    createAnalyticsWindow();
    });
});