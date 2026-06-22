import { app, BrowserWindow } from "electron";
import {createTray} from "./tray.js";

let mainWindow;

function createWindow() {

    mainWindow = new BrowserWindow({
        width: 1400,
        height: 900
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
});