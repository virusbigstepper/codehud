import { BrowserWindow } from "electron";


let analyticWindow = null;

export function createAnalyticsWindow() {
    if(analyticWindow) {
        analyticWindow.show();
        analyticWindow.focus();
        return;
    }

    analyticWindow = new BrowserWindow({
        width : 1400,
        height : 390,
        minWidth: 1100,
        minHeight: 390,
        alwaysOnTop : true,
        frame : false,
        resizable : false,
        autoHideMenuBar : true
    });

    analyticWindow.loadURL(
        "http://localhost:5173/widget/analytics"
    );

    analyticWindow.on("closed", ()=>{
        analyticWindow = null;
    });
}