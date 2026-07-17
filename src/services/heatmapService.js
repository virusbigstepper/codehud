class HeatmapService {

    constructor() {

        this.data = this.getDefaultData();
        this.listeners = [];
        this._saveTimer = null;
        this._initialized = false;

        // Eagerly load from localStorage for browser
        if (!this.isElectron()) {

            const raw = localStorage.getItem("heatmapData");
            const saved = raw ? JSON.parse(raw) : null;

            if (saved) {

                this.data = { ...this.getDefaultData(), ...saved };

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
                "heatmapData.json"
            );

            if (saved) {

                this.data = { ...this.getDefaultData(), ...saved };

            }

            // Listen for batched file changes
            window.electronAPI.onFileChanged((batch) => {

                const count = batch.count || 0;
                if (count > 0) {

                    this.recordActivity(count, 0);

                }

            });

            // Listen for coding ticks
            window.electronAPI.onCodingTick((data) => {

                this.recordActivity(0, data.minutes);

            });

        }

    }

    getDefaultData() {

        return {

            dailyActivity: {},

            bestStreak: 0,

            currentStreak: 0

        };

    }

    save() {

        if (this.isElectron()) {

            window.electronAPI.save(
                "heatmapData.json",
                this.data
            );

        } else {

            localStorage.setItem(
                "heatmapData",
                JSON.stringify(this.data)
            );

        }

        this.notifyListeners();

    }

    debouncedSave() {

        if (this._saveTimer) return;

        this._saveTimer = setTimeout(() => {

            this._saveTimer = null;
            this.save();

        }, 1000);

    }

    recordActivity(filesChanged = 0, minutesCoded = 0) {

        const today = new Date().toISOString().split("T")[0];

        if (!this.data.dailyActivity[today]) {

            this.data.dailyActivity[today] = {
                filesChanged: 0,
                minutesCoded: 0
            };

        }

        this.data.dailyActivity[today].filesChanged += filesChanged;
        this.data.dailyActivity[today].minutesCoded += minutesCoded;

        this.updateStreaks();
        this.debouncedSave();

    }

    updateStreaks() {

        const dates = Object.keys(this.data.dailyActivity).sort();

        if (dates.length === 0) {

            this.data.currentStreak = 0;
            return;

        }

        // Calculate current streak from today backwards
        let streak = 0;
        const today = new Date();

        for (let i = 0; i < 365; i++) {

            const date = new Date(today);
            date.setDate(date.getDate() - i);
            const key = date.toISOString().split("T")[0];

            if (this.data.dailyActivity[key]) {

                streak++;

            } else if (i === 0) {

                // Today has no activity yet, that's ok
                continue;

            } else {

                break;

            }

        }

        this.data.currentStreak = streak;

        if (streak > this.data.bestStreak) {

            this.data.bestStreak = streak;

        }

    }

    getStats() {

        const today = new Date();
        const currentMonth = today.toLocaleString("default", {
            month: "long",
            year: "numeric"
        });

        // Build heatmap array for current month (activity levels 0-4)
        const year = today.getFullYear();
        const month = today.getMonth();
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        const heatmap = [];

        for (let day = 1; day <= daysInMonth; day++) {

            const dateKey = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
            const activity = this.data.dailyActivity[dateKey];

            if (!activity) {

                heatmap.push(0);

            } else {

                const mins = activity.minutesCoded;

                if (mins < 30) heatmap.push(1);
                else if (mins < 60) heatmap.push(2);
                else if (mins < 120) heatmap.push(3);
                else heatmap.push(4);

            }

        }

        // Count total files changed this month
        let monthlyFilesChanged = 0;

        Object.entries(this.data.dailyActivity).forEach(
            ([dateKey, activity]) => {

                if (dateKey.startsWith(
                    `${year}-${String(month + 1).padStart(2, "0")}`
                )) {

                    monthlyFilesChanged += activity.filesChanged;

                }

            }
        );

        return {

            month: currentMonth,

            trackedFolder: "C:\\Code",

            bestStreak: this.data.bestStreak,

            currentStreak: this.data.currentStreak,

            filesChanged: monthlyFilesChanged,

            heatmap

        };

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

export default new HeatmapService();
