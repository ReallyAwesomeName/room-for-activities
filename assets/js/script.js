var slider = document.getElementById("myRadius");
var output = document.getElementById("demo");

// Update the current slider value (each time you drag the slider handle)
slider.oninput = function() {
  output.innerHTML = this.value;
}

$( function() {
  $( "#datepicker" ).datepicker();
} );