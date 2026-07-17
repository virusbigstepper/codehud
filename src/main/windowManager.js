import { BrowserWindow } from "electron";
import path from "path";
import { fileURLToPath } from "url";
import StorageManager from "./storageManager.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const widgetWindows = {};

const widgetConfig = {

    analytics: {
        width: 380,
        height: 220,
        minWidth: 340,
        minHeight: 200,
        maxWidth: 500,
        maxHeight: 280,
        route: "/widget/analytics",
        title: "Analytics"
    },

    task: {
        width: 300,
        height: 500,
        minWidth: 280,
        minHeight: 400,
        maxWidth: 400,
        maxHeight: 700,
        route: "/widget/task",
        title: "Tasks"
    },

    coding: {
        width: 340,
        height: 260,
        minWidth: 300,
        minHeight: 240,
        maxWidth: 450,
        maxHeight: 320,
        route: "/widget/coding",
        title: "Coding Tracker"
    },

    platform: {
        width: 360,
        height: 240,
        minWidth: 320,
        minHeight: 220,
        maxWidth: 460,
        maxHeight: 300,
        route: "/widget/platform",
        title: "Platform Analyzer"
    },

    heatmap: {
        width: 380,
        height: 260,
        minWidth: 340,
        minHeight: 240,
        maxWidth: 500,
        maxHeight: 320,
        route: "/widget/heatmap",
        title: "Heatmap"
    }

};

function loadWidgetLayouts() {

    return StorageManager.load("widgetLayouts.json") || {};

}

function saveWidgetLayouts(layouts) {

    StorageManager.save("widgetLayouts.json", layouts);

}

function saveWidgetPosition(name) {

    const win = widgetWindows[name];
    if (!win || win.isDestroyed()) return;

    const bounds = win.getBounds();
    const layouts = loadWidgetLayouts();

    layouts[name] = {
        x: bounds.x,
        y: bounds.y,
        width: bounds.width,
        height: bounds.height
    };

    saveWidgetLayouts(layouts);

}

export function openWidget(name) {

    const config = widgetConfig[name];

    if (!config) {

        console.error(`Unknown widget: ${name}`);
        return;

    }

    if (widgetWindows[name] && !widgetWindows[name].isDestroyed()) {

        widgetWindows[name].show();
        widgetWindows[name].focus();
        return;

    }

    const layouts = loadWidgetLayouts();
    const saved = layouts[name];

    const settings = StorageManager.load("settings.json");
    const isGlass = settings?.theme === "glass";
    const rememberPosition = settings?.rememberWidgetPosition !== false;

    const windowOptions = {

        width: (rememberPosition && saved?.width) || config.width,
        height: (rememberPosition && saved?.height) || config.height,
        minWidth: config.minWidth,
        minHeight: config.minHeight,
        maxWidth: config.maxWidth,
        maxHeight: config.maxHeight,

        x: rememberPosition ? saved?.x : undefined,
        y: rememberPosition ? saved?.y : undefined,

        frame: false,
        resizable: true,
        alwaysOnTop: false,
        autoHideMenuBar: true,
        skipTaskbar: true,

        show: false,

        transparent: isGlass,
        backgroundColor: isGlass ? "#00000000" : "#090909",

        webPreferences: {
            preload: path.join(__dirname, "preload.cjs"),
            contextIsolation: true,
            nodeIntegration: false
        }

    };

    widgetWindows[name] = new BrowserWindow(windowOptions);

    const win = widgetWindows[name];

    win.loadURL(
        `http://localhost:5173${config.route}`
    );

    win.once("ready-to-show", () => {

        win.show();

    });

    let saveTimer = null;

    const debouncedSave = () => {

        if (!rememberPosition) return;

        if (saveTimer) clearTimeout(saveTimer);

        saveTimer = setTimeout(() => {

            saveWidgetPosition(name);

        }, 500);

    };

    win.on("move", debouncedSave);
    win.on("resize", debouncedSave);

    win.on("closed", () => {

        widgetWindows[name] = null;

        if (saveTimer) clearTimeout(saveTimer);

    });

}

export function getWindow(name) {

    return widgetWindows[name] || null;

}

export function isOpen(name) {

    return widgetWindows[name] !== null &&
        !widgetWindows[name].isDestroyed();

}

export function hideWidget(name) {

    const win = getWindow(name);
    if (!win || win.isDestroyed()) return;

    win.hide();

}

export function showWidget(name) {

    const win = getWindow(name);
    if (!win || win.isDestroyed()) return;

    win.show();
    win.focus();

}

export function toggleWidget(name) {

    const win = getWindow(name);

    if (!win || win.isDestroyed()) {

        openWidget(name);
        return;

    }

    if (win.isVisible()) {

        win.hide();

    } else {

        win.show();
        win.focus();

    }

}

export function closeWidget(name) {

    const win = getWindow(name);
    if (!win || win.isDestroyed()) return;

    saveWidgetPosition(name);
    win.destroy();

}

export function closeAllWidgets() {

    for (const name of Object.keys(widgetWindows)) {

        closeWidget(name);

    }

}

export function getWidgetNames() {

    return Object.keys(widgetConfig);

}

export function getWidgetConfig(name) {

    return widgetConfig[name] || null;

}
