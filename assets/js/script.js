console.log("running");
const apiUrl = "http://api.openweathermap.org/data/2.5/weather";
const apiUrl2 = "http://api.openweathermap.org/data/2.5/forecast";
const apiUrl3 = "https://api.openweathermap.org/data/2.5/onecall";
const APPID = "3fa7b2c1cbc30cd3a3619a313b9a2946";
// api.openweathermap.org/data/2.5/weather?q=London,uk&APPID=3fa7b2c1cbc30cd3a3619a313b9a2946
// api.openweathermap.org/data/2.5/forecast?id=524901&appid=3fa7b2c1cbc30cd3a3619a313b9a2946
// https://api.openweathermap.org/data/2.5/onecall?lat={lat}&lon={lon}&exclude={part}&appid={API key}
// https://api.openweathermap.org/data/2.5/onecalllat=35.2271&lon=-80.8431&APPID=3fa7b2c1cbc30cd3a3619a313b9a2946
// problems: 
// 1. how to execute the search if they hit ENTER key OR click on the search icon
//
function getSearchResults () {
$(document).on("keypress", "input", function(e){
    if(e.which == 13){
        var inputVal = $(this).val();
        searchWeather (inputVal);
        // alert("You've entered: " + inputVal);
        // $(this).value = '';
        $(this).val('');
        console.log ("clear");
    }
    // return(searchString)
    })
};

getSearchResults();
myInterface();

var searchString = "rock hill";
var latCity;
var lonCity;
var idCity;
var humidity;
var windspeed;
var UVindex;
var fiveDay = [] // date cloud temp humidity
 
function searchWeather (searchString) {
    let fetchUrl=apiUrl+"?q="+searchString+"&APPID="+APPID;

    var array = fetch (fetchUrl, {
        method: 'GET', //GET is the default.
        credentials: 'same-origin', // include, *same-origin, omit
        redirect: 'follow', // manual, *follow, error
    })
    .then(function (response) {
        return response.json();    
    })
    .then(function (data) {
        console.log(data);  
        
        // moment(timestamp, 'X').format('lll')
        
        // console.log ("currentData is"+currentDate);
        let idCity = data.id;
        let latCity = data.coord.lat;
        let lonCity = data.coord.lon;
        console.log ("city name is "+data.name+" lat "+latCity+" lon "+lonCity);
        
        // let fetchUrl=apiUrl2+"?id="+idCity+"&APPID="+APPID;
        let fetchUrl=apiUrl3+"?lat="+latCity+"&lon="+lonCity+"&units=imperial&APPID="+APPID;
    console.log (fetchUrl);
        var array = fetch (fetchUrl, {
            method: 'GET', //GET is the default.
            credentials: 'same-origin', // include, *same-origin, omit
            redirect: 'follow', // manual, *follow, error
        })
    .then(function (response) {
            console.log ("then response");
            return response.json();    
    })
    .then(function (data2) {
            console.log ("data here");
            console.log(data2);

            // current weather
            // current weather icon 
            console.log("ICON "+data2.current.weather[0].icon);
            let iconUrl="http://openweathermap.org/img/wn/"+data2.current.weather[0].icon+"@2x.png";
            console.log (iconUrl);

            $("#first-run-placeholder").hide();
            // ${moment(data2.daily[0].dt, 'X').format('LL')}

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
                Wind Speed:${Math.round(data2.current.wind_speed)} MPH<br>
                UV Index: <span class="${uvClass}">&nbsp;&nbsp;&nbsp;${data2.current.uvi}&nbsp;&nbsp;&nbsp;</span>
            </div>
            `);

            $("#five-day-forecast").html(``);
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



            
    })
    });
}

function myInterface () {

    //Search box historyu stuff

    $("#search-history").append(` 
        <div>
            <button class="button makeit-100">
                Javascript did this
            </button>
        </div>
    `);


// display the current forecast

// $("#current-weather").append(` 
// <div>
//     Current Weather Goes Here says Javascript
// </div>
// `);


// display the five day forecast

// for (let i = 0; i < 5; i++ ) {
// $("#five-day-forecast").append(` 
//     <div class="card">
//         <div class="card-content">
//             <div class="content">
//                 Date<br>
//                 Icon<br>
//                 Temp:<br> 
//                 Humidity:
//             </div>
//         </div>
//     </div>
// `);
// }

}