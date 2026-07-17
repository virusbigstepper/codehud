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

            // submissions is an array like:
            // [{ difficulty: "All", count: X }, { difficulty: "Easy", count: Y }, ...]
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

}

export default new LeetcodeService();
