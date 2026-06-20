import "./analytics.css";
import AnalyticsServices from "../../services/analyticsService";
import {useEffect} from "react";
// import GithubService from "../../services/githubService"
import CodeforcesService from "../../services/codeforcesService"


const AnalyticsWidget = () => {
    const stats = AnalyticsServices.getDashboardStats();
    const trackedFolder = "C:\\Code";
    useEffect
    return (
        <div className="analytics-widget">
            <div className="problem-wheel-circle">
                <div className="problem-count">
                    {stats.totalProblems}
                </div>
            </div>

            <div className="analytics-content">

                <div className="analytics-header">

                    <h1>
                        You have coded for
                        <span> {stats.codingTime} </span>
                    </h1>

                    <p>
                        26% more than yesterday. Nice Going!
                    </p>

                </div>

                <div className="screen-time-card">
                    27 H 52M
                </div>

                <div className="task-progress">

                    <span>
                        {stats.tasksCompleted} of {stats.totalTasks} tasks completed.
                    </span>

                    <div className="progress-bar">
                        <div className="progress-fill" style={{width: `${stats.completionPercentage}%`}}></div>
                    </div>

                    <span>
                        {stats.completionPercentage}%
                    </span>

                </div>

                <div className="heatmap-section">

                    <p className="heatmap-folder">
                        contributing in {trackedFolder}
                    </p>

                    <div className="heatmap-container">

                        <div className="heatmap-grid">

                            {Array.from({ length: 120 }).map((_, index) => (
                                <div
                                    key={index}
                                    className="heatmap-cell"
                                />
                            ))}

                        </div>

                    </div>

                </div>

            </div>

        </div>
    );
};

export default AnalyticsWidget;