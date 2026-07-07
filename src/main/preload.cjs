const { contextBridge, ipcRenderer } = require("electron");

// console.log("PRELOAD LOADED");

contextBridge.exposeInMainWorld("electronAPI", {
    openWidget: (name) =>
        ipcRenderer.send(
            "open-widget",
            name
        ),

        save : (fileName,data) =>
            ipcRenderer.invoke(
                "storage-save",
                fileName,
                data
        ),

        load : (fileName) =>
            ipcRenderer.invoke(
                "storage-load",
                fileName
        ),
        
        deleteFile : (fileName) =>
            ipcRenderer.invoke(
                "storage-delete",
                fileName
        ),

        exists: (fileName) =>
            ipcRenderer.invoke(
                "storage-exists",
                fileName
        ),

});