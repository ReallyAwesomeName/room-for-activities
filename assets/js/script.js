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
const url1 = `https://app.ticketmaster.com/discovery/v2/events.json?apikey=${apiKey1}`
// TODO: maybe re-style with bulma?
const eventDisplayPanel = `
<div class="container is-max-width">
          <div class="row">
            <div class="column is-full">
              <div id="events-panel" class="panel is-danger && has-text-white && has-background-dark">
                <div class="panel-heading">
                  <h3 class="panel-title">Events</h3>
                </div>
                <div class="panel is-body">
                  <div id="events" class="list-group">
                    <div class="list-group-item pt-4 && pl-2">
                      <h4 class="list-group-item-heading">Event title</h4>
                      <p class="list-group-item-text pr-2">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                        sed do eiusmod tempor incididunt ut labore et dolore
                        magna aliqua.
                      </p>
                      <p class="venue"></p>
                      <button id="btn-1" class="button is-danger">Show on Map</button>
                    </div> 

                    <div class="list-group-item pt-4 && pl-2">
                      <h4 class="list-group-item-heading">Event title</h4>
                      <p class="list-group-item-text pr-2">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                        sed do eiusmod tempor incididunt ut labore et dolore
                        magna aliqua.
                      </p>
                      <p class="venue"></p>
                      <button id="btn-2" class="button is-danger">Show on Map</button>
                    </div>

                    <div href="#" class="list-group-item pt-4 && pl-2">
                      <h4 class="list-group-item-heading">Event title</h4>
                      <p class="list-group-item-text pr-2">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                        sed do eiusmod tempor incididunt ut labore et dolore
                        magna aliqua.
                      </p>
                      <p class="venue"></p>
                      <button id="btn-3" class="button is-danger">Show on Map</button>
                    </div>

                    <div href="#" class="list-group-item py-4 && pl-2">
                      <h4 class="list-group-item-heading">Event title</h4>
                      <p class="list-group-item-text pr-2">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                        sed do eiusmod tempor incididunt ut labore et dolore
                        magna aliqua.
                      </p>
                      <p class="venue"></p>
                      <button id="btn-4" class="button is-danger">Show on Map</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
`;

const mapDisplayPanel = `
<div>
<p id="location">location there</p>
<div id="map"></div>
<div id="events"></div>
</div>`;

`<iframe
width="600"
height="450"
style="border:0"
loading="lazy"
allowfullscreen
referrerpolicy="no-referrer-when-downgrade"
src="https://www.google.com/maps/embed/v1/place?key=AIzaSyDlW9L5B2-Q1QSaPplLy0MP4KnZQZlENfg
&q=,Westville+NJ">
</iframe>`;






// TODO: function to display recent searches



//.map( (search) => {
// return `<option value = ${search}> </option>`.join("")




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
    $(eventDisplayPanel).prependTo("#results");
    saveRecentSearch();
    showRecentSearches();
  });
  
  $("#btn-1").on("click", function (event) {
  event.preventDefault();
  $("#map").show();
  $(eventDisplayPanel).appendTo("main");
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

function saveRecentSearch(){
  var thisSearch = getValues().search;
  localStorage.setItem(`activitySearch${localStorage.length}`,thisSearch);
}

function showRecentSearches(){
  for (const [key,value] of Object.entries(localStorage)){
    if (key.includes("activitySearch")){
      console.log(`key: ${key},`, value);
      $("#previousSearches").append(`<option value = ${value}></option>`);
      
    }
  }
}

// function showRecentSearches() {
//   var thisSearch = getValues();
//   const recentSearches = (localStorage.getItem('search'));
//   localStorage.setItem('search',JSON.stringify(recentSearches));
//   const previousSearch = document.getElementById('previousSearches');
//   recentSearches += thisSearch.search;

//   recentSearches.forEach(function(search) {
//     previousSearch.innerHTML += `<option value = ${search}> </option>`
//   })
//   // previousSearch.innerHTML =  `<option value = ${recentSearches}> </option>`
// }

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
      queryParams += `&postalCode=${value}`;} 
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
  
  const apiKey2 = "AIzaSyCY1bmueAYidVBIvqA4GkRWpNYkfSBWiTQ";
  
  // add markers for each event to the `params` object
  
  
  // append the image element to the map display panel
  // $(mapDisplayPanel).append(img);
  
  /* Radius Slider
  function updateRadiusLabel() {
    var radius = document.getElementById("myRadius").value;
    var label = document.getElementById("radiusLabel");
    label.innerHTML = radius + " miles";
  }*/
  
  function clearResults() {
    // TODO: function to clear previous search results from page upon repeated search
    // TODO: returns nothing
    // TODO: ensure this works even when there is nothing displayed
    // TODO:    (this is called first thing when user clicks search button)
    // TODO: must save previous results (if any) to local storage before clearing
  }


 // Initialize the map when the page is loaded
    // Create a map centered on San Francisco
  //   const createMap = new google.maps.Map(document.getElementById('map'), {
  //     center: { lat: 37.7749, lng: -122.4194 },
  //     zoom: 12
  //   });
    
  // // Add a marker at a random location
  // const randomLat = Math.random() * (37.8 - 37.7) + 37.7;
  // const randomLng = Math.random() * (-122.3 - -122.4) + -122.4;
  // const latLng = new google.maps.LatLng(randomLat, randomLng);
  // const marker = new google.maps.Marker({
  //   position: latLng,
  //   map: createMap,
  //   title: 'Hello World!'
  // });

  const createMap = new google.maps.Map(document.getElementById('map'), {
    center: { lat: 37.7749, lng: -122.4194 },
    zoom: 12
  });
  
  const apiUrl = `https://app.ticketmaster.com/discovery/v2/events.json?apikey=${apiKey1}&latlong=50.889,-122.9994`;
  
  fetch(apiUrl)
    .then(response => response.json())
    .then(data => {
      // Loop through the events and create a marker for each one
      data._embedded.events.forEach(event => {
        const latLng = new google.maps.LatLng(event._embedded.venues[0].location.latitude, event._embedded.venues[0].location.longitude);
  
        const marker = new google.maps.Marker({
          position: latLng,
          map: createMap,
          title: event.name
        });
      });
    })
    .catch(error => {
      console.error('Error fetching event data from Ticketmaster API:', error);
    });

  // function createMap() {
  // TODO: function to place pings on a map
  // TODO: returns map element with pings
  // TODO: will need to use a map api


