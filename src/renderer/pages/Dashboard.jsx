import TaskWidget from "../../widgets/TaskWidget/TaskWidget.jsx";
import CodingTrackerWidget from "../../widgets/CodingTrackerWidget/tracker.jsx";
import AnalyticsWidget from "../../widgets/AnalyticsWidget/analytics.jsx";
import PlatformAnalyzerWidget from "../../widgets/PlatoformAnalyzerWidget/analyzer.jsx";
import HeatmapWidget from "../../widgets/HeatmapWidget/heatmap.jsx";
import "./dashboard.css";

import { useState } from "react";

import SettingsService from "../../services/settingsService";
import SettingsModal from "../../renderer/components/SettingsModal";

const Dashboard = () => {

    const [showSettings, setShowSettings] = useState(false);

    const [settings, setSettings] = useState(
        SettingsService.getSettings()
    );

    return (
        <>

            <div className="dashboard">

                <button
                    className="settings-button"
                    onClick={() => setShowSettings(true)}
                >
                    ⚙
                </button>

                {
                    settings.showTaskWidget && (
                        <div className="left-panel">
                            <TaskWidget />
                        </div>
                    )
                }

                <div className="right-panel">

                    {/* Remove this later
                    <button
                        className="analytics-window-btn"
                        onClick={()=>{
                            window.electronAPI.openAnalyticsWidget();
                        }}
                    >
                        Open Analytics
                    </button> */}

                    <div className="widget-grid">

                        {
                            settings.showAnalytics &&
                            <AnalyticsWidget />
                        }

                        {
                            settings.showPlatformAnalyzer &&
                            <PlatformAnalyzerWidget />
                        }

                        {
                            settings.showCodingTracker &&
                            <CodingTrackerWidget />
                        }

                        {
                            settings.showHeatmap &&
                            <HeatmapWidget />
                        }

                        {/* GithubWidget */}

                    </div>

                </div>

            </div>

            {
                showSettings && (
                    <SettingsModal
                        onClose={() => {
                            setShowSettings(false);

                            setSettings(
                                SettingsService.getSettings()
                            );
                        }}
                    />
                )
            }

        </>
    );
};

export default Dashboard;