import "./analyzer.css";
import PlatformAnalyzerService from "../../services/platformAnalyzerService.js";
import SettingsService from "../../services/settingsService.js"
import { SiLeetcode, SiCodeforces, SiGeeksforgeeks } from "react-icons/si";
import { FaGithub } from "react-icons/fa";
import { useState, useEffect } from "react";


const PlatformAnalyzerWidget = () => {
    const [stats, setStats] = useState(null);
    const settings = SettingsService.getSettings();
//     useEffect(() => {

//     async function loadData() {

//         const data =
//             await PlatformAnalyzerService.getStats();

//         console.log(data);

//         setStats(data);
//     }

//     loadData();

// }, []); // for some testing
    const displayName =
        settings.displayName || "Developer";

    useEffect(() => {

        async function loadData() {

            const data =
                await PlatformAnalyzerService.getStats();

            setStats(data);
        }

        loadData();

    }, []);
    if (!stats) {

    return (
        <div className="platform-widget">
            Loading...
        </div>
    );
}

    const platforms = [
        {
            icon: <SiLeetcode className="leetcode-icon" />,
            count: stats.leetcodeSolved,
            label: "Problems"
        },
        {
            icon: <SiCodeforces className="codeforces-icon" />,
            count: stats.codeforcesRating,
            label: "Current Rating"
        },
        {
            icon: <SiGeeksforgeeks className="gfg-icon" />,
            count: stats.gfgSolved,
            label: "Problems"
        },
        {
            icon: <FaGithub className="github-icon" />,
            count: stats.githubRepos,
            label: "Repositories"
        }
    ];

    return (
        <div className="platform-widget">

            <h1 className="platform-title">
                Hi, {displayName}
            </h1>

            <div className="platform-list">

                {platforms.map((platform, index) => (
                    <div key={index} className="platform-card">

                        {platform.icon}

                        <div className="platform-info">
                            <h2>{platform.count}</h2>
                            <p>{platform.label}</p>
                        </div>

                    </div>
                ))}

            </div>

        </div>
    );
};

export default PlatformAnalyzerWidget;