import "./tracker.css";
import CodeTrackerService from "../../services/codeTrackerService.js";

import { FaReact, FaJava, FaPhp, FaRust } from "react-icons/fa";
import {
    SiJavascript,
    SiPython,
    SiTypescript,
    SiCplusplus,
    SiGo,
    SiRuby,
    SiSwift,
    SiKotlin,
    SiDart,
    SiLua,
    SiVuedotjs,
    SiSvelte
} from "react-icons/si";

import { useState, useEffect } from "react";

const iconMap = {
    React: <FaReact color="#61DAFB" />,
    JavaScript: <SiJavascript color="#F7DF1E" />,
    Python: <SiPython color="#3776AB" />,
    TypeScript: <SiTypescript color="#3178C6" />,
    "C++": <SiCplusplus color="#00599C" />,
    "C": <SiCplusplus color="#A8B9CC" />,
    Java: <FaJava color="#ED8B00" />,
    Go: <SiGo color="#00ADD8" />,
    Rust: <FaRust color="#DEA584" />,
    Ruby: <SiRuby color="#CC342D" />,
    PHP: <FaPhp color="#777BB4" />,
    Swift: <SiSwift color="#FA7343" />,
    Kotlin: <SiKotlin color="#7F52FF" />,
    Dart: <SiDart color="#0175C2" />,
    Lua: <SiLua color="#2C2D72" />,
    Vue: <SiVuedotjs color="#4FC08D" />,
    Svelte: <SiSvelte color="#FF3E00" />
};

const CodingTrackerWidget = () => {

    const [stats, setStats] = useState(
        CodeTrackerService.getStats()
    );

    useEffect(() => {

        const updateStats = () => {

            setStats(CodeTrackerService.getStats());

        };

        const unsubscribe = CodeTrackerService.subscribe(updateStats);

        return () => unsubscribe();

    }, []);

    const activeLanguages = stats.languages
        .filter(lang => lang.minutes > 0)
        .sort((a, b) => b.minutes - a.minutes)
        .slice(0, 5);

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

            <div className="language-list">

                {activeLanguages.length === 0 ? (

                    <p className="no-activity">No coding activity yet</p>

                ) : (

                    activeLanguages.map((language, index) => (

                        <div
                            key={index}
                            className="language-card"
                        >

                            <div className="language-icon">

                                {iconMap[language.name] || <span>{language.name[0]}</span>}

                            </div>

                            <p>

                                {language.name}

                            </p>

                        </div>

                    ))

                )}

            </div>

            {activeLanguages.length > 0 && (
                <>
                    <div className="coding-divider"></div>

                    <div className="top-language">

                        <span>Top Language:</span>

                        <strong>{stats.topLanguage}</strong>

                    </div>
                </>
            )}

        </div>

    );

};

export default CodingTrackerWidget;
