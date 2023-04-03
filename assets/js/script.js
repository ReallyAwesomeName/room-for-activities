// TODO: read user input
// TODO: validate user input
// TODO: Create variable for apikey and url
// TODO: get data from API
// TODO: create div for displaying data
// TODO: display data
// TODO: save data to local storage
// TODO: create a "recent searches" list

const apiKey1 = "GYyOSqBcm8hPEAfdpNrM7xPdTb9er8zT";
const url1 = "https://app.ticketmaster.com/discovery/v2/events.json?apikey=GYyOSqBcm8hPEAfdpNrM7xPdTb9er8zT"

$(function () {
  $("#datepickerFrom").datepicker();
});
$(function () {
  $("#datepickerUntil").datepicker();
});

// click event for search button
$("#btnSearch").on("click", function (event) {
  event.preventDefault();
  var values = getValues();
  // call api to get data using values
  $.ajax({});
});

// get values from the form
// return json with (element id, value) pairs
function getValues() {
  var searchTerm = $("#search").val();
  var zipCode = $("#zipCode").val();
  var radius = $("#myRadius").val();
  var dateRange = {
    from: $("#datepickerFrom").val(),
    until: $("#datepickerUntil").val(),
  };
  return {
    search: searchTerm,
    zipCode: zipCode,
    myRadius: radius,
    datepicker: dateRange,
  };
}
