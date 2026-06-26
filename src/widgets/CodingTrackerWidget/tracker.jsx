import "./tracker.css";
import CodeTrackerService from "../../services/codeTrackerService.js";

import { FaReact } from "react-icons/fa";
import {
    SiJavascript,
    SiPython,
    SiTypescript,
    SiCplusplus
} from "react-icons/si";

import { useState } from "react";

const CodingTrackerWidget = () => {

    const [stats, setStats] = useState(
        CodeTrackerService.getStats()
    );

    const iconMap = {
        React: <FaReact color="#61DAFB" />,
        JavaScript: <SiJavascript color="#F7DF1E" />,
        Python: <SiPython color="#3776AB" />,
        TypeScript: <SiTypescript color="#3178C6" />,
        "C++": <SiCplusplus color="#00599C" />
    };

    return (

        <div className="coding-widget">

            <div className="coding-header">

                <h2>Hours Coded</h2>

                <span>
                    {stats.filesChanged} files changed
                </span>

            </div>

            <div className="coding-time">

                {stats.codingTime}

            </div>

            {/* Debug Buttons */}

            {/*
            <button
                onClick={() => {

                    CodeTrackerService.addCodingMinutes(30);

                    setStats(
                        CodeTrackerService.getStats()
                    );

                }}
            >
                Simulate Time
            </button>

            <button
                onClick={() => {

                    CodeTrackerService.resetStats();

                    setStats(
                        CodeTrackerService.getStats()
                    );

                }}
            >
                Reset
            </button>
            */}

            <div className="language-list">

                {stats.languages.map((language, index) => (

                    <div
                        key={index}
                        className="language-card"
                    >

                        <div className="language-icon">

                            {iconMap[language.name]}

                        </div>

                        <h3>

                            {language.time}

                        </h3>

                        <p>

                            {language.name}

                        </p>

                    </div>

                ))}

            </div>

            <div className="coding-divider"></div>

            <div className="top-language">

                <span>

                    Top Language:

                </span>

                <strong>

                    {stats.topLanguage}

                </strong>

            </div>

        </div>

    );

};

export default CodingTrackerWidget;