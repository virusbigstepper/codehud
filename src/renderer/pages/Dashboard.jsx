import TaskWidget from "../../widgets/TaskWidget/TaskWidget.jsx";
import CodingTrackerWidget from "../../widgets/CodingTrackerWidget/tracker.jsx";
import AnalyticsWidget from "../../widgets/AnalyticsWidget/analytics.jsx";
import PlatformAnalyzerWidget from "../../widgets/PlatoformAnalyzerWidget/analyzer.jsx";
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

                {
                    settings.showAnalytics &&
                    <AnalyticsWidget/>
                }

                <div className="bottom-row">

                    {
                        settings.showCodingTracker &&
                        <CodingTrackerWidget />
                    }

                    {
                        settings.showPlatformAnalyzer &&
                        <PlatformAnalyzerWidget />
                    }

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