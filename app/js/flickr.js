class FlickrClient {
    constructor(url, key) {
        this.url = url;
        this.key = key;
    }

    async SearchPhotos(tags) {
        const params = {
            method: "flickr.photos.search",
            format: "json",
            api_key: this.key,
            sort:  'interestingness-desc',
            tags: tags,
            tag_mode: 'all',
            extras: 'url_h,url_k,url_o',
            nojsoncallback: 1
        }
        const uri = addGetParams(this.url, params);
        return await FlickrClient.get(uri)
    }

    static async get(uri) {
        const response = await fetch(uri);
        if (!response.ok) throw new Error("Flickr service error");
        const data = await response.json();
        return data;
    }
}
