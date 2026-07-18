import { Tray, Menu, app } from "electron";
import { toggleWidget, isOpen, closeAllWidgets } from "./windowManager.js";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let tray = null;
let mainWindowRef = null;

export function createTray(mainWindow) {

    mainWindowRef = mainWindow;

    const isDev = !app.isPackaged;
    const iconPath = isDev
        ? path.join(process.cwd(), "public", "codehud.png")
        : path.join(process.resourcesPath, "codehud.png");

    try {
        tray = new Tray(iconPath);
    } catch (e) {
        console.error("Failed to create tray:", e);
        return;
    }

    tray.setToolTip("CodeHUD");

    setTrayMenu();

    tray.on("click", () => {
        if (mainWindowRef && !mainWindowRef.isDestroyed()) {
            mainWindowRef.show();
            mainWindowRef.focus();
        }
    });

    tray.on("right-click", () => {
        setTrayMenu();
    });

}

function setTrayMenu() {

    if (!tray) return;

    let analyticsOpen = false;
    let taskOpen = false;
    let codingOpen = false;
    let platformOpen = false;
    let heatmapOpen = false;

    try {
        analyticsOpen = isOpen("analytics");
        taskOpen = isOpen("task");
        codingOpen = isOpen("coding");
        platformOpen = isOpen("platform");
        heatmapOpen = isOpen("heatmap");
    } catch (e) {
    }

    const contextMenu = Menu.buildFromTemplate([
        {
            label: "Open Dashboard",
            click: () => {
                if (mainWindowRef && !mainWindowRef.isDestroyed()) {
                    mainWindowRef.show();
                    mainWindowRef.focus();
                }
            }
        },
        { type: "separator" },
        
        {
            label: "Analytics",
            type: "checkbox",
            checked: analyticsOpen,
            click: () => { toggleWidget("analytics"); }
        },
        {
            label: "Tasks",
            type: "checkbox",
            checked: taskOpen,
            click: () => { toggleWidget("task"); }
        },
        {
            label: "Coding Tracker",
            type: "checkbox",
            checked: codingOpen,
            click: () => { toggleWidget("coding"); }
        },
        {
            label: "Platform Analyzer",
            type: "checkbox",
            checked: platformOpen,
            click: () => { toggleWidget("platform"); }
        },
        {
            label: "Heatmap",
            type: "checkbox",
            checked: heatmapOpen,
            click: () => { toggleWidget("heatmap"); }
        },
        { type: "separator" },
        {
            label: "Close All Widgets",
            click: () => { closeAllWidgets(); }
        },
        { type: "separator" },
        {
            label: "Quit CodeHUD",
            click: () => {
                closeAllWidgets();
                app.exit(0);
            }
        }
    ]);

    tray.setContextMenu(contextMenu);

}
