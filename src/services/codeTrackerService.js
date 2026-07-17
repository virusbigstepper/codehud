class CodeTrackerService {

    constructor() {

        this.stats = this.getDefaultStats();
        this.listeners = [];
        this._saveTimer = null;
        this._initialized = false;

        if (!this.isElectron()) {

            const raw = localStorage.getItem("codingStats");
            const saved = raw ? JSON.parse(raw) : null;

            if (saved) {

                this.stats = { ...this.getDefaultStats(), ...saved };

            }

            if (!this.stats.languageMinutes) {

                this.stats.languageMinutes =
                    this.getDefaultLanguages();

                this.save();

            }

        }

    }

    isElectron() {

        return window.electronAPI !== undefined;

    }

    async initialize() {

        if (this._initialized) return;
        this._initialized = true;

        if (this.isElectron()) {

            const saved = await window.electronAPI.load(
                "codingStats.json"
            );

            if (saved) {

                this.stats = { ...this.getDefaultStats(), ...saved };

            }

            if (!this.stats.languageMinutes) {

                this.stats.languageMinutes =
                    this.getDefaultLanguages();

                this.save();

            }

            window.electronAPI.onFileChanged((batch) => {

                this.handleFileChangeBatch(batch);

            });

            window.electronAPI.onCodingTick((data) => {

                this.handleCodingTick(data);

            });

        }

    }

    getDefaultStats() {

        return {

            codingTimeMinutes: 0,

            yesterdayCodingMinutes: 0,

            filesChanged: 0,

            languageMinutes: this.getDefaultLanguages()

        };

    }

    getDefaultLanguages() {

        return {

            React: 0,
            JavaScript: 0,
            Python: 0,
            TypeScript: 0,
            "C++": 0

        };

    }

    handleFileChangeBatch(batch) {

        const files = batch.files || [];

        this.stats.filesChanged += files.length;

        for (const file of files) {

            const language = file.language;

            if (language && language !== "Other") {

                if (!this.stats.languageMinutes[language]) {

                    this.stats.languageMinutes[language] = 0;

                }

                this.stats.languageMinutes[language] += 1;

            }

        }

        this.debouncedSave();

    }

    handleCodingTick(data) {

        this.stats.codingTimeMinutes += data.minutes;

        this.debouncedSave();

    }

    debouncedSave() {

        if (this._saveTimer) return;

        this._saveTimer = setTimeout(() => {

            this._saveTimer = null;
            this.save();

        }, 1000);

    }

    save() {

        if (this.isElectron()) {

            window.electronAPI.save(
                "codingStats.json",
                this.stats
            );

        } else {

            localStorage.setItem(
                "codingStats",
                JSON.stringify(this.stats)
            );

        }

        this.notifyListeners();

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

        this.stats = this.getDefaultStats();

        this.save();

    }

    subscribe(listener) {

        this.listeners.push(listener);

        return () => {

            this.listeners = this.listeners.filter(
                l => l !== listener
            );

        };

    }

    notifyListeners() {

        this.listeners.forEach(listener => listener());

    }

}

export default new CodeTrackerService();
