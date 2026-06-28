import { Tray, Menu } from "electron";
import {openWidget} from "./windowManager.js"
import path from "path";

let tray = null;

export function createTray(mainWindow) {

    const iconPath = path.join(
        process.cwd(),
        "public",
        "codehud.png"
    );
    console.log(iconPath);
    tray = new Tray(iconPath);

    tray.on("click", () => {
        mainWindow.show();
        mainWindow.focus();
    });
         
    const contextMenu = Menu.buildFromTemplate([
        {
            label: "Open Dashboard",
            click: () => {
                mainWindow.show();
                mainWindow.focus();
            }
        },
        {
            type: "separator"
        },
        // {
        //     type: "separator"
        // },
        {
            label: "Open Analytics Widget",
            click: () => {
                openWidget("analytics");
            }
        },
        {
            label: "Open Task Widget",
            click: () => {
                openWidget("task");
            }
        },
        {
            label: "Open Coding Widget",
            click: () => {
                openWidget("coding");
            }
        },
        {
            label: "Open Platform Widget",
            click: () => {
                openWidget("platform");
            }
        },
        {
            label: "Open Heatmap Widget",
            click: () => {
                openWidget("heatmap");
            }
        },
        {
            label: "Quit",
            click: () => {
                mainWindow.destroy();
            }
        },
    ]);

    tray.setToolTip("CodeHUD");
    // console.log("Tray created");
    tray.setContextMenu(contextMenu);
}