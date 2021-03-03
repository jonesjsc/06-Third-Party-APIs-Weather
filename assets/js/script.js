console.log("running");
apiUrl = "http://api.openweathermap.org/data/2.5/weather";
const APPID = "APPID=3fa7b2c1cbc30cd3a3619a313b9a2946";
// api.openweathermap.org/data/2.5/weather?q=London,uk&APPID=22443fc9195b77b16450ff1e7196b692



function getSearchResults () {
$(document).on("keypress", "input", function(e){
    if(e.which == 13){
        var inputVal = $(this).val();
        alert("You've entered: " + inputVal);
        // $(this).value = '';
        document.getElementById('city-search').value = '';
        console.log ("clear");
    }
    return(searchString)
});
}
var r = getSearchResults;
console.log (r);
// fetchUrl=apiUrl+"q="+searchString

// fetch('https://api.github.com/repos/nodejs/node/issues?per_page=5', {
//   method: 'GET', //GET is the default.
//   credentials: 'same-origin', // include, *same-origin, omit
//   redirect: 'follow', // manual, *follow, error
// })
//   .then(function (response) {
//     return response.json();
//   })
//   .then(function (data) {
//     console.log(data);
//   });
