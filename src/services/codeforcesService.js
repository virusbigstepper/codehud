import SettingsService from "./settingsService.js";

class CodeforcesService {

    async getStats() {

        const settings =
            SettingsService.getSettings();

        const handle =
            settings.codeforcesUsername;

        if (!handle) {

            return {
                rating: 0,
                maxRating: 0,
                rank: "Unrated"
            };
        }

        const response = await fetch(
            `https://codeforces.com/api/user.info?handles=${handle}`
        );

        const data = await response.json();

        const statusResponse = await fetch (`https://codeforces.com/api/user.status?handle=${handle}`);

        const statusData = await statusResponse.json();

        const user = data.result[0];
        const problemSet = new Set();
        statusData.result.forEach(submission =>{
            if(submission.verdict==="OK"){
                problemSet.add(`${submission.problem.contestId}-${submission.problem.index}`
                );
            }
        });

        return {
            rating: user.rating || 0,
            maxRating: user.maxRating || 0,
            rank: user.rank || "Unrated",
            problemsSolved : problemSet.size
        };
    }
}

export default new CodeforcesService();