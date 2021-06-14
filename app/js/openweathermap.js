class OpenweathermapClient {
    constructor(url, key) {
        this.url = url;
        this.key = key;
    }

    async getWeather(latitude, longitude, lang) {
        const params = {
            lat: latitude,
            lon: longitude,
            appid: this.key,
            units: "metric",
            lang: lang,
        }
        const uri = addGetParams(this.url + "weather?", params);
        return await OpenweathermapClient.get(uri);
    }

    async getForecast(latitude, longitude, lang) {
        const params = {
            lat: latitude,
            lon: longitude,
            appid: this.key,
            units: "metric",
            lang: lang,
        }
        const uri = addGetParams(this.url + "forecast?", params);
        return await OpenweathermapClient.get(uri);
    }

    static async get(uri) {
        const response = await fetch(uri);
        if (!response.ok) throw new Error("Failed to get weather");
        const data = await response.json();
        return data;
    }
}