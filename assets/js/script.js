// TODO: read user input
// TODO: validate user input
// TODO: Create variable for apikey and url
// TODO: get data from API
// TODO: create div for displaying data
// TODO: display data
// TODO: save data to local storage
// TODO: create a "recent searches" list

const apiKey = "GYyOSqBcm8hPEAfdpNrM7xPdTb9er8zT";
const apiUrl = "https://app.ticketmaster.com/discovery/v2/events.json?apikey=GYyOSqBcm8hPEAfdpNrM7xPdTb9er8zT"

fetch(apiUrl)
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error(error));

$(function () {
  $("#datepicker").datepicker();
});
