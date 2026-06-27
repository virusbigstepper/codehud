import { useState } from "react";
import "./SettingsModal.css";
import SettingsService from "../../services/settingsService";

const SettingsModal = ({ onClose }) => {

    const currentSettings = SettingsService.getSettings();
    const [displayName, setDisplayName] = useState(
    currentSettings.displayName || "Developer"
    );
    const [leetcodeUsername, setLeetcodeUsername] =
        useState(currentSettings.leetcodeUsername || "");

    const [codeforcesUsername, setCodeforcesUsername] =
        useState(currentSettings.codeforcesUsername || "");

    const [githubUsername, setGithubUsername] =
        useState(currentSettings.githubUsername || "");

    const [trackedFolder, setTrackedFolder] =
        useState(currentSettings.trackedFolder || "C:\\Code");

    const handleSave = () => {

        SettingsService.saveSettings({
            displayName,
            leetcodeUsername,
            codeforcesUsername,
            githubUsername,
            trackedFolder,

            showAnalytics,
            showTaskWidget,
            showCodingTracker,
            showPlatformAnalyzer,
            showHeatmap,

            theme,

            launchOnStartup,
            rememberWidgetPosition
        });

        onClose();
    };

    const [showAnalytics, setShowAnalytics] = useState(
    currentSettings.showAnalytics ?? true
    );

    const [showTaskWidget, setShowTaskWidget] = useState(
        currentSettings.showTaskWidget ?? true
    );

    const [showCodingTracker, setShowCodingTracker] = useState(
        currentSettings.showCodingTracker ?? true
    );

    const [showPlatformAnalyzer, setShowPlatformAnalyzer] = useState(
        currentSettings.showPlatformAnalyzer ?? true
    );

    const [showHeatmap, setShowHeatmap] = useState(
        currentSettings.showHeatmap ?? true
    );

    const [theme, setTheme] = useState(
        currentSettings.theme ?? "dark"
    );

    const [launchOnStartup, setLaunchOnStartup] = useState(
        currentSettings.launchOnStartup ?? false
    );

    const [rememberWidgetPosition, setRememberWidgetPosition] = useState(
        currentSettings.rememberWidgetPosition ?? true
    );

    return (
        <div className="settings-overlay">

            <div className="settings-modal">

                <button
                    className="close-button"
                    onClick={onClose}
                >
                    ✕
                </button>

                <h1 className="settings-title">
                    Settings
                </h1>

                <div className="settings-grid">

                    
                    <div className="settings-column">

                        <div className="settings-section">

                            <h2>Connections</h2>
                            <label>Enter your Name</label>
                            <input
                                type="text"
                                placeholder="Display Name"
                                value={displayName}
                                onChange={(e) =>
                                    setDisplayName(e.target.value)
                                }
                            />
                            <label>Leetcode</label>
                            <input
                                type="text"
                                value={leetcodeUsername}
                                onChange={(e) =>
                                    setLeetcodeUsername(e.target.value)
                                }
                            />

                            <label>Codeforces</label>
                            <input
                                type="text"
                                value={codeforcesUsername}
                                onChange={(e) =>
                                    setCodeforcesUsername(e.target.value)
                                }
                            />

                            <label>Github</label>
                            <input
                                type="text"
                                value={githubUsername}
                                onChange={(e) =>
                                    setGithubUsername(e.target.value)
                                }
                            />

                        </div>

                        <div className="settings-section">

                            <h2>Tracking</h2>

                            <label>Tracked Folder</label>

                            <div className="folder-row">

                                <input
                                    type="text"
                                    value={trackedFolder}
                                    onChange={(e) =>
                                        setTrackedFolder(e.target.value)
                                    }
                                />

                                <button className="browse-button">
                                    Browse
                                </button>

                            </div>

                        </div>

                    </div>

                    <div className="settings-column">

                        <div className="settings-section widget-group">

                            <h2>Widgets</h2>

                            <label>
                                <input
                                    type="checkbox"
                                    checked={showAnalytics}
                                    onChange={() =>
                                        setShowAnalytics(!showAnalytics)
                                    }
                                />
                                Analytics Widget
                            </label>

                            <label>
                                <input
                                    type="checkbox"
                                    checked={showTaskWidget}
                                    onChange={() =>
                                        setShowTaskWidget(!showTaskWidget)
                                    }
                                />
                                Task Widget
                            </label>

                            <label>
                                <input
                                    type="checkbox"
                                    checked={showCodingTracker}
                                    onChange={() =>
                                        setShowCodingTracker(!showCodingTracker)
                                    }
                                />
                                Coding Tracker
                            </label>

                            <label>
                                <input
                                    type="checkbox"
                                    checked={showPlatformAnalyzer}
                                    onChange={() =>
                                        setShowPlatformAnalyzer(
                                            !showPlatformAnalyzer
                                        )
                                    }
                                />
                                Platform Analyzer
                            </label>
                            
                            <label>
                                <input
                                    type="checkbox"
                                    checked={showHeatmap}
                                    onChange={() =>
                                        setShowHeatmap(!showHeatmap)
                                    }
                                />
                                Heatmap Widget
                            </label>

                        </div>

                        <div className="settings-section">

                            <h2>Appearance</h2>

                            <div className="theme-options">

                                <label>
                                    <input
                                        type="radio"
                                        checked={theme === "dark"}
                                        onChange={() =>
                                            setTheme("dark")
                                        }
                                    />
                                    Dark
                                </label>

                                <label>
                                    <input
                                        type="radio"
                                        checked={theme === "light"}
                                        onChange={() =>
                                            setTheme("light")
                                        }
                                    />
                                    Light
                                </label>

                                <label>
                                    <input
                                        type="radio"
                                        checked={theme === "glass"}
                                        onChange={() =>
                                            setTheme("glass")
                                        }
                                    />
                                    Glass
                                </label>

                            </div>

                        </div>

                        <div className="settings-section">

                            <h2>General</h2>

                            <label>
                                <input
                                    type="checkbox"
                                    checked={launchOnStartup}
                                    onChange={() =>
                                        setLaunchOnStartup(
                                            !launchOnStartup
                                        )
                                    }
                                />
                                Launch on Startup
                            </label>

                            <label>
                                <input
                                    type="checkbox"
                                    checked={rememberWidgetPosition}
                                    onChange={() =>
                                        setRememberWidgetPosition(
                                            !rememberWidgetPosition
                                        )
                                    }
                                />
                                Remember Widget Position
                            </label>


                        </div>

                    </div>

                </div>

                <button
                    className="save-button"
                    onClick={handleSave}
                >
                    Save Settings
                </button>

            </div>


        </div>

        
    );
};

export default SettingsModal;