const { contextBridge, ipcRenderer } = require("electron");

// console.log("PRELOAD LOADED");

contextBridge.exposeInMainWorld("electronAPI", {
    openWidget: (name) =>
        ipcRenderer.send(
            "open-widget",
            name
        ),

    save: (fileName, data) =>
        ipcRenderer.invoke(
            "storage-save",
            fileName,
            data
        ),

    load: (fileName) =>
        ipcRenderer.invoke(
            "storage-load",
            fileName
        ),

    deleteFile: (fileName) =>
        ipcRenderer.invoke(
            "storage-delete",
            fileName
        ),

    exists: (fileName) =>
        ipcRenderer.invoke(
            "storage-exists",
            fileName
        ),

    // File watcher events
    onFileChanged: (callback) => {
        ipcRenderer.on("file-changed", (_, event) => {
            callback(event);
        });
    },

    onCodingTick: (callback) => {
        ipcRenderer.on("coding-tick", (_, data) => {
            callback(data);
        });
    },

    // Update tracked folder
    updateTrackedFolder: (folder) =>
        ipcRenderer.send(
            "update-tracked-folder",
            folder
        )
});
