import SettingsService from "./settingsService.js";

class GithubService {
    async getStats(){
        const settings = SettingsService.getSettings();

        const username = settings.githubUsername;

        if(!username){
            return {
                followers: 0,
                following: 0,
                publicRepos: 0
            };
        }

        const response = await fetch(`https://api.github.com/users/${username}`);

        const data = await response.json();

        return{

            followers: data.followers || 0,
            following: data.following || 0,
            publicRepos: data.public_repos || 0
        };
    }
}

export default new GithubService();