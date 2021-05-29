const geocoderApiKey = '652de9696d8946f8b8c4b4a444737399';

var positionLatitude = document.querySelector(".map__latitide");
var positionLongitude = document.querySelector(".map__longitude");
var currentLocation = document.querySelector(".weather__current-location");
var currentLanguage = 'en';


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
}


async function geocoderReverse(latitude, longitude) {
    const url = 'https://api.opencagedata.com/geocode/v1/json?q=' + latitude + '+' + longitude + '&key=' + geocoderApiKey + '&limit=1&language=' + currentLanguage;
    console.log(url);
    let response = await fetch(url);
    let data = await response.json();
    return data.results[0];
}

async function geocoderForward(city) {
    const url = 'https://api.opencagedata.com/geocode/v1/json?q=' + city + '&key=' + geocoderApiKey;
    let response = await fetch(url);
    let data = await response.json();
}


// Getting position
navigator.geolocation.getCurrentPosition(setPosition)