// // TODO: read user input
// // TODO: validate user input
// // TODO: Create variable for apikey and url
// // TODO: get data from API
// // TODO: create div for displaying data
// // TODO: display data
// // TODO: save data to local storage
// // TODO: create a "recent searches" list

const apiKey1 = "GYyOSqBcm8hPEAfdpNrM7xPdTb9er8zT";
// const url1 = `https://app.ticketmaster.com/discovery/v2/events.json?apikey=${apiKey1}`
// TODO: update hrefs - maybe make them buttons instead of links
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
        <a href="#" class="list-group-item">
          <h4 class="list-group-item-heading">Event title</h4>
          <p class="list-group-item-text">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
          <p class="venue"></p>
        </a>
        <a href="#" class="list-group-item">
          <h4 class="list-group-item-heading">Event title</h4>
          <p class="list-group-item-text">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
          <p class="venue"></p>
        </a>
        <a href="#" class="list-group-item">
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
`


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
  $('body').append(eventDisplayPanel);
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

var page = 0;

function getEvents(page) {

  $('body').append(eventDisplayPanel);
  $('#events-panel').show();
  $('#attraction-panel').hide();


  if (page < 0) {
    page = 0;
    return;
  }
  if (page > 0) {
    if (page > getEvents.json.page.totalPages-1) {
      page=0;
    }
  }
  
  $.ajax({
    type:"GET",
    url:`https://app.ticketmaster.com/discovery/v2/events.json?apikey=${apiKey1}&size=4&page=`+page,
    async:true,
    dataType: "json",
    success: function(json) {
          getEvents.json = json;
  			  showEvents(json);
  		   },
    error: function(xhr, status, err) {
  			  console.log(err);
  		   }
  });
}

function showEvents(json) {
  var items = $('#events .list-group-item');
  items.hide();
  var events = json._embedded.events;
  var item = items.first();
  for (var i=0;i<events.length;i++) {
    item.children('.list-group-item-heading').text(events[i].name);
    item.children('.list-group-item-text').text(events[i].dates.start.localDate);
    try {
      item.children('.venue').text(events[i]._embedded.venues[0].name + " in " + events[i]._embedded.venues[0].city.name);
    } catch (err) {
      console.log(err);
    }
    item.show();
    item.off("click");
    item.click(events[i], function(eventObject) {
      console.log(eventObject.data);
      try {
        getAttraction(eventObject.data._embedded.attractions[0].id);
      } catch (err) {
      console.log(err);
      }
    });
    item=item.next();
  }
}

$('#prev').click(function() {
  getEvents(--page);
});

$('#next').click(function() {
  getEvents(++page);
});

function getAttraction(id) {
  $.ajax({
    type:"GET",
    url:"https://app.ticketmaster.com/discovery/v2/attractions/"+id+".json?apikey=5QGCEXAsJowiCI4n1uAwMlCGAcSNAEmG",
    async:true,
    dataType: "json",
    success: function(json) {
          showAttraction(json);
  		   },
    error: function(xhr, status, err) {
  			  console.log(err);
  		   }
  });
}

function showAttraction(json) {
  $('#events-panel').hide();
  $('#attraction-panel').show();
  
  $('#attraction-panel').click(function() {
    getEvents(page);
  });
  
  $('#attraction .list-group-item-heading').first().text(json.name);
  $('#attraction img').first().attr('src',json.images[0].url);
  $('#classification').text(json.classifications[0].segment.name + " - " + json.classifications[0].genre.name + " - " + json.classifications[0].subGenre.name);
}

getEvents(page);
