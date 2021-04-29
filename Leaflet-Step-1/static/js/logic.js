// Store our API endpoint inside queryUrl
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Perform a GET request to the query URL
var features = "";

//Function to return colors based on depth.
function getColor(d) {
  return d > 20 ? '#800026' :
         d > 15  ? '#BD0026' :
         d > 10  ? '#E31A1C' :
         d > 5  ? '#FC4E2A' :
         d > 0   ? '#FD8D3C' :
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
                    "<hr><p>" + new Date(featureData.properties.time) + "</p>");
  }
  console.log(features);
  var earthquakes = L.geoJSON(features, {
    style: {
      weight: 2,
      opacity: 1,
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
    center: [
      37.09, -95.71
    ],
    zoom: 5,
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
  "<p>Depth Greater Than 20</p>" +
  "<p>Depth Greater Than 15</p>" +
  "<p>Depth Greater Than 10</p>" +
  "<p>Depth Greater Than  5</p>" +
  "<p>Depth Greater Than  0</p>" 
].join("");

});

  







