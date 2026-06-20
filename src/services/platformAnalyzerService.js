import GithubService from "./githubService.js";
import CodeforcesService from "./codeforcesService.js";

class PlatformAnalyzerService {

    async getStats() {

        const github =
            await GithubService.getStats();

        const codeforces =
            await CodeforcesService.getStats();

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
                246, // mock for now
            
            gfgSolved:
                8
        };
    }
}

export default new PlatformAnalyzerService();