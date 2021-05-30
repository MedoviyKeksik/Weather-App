const geocoderApiKey = '652de9696d8946f8b8c4b4a444737399';
const flickrApiKey = '83c7aaecf87518d2dd68dfe430c15063';
const mapboxApiKey = 'pk.eyJ1IjoibWVkb3ZpeWtla3NpayIsImEiOiJja3BiYThtczgweTJ6MnB0NzJhd3VsdzVoIn0.lL5Au5U12jDUbbRrhUJHbA';

var positionLatitude = document.querySelector(".map__latitide");
var positionLongitude = document.querySelector(".map__longitude");
var currentLocation = document.querySelector(".weather__current-location");
var currentLanguage = 'en';
var changeBackgroundButton = document.querySelector(".control__refresh");


function prettifyDegrees(degrees) {
    let int = Math.trunc(degrees);
    let frac = Math.round((degrees - int) * 60);
    return int + '°' + frac + '\'';
}

function setPosition(position) {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;
    positionLatitude.innerHTML = "Latitude: " + prettifyDegrees(latitude);
    positionLongitude.innerHTML = "Longitude: " + prettifyDegrees(longitude);
    geocoderReverse(latitude, longitude).then(json => currentLocation.innerHTML = json.components.town + ', ' + json.components.country);
    InitMap(latitude, longitude);
}

function addGetParams(url, params) {
    let tmp = [];
    for (param in params) {
        tmp.push(param + '=' + params[param]);
    }
    for (let i = 0; i < tmp.length; i++) {
        if (i) url += '&';
        url += tmp[i];
    }
    return url;
}


async function geocoderReverse(latitude, longitude) {
    const params = {
        'q': latitude + '+' + longitude,
        'key': geocoderApiKey,
        'limit': 1,
        'language': currentLanguage
    };
    const url = addGetParams('https://api.opencagedata.com/geocode/v1/json?', params);
    let response = await fetch(url);
    let data = await response.json();
    return data.results[0];
}

async function geocoderForward(city) {
    const params = {
        'q': city,
        'key': geocoderApiKey
    };
    const url = addGetParams('https://api.opencagedata.com/geocode/v1/json?', params);
    let response = await fetch(url);
    let data = await response.json();
    return data.results[0];
}

async function getFlickrImage(tags, page = 1) {
    const params = {
        'format': 'json',
        'api_key': flickrApiKey,
        'sort':  'interestingness-desc',
        'tags': tags,
        'tag_mode': 'all',
        'extras': 'url_h,url_k,url_o',
        'nojsoncallback': 1
    }
    const url = addGetParams('https://www.flickr.com/services/rest/?method=flickr.photos.search&', params);
    let response = await fetch(url);
    let data = await response.json();
    let photoArray = data.photos.photo;
    let tries = 0;
    while (tries < 100) {
        let i = Math.round(Math.random() * photoArray.length - 1);
        if (photoArray[i].url_h != 'undefined') {
            return photoArray[i].url_h;
        }
        if (photoArray[i].url_k != 'undefined') {
            return photoArray[i].url_k;
        }
        if (photoArray[i].url_o != 'undefined') {
            return photoArray[i].url_o;
        }
        tries++;
    }
}

async function changeBackground() {
    const img = new Image();
    img.src = await getFlickrImage('city,night');
    img.onload = () => {
        document.body.style.backgroundImage = `url(${img.src})`;
    }
}

function InitMap(latitude, longitude) {
    mapboxgl.accessToken = mapboxApiKey;
    var map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/streets-v11', // style URL
        center: [longitude, latitude], // starting position [lng, lat]
        interactive: 0,
        zoom: 9 // starting zoom
    });
    var marker = new mapboxgl.Marker().setLngLat([longitude, latitude]).addTo(map);
}

// Getting position
navigator.geolocation.getCurrentPosition(setPosition);
changeBackground();

changeBackgroundButton.addEventListener('click', changeBackground);
