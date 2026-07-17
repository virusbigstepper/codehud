import SettingsService from "./settingsService.js";

class LeetcodeService {

    async getUserStats() {

        const settings = SettingsService.getSettings();
        const username = settings.leetcodeUsername;

        if (!username) {

            return {
                totalSolved: 0,
                easySolved: 0,
                mediumSolved: 0,
                hardSolved: 0,
                error: null
            };

        }

        // In Electron, use IPC to fetch from main process (avoids CORS)
        if (window.electronAPI && window.electronAPI.fetchLeetcode) {

            try {

                const result = await window.electronAPI.fetchLeetcode(username);
                return result;

            } catch (e) {

                return {
                    totalSolved: 0,
                    easySolved: 0,
                    mediumSolved: 0,
                    hardSolved: 0,
                    error: "Network error fetching LeetCode data"
                };

            }

        }

        // Browser fallback: direct fetch (may be blocked by CORS)
        return await this.fetchDirect(username);

    }

    async fetchDirect(username) {

        const query = `
            query getUserProfile($username: String!) {
                matchedUser(username: $username) {
                    username
                    submitStats: submitStatsGlobal {
                        acSubmissionNum {
                            difficulty
                            count
                            submissions
                        }
                    }
                }
            }
        `;

        try {

            const response = await fetch("https://leetcode.com/graphql", {

                method: "POST",

                headers: {
                    "Content-Type": "application/json",
                    "Referer": "https://leetcode.com"
                },

                body: JSON.stringify({
                    query,
                    variables: { username }
                })

            });

            if (!response.ok) {

                return {
                    totalSolved: 0,
                    easySolved: 0,
                    mediumSolved: 0,
                    hardSolved: 0,
                    error: `LeetCode API error: ${response.status}`
                };

            }

            const data = await response.json();

            return this.parseResponse(data);

        } catch (e) {

            return {
                totalSolved: 0,
                easySolved: 0,
                mediumSolved: 0,
                hardSolved: 0,
                error: "Network error fetching LeetCode data"
            };

        }

    }

    parseResponse(data) {

        if (!data.data || !data.data.matchedUser) {

            return {
                totalSolved: 0,
                easySolved: 0,
                mediumSolved: 0,
                hardSolved: 0,
                error: "LeetCode user not found"
            };

        }

        const submissions =
            data.data.matchedUser.submitStats.acSubmissionNum;

        let totalSolved = 0;
        let easySolved = 0;
        let mediumSolved = 0;
        let hardSolved = 0;

        for (const entry of submissions) {

            switch (entry.difficulty) {
                case "All":
                    totalSolved = entry.count;
                    break;
                case "Easy":
                    easySolved = entry.count;
                    break;
                case "Medium":
                    mediumSolved = entry.count;
                    break;
                case "Hard":
                    hardSolved = entry.count;
                    break;
            }

        }

        return {
            totalSolved,
            easySolved,
            mediumSolved,
            hardSolved,
            error: null
        };

    }

}

export default new LeetcodeService();
