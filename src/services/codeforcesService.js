import SettingsService from "./settingsService.js";

class CodeforcesService {

    async getStats() {

        const settings = SettingsService.getSettings();
        const handle = settings.codeforcesUsername;

        if (!handle) {

            return {
                rating: 0,
                maxRating: 0,
                rank: "Unrated",
                problemsSolved: 0,
                error: null
            };

        }

        try {

            const [infoResponse, statusResponse] = await Promise.all([

                fetch(
                    `https://codeforces.com/api/user.info?handles=${handle}`
                ),

                fetch(
                    `https://codeforces.com/api/user.status?handle=${handle}`
                )

            ]);

            if (!infoResponse.ok) {

                return {
                    rating: 0,
                    maxRating: 0,
                    rank: "Unrated",
                    problemsSolved: 0,
                    error: `Codeforces API error: ${infoResponse.status}`
                };

            }

            const data = await infoResponse.json();

            if (data.status !== "OK") {

                return {
                    rating: 0,
                    maxRating: 0,
                    rank: "Unrated",
                    problemsSolved: 0,
                    error: data.comment || "Codeforces API returned error"
                };

            }

            const user = data.result[0];

            let problemsSolved = 0;

            if (statusResponse.ok) {

                const statusData = await statusResponse.json();

                if (statusData.status === "OK") {

                    const problemSet = new Set();

                    statusData.result.forEach(submission => {

                        if (submission.verdict === "OK") {

                            problemSet.add(
                                `${submission.problem.contestId}-${submission.problem.index}`
                            );

                        }

                    });

                    problemsSolved = problemSet.size;

                }

            }

            return {
                rating: user.rating || 0,
                maxRating: user.maxRating || 0,
                rank: user.rank || "Unrated",
                problemsSolved,
                error: null
            };

        } catch (e) {

            return {
                rating: 0,
                maxRating: 0,
                rank: "Unrated",
                problemsSolved: 0,
                error: "Network error fetching Codeforces data"
            };

        }

    }

}

export default new CodeforcesService();
