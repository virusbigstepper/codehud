import GithubService from "./githubService.js";
import CodeforcesService from "./codeforcesService.js";
import LeetcodeService from "./leetcodeService.js";
import GfgService from "./gfgService.js";

class PlatformAnalyzerService {

    async getStats() {

        const [github, codeforces, leetcode, gfg] = await Promise.all([

            GithubService.getStats(),
            CodeforcesService.getStats(),
            LeetcodeService.getUserStats(),
            GfgService.getStats()

        ]);

        const errors = [];

        if (github.error) errors.push(github.error);
        if (codeforces.error) errors.push(codeforces.error);
        if (leetcode.error) errors.push(leetcode.error);
        if (gfg.error) errors.push(gfg.error);

        return {

            githubRepos:
                github.publicRepos,

            codeforcesRating:
                codeforces.rating,

            codeforcesSolved:
                codeforces.problemsSolved,

            codeforcesRank:
                codeforces.rank,

            leetcodeSolved:
                leetcode.totalSolved,

            gfgSolved:
                gfg.totalSolved,

            errors: errors.length > 0 ? errors : null

        };

    }

}

export default new PlatformAnalyzerService();
