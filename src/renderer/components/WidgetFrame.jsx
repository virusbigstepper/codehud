import { useEffect } from "react";
import "./WidgetFrame.css";
import settingsService from "../../services/settingsService";

const WidgetFrame = ({ children }) => {

    useEffect(() => {

        const settings = settingsService.getSettings();
        document.documentElement.setAttribute(
            "data-theme",
            settings.theme || "dark"
        );

    }, []);

    return (
        <div className="widget-frame">
            <div className="widget-content">
                {children}
            </div>
        </div>
    );

};

export default WidgetFrame;
