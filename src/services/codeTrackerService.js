class CodeTrackerService {
    constructor(){
        this.stats = JSON.parse(
            localStorage.getItem("codingStats")
        ) || {
            codingTimeMinutes : 0,
            filesChanged: 0
        };
    }

    save(){
        localStorage.setItem(
            "codingStats",
            JSON.stringify(this.stats)
        );
    }

    getStats(){
        const TotalMinutes = this.stats.codingTimeMinutes || 0;
        const hours = Math.floor(
            this.stats.codingTimeMinutes /60
        );
        const minutes = this.stats.codingTimeMinutes % 60;

        return{
            codingTime: `${hours} H ${minutes} M`,
            filesChanged: this.stats.filesChanged,
            codingTimeMinutes: this.stats.codingTimeMinutes,

            languagesUsed: [
            "React",
            "JavaScript",
            "Python",
            "TypeScript",
            "C++"
            ]
        };
    }

    incrementFileChanged(){
        this.stats.filesChanged += 1;
        this.save();
    }

    addCodingMinutes(minutes){
        this.stats.codingTimeMinutes += minutes;
        this.save();
    }

    resetStats() {
        this.stats = {
        codingTimeMinutes: 0,
        filesChanged: 0
        };

        this.save();
    }
}

export default new CodeTrackerService();