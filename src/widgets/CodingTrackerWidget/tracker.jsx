import "./tracker.css";
import CodeTrackerService from "../../services/codeTrackerService.js";
import { FaReact } from "react-icons/fa";
import { SiJavascript } from "react-icons/si";
import { SiPython } from "react-icons/si";
import { SiTypescript } from "react-icons/si";
import { SiCplusplus } from "react-icons/si";
import { useState } from "react";

const CodingTrackerWidget = () => {

    const [stats,setStats] = useState(CodeTrackerService.getStats());

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

                <span>{stats.filesChanged} files changed</span>

            </div>

            <div className="coding-time">

                {stats.codingTime}

            </div>
            // for debugging
            {/* <button
                onClick={() => {

                    CodeTrackerService.addCodingMinutes(30);

                    setStats(
                        CodeTrackerService.getStats()
                    );

                }}
            >
                Simulate Time
            </button> */}
            {/* <button
                onClick={()=> {
                    CodeTrackerService.resetStats();
                    setStats(
                        CodeTrackerService.getStats()
                    );
                }}
            >
                Reset Stats
            </button> */}
            <div className="language-list">

                {stats.languagesUsed.map((language, index) => (
                <div key={index} className="language-icon">
                    {iconMap[language]}
                </div>
))}

            </div>

        </div>
    );
};

export default CodingTrackerWidget;