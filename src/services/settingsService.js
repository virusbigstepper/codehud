class SettingsService {

    constructor() {

        if (!this.isElectron()) {

            const raw = localStorage.getItem("settings");
            const saved = raw ? JSON.parse(raw) : null;

            this._cached = {
                ...this.getDefaults(),
                ...saved
            };

        } else {

            this._cached = this.getDefaults();

        }

    }

    isElectron() {

        return window.electronAPI !== undefined;

    }

    async initialize() {

        const saved = await this.loadSettings();

        this._cached = {
            ...this.getDefaults(),
            ...saved
        };

    }

    async saveSettings(settings) {

        this._cached = { ...settings };

        if (this.isElectron()) {

            await window.electronAPI.save(
                "settings.json",
                settings
            );

        } else {

            localStorage.setItem(
                "settings",
                JSON.stringify(settings)
            );

        }

    }

    async loadSettings() {

        if (this.isElectron()) {

            return await window.electronAPI.load(
                "settings.json"
            );

        } else {

            const raw = localStorage.getItem("settings");
            return raw ? JSON.parse(raw) : null;

        }

    }

    getSettings() {

        return { ...this._cached };

    }

    getDefaults() {

        return {
            displayName: "Developer",
            leetcodeUsername: "",
            codeforcesUsername: "",
            githubUsername: "",
            gfgUsername: "",
            trackedFolder: "",

            showAnalytics: true,
            showTaskWidget: true,
            showCodingTracker: true,
            showPlatformAnalyzer: true,
            showHeatmap: true,

            startupWidgets: {
                analytics: false,
                task: false,
                coding: false,
                platform: false,
                heatmap: false
            },

            theme: "dark",

            launchOnStartup: false,
            rememberWidgetPosition: true
        };

    }

    clearSettings() {

        this._cached = this.getDefaults();

        if (this.isElectron()) {

            window.electronAPI.deleteFile("settings.json");

        } else {

            localStorage.removeItem("settings");

        }

    }

}

export default new SettingsService();
