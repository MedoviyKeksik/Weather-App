class GeocoderClient {
    url;
    key;

    constructor(url, key) {
        this.url = url;
        this.key = key;
    }

    async forwardRequest(city, lang = 'en') {
        const params = {
            q: city,
            key: this.key,
            language: lang
        };
        const uri = addGetParams(this.url, params);
        return await GeocoderClient.get(uri);
    }

    async reverseRequest(latitude, longitude, lang = 'en') {
        const params = {
            q: latitude + '+' + longitude,
            key: this.key,
            language: lang
        };
        const uri = addGetParams(this.url, params);
        return await GeocoderClient.get(uri);
    }

    static async get(uri) {
        const response = await fetch(uri);
        if (!response.ok) throw new Error("Geocoder service error");
        const data = await response.json();
        return data;
    }
}