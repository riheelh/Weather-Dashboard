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
// console.log(today)

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
            const {icon} = data.weather[0]
            //input lon, lat of input city to get UV Index
            getUV(dataLat, dataLon)
            document.querySelector("#temp").innerHTML = "Tempreture: " + tempreture + ' &#8457;'
            document.querySelector("#humid").innerHTML = "Humidity: " + Humidity + '%'
            document.querySelector("#wind").innerHTML = "Wind Speed: " + windSpeed + ' MPH'
            var locationIcon = document.querySelector('.weather-icon')
            
            // console.log(iconId)
            locationIcon.innerHTML = `<img src="./icons/${icon}.png">`
            
            // document.getElementById('description').innerHTML = description;
            // console.log(tempreture, Humidity, windSpeed, dataLat, dataLon, )

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
            // const {icon} = data.weather[0];
            // console.log(uvIndex)
            document.querySelector("#uvIndex").innerHTML = "UV Index: "
            document.querySelector("#uvIndex2").innerHTML = uvIndex

        });
}

function getFiveDays(cityInput) {

    fetch('https://api.openweathermap.org/data/2.5/forecast?q=' + cityInput + '&units=imperial&appid=' + myKeys)
    
    .then(function (response) {
        return response.json();
    })
    .then(function (data) {
        for (var i = 0; i < data.list.length; i++) {
            var fiveTemp = data.list[i].main.temp_max;
            var fiveHumid =  data.list[i].main.humidity;
            var fiveIcon = data.list[i].weather[0].icon;
            var fiveDT = data.list[i].dt;
            var erd = new Date(fiveDT * 1000);
            var DSAA = erd.getMonth()+1 + '/' + erd.getDate() + '/' + erd.getFullYear();
            console.log(DSAA)

        }
        
        
    })



}

getFiveDays('boston')
cityFormEl.addEventListener('submit', searchHandler);


// var unix_timestamp = 1615960800

// var erd = new Date(unix_timestamp * 1000);
// var DSAA = erd.getMonth()+1 + '/' + erd.getDate() + '/' + erd.getFullYear();
// console.log(DSAA);
