import { useState } from "react";
import "./dashboard.css";

import SettingsService from "../../services/settingsService";
import SettingsModal from "../components/SettingsModal";

// Embedded widgets for browser mode
import TaskWidget from "../../widgets/TaskWidget/TaskWidget.jsx";
import CodingTrackerWidget from "../../widgets/CodingTrackerWidget/tracker.jsx";
import AnalyticsWidget from "../../widgets/AnalyticsWidget/analytics.jsx";
import PlatformAnalyzerWidget from "../../widgets/PlatoformAnalyzerWidget/analyzer.jsx";
import HeatmapWidget from "../../widgets/HeatmapWidget/heatmap.jsx";

import {
    FiBarChart2,
    FiCheckSquare,
    FiCode,
    FiGlobe,
    FiGrid,
    FiSettings
} from "react-icons/fi";

const isElectron = window.electronAPI !== undefined;

const widgetList = [
    { name: "analytics", label: "Analytics", icon: <FiBarChart2 />, setting: "showAnalytics" },
    { name: "task", label: "Tasks", icon: <FiCheckSquare />, setting: "showTaskWidget" },
    { name: "coding", label: "Coding Tracker", icon: <FiCode />, setting: "showCodingTracker" },
    { name: "platform", label: "Platform Analyzer", icon: <FiGlobe />, setting: "showPlatformAnalyzer" },
    { name: "heatmap", label: "Heatmap", icon: <FiGrid />, setting: "showHeatmap" }
];

const Dashboard = () => {

    const [showSettings, setShowSettings] = useState(false);
    const [settings, setSettings] = useState(
        SettingsService.getSettings()
    );

    const handleOpenWidget = (name) => {

        if (isElectron) {

            window.electronAPI.openWidget(name);

        }

    };

    // In Electron: show launcher cards
    if (isElectron) {

        return (
            <>
                <div className="dashboard launcher-mode">

                    <button
                        className="settings-button"
                        onClick={() => setShowSettings(true)}
                    >
                        <FiSettings />
                    </button>

                    <div className="launcher-content">

                        <h1 className="launcher-title">
                            CodeHUD
                        </h1>

                        <p className="launcher-subtitle">
                            Click a widget to open it on your desktop
                        </p>

                        <div className="launcher-grid">

                            {widgetList.map(widget => (

                                settings[widget.setting] && (

                                    <button
                                        key={widget.name}
                                        className="launcher-card"
                                        onClick={() => handleOpenWidget(widget.name)}
                                    >
                                        <span className="launcher-card-icon">
                                            {widget.icon}
                                        </span>
                                        <span className="launcher-card-label">
                                            {widget.label}
                                        </span>
                                    </button>

                                )

                            ))}

                        </div>

                        <div className="launcher-footer">
                            <p>Widgets stay on your desktop. Use the system tray to toggle them.</p>
                        </div>

                    </div>

                </div>

                {showSettings && (
                    <SettingsModal
                        onClose={() => {
                            setShowSettings(false);
                            setSettings(
                                SettingsService.getSettings()
                            );
                        }}
                    />
                )}
            </>
        );

    }

    // In browser: show embedded widgets (original layout)
    return (
        <>
            <div className="dashboard">

                <button
                    className="settings-button"
                    onClick={() => setShowSettings(true)}
                >
                    <FiSettings />
                </button>

                {settings.showTaskWidget && (
                    <div className="left-panel">
                        <TaskWidget />
                    </div>
                )}

                <div className="right-panel">

                    <div className="widget-grid">

                        {settings.showAnalytics && <AnalyticsWidget />}

                        {settings.showPlatformAnalyzer && <PlatformAnalyzerWidget />}

                        {settings.showCodingTracker && <CodingTrackerWidget />}

                        {settings.showHeatmap && <HeatmapWidget />}

                    </div>

                </div>

            </div>

            {showSettings && (
                <SettingsModal
                    onClose={() => {
                        setShowSettings(false);
                        setSettings(
                            SettingsService.getSettings()
                        );
                    }}
                />
            )}
        </>
    );

};

export default Dashboard;
