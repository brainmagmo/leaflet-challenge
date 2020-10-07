// Store our API endpoint inside queryUrl
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"
// Perform a GET request to the query URL
d3.json(queryUrl, function(data) {
  // Once we get a response, send the data.features object to the createFeatures function
  createMap(data.features);
});

function color_f (depth) {
  if(depth < 0) {
    return "white";
  } else if (depth < 5) {
    return "gray";
  } else if (depth < 10) {
    return "black";
  } else { 
    return "red";
  }
}

function createMap(eqData) {

  // Define streetmap and darkmap layers
  var streetmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/streets-v11",
    accessToken: API_KEY
  });

  var darkmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "dark-v10",
    accessToken: API_KEY
  });

  // Define a baseMaps object to hold our base layers
  var baseMaps = {
    "Street Map": streetmap,
    "Dark Map": darkmap
  };

  // Create overlay object to hold our overlay layer

  // Create our map, giving it the streetmap and earthquakes layers to display on load


  // Create a layer control
  // Pass in our baseMaps and overlayMaps
  // Add the layer control to the map

  eqData = eqData.map(function(eq) {
    var mag = eq.properties.mag;
    var lat = eq.geometry.coordinates[1];
    var lng = eq.geometry.coordinates[0];
    var depth = eq.geometry.coordinates[2];
    //console.log(depth);
	  return L.circle([lat,lng], {
		  color: "white",
      fillColor: color_f (depth),
      radius: mag * 1000
    });
  });
  var myMap = L.map("map", {
    center: [
      32.7157, -117.1611
    ],
    zoom: 10,
    layers: [streetmap]
  });
  var overlayMaps = {
    "earthquakes": L.layerGroup(eqData)
  };
  L.control.layers(baseMaps, overlayMaps).addTo(myMap);
}
