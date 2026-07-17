import SettingsService from "./settingsService.js";

class GfgService {

    async getStats() {

        const settings = SettingsService.getSettings();
        const username = settings.gfgUsername;

        if (!username) {

            return {
                totalSolved: 0,
                easySolved: 0,
                mediumSolved: 0,
                hardSolved: 0,
                error: null
            };

        }

        try {

            const response = await fetch(
                `https://gfg-stats.tashif.codes/${username}/stats`
            );

            if (!response.ok) {

                return {
                    totalSolved: 0,
                    easySolved: 0,
                    mediumSolved: 0,
                    hardSolved: 0,
                    error: `GFG API error: ${response.status}`
                };

            }

            const result = await response.json();

            if (result.status !== "success" || !result.data) {

                return {
                    totalSolved: 0,
                    easySolved: 0,
                    mediumSolved: 0,
                    hardSolved: 0,
                    error: "GFG user not found"
                };

            }

            const data = result.data;

            return {
                totalSolved: data.totalSolved || 0,
                easySolved: data.byDifficulty?.easy || 0,
                mediumSolved: data.byDifficulty?.medium || 0,
                hardSolved: data.byDifficulty?.hard || 0,
                error: null
            };

        } catch (e) {

            return {
                totalSolved: 0,
                easySolved: 0,
                mediumSolved: 0,
                hardSolved: 0,
                error: "Network error fetching GFG data"
            };

        }

    }

}

export default new GfgService();
