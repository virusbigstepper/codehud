import { BrowserWindow } from "electron";


const widgetWindows = {

    dashboard: null,

    analytics: null,

    task: null,

    coding: null,

    platform: null,

    heatmap: null

};

const widgetConfig = {

    analytics: {

        width: 500,
        height: 270,

    

        route: "/widget/analytics",

        frame: false,
        resizable: false,
        alwaysOnTop: true

    },

    task: {

        width: 360,
        height: 720,

        route: "/widget/task",


        frame: false,
        resizable: false,
        alwaysOnTop: true

    },

    coding: {

        width: 450,
        height: 300,

        route: "/widget/coding",


        frame: false,
        resizable: false,
        alwaysOnTop: true

    },

    platform: {

        width: 450,
        height: 300,

        route: "/widget/platform",


        frame: false,
        resizable: false,
        alwaysOnTop: true

    },

    heatmap: {

        width: 450,
        height: 300,

        route: "/widget/heatmap",


        frame: false,
        resizable: false,
        alwaysOnTop: true

    }

};

export function openWidget(name) {

    const config = widgetConfig[name];

    if (!config) {

        console.error(`Unknown widget: ${name}`);
        return;

    }

    if (widgetWindows[name]) {

        widgetWindows[name].show();
        widgetWindows[name].focus();

        return;

    }

    widgetWindows[name] = new BrowserWindow({

        width: config.width,
        height: config.height,

        minWidth: config.minWidth,
        minHeight: config.minHeight,

        frame: config.frame,
        resizable: config.resizable,

        alwaysOnTop: config.alwaysOnTop,

        autoHideMenuBar: true,

        show: false

    });

    widgetWindows[name].loadURL(
        `http://localhost:5173${config.route}`
    );

    widgetWindows[name].once("ready-to-show", () => {

        widgetWindows[name].show();

    });

    widgetWindows[name].on("closed", () => {

        widgetWindows[name] = null;

    });

}

export function getWindow(name) {
    return widgetWindows[name];
}

export function isOpen(name) {

    return widgetWindows[name] !== null;

}

export function hideWidget(name) {

    const window = getWindow(name);

    if (!window) return;

    window.hide();

}

export function showWidget(name) {

    const window = getWindow(name);

    if (!window) return;

    window.show();
    window.focus();

}


export function toggleWidget(name) {

    const window = getWindow(name);

    if (!window) {

        openWidget(name);
        return;

    }

    if (window.isVisible()) {

        window.hide();

    } else {

        window.show();
        window.focus();

    }

}


export function closeWidget(name) {

    const window = getWindow(name);

    if (!window) return;

    window.destroy();

}