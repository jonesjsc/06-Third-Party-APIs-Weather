const apiUrl = "https://api.openweathermap.org/data/2.5/weather";
const apiUrl3 = "https://api.openweathermap.org/data/2.5/onecall";
const APPID = "3fa7b2c1cbc30cd3a3619a313b9a2946";
//
// api.openweathermap.org/data/2.5/weather?q=London,uk&APPID=3fa7b2c1cbc30cd3a3619a313b9a2946
// api.openweathermap.org/data/2.5/forecast?id=524901&appid=3fa7b2c1cbc30cd3a3619a313b9a2946
// https://api.openweathermap.org/data/2.5/onecall?lat={lat}&lon={lon}&exclude={part}&appid={API key}
// https://api.openweathermap.org/data/2.5/onecalllat=35.2271&lon=-80.8431&APPID=3fa7b2c1cbc30cd3a3619a313b9a2946
//
const maxSearchHistory = 5 // this is the number of unique searches savewd to localstorage and the search window

//
// lets setup local storage and related array
//

if (localStorage.getItem("MY_WEATHER_APP_SEARCH_HISTORY") === null) {
    var searchHistory = [];
    localStorage.setItem("MY_WEATHER_APP_SEARCH_HISTORY", JSON.stringify(searchHistory));
} else {
    var searchHistory = JSON.parse(localStorage.getItem("MY_WEATHER_APP_SEARCH_HISTORY"));
}

//
// listener for the ENTER KEY so you can type your search and hit ENTER
//

function getSearchResults () {
    $(document).on("keypress", "input", function(e){
        if(e.which == 13){
            var inputVal = $(this).val();
            searchWeather (inputVal);
            $(this).val('');
        }
    })
};

//
// click listener on the search history buttons
//

$("#search-history").click(function(e) {
    searchWeather ($(e.target).text().trim());
});


getSearchResults();

var searchString = "rock hill";
var latCity;
var lonCity;
var humidity;
var windspeed;
var UVindex;
var fiveDay = [] // date cloud temp humidity
 
searchWeather("Rock Hill");

function searchWeather (searchString) {

    let fetchUrl=apiUrl+"?q="+searchString+"&APPID="+APPID;

    //
    // this is the first fetch - we get lat and lon from this fetch
    //

    var array = fetch (fetchUrl, {
        method: 'GET', //GET is the default.
        credentials: 'same-origin', // include, *same-origin, omit
        redirect: 'follow', // manual, *follow, error
    })
    .then(function (response) {
        return response.json();    
    })
    .then(function (data) {       
        let latCity = data.coord.lat;
        let lonCity = data.coord.lon;   
        let fetchUrl=apiUrl3+"?lat="+latCity+"&lon="+lonCity+"&units=imperial&APPID="+APPID;
    
        //
        // this is the subsequent fetch to get 5 day, and current uv
        //

        var array = fetch (fetchUrl, {
            method: 'GET', //GET is the default.
            credentials: 'same-origin', // include, *same-origin, omit
            redirect: 'follow', // manual, *follow, error
        })
    .then(function (response) {
            return response.json();    
    })
    .then(function (data2) {
            //
            // there is some formatting that operweathermap does on the search string, so lets ride that 
            // and set what we display based on what the city name we get back
            //
            var searchString2 = data.name; 
            let iconUrl="http://openweathermap.org/img/wn/"+data2.current.weather[0].icon+"@2x.png";

            //
            // let's write out the current weather
            //

            $("#current-weather").html(`
            <div class="title is-4">
                ${data.name} (${moment(data2.daily[0].dt, 'X').format('LL')}) 
                <img src=${iconUrl} alt="Weather Icon" class="smaller-icon">
            </div>
            `);

            //
            // What were doing here is color coding the UV Index.  Here's how
            // First lets build an array called uvScale and in index 0 and 1 will be the class name for green
            // in that array we'll put yellow in 2 3 4, and 5 thru 10 will be red.
            // Then - we're gonna round the actual current uvi, and then just use that as the index on the 
            // array for the class name
            //

            var uvScale = ["uvi-green", "uvi-green", "uvi-yellow", "uvi-yellow", "uvi-yellow", "uvi-red", "uvi-red", "uvi-red", "uvi-red", "uvi-red", "uvi-red"];
            var uvClass = uvScale[Math.round(data2.current.uvi)];
        
            $("#current-weather").append(`
            <div>
                Temperature: ${Math.round(data2.current.temp)} &#8457<br>
                Humidify: ${data2.current.humidity} %<br>
                Wind Speed: ${Math.round(data2.current.wind_speed)} MPH<br>
                UV Index: <span class="${uvClass}">&nbsp;&nbsp;&nbsp;${data2.current.uvi}&nbsp;&nbsp;&nbsp;</span>
            </div>
            `);

            //
            // let's start by clearing out the five day forecast block
            //

            $("#five-day-forecast").html(``);

            //
            // since we only want 5 days, and since index 0 is the current day, lets
            // loop 1 through 6
            //

            for (let i = 1; i < 6; i++ ) {
                $("#five-day-forecast").append(` 
                    <div class="card">
                        <div class="card-content">
                            <div class="content">
                                <div class="is-size-6">
                                    ${moment(data2.daily[i].dt, 'X').format('L')}<br>
                                </div>
                                <div class="">
                                    <img src="http://openweathermap.org/img/wn/${data2.daily[i].weather[0].icon}@2x.png" alt="Weather Icon" class="smaller-icon"><br>
                                </div>
                                <div class="is-size-7">
                                    Temp: ${Math.round(data2.daily[i].temp.day)} &#8457<br>
                                    Humidity: ${data2.daily[i].humidity} %
                                </div>
                            </div>
                        </div>
                    </div>
                `);
                }
                
                //
                // let's load the LOCAL STORAGE search history
                //

                var searchHistory = JSON.parse(localStorage.getItem("MY_WEATHER_APP_SEARCH_HISTORY"));

                //
                // It looks dumb to keep up with the same search multiple times, so lets unshift only unique searches
                //
                if(jQuery.inArray(searchString2, searchHistory) == -1) {
                    searchHistory.unshift(searchString2);
                } 
                else {
                    searchHistory.splice(jQuery.inArray(searchString2, searchHistory),1);
                    // then put it back on at the top
                    searchHistory.unshift(searchString2);
                }

                //
                // We cant keep everything - so lets just keep maxSearchHistory number of historical searches
                //

                if (searchHistory.length > maxSearchHistory) {
                    searchHistory.pop();
                }
                
                //
                // Update local storage with current searchHistory
                //

                localStorage.setItem("MY_WEATHER_APP_SEARCH_HISTORY", JSON.stringify(searchHistory));

                //
                // render the search history box by first clearing the search history box out
                //

                $("#search-history").html(``);

                //
                // lets loop through all the elements in the searchHistory array and render the search box
                //

                searchHistory.forEach(function(searchItem) {
                    $("#search-history").append(` 
                    <div>
                        <button class="button makeit-100">
                            ${searchItem}
                        </button>
                    </div>`);
                });  
        })
    });
}