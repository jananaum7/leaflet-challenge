// Initialize the Leaflet map centered over San Francisco with zoom level 5
var myMap = L.map('map').setView([37.7749, -122.4194], 5);

// Create the tile layer using OpenStreetMap tiles
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 18,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);

// Create a legend for depth color-coding
// Create a legend for depth color-coding
var legend = L.control({ position: 'bottomright' });

legend.onAdd = function () {
    var div = L.DomUtil.create('div', 'info legend');
    var labels = ['<strong>Depth (km)</strong>']; // Add title with bold text
    var depths = [0, 50, 100];
    var colors = ["green", "orange", "red"];

    // Loop through the depths and generate a label with a colored square for each range
    for (var i = 0; i < depths.length; i++) {
        labels.push(
            '<i style="background:' + colors[i] + ';"></i> ' +
            (depths[i] ? depths[i] + (depths[i + 1] ? ' - ' + depths[i + 1] : '+') : 'Less than ' + depths[1]) + ' km'
        );
    }

    // Add all labels to the div with line breaks
    div.innerHTML = labels.join('<br>');
    return div;
};

legend.addTo(myMap);

// Fetch GeoJSON data from the USGS earthquake feed
d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson").then(data => {
    data.features.forEach(feature => {
        const coords = feature.geometry.coordinates;
        const magnitude = feature.properties.mag;
        const depth = coords[2];
        const location = feature.properties.place;

        // Add a circle marker with color and size based on depth and magnitude
        L.circleMarker([coords[1], coords[0]], {
            radius: magnitude * 4, // Adjust radius based on magnitude
            fillColor: depth > 100 ? "red" : depth > 50 ? "orange" : "green", // Color based on depth
            color: "black",
            weight: 1,
            opacity: 0.7,
            fillOpacity: 0.5
        })
        .addTo(myMap)
        .bindPopup(`Location: ${location}<br>Magnitude: ${magnitude}<br>Depth: ${depth} km`)
        .on("mouseover", function() { this.openPopup(); })
        .on("mouseout", function() { this.closePopup(); });
    });
});
