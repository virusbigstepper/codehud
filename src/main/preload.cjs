const { contextBridge, ipcRenderer } = require("electron");

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

    // File watcher events - use removeAllListeners to prevent duplicates
    onFileChanged: (callback) => {
        ipcRenderer.removeAllListeners("file-changed");
        ipcRenderer.on("file-changed", (_, event) => {
            callback(event);
        });
    },

    onCodingTick: (callback) => {
        ipcRenderer.removeAllListeners("coding-tick");
        ipcRenderer.on("coding-tick", (_, data) => {
            callback(data);
        });
    },

    // Update tracked folder
    updateTrackedFolder: (folder) =>
        ipcRenderer.send(
            "update-tracked-folder",
            folder
        ),

    // LeetCode fetch (bypasses CORS via main process)
    fetchLeetcode: (username) =>
        ipcRenderer.invoke(
            "fetch-leetcode",
            username
        )
});
