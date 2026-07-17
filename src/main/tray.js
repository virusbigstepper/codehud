import { Tray, Menu } from "electron";
import { toggleWidget, isOpen, getWidgetNames, closeAllWidgets } from "./windowManager.js";
import path from "path";

let tray = null;

export function createTray(mainWindow) {

    const iconPath = path.join(
        process.cwd(),
        "public",
        "codehud.png"
    );

    tray = new Tray(iconPath);

    tray.on("click", () => {
        mainWindow.show();
        mainWindow.focus();
    });

    buildMenu(mainWindow);

    tray.setToolTip("CodeHUD");

}

function buildMenu(mainWindow) {

    const widgetNames = getWidgetNames();

    const widgetLabels = {
        analytics: "Analytics",
        task: "Tasks",
        coding: "Coding Tracker",
        platform: "Platform Analyzer",
        heatmap: "Heatmap"
    };

    const widgetItems = widgetNames.map(name => ({

        label: widgetLabels[name] || name,
        type: "checkbox",
        checked: isOpen(name),
        click: () => {

            toggleWidget(name);

            // Rebuild menu after toggle to update checkbox state
            setTimeout(() => buildMenu(mainWindow), 200);

        }

    }));

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
        {
            label: "Widgets",
            enabled: false
        },
        ...widgetItems,
        {
            type: "separator"
        },
        {
            label: "Close All Widgets",
            click: () => {

                closeAllWidgets();
                setTimeout(() => buildMenu(mainWindow), 200);

            }
        },
        {
            type: "separator"
        },
        {
            label: "Quit",
            click: () => {
                closeAllWidgets();
                mainWindow.destroy();
            }
        }
    ]);

    tray.setContextMenu(contextMenu);

}

export function refreshTrayMenu(mainWindow) {

    buildMenu(mainWindow);

}
