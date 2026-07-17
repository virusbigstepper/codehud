import { useState } from "react";
import "./WidgetFrame.css";

const WidgetFrame = ({ title, children }) => {

    const [isHovered, setIsHovered] = useState(false);

    return (
        <div
            className="widget-frame"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >

            <div className={`widget-titlebar ${isHovered ? "visible" : ""}`}>

                <div className="widget-drag-region">
                    <span className="widget-title">{title}</span>
                </div>

                <button
                    className="widget-close-btn"
                    onClick={() => window.close()}
                    title="Close"
                >
                    ✕
                </button>

            </div>

            <div className="widget-content">
                {children}
            </div>

        </div>
    );

};

export default WidgetFrame;
