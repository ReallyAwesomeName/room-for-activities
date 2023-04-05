// // TODO: read user input
// // TODO: validate user input
// // TODO: Create variable for apikey and url
// // TODO: get data from API
// // TODO: create div for displaying data
// // TODO: display data
// // TODO: save data to local storage
// // TODO: create a "recent searches" list

/* NOTE: rough outline of application flow:
1. user enters search options
2. user clicks search button:
    all currently presented events are cleared from the viewport
    if map is present, it is also cleared from the viewport
      clearResults()
    validate user input
    retrieve validated search options
      getValues() (called by getEvents())
    build ticketmaster api request url
	  call api with query parameters to recieve user-requested data
      getEvents()
	  create and place element to display that data
      showEvents()
	
	3. if user clicks an event result:
		  create map element
      place ping on map where this event is happening
      display this map
        createMap()
	
	4. user makes another search query:
		  all currently presented events are saved to local storage
      return to 2
*/

const apiKey1 = "GYyOSqBcm8hPEAfdpNrM7xPdTb9er8zT";
// const url1 = `https://app.ticketmaster.com/discovery/v2/events.json?apikey=${apiKey1}`
// TODO: maybe re-style with bulma?
const eventDisplayPanel = `
<div class="container">
  <div class="row">
    <div class="col-xs-6">
      <div id='events-panel' class="panel panel-primary">
        <div class="panel-heading">
          <h3 class="panel-title">Events</h3>
        </div>
        <div class="panel-body">
          <div id="events" class="list-group">

            <div class="list-group-item">
              <h4 class="list-group-item-heading">Event title</h4>
              <p class="list-group-item-text">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
              <p class="venue"></p>
              <button id="btn-1" class="button">See More!</button>
            </div>
            
            <div class="list-group-item">  
              <h4 class="list-group-item-heading">Event title</h4>
              <p class="list-group-item-text">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
              <p class="venue"></p>
              <button id="btn-2" class="button">See More!</button>
            </div>
              
            <div href="#" class="list-group-item">
            <h4 class="list-group-item-heading">Event title</h4>
              <p class="list-group-item-text">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
              <p class="venue"></p>
              <button id="btn-3" class="button">See More!</button>
            </div>

            <div href="#" class="list-group-item">
              <h4 class="list-group-item-heading">Event title</h4>
              <p class="list-group-item-text">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
              <p class="venue"></p>
              <button id="btn-4" class="button">See More!</button>
            </div>

          </div>
        </div>

      </div>
    </div>
  </div>
</div>
`;

$(function () {
  $("#datepickerFrom").datepicker();
});
$(function () {
  $("#datepickerUntil").datepicker();
});

// NOTE: search click function is essentially the driver code
// buttons
$("#btnSearch").on("click", function (event) {
  event.preventDefault();
  // clear output areas incase they made a search previously
  clearResults();
  // call api to get data using values
  var values = getEvents();
  // display results
  $(eventDisplayPanel).appendTo("main");
});

//"Clear" button element by its ID
const clearBtn = document.getElementById('btnAdd');

//Input field that needs to be cleared
const searchBox = document.getElementById('search');
const zipCode = document.getElementById('zipCode');
const radius = document.getElementById('myRadius');
const datepickerFrom = document.getElementById('datepickerFrom');
const datepickerUntil = document.getElementById('datepickerUntil');

clearBtn.addEventListener('click', () => {
  //Clears the input fields' values
  searchBox.value = '';
  zipCode.value = '';
  radius.value = '';
  datepickerFrom.value = '';
  datepickerUntil.value = '';
});


// get values from the form
// return json with (element id, value) pairs
function getValues() {
  // TODO: user input validation (no past dates, no letters in radius, etc.)
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

function getEvents(page = 0) {
  // parameter json to add to queryUrl as needed
  let userParams = getValues();

  // $("#events-panel").show();
  // $("#attraction-panel").hide();

  if (page < 0) {
    page = 0;
    return;
  }
  if (page > 0) {
    if (page > getEvents.json.page.totalPages - 1) {
      page = 0;
    }
  }

  // DEBUG: entering a zipCode results in "TypeError: json._embedded is undefined"
  // DEBUG: pointing to reference in showEvents()
  // iterate entered parameters and add to request url (remember & before each)
  var queryParams = "";
  for (const [key, value] of Object.entries(userParams)) {
    console.log(key, value);
    if (key === "search" && value !== "") {
      queryParams += `&keyword=${value}`;
    } else if (key === "zipCode" && value !== "") {
      queryParams += `&postalCode=${value}`;
    } else if (key === "myRadius" && value !== "") {
      queryParams += `&radius=${value}`;
    }
    // NOTE: datepicker value is json w/ from and until keys
    // TODO: implement date range selection
    //   else if (key === "datepicker" && value) {
    //   }
  }

  let queryUrl =
    `https://app.ticketmaster.com/discovery/v2/events.json?apikey=${apiKey1}${queryParams}&dmaId=200&size=4&page=` +
    page;

  $.ajax({
    type: "GET",
    url: queryUrl,
    async: true,
    dataType: "json",
    success: function (json) {
      getEvents.json = json;
      showEvents(json);
    },
    error: function (xhr, status, err) {
      console.log(err);
    },
  });
}

function showEvents(json) {
  var items = $("#events .list-group-item");
  items.hide();
  var events = json._embedded.events;
  var item = items.first();
  for (var i = 0; i < events.length; i++) {
    item.children(".list-group-item-heading").text(events[i].name);
    item
      .children(".list-group-item-text")
      .text(events[i].dates.start.localDate);
    try {
      item
        .children(".venue")
        .text(
          events[i]._embedded.venues[0].name +
            " in " +
            events[i]._embedded.venues[0].city.name
        );
    } catch (err) {
      console.log(err);
    }
    item.show();
    item.off("click");
    item.click(events[i], function (eventObject) {
      console.log(eventObject.data);
      // try {
      //   getAttraction(eventObject.data._embedded.attractions[0].id);
      // } catch (err) {
      //   console.log(err);
      // }
    });
    item = item.next();
  }
}

const apiKey2 = "AIzaSyDlW9L5B2-Q1QSaPplLy0MP4KnZQZlENfg"
// get browsers geolocation //
function getLocation() {
  if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(showPosition, showError);
  } else {
      var x = document.getElementById("location");
      x.innerHTML = "Geolocation is not supported by this browser.";
  }
}
function showPosition(position) {
  var x = document.getElementById("location");
  x.innerHTML = "Latitude: " + position.coords.latitude + "<br>Longitude: " + position.coords.longitude;
  
  var latlon = position.coords.latitude + "," + position.coords.longitude;

  $.ajax({
    type:"GET",
    url:"https://app.ticketmaster.com/discovery/v2/events.json?apikey=GYyOSqBcm8hPEAfdpNrM7xPdTb9er8zT&latlong="+latlon,
    async:true,
    dataType: "json",
    success: function(json) {
                console.log(json);
                var e = document.getElementById("events");
                e.innerHTML = json.page.totalElements + " events found.";
                showEvents(json);
                initMap(position, json);
             },
    error: function(xhr, status, err) {
                console.log(err);
             }
  });
  
}

function showError(error) {
  switch(error.code) {
      case error.PERMISSION_DENIED:
          text.innerHTML = "User denied the request for Geolocation."
          break;
      case error.POSITION_UNAVAILABLE:
          text.innerHTML = "Location information is unavailable."
          break;
      case error.TIMEOUT:
          text.innerHTML = "The request to get user location timed out."
          break;
      case error.UNKNOWN_ERROR:
          text.innerHTML = "An unknown error occurred."
          break;
  }
}


function showEvents(json) {
for(var i=0; i<json.page.size; i++) {
  $("#events").append("<p>"+json._embedded.events[i].name+"</p>");
}
}


function initMap(position, json) {
var mapDiv = document.getElementById('map');
var map = new google.maps.Map(mapDiv, {
  center: {lat: position.coords.latitude, lng: position.coords.longitude},
  zoom: 10
});
for(var i=0; i<json.page.size; i++) {
  addMarker(map, json._embedded.events[i]);
}
}

function addMarker(map, event) {
var marker = new google.maps.Marker({
  position: new google.maps.LatLng(event._embedded.venues[0].location.latitude, event._embedded.venues[0].location.longitude),
  map: map
});
marker.setIcon('http://maps.google.com/mapfiles/ms/icons/red-dot.png');
console.log(marker);
}




getLocation();


function clearResults() {
  // TODO: function to clear previous search results from page upon repeated search
  // TODO: returns nothing
  // TODO: ensure this works even when there is nothing displayed
  // TODO:    (this is called first thing when user clicks search button)
  // TODO: must save previous results (if any) to local storage before clearing
}

function showRecentSearches() {
  // TODO: function to display recent searches
  // TODO: returns nothing
  // TODO: create the element to display recent searches
  // TODO: give the element an id of "recent-searches"
  // TODO: fill element with saved searches from local storage
}

function createMap() {
  // TODO: function to place pings on a map
  // TODO: returns map element with pings
  // TODO: will need to use a map api
}
