import { BrowserWindow } from "electron";
import path from "path";
import { fileURLToPath } from "url";
import StorageManager from "./storageManager.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const widgetWindows = {};

const widgetConfig = {

    analytics: {
        width: 500,
        height: 270,
        minWidth: 350,
        minHeight: 200,
        route: "/widget/analytics",
        title: "Analytics"
    },

    task: {
        width: 360,
        height: 720,
        minWidth: 300,
        minHeight: 400,
        route: "/widget/task",
        title: "Tasks"
    },

    coding: {
        width: 450,
        height: 300,
        minWidth: 350,
        minHeight: 250,
        route: "/widget/coding",
        title: "Coding Tracker"
    },

    platform: {
        width: 450,
        height: 300,
        minWidth: 350,
        minHeight: 250,
        route: "/widget/platform",
        title: "Platform Analyzer"
    },

    heatmap: {
        width: 450,
        height: 300,
        minWidth: 350,
        minHeight: 250,
        route: "/widget/heatmap",
        title: "Heatmap"
    }

};

// Load saved positions/sizes from storage
function loadWidgetLayouts() {

    return StorageManager.load("widgetLayouts.json") || {};

}

// Save positions/sizes to storage
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

    // If already open, just show and focus
    if (widgetWindows[name] && !widgetWindows[name].isDestroyed()) {

        widgetWindows[name].show();
        widgetWindows[name].focus();
        return;

    }

    // Load saved position/size or use defaults
    const layouts = loadWidgetLayouts();
    const saved = layouts[name];

    const windowOptions = {

        width: saved?.width || config.width,
        height: saved?.height || config.height,
        minWidth: config.minWidth,
        minHeight: config.minHeight,

        x: saved?.x,
        y: saved?.y,

        frame: false,
        resizable: true,
        alwaysOnTop: true,
        autoHideMenuBar: true,
        skipTaskbar: true,

        show: false,

        transparent: false,

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

    // Save position on move/resize (debounced)
    let saveTimer = null;

    const debouncedSave = () => {

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
