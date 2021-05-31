const geocoderApiKey = '652de9696d8946f8b8c4b4a444737399';
const flickrApiKey = '83c7aaecf87518d2dd68dfe430c15063';
const mapboxApiKey = 'pk.eyJ1IjoibWVkb3ZpeWtla3NpayIsImEiOiJja3BiYThtczgweTJ6MnB0NzJhd3VsdzVoIn0.lL5Au5U12jDUbbRrhUJHbA';
const openweathermapApiKey = '30c15b7a3a24e78c3e199d9d7a6d68d7';

var positionLatitude = document.querySelector(".map__latitude");
var positionLongitude = document.querySelector(".map__longitude");
var currentLocation = document.querySelector(".weather__current-location");
var degrees = document.querySelectorAll(".weather__degrees");
var currentDescription = document.querySelector(".weather__type");
var currentFeelsLike = document.querySelector(".weather__feels-like"); 
var currentHumidity = document.querySelector(".weather__humidity");
var currentWind = document.querySelector(".weather__wind");
var icons = document.querySelectorAll(".weather__icon");
var weatherWeekdays = document.querySelectorAll(".weather__day-title");
var searchButton = document.querySelector(".control__search-button");
var searchInput = document.querySelector(".control__input-city");

var currentLanguage = 'en';
var changeBackgroundButton = document.querySelector(".control__refresh");
var currentCity;
var currentTime = document.querySelector(".weather__current-time");
var deltaTimezone;
var currentUnits = 'metric';

const weekday = {
    en: [
        'Sunday',
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturnday'
    ],
    ru: [
        'Воскресенье',
        'Понедельник',
        'Вторник',
        'Среда',
        'Четверг',
        'Пятница',
        'Суббота'
    ]
}


function prettifyDegrees(degrees) {
    let int = Math.trunc(degrees);
    let frac = Math.round((degrees - int) * 60);
    return int + '°' + frac + '\'';
}


function updateAll(latitude, longitude) {
    positionLatitude.innerHTML = "Latitude: " + prettifyDegrees(latitude);
    positionLongitude.innerHTML = "Longitude: " + prettifyDegrees(longitude);
    geocoderReverse(latitude, longitude).then(json => {
        currentCity = json.components.town || json.components.city || json.components.county;
        currentLocation.innerHTML = currentCity + ', ' + json.components.country;
    });
    InitMap(latitude, longitude);
    getCurrentWeather(latitude, longitude, currentUnits, currentLanguage)
    .then(updateTime())
    .then(getWeatherForecast(latitude, longitude, currentUnits, currentLanguage));
}

function setPosition(position) {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;
    updateAll(latitude, longitude);
}

function updateTime() {
    const time = new Date();;
    const format = {
        hour12: false,
        weekday: "short",
        day: "numeric",
        month: "long",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit"
    }
    currentTime.innerHTML = time.toLocaleString(currentLanguage, format).split(',').join('');
    setTimeout(updateTime, 1000);   
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
    changeBackgroundButton.disable = true;
    getFlickrImage('city,night')
    .then(url => img.src = url)
    .then(() => {
        img.onload = () => {
            document.body.style.backgroundImage = `url(${img.src})`;
            setTimeout(() => changeBackgroundButton.disable = false, 500);
        }
    });
}

async function getCurrentWeather(latitude, longitude, units, lang) {
    const params = {
        lat: latitude,
        lon: longitude,
        appid: openweathermapApiKey,
        units: units,
        lang: lang,
    }
    const url = addGetParams('https://api.openweathermap.org/data/2.5/weather?', params);
    const res = await fetch(url);
    const data = await res.json();
    console.log(data);
    if (data.cod === 200) {
        degrees[0].innerHTML = Math.round(data.main.temp) + '°';
        icons[0].classList.add(`owf-${data.weather[0].id}`);
        currentDescription.innerHTML = data.weather[0].description;
        currentFeelsLike.innerHTML = 'feels like: ' + Math.round(data.main.feels_like) + '°';
        currentWind.innerHTML = 'wind: ' + Math.round(data.wind.speed) + ' m/s';
        currentHumidity.innerHTML = 'humidity: ' + data.main.humidity + '%';
        deltaTimezone = new Date(data.dt * 1000) - new Date();
    }
}

async function getWeatherForecast(latitude, longitude, units, lang) {
    const params = {
        lat: latitude,
        lon: longitude,
        appid: openweathermapApiKey,
        units: units,
        lang: lang,
    }
    const url = addGetParams('https://api.openweathermap.org/data/2.5/forecast?', params);
    const res = await fetch(url);
    const data = await res.json(); 
    const filteredData = data.list.filter((reading) => reading.dt_txt.includes("18:00:00") && reading.dt * 1000 - new Date() >= 64800000);
    if (data.cod === "200") {
        for (let i = 1; i < 4; i++) {
            degrees[i].innerHTML = Math.round(filteredData[i - 1].main.temp) + '°';
            icons[i].classList.add(`owf-${filteredData[i - 1].weather[0].id}`);
            let day = new Date(filteredData[i - 1].dt * 1000);
            weatherWeekdays[i - 1].innerHTML = weekday[currentLanguage][day.getDay()];
        }
    } else {
        alert('Weather not found!');        
    }
}

function InitMap(latitude, longitude) {
    mapboxgl.accessToken = mapboxApiKey;
    var map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/streets-v11',
        center: [longitude, latitude], 
        interactive: 1,
        zoom: 9
    });
    var marker = new mapboxgl.Marker().setLngLat([longitude, latitude]).addTo(map);
}

function changeCity(e) {
    if (e.type === 'keypress') {
        if (e.which == 13 || e.keyCode == 13) {
            if (searchInput.value == '') return alert("Empty query");
            currentCity = searchInput.value;
            geocoderForward(currentCity)
            .then(json => {
                if (typeof(json) == 'undefined') alert("City not found");
                else updateAll(json.geometry.lat, json.geometry.lng);
            });
        }
    }
    if (e.type === 'click') {
        if (searchInput.value == '') return alert("Empty query");
        currentCity = searchInput.value;
        geocoderForward(currentCity)
        .then(json => {
            if (typeof(json) == 'undefined') alert("City not found");
            else updateAll(json.geometry.lat, json.geometry.lng);
        });
    }
}

// Getting position
navigator.geolocation.getCurrentPosition(setPosition);
document.addEventListener('DOMContentLoaded', changeBackground());
changeBackgroundButton.addEventListener('click', changeBackground);
searchButton.addEventListener('click', changeCity);
searchInput.addEventListener('keypress', changeCity);