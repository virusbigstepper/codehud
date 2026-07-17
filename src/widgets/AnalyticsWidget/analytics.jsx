import { useState, useEffect } from "react";
import "./analytics.css";
import AnalyticsServices from "../../services/analyticsService";
import taskService from "../../services/taskService";

const AnalyticsWidget = () => {

    const [stats, setStats] = useState(
        AnalyticsServices.getDashboardStats()
    );

    useEffect(() => {

        const updateStats = () => {

            setStats(AnalyticsServices.getDashboardStats());

        };

        const unsubscribe = taskService.subscribe(updateStats);

        return () => unsubscribe();

    }, []);

    return (

        <div className="analytics-widget">

            <h2 className="analytics-title">
                Analytics
            </h2>

            <div className="analytics-stats">

                <div className="stat-card">

                    <h1>{stats.totalProblems}</h1>

                    <p>Problems Solved</p>

                </div>

                <div className="stat-card">

                    <h1>
                        {stats.tasksCompleted}/{stats.totalTasks}
                    </h1>

                    <p>Tasks Completed</p>

                </div>

            </div>

            <div className="analytics-progress">

                <div className="progress-bar">

                    <div
                        className="progress-fill"
                        style={{
                            width: `${stats.completionPercentage}%`
                        }}
                    />

                </div>

                <span>
                    {stats.completionPercentage}%
                </span>

            </div>

            <div className="analytics-bottom">

                <div>

                    <h1>{stats.codingTime}</h1>

                    <p>Total Time Today</p>

                </div>

                <div className="improvement">

                    <h1>
                        26%
                        <span> ▲</span>
                    </h1>

                    <p>vs yesterday</p>

                </div>

            </div>

        </div>

    );
};

export default AnalyticsWidget;
