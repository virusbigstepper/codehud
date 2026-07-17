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

    broadcastTasksChanged: () => {
        ipcRenderer.send("tasks-changed");
    },

    onTasksUpdated: (callback) => {
        ipcRenderer.removeAllListeners("tasks-updated");
        ipcRenderer.on("tasks-updated", () => {
            callback();
        });
    },

    updateTrackedFolder: (folder) =>
        ipcRenderer.send(
            "update-tracked-folder",
            folder
        ),

    browseFolder: () =>
        ipcRenderer.invoke("browse-folder"),

    fetchLeetcode: (username) =>
        ipcRenderer.invoke(
            "fetch-leetcode",
            username
        ),

    setLaunchOnStartup: (enabled) =>
        ipcRenderer.send(
            "set-launch-on-startup",
            enabled
        ),

    sendNotification: (title, body) =>
        ipcRenderer.send(
            "send-notification",
            { title, body }
        ),

    notifyStreak: (days) =>
        ipcRenderer.send("notify-streak", days),

    notifyTaskReminder: (taskTitle) =>
        ipcRenderer.send("notify-task-reminder", taskTitle),

    notifySessionSummary: (minutes, filesChanged) =>
        ipcRenderer.send(
            "notify-session-summary",
            { minutes, filesChanged }
        )
});
