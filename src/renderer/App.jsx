import { BrowserRouter, Routes, Route } from "react-router-dom";

import Dashboard from "./pages/Dashboard";

import AnalyticsPage from "./pages/widgets/AnalyticsPage";
import TaskPage from "./pages/widgets/TaskPage";
import CodePage from "./pages/widgets/CodePage";
import PlatformPage from "./pages/widgets/PlatformPage";
import HeatmapPage from "./pages/widgets/HeatmapPage";

function App() {

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