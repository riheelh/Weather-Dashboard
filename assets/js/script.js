var myKeys;

function getToday(city) {
  
  fetch('https://api.openweathermap.org/data/2.5/weather?q=' + city + '&units=imperial&appid=' + myKeys)
    
    .then(function(response) {
      return response.json();
    })
    .then(function (data) {
      console.log(data);
    });
}

getToday('boston')