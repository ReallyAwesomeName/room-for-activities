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
const url1 = `https://app.ticketmaster.com/discovery/v2/events.json?apikey=${apiKey1}`;
// TODO: maybe re-style with bulma?
const eventDisplayPanel = `
<div class="container is-fluid" id="resultsContainer">
          <div class="row">
            <div class="column is-full">
              <div id="events-panel" class="panel is-danger && has-text-white && is-max-width">
                <div class="panel-heading">
                  <h3 class="panel-title">Events</h3>
                </div>
                <div class="panel is-body && has-background-dark">
                  <div id="events" class="list-group">
                    <div class="list-group-item p-4 && has-background-dark">
                      <h4 class="list-group-item-heading"></h4>
                      <p class="list-group-item-text pr-2">
                      </p>
                      <p class="venue"></p>
                      <button id="btn-1" class="button is-danger m-2">Show on Map</button>
                    </div> 

                    <div class="list-group-item p-4 && has-background-dark">
                      <h4 class="list-group-item-heading"></h4>
                      <p class="list-group-item-text pr-2">
                      </p>
                      <p class="venue"></p>
                      <button id="btn-2" class="button is-danger m-2">Show on Map</button>
                    </div>

                    <div class="list-group-item p-4 && has-background-dark">
                      <h4 class="list-group-item-heading"></h4>
                      <p class="list-group-item-text pr-2">
                      </p>
                      <p class="venue"></p>
                      <button id="btn-3" class="button is-danger m-2">Show on Map</button>
                    </div>

                    <div class="list-group-item p-4 && has-background-dark">
                      <h4 class="list-group-item-heading"></h4>
                      <p class="list-group-item-text pr-2">
                      </p>
                      <p class="venue"></p>
                      <button id="btn-4" class="button is-danger m-2">Show on Map</button>
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
  // TODO: clear output areas incase they made a search previously

  // call api to get data using values
  getEvents();
  // display results
  $(eventDisplayPanel).prependTo("#results");
  saveRecentSearch();
  showRecentSearches();
});

//"Clear" button element by its ID
const clearBtn = document.getElementById("btnAdd");

//Input field that needs to be cleared
const searchBox = document.getElementById("search");
const zipCode = document.getElementById("zipCode");
const radius = document.getElementById("myRadius");
const datepickerFrom = document.getElementById("datepickerFrom");
const datepickerUntil = document.getElementById("datepickerUntil");

clearBtn.addEventListener("click", () => {
  //Clears the input fields' values
  searchBox.value = "";
  zipCode.value = "";
  radius.value = "";
  datepickerFrom.value = "";
  datepickerUntil.value = "";
});

function saveRecentSearch() {
  var thisSearch = getValues().search;
  localStorage.setItem(`activitySearch${localStorage.length}`, thisSearch);
}

function showRecentSearches() {
  for (const [key, value] of Object.entries(localStorage)) {
    if (key.includes("activitySearch")) {
      console.log(`key: ${key},`, value);
      $("#previousSearches").append(`<option value = ${value}></option>`);
    }
  }
}

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
    }
    // FIXME: THIS DOESN'T WORK
    //   else if (key === "myRadius" && value !== "") {
    //   queryParams += `&radius=${value}`;
    // }
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
  // iterate events and fill out event results card
  for (let i = 0; i < events.length; i++) {
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
      // attach image of venue to event listing
      // var img = document.createElement("img");
      // img.src = events[i]._embedded.venues[0].images[0].url;
      // img.alt = events[i]._embedded.venues[0].name;
      // item.append(img);
      // item.append(document.createElement("br"));

      // plot this venue on map
      item.show();
      item.off("click");
      // var thisButton = item.children("button");
      item.click(events[i], function (eventObject) {
        console.log(eventObject.data);
        plotEvent(events[i]);
        // try {
        //   getAttraction(eventObject.data._embedded.attractions[0].id);
        // } catch (err) {
        //   console.log(err);
        // }
      });
    } catch (err) {
      console.log(err);
    }
    item = item.next();
  }
}

async function plotEvent(thisEvent) {
  // plot this venue on map
  console.log(
    typeof parseFloat(thisEvent._embedded.venues[0].location.latitude)
  );
  // var mapDiv = $("#map");
  // target map div and initialize map in it, centered on thisEvent
  var mapDiv = document.getElementById("map");
  const { Map } = await google.maps.importLibrary("maps");
  const thisMap = new Map(mapDiv, {
    center: {
      lat: parseFloat(thisEvent._embedded.venues[0].location.latitude),
      lng: parseFloat(thisEvent._embedded.venues[0].location.longitude),
    },
    zoom: 8,
  });
  // place marker on map at thisEvent location
  const marker = new google.maps.Marker({
    position: {
      lat: parseFloat(thisEvent._embedded.venues[0].location.latitude),
      lng: parseFloat(thisEvent._embedded.venues[0].location.longitude),
    },
    map: thisMap,
    title: thisEvent._embedded.venues[0].name,
  });
  // add listener to marker linking to ticketmaster page
  marker.addListener("click", function () {
    window.open(thisEvent._embedded.venues[0].url, "_blank");
  });
}

// const apiKey2 = "AIzaSyCY1bmueAYidVBIvqA4GkRWpNYkfSBWiTQ";
