//Search Form Vars
var searchBtn = document.getElementById('searchButton');
var cityInputEl = document.getElementById('cityInput');
var cityFormEl = document.getElementById('cityForm');
//API keys
var myKeys = '36caf7375930147c2787ae5b0d32aba2'

//get city input and load data
var searchHandler = function (event) {
    event.preventDefault();
    
    var input = cityInputEl.value.trim();
    
    if (input) {
        
        getToday(input);
        document.getElementById('weatherDiv').style.display = "block";
        document.querySelector("#cityDate").textContent = input.toUpperCase() + ' (' + date + ')'
        // cityInputEl.value = '';
    } else {
      alert('Please enter City name');
    }
};

//get date of today
var today = new Date();
var date = today.getMonth()+1 + '/' + today.getDate() + '/' + today.getFullYear();
// console.log(date)

//Get temp, humdity, wind speed for input city
function getToday(city) {

    fetch('https://api.openweathermap.org/data/2.5/weather?q=' + city + '&units=imperial&appid=' + myKeys)

        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            var tempreture = data.main.temp;
            var Humidity = data.main.humidity;
            var windSpeed = data.wind.speed;
            var dataLat = data.coord.lat
            var dataLon = data.coord.lon
            //input lon, lat of input city to get UV Index
            getUV(dataLat, dataLon)
            document.querySelector("#temp").textContent = "Tempreture: " + tempreture + String.fromCharCode()
            document.querySelector("#humid").textContent = "Humidity: " + Humidity
            document.querySelector("#wind").textContent = "Wind Speed: " + windSpeed
            // document.getElementById('description').innerHTML = description;
            console.log(tempreture, Humidity, windSpeed, dataLat, dataLon, )

        });
}

// Get UV-Index for input city
function getUV(lat, lon) {

    fetch('https://api.openweathermap.org/data/2.5/onecall?lat=' + lat + '&lon=' + lon + '&exclude=hourly,daily&appid=' + myKeys)

        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            var uvIndex = data.current.uvi;
            console.log(uvIndex)
            document.querySelector("#uvIndex").textContent = "UV Index: " + uvIndex
        });
}


cityFormEl.addEventListener('submit', searchHandler);
// languageButtonsEl.addEventListener('click', buttonClickHandler);
