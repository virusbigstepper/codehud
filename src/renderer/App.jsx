import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";

import Dashboard from "./pages/Dashboard";

import AnalyticsPage from "./pages/widgets/AnalyticsPage";
import TaskPage from "./pages/widgets/TaskPage";
import CodePage from "./pages/widgets/CodePage";
import PlatformPage from "./pages/widgets/PlatformPage";
import HeatmapPage from "./pages/widgets/HeatmapPage";

import settingsService from "../services/settingsService";
import codeTrackerService from "../services/codeTrackerService";
import heatmapService from "../services/heatmapService";
import taskService from "../services/taskService";

function App() {

    const [ready, setReady] = useState(false);

    useEffect(() => {

        const initServices = async () => {

            await settingsService.initialize();
            await codeTrackerService.initialize();
            await heatmapService.initialize();
            await taskService.initialize();

            document.documentElement.setAttribute(
                "data-theme",
                "dark"
            );

            setReady(true);

        };

        initServices();

    }, []);

    if (!ready) {

        return null;

    }

    return (

        <BrowserRouter>

            <Routes>

                <Route
                    path="/"
                    element={<Dashboard />}
                />

                <Route
                    path="/widget/analytics"
                    element={<AnalyticsPage />}
                />

                <Route
                    path="/widget/task"
                    element={<TaskPage />}
                />

                <Route
                    path="/widget/coding"
                    element={<CodePage />}
                />

                <Route
                    path="/widget/platform"
                    element={<PlatformPage />}
                />

                <Route
                    path="/widget/heatmap"
                    element={<HeatmapPage />}
                />

            </Routes>

        </BrowserRouter>

    );

}

export default App;
