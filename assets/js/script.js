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
    validate user input
    retrieve validated search options
      getValues()
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
		  all currently presented events are cleared from the viewport
      if map is present, it is cleared from the viewport
        clearResults()
		  return to 2
*/

const apiKey1 = "GYyOSqBcm8hPEAfdpNrM7xPdTb9er8zT";
const apiKey2 ="AIzaSyBWKK5qEUakiyLagiIyKIw53IqPDoaqnsU"
// const url1 = `https://app.ticketmaster.com/discovery/v2/events.json?apikey=${apiKey1}`
// TODO: update hrefs - maybe make them buttons instead of links
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
        <a href="#" class="list-group-item">
          <h4 class="list-group-item-heading">Event title</h4>
          <p class="list-group-item-text">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
          <p class="venue"></p>
        </a>
        <button id="btn-1" class="button">See More!</button>
          <h4 class="list-group-item-heading">Event title</h4>
          <p class="list-group-item-text">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
          <p class="venue"></p>
        </a>
        <button id="btn-2" class="button">See More!</button>
          <h4 class="list-group-item-heading">Event title</h4>
          <p class="list-group-item-text">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
          <p class="venue"></p>
        </a>
        <button id="btn-3" class="button">See More!</button>
          <h4 class="list-group-item-heading">Event title</h4>
          <p class="list-group-item-text">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
          <p class="venue"></p>
        </a>
      </div>
    </div>
    <div class="panel-footer">
      <nav>
        <ul class="pager">
          <li id="prev" class="previous"><a href="#"><span aria-hidden="true">&larr;</span></a></li>
          <li id="next" class="next"><a href="#"><span aria-hidden="true">&rarr;</span></a></li>
        </ul>
      </nav>
    </div>
  </div>
  
  <div id='attraction-panel' class="panel panel-primary">
    <div class="panel-heading">
      <h3 class="panel-title">Attraction</h3>
    </div>
    <div id="attraction" class="panel-body">
      <h4 class="list-group-item-heading">Attraction title</h4>
      <img class="col-xs-12" src="">
      <p id="classification"></p>
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

// click event for search button
$("#btnSearch").on("click", function (event) {
  event.preventDefault();
  var values = getEvents();
  // call api to get data using values
  $("body").append(eventDisplayPanel);
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
  $(eventDisplayPanel).appendTo("main");
  $("#events-panel").show();
  $("#attraction-panel").hide();

  if (page < 0) {
    page = 0;
    return;
  }
  if (page > 0) {
    if (page > getEvents.json.page.totalPages - 1) {
      page = 0;
    }
  }

  // TODO: iterate entered parameters and add to request url (remember & before each)
  // DEBUG: entering a zipCode results in "TypeError: json._embedded is undefined"
  // DEBUG: pointing to reference in showEvents()
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

  // TODO: define buildUrl()
  // queryUrl = buildUrl();

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
      try {
        getAttraction(eventObject.data._embedded.attractions[0].id);
      } catch (err) {
        console.log(err);
      }
    });
    item = item.next();
  }
}

// TODO: remove these buttons? instead just display one big list?
$("#prev").click(function () {
  getEvents(--page);
});

$("#next").click(function () {
  getEvents(++page);
});

function getAttraction(id) {
  $.ajax({
    type: "GET",
    url:
      "https://app.ticketmaster.com/discovery/v2/attractions/" +
      id +
      ".json?apikey=5QGCEXAsJowiCI4n1uAwMlCGAcSNAEmG",
    async: true,
    dataType: "json",
    success: function (json) {
      showAttraction(json);
    },
    error: function (xhr, status, err) {
      console.log(err);
    },
  });
}

function showAttraction(json) {
  $("#events-panel").hide();
  $("#attraction-panel").show();

  $("#attraction-panel").click(function () {
    getEvents(page);
  });

  $("#attraction .list-group-item-heading").first().text(json.name);
  $("#attraction img").first().attr("src", json.images[0].url);
  $("#classification").text(
    json.classifications[0].segment.name +
      " - " +
      json.classifications[0].genre.name +
      " - " +
      json.classifications[0].subGenre.name
  );
}

function clearResults() {
  // TODO: function to clear previous search results from page upon repeated search
  // TODO: returns nothing
  // TODO: must save previous results to local storage before clearing
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
