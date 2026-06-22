import { app, BrowserWindow } from "electron";

function createWindow() {

    const mainWindow = new BrowserWindow({
        width: 1400,
        height: 900
    });

    mainWindow.loadURL("http://localhost:5173");
}

app.whenReady().then(() => {
    createWindow();
});