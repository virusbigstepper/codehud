class StorageService {

    saveData(key, data) {
        localStorage.setItem(
            key,
            JSON.stringify(data)
        );
    }

    loadData(key) {

        const data = localStorage.getItem(key);

        if (!data) {
            return null;
        }

        return JSON.parse(data);
    }
}

export default StorageService;