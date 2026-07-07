import { app } from "electron";
import path from "path";
import fs from "fs";

class StorageManager {

    constructor() {

        this.dataPath = path.join(
            app.getPath("userData"),
            "data"
        );

        if (!fs.existsSync(this.dataPath)) {

            fs.mkdirSync(this.dataPath, {
                recursive: true
            });

        }

    }

    load(fileName) {

        const filePath = path.join(
            this.dataPath,
            fileName
        );

        if (!fs.existsSync(filePath)) {

            return null;

        }

        const data = fs.readFileSync(
            filePath,
            "utf-8"
        );

        return JSON.parse(data);

    }

    save(fileName, data) {

        const filePath = path.join(
            this.dataPath,
            fileName
        );

        fs.writeFileSync(
            filePath,
            JSON.stringify(data, null, 4),
            "utf-8"
        );

    }

    exists(fileName) {

        const filePath = path.join(
            this.dataPath,
            fileName
        );

        return fs.existsSync(filePath);

    }

    deleteFile(fileName) {

        const filePath = path.join(
            this.dataPath,
            fileName
        );

        if (!fs.existsSync(filePath)) {

            return;

        }

        fs.unlinkSync(filePath);

    }

}

export default new StorageManager();