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

const eventDisplayPanel = `
<div class="container is-fluid" id="resultsContainer">
          <div class="row">
            <div class="column is-full">
              <div id="events-panel" class="panel is-link && has-text-white && is-max-width">
                <div class="panel-heading">
                  <h2 class="panel-title && has-text-centered">Events</h2>
                </div>
                <div class="panel is-body && has-background-grey-light">
                  <div id="events" class="list-group">
                </div>
                </div>
              </div>
            </div>
          </div>
        </div>
`;

const listGroupItem = `
<div class="list-group-item pt-4 && p-1 && has-background-dark && has-text-centered">
  <h4 class="list-group-item-heading"></h4>
  <p class="list-group-item-text pr-2">
  </p>
  <p class="venue mb-2"></p>
  <br>
  <button class="button && is-link && m-2 && has-text-white"><a href="#map">Show on Map</a></button>
</div>
`;

$(function () {
  $("#datepickerFrom").datepicker();
});
$(function () {
  $("#datepickerUntil").datepicker();
});

$("#search").on("click", function () {
  showRecentSearches();
});

// NOTE: search click function is essentially the driver code
// buttons
$("#btnSearch").on("click", function (event) {
  event.preventDefault();
  //  clears output areas incase they made a search previously.
  $("#resultsContainer").remove();
  // clears out map that was previously shown.
  $("#map").empty();
  // call api to get data using values
  getEvents();
  // display results
  $(eventDisplayPanel).prependTo("#results");
  saveRecentSearch();
});

//"Clear" button element by its ID
const clearBtn = document.getElementById("btnAdd");

//Input field that needs to be cleared
const searchBox = document.getElementById("search");
const stateCode = document.getElementById("stateCode");
const radius = document.getElementById("myRadius");
const datepickerFrom = document.getElementById("datepickerFrom");
const datepickerUntil = document.getElementById("datepickerUntil");

clearBtn.addEventListener("click", () => {
  //Clears the input fields' values
  searchBox.value = "";
  stateCode.value = "";
  radius.value = "";
  datepickerFrom.value = "";
  datepickerUntil.value = "";
});

function saveRecentSearch() {
  var thisSearch = getValues().search;
  if (!Object.values(localStorage).includes(thisSearch)) {
    // TODO: add max length too
    localStorage.setItem(`activitySearch${localStorage.length}`, thisSearch);
  }
}

function showRecentSearches() {
  document.getElementById("previousSearches").innerHTML = "";
  let reverseStorage = [];
  for (let [key, value] of Object.entries(localStorage)) {
    if (key.includes("activitySearch")) {
      reverseStorage.push(value);
    }
  }
  reverseStorage = reverseStorage.reverse();
  for (const [key, value] of reverseStorage.slice((end = 10))) {
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
  const datetimeFrom = new Date($("#datepickerFrom").val());
  const datetimeUntil = new Date($("#datepickerUntil").val());
  var searchTerm = $("#search").val();
  var stateCode = $("#stateCode").val();
  var radius = $("#myRadius").val();
  var dateRange = {
    from: datetimeFrom.toISOString().split("T")[0].concat("T12:00:00Z"),
    until: datetimeUntil.toISOString().split("T")[0].concat("T23:59:00Z"),
  };
  return {
    search: searchTerm,
    stateCode: stateCode,
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

  // iterate entered parameters and add to request url (remember & before each)
  var queryParams = "";
  for (const [key, value] of Object.entries(userParams)) {
    console.log(key, value);
    if (key === "search" && value !== "") {
      queryParams += `&keyword=${value}`;
    } else if (key === "stateCode" && value !== "") {
      queryParams += `&stateCode=${value}`;
    }
    // NOTE: datepicker value is json w/ from and until keys
    else if (key === "datepicker" && value !== "") {
      queryParams += `&startDateTime=${value.from}`;
      queryParams += `&endDateTime=${value.until}`;
    }
  }

  let queryUrl =
    `https://app.ticketmaster.com/discovery/v2/events.json?apikey=${apiKey1}${queryParams}&locale=*&size=20&page=` +
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
  // add a list-group-item for each event in events
  var events = json._embedded.events;
  for (let i = 0; i < events.length; i++) {
    $("#events").append(listGroupItem);
  }
  var items = $("#events .list-group-item");
  var item = items.first();
  // iterate events and fill out event results card
  for (let i = 0; i < items.length; i++) {
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
      // if (events[i]._embedded.venues[0].images) {
      //   var img = document.createElement("img");
      //   img.src = events[i]._embedded.venues[0].images[0].url;
      //   img.alt = events[i]._embedded.venues[0].name;
      //   img.style = "width: 50%;";
      //   item.children(".venue").after(img);
      // }
      item.children(".button").after(document.createElement("hr"));

      // plot this venue on map
      item.children(".button").click(events[i], function (eventObject) {
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
  if (thisEvent.url) {
    marker.addListener("click", function () {
      window.open(thisEvent.url);
      // window.open(thisEvent._embedded.venues[0].url, "_blank");
    });
  }
}
