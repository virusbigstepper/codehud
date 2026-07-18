import { useState, useEffect } from "react";
import "./heatmap.css";
import HeatmapService from "../../services/heatmapService.js";
import settingsService from "../../services/settingsService.js";

const HeatmapWidget = () => {

    const [stats, setStats] = useState(
        HeatmapService.getStats()
    );

    const [trackedFolder, setTrackedFolder] = useState("");

    useEffect(() => {

        const updateStats = () => {

            setStats(HeatmapService.getStats());

        };

        const loadFolder = async () => {
            const settings = await settingsService.getSettings();
            setTrackedFolder(settings.trackedFolder || "");
        };

        loadFolder();

        const unsubscribe = HeatmapService.subscribe(updateStats);

        return () => unsubscribe();

    }, []);

    return (

        <div className="heatmap-widget">

            <div className="heatmap-header">

                <span className="heatmap-month">
                    {stats.month}
                </span>

                <span className="heatmap-folder">
                    contributing in {trackedFolder || "No folder selected"}
                </span>

            </div>

            <div className="heatmap-content">

                <div className="heatmap-grid">

                    {stats.heatmap.map((level, index) => (

                        <div
                            key={index}
                            className={`heatmap-cell level-${level}`}
                        />

                    ))}

                </div>

                <div className="heatmap-side">

                    <div className="streak-box">

                        <h2>
                            {stats.bestStreak}
                        </h2>

                        <p>
                            Best Streak
                        </p>

                    </div>

                    <div className="streak-box">

                        <h2>
                            {stats.currentStreak}
                        </h2>

                        <p>
                            Current Streak
                        </p>

                    </div>

                </div>

            </div>

            <div className="heatmap-footer">

                {stats.filesChanged} files changed

            </div>

        </div>

    );

};

export default HeatmapWidget;
