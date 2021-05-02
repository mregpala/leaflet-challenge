// Store our API endpoint inside queryUrl
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Perform a GET request to the query URL
var features = "";

//Function to return colors based on depth.
function getColor(d) {
  return d > 20 ? '#e73d0a' :
         d > 15  ? '#e7a00a' :
         d > 10  ? '#dfe70a' :
         d > 5  ? '#acff0a' :
         d > 0   ? '#155803' :
                   '#FFEDA0';
};

//Grab GeoJson Data from USGS website and build map components.
d3.json(queryUrl).then(function(response) {
  // Once we get a response, send the data.features object to the createFeatures function
  

  features = response.features;

  function onEachFeature(featureData, layer) {
    layer.bindPopup("<h3>" + featureData.properties.place + "</h3>" +
                    "<h3>Magnitude: " + featureData.properties.mag + ", Depth: " +
                    featureData.geometry.coordinates[2] + "</h3>" +
                    "<h3>Coordinates: " + featureData.geometry.coordinates[1] + ", " + featureData.geometry.coordinates[0] + "</h3>" +
                    "<hr><p>" + new Date(featureData.properties.time) + "</p>");
  }
  console.log(features);
  var earthquakes = L.geoJSON(features, {
    style: {
      weight: 2,
      opacity: .7,
      color: "#666",
      dashArray: '3',
      fillOpacity: 0.7         
      },
    onEachFeature: onEachFeature,
    pointToLayer: (featureData, latlng) => 
    {
    //   return L.marker(latlng)    
      return L.circle(latlng,
        {radius: featureData.properties.mag*100,
         fillColor:getColor(featureData.geometry.coordinates[2]) }
        )
    }

  });
  
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
  var overlayMaps = {
    Earthquakes: earthquakes
  };

  // Create our map, giving it the streetmap and earthquakes layers to display on load
  var myMap = L.map("map", {
    center: [61.2912,-149.9096],
    zoom: 10,
    layers: [streetmap, earthquakes]
  });

//create Layer Control
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);


// When the layer control is added, insert a div with the class of "legend"
// Create a legend to display information about our map
var info = L.control({
  position: "bottomright"
});


info.onAdd = function() {
  var div = L.DomUtil.create("div", "legend");
  return div;
};
// Add the info legend to the map
info.addTo(myMap);

document.querySelector(".legend").innerHTML = [
  "<h3>Depth</h3><hr>" +
  "<ul class=\"no-bullets\">" +
    "<li><span class=\"gtr20\"></span>Greater Than 20</li>" +
    "<li><span class=\"gtr15\"></span>Greater Than 15</li>" +
    "<li><span class=\"gtr10\"></span>Greater Than 10</li>" +
    "<li><span class=\"gtr5\"></span>Greater Than  5</li>" +
    "<li><span class=\"gtr0\"></span>Greater Than  0</li>" +
  "</ul>"
].join("");


});

  







