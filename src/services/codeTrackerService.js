class CodeTrackerService {

    constructor() {

        this.stats = JSON.parse(
            localStorage.getItem("codingStats")
        ) || {

            codingTimeMinutes: 0,

            yesterdayCodingMinutes: 0,

            filesChanged: 0,

            languageMinutes: this.getDefaultLanguages()

        };

        // Handle old localStorage structure
        if (!this.stats.languageMinutes) {

            this.stats.languageMinutes =
                this.getDefaultLanguages();

            this.save();
        }

    }

    getDefaultLanguages() {

        return {

            React: 80,
            JavaScript: 65,
            Python: 45,
            TypeScript: 20,
            "C++": 15

        };

    }

    save() {

        localStorage.setItem(
            "codingStats",
            JSON.stringify(this.stats)
        );

    }

    getStats() {

        const totalMinutes =
            this.stats.codingTimeMinutes || 0;

        const hours =
            Math.floor(totalMinutes / 60);

        const minutes =
            totalMinutes % 60;

        const languages = Object.entries(
            this.stats.languageMinutes
        ).map(([name, mins]) => {

            const h = Math.floor(mins / 60);
            const m = mins % 60;

            return {

                name,

                time:
                    h > 0
                        ? `${h}H ${m}M`
                        : `${m}M`,

                minutes: mins

            };

        });

        const topLanguage =
            languages.length
                ? languages.reduce((best, current) =>

                    current.minutes > best.minutes
                        ? current
                        : best

                ).name
                : "None";

        return {

            codingTime:
                `${hours} H ${minutes} M`,

            codingTimeMinutes:
                totalMinutes,

            filesChanged:
                this.stats.filesChanged,

            codingIncrease:
                this.codingIncrease(),

            languages,

            topLanguage

        };

    }

    addCodingMinutes(minutes) {

        this.stats.codingTimeMinutes += minutes;

        this.save();

    }

    addLanguageMinutes(language, minutes) {

        if (!this.stats.languageMinutes[language]) {

            this.stats.languageMinutes[language] = 0;

        }

        this.stats.languageMinutes[language] += minutes;

        this.save();

    }

    incrementFileChanged() {

        this.stats.filesChanged++;

        this.save();

    }

    codingIncrease() {

        const today =
            this.stats.codingTimeMinutes;

        const yesterday =
            this.stats.yesterdayCodingMinutes;

        if (yesterday === 0) {

            return today > 0
                ? 100
                : 0;

        }

        return Math.round(
            ((today - yesterday) / yesterday) * 100
        );

    }

    resetStats() {

        this.stats = {

            codingTimeMinutes: 0,

            yesterdayCodingMinutes: 0,

            filesChanged: 0,

            languageMinutes:
                this.getDefaultLanguages()

        };

        this.save();

    }

}

export default new CodeTrackerService();