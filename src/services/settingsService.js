class SettingsService {

    saveSettings(settings) {
        localStorage.setItem(
            "settings",
            JSON.stringify(settings)
        );
    }

    getSettings() {
        const saved = JSON.parse(
            localStorage.getItem("settings")
        );

        return{
            leetcodeUsername: "",
            codeforcesUsername: "",
            githubUsername: "",
            trackedFolder: "C:\\Code",

            showAnalytics: true,
            showTaskWidget: true,
            showCodingTracker: true,
            showPlatformAnalyzer: true,
            showHeatmap : true,

            theme: "dark",

            launchOnStartup: false,
            rememberWidgetPosition: true,

            ...saved
        };
    }

    clearSettings() {
        localStorage.removeItem("settings");
    }
}

export default new SettingsService();