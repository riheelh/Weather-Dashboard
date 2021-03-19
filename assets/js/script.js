//Search Form Vars
var searchBtn = document.getElementById('searchButton');
var cityInputEl = document.getElementById('cityInput');
var cityFormEl = document.getElementById('cityForm');
var forCard = document.getElementById('fiveDayCards');
var searchDivEL = document.querySelector('.searchDiv');
var historyBtnEl = document.querySelector('.historyBtn');
var cities = [];
//API keys
var myKeys = '36caf7375930147c2787ae5b0d32aba2'

//parse history items from local storage
// if (localStorage.getItem("city")) {
//     cities = JSON.parse(localStorage.getItem("city"))
//     historyItems(cities[0])
//     // getToday(cities[0])
//     // getFiveDays(cities[0])
// }

//get city input and load data
var searchHandler = function (event) {
    event.preventDefault();
    //Enter city name on search bar and trim white spaces
    var input = cityInputEl.value.trim();
    if (input) {
        //call today function
        getToday(input);
        //call 5 day forcast function
        getFiveDays(input);
        //unhide weather section 
        document.getElementById('weatherDiv').style.display = "block";
        //call history
        historyItems(input)
    } else {
        alert('Please enter City name');
    }
};

//click on history items and load data
function historyClick(e) {
    getToday(e.target.textContent);
    getFiveDays(e.target.textContent);
}

// store the city input in local storage and append the stored vale as button in left Div
function historyItems(city) {
    // console.log(cities.indexOf(city))
    //verify the city name exist in array
    if (cities.indexOf(city.toLowerCase()) == -1) {
        cities.unshift(city.toLowerCase())
    }

    //limit history items to 6 entry
    while (cities.length > 6) {
        cities.splice(cities.length - 1, 1)
    }

    // console.log(cities)
    //empty elements
    while (historyBtnEl.firstChild) {
        historyBtnEl.removeChild(historyBtnEl.firstChild)
    }

    //create history item button under search bar for pervious entered cities
    for (i = 0; i < cities.length; i++) {
        var tab = document.createElement('button');
        tab.setAttribute('class', 'history');
        let currentCity = cities[i].charAt(0).toUpperCase() + cities[i].slice(1)
        tab.textContent = currentCity
        historyBtnEl.append(tab);
        tab.addEventListener('click', historyClick);
    }

    // var getHistory =  localStorage.getItem('city')
    localStorage.setItem('city', JSON.stringify(cities));
}

//get date of today and format the today's date to mm/dd/yyyy
var today = new Date();
var date = today.getMonth() + 1 + '/' + today.getDate() + '/' + today.getFullYear();

//Get temp, humdity, wind speed for city input
function getToday(city) {

    fetch('https://api.openweathermap.org/data/2.5/weather?q=' + city + '&units=imperial&appid=' + myKeys)

        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            //append date of today beside the city name
            document.querySelector("#cityDate").textContent = city.toUpperCase() + ' (' + date + ')';
            //call the UV index function to load UV Index
            getUV(data.coord.lat, data.coord.lon)
            //append data to HTML on Today weather section
            document.querySelector("#temp").innerHTML = "Tempreture: " + data.main.temp + ' &#8457;'
            document.querySelector("#humid").innerHTML = "Humidity: " + data.main.humidity + '%'
            document.querySelector("#wind").innerHTML = "Wind Speed: " + data.wind.speed + ' MPH'
            var locationIcon = document.querySelector('.weather-icon')
            const {
                icon
            } = data.weather[0]
            locationIcon.innerHTML = `<img src="./icons/${icon}.png">`
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
            document.querySelector("#uvIndex").innerHTML = "UV Index: "
            document.querySelector("#uvIndex2").innerHTML = uvIndex
        });
}

//function to get the 5 days forcast from API and fetch as forcast cards.
function getFiveDays(cityInput) {
    $(".fiveDayCards").empty()
    fetch('https://api.openweathermap.org/data/2.5/forecast?q=' + cityInput + '&units=imperial&appid=' + myKeys)

        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            for (var i = 7; i < data.list.length; i += 7) {
                //convert the unix timestamp to date format mm/dd/yyyy
                var fiveDT = data.list[i].dt;
                var fdate = new Date(fiveDT * 1000);
                var forcastDates = fdate.getMonth() + 1 + '/' + fdate.getDate() + '/' + fdate.getFullYear();
                //create future day cards following structure <Div> P img P P <Div>
                var EL = document.createElement('div')
                var indCard = forCard.appendChild(EL).setAttribute('class', 'card-text')
                var pDate = document.createElement('p')
                var pTemp = document.createElement('p')
                var pHumid = document.createElement('p')
                var imgW = document.createElement('img')
                imgW.setAttribute('src', `./icons/${data.list[i].weather[0].icon}.png`)
                pDate.textContent = forcastDates
                pTemp.innerHTML = 'Temp: ' + data.list[i].main.temp_max + ' &#8457;'
                pHumid.innerHTML = 'Humdity: ' + data.list[i].main.humidity + '%'
                //append future days weather data in card
                EL.append(pDate, imgW, pTemp, pHumid);
            }
        })
}

//submit city input
cityFormEl.addEventListener('submit', searchHandler);