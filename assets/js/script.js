// TODO: read user input
// TODO: validate user input
// TODO: Create variable for apikey and url
// TODO: get data from API
// TODO: create div for displaying data
// TODO: display data
// TODO: save data to local storage
// TODO: create a "recent searches" list

const apiKey = "4g4wrjxnxvv3mz2q3w7menj";
const apiUrl = "http://api.amp.active.com/v2/search?query=running&category=event&start_date=2013-07-04..&near=San%20Diego,CA,US&radius=50&api_key=sqq35zvx6a8rgmxhy9csm8qj"

fetch(apiUrl)
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error(error));

$(function () {
  $("#datepicker").datepicker();
});
