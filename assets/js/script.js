console.log("running");
const apiUrl = "http://api.openweathermap.org/data/2.5/weather";
const apiUrl2 = "http://api.openweathermap.org/data/2.5/forecast";
const APPID = "3fa7b2c1cbc30cd3a3619a313b9a2946";
// api.openweathermap.org/data/2.5/weather?q=London,uk&APPID=3fa7b2c1cbc30cd3a3619a313b9a2946
// api.openweathermap.org/data/2.5/forecast?id=524901&appid=3fa7b2c1cbc30cd3a3619a313b9a2946
// problems: 
// 1. how to clear the search that the user typed in
// 2. how to execute the search if they hit ENTER key OR click on the search icon
// 3. how to capture the value that they entered and THEN call the fetch
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
    console.log ("then response");
    return response.json();    
})
.then(function (data) {
    console.log ("data here");
    console.log(data);
    
    let idCity = data.id;
    console.log ("city name is "+data.name+" lat "+latCity+" lon "+lonCity);
    
    let fetchUrl=apiUrl2+"?id="+idCity+"&APPID="+APPID;
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
.then(function (data) {
        console.log ("data here");
        console.log(data);
})
});
}
