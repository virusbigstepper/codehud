const { contextBridge, ipcRenderer } = require("electron");

// console.log("PRELOAD LOADED");

contextBridge.exposeInMainWorld("electronAPI", {
    openAnalyticsWidget: () => {
        ipcRenderer.send("open-analytics-widget");
    }
});