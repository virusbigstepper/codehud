import { BrowserRouter, Routes, Route } from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import AnalyticsPage from "./pages/widgets/AnalyticsPage";

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

            </Routes>

        </BrowserRouter>
    );
}

export default App;