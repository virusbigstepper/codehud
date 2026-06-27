class HeatmapService {

    getStats() {

        return {

            month: "June 2026",

            trackedFolder: "C:\\Code",

            bestStreak: 28,

            currentStreak: 3,

            filesChanged: 12,

            heatmap: [

                0,3,4,2,0,0,0,
                0,0,3,0,0,2,0,
                0,0,0,4,0,2,0,
                0,0,3,0,0,0,0,
                0,2,0,0,0,2,0,
                0,4,0,0,0,4,0,
                0,0,0,0,2,0

            ]

        };

    }

}

export default new HeatmapService();