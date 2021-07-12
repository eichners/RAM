// START MAP HERE

let initial_position = [40.632, -73.923];
let initial_zoom = 10;
var map = L.map('map').setView(initial_position, initial_zoom);

//let tileURL = 'https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw'
let tileURL = 'https://api.mapbox.com/styles/v1/eichners/cjp2020t41o7k2snzc9l82rpu/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1IjoiZWljaG5lcnMiLCJhIjoiY2lrZzVneDI4MDAyZ3VkbTZmYWlyejUzayJ9.vEGckM-D3AjV4jXmdibXyw'
//https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}

L.tileLayer(tileURL, {
    maxZoom: 18,
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, ' + 'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    id: 'mapbox/light-v9',
    tileSize: 512,
    zoomOffset: -1,
}).addTo(map);

map.removeControl(map.zoomControl)

L.control.zoom({
    position: 'topright'
}).addTo(map)

//Add Home Button
L.easyButton('<i class="material-icons" style="font-size:18px;padding-bottom: 3px; display: inline-flex; vertical-align: middle;">home</i>', function(btn, map) {
    map.flyTo(initial_position, initial_zoom);
}, 'Zoom To Home').addTo(map);

let map_orange = "#f4a261";
let map_blue = "#62A4D6";
let map_green = "#93C15C";

// -----------------------------------------   FUNCTIONS  -------------------------------------------------
// Prepare Pop Up Function Build Pop Up
function onEachFeature(feature, layer) {
    var popupContent = `${feature.properties.SiteName}`;
    layer.bindPopup(popupContent);
};

// Generate DOM elements based on data. Left Panel
// Class place-list is also used in click interaction
function generatePanel(data) {
    data.forEach(f => {
        // HTML elements
        let uid = f.properties.CRPID;
        let name = f.properties.SiteName;
        let html_text = `<b>${name}</b><br>`;
        //console.log(f.properties.db)

        //Assign seperate class's for working and retired sites
        if (f.properties.db === 'working sites') {
            // Create new DIV using JQuery
            $("<div/>").appendTo('#holder')
                .attr('id', uid)
                .attr('class', 'place-list working-site')
                .html(html_text);
        } else {
            $("<div/>").appendTo('#holder')
                .attr('id', uid)
                .attr('class', 'place-list retired-site')
                .html(html_text);
        }

    })
};



// Colors for the Categorical Choropleth
function getColor(d) {
    return d == "working sites" ? map_blue : map_green;
}

// Style Object for the general Polygon Styline
function style(data) {
    return {
        fillColor: getColor(data.properties.db), // Here is the categorical coloring.
        weight: 0,
        opacity: 1,
        fillOpacity: 0.7
    };
}


var pointstyle = {
    radius: 2,
    fillColor: 'green',
    weight: 0,
    opacity: 1,
    fillOpacity: 1
};
// Generate each polygon by binding pop up as well. 
// Pop-up Binding: onEachFeature, Style = style
function generatePolygon(data, point_data, L) {

    $(".leaflet-interactive").remove();

    let geoJsonLayer = L.geoJSON(data, {
        style: style,
        onEachFeature: onEachFeature
    }).addTo(map);

    geoJsonLayer.eachLayer(function(layer) {
        layer._path.id = layer.feature.properties.CRPID;
    });

    //Point Layer does not have ID Property
    let pointLayer = L.geoJSON(point_data, {
        pointToLayer: function(feature, latlng) {
            return L.circleMarker(latlng, pointstyle);
        }
    }).addTo(map);
}

let url = "https://raw.githubusercontent.com/PrattSAVI/RAM/main/data/PolySites.geojson"

//Use D3 to read JSON -> This might be an overkill. 
//d3.json(url).then(function(data) {
$.getJSON(url, function(data) {
    $.getJSON('https://raw.githubusercontent.com/PrattSAVI/RAM/main/data/PointSites.geojson', function(point_data) {


        console.log(data);
        console.log(point_data);

        generatePanel(data.features);
        generatePolygon(data.features, point_data, L);


        // ------------------------------ CLICKS & INTERACTION
        // Watch clicks on #holder to fly to the bounds of the clicked element.
        $('.place-list').click(function(d) {
            let uid = $(this).attr("id")
                // extract clicked on geometry
            let filtered = data.features.filter(function(f) {
                return f.properties.CRPID == uid
            });
            map.flyToBounds(L.geoJson(filtered).getBounds());
        })

        //Scroll to clicked Element
        $('path').click(function(d) {
            let uid = $(this).attr("id")
            uid = `#holder #${uid}`;
            $("#holder").scrollTo($(uid), {
                axis: "y",
                duration: 1500
            })
        });

        //---------------------- POP-UP TEC ------------------------------
        $('#button-holder').mouseenter(function() {
            var position = $('#button-holder').offset();
            var hoverup = $('<div />').appendTo('body');
            hoverup.attr('id', 'hoverup');
            hoverup.css({
                'z-index': 100000000000000,
                "width": "250px",
                "border-radius": "8px",
                "font-size": "12px",
                "padding": "8px",
                "position": 'absolute',
                'background': "white",
                "top": position.top + ($('#button-holder').height() / 2) - 50,
                "left": position.left + $('#button-holder').width() + 30
            })
            hoverup.html("<p><strong>TEC Filters</strong><br>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris scelerisque libero in lacinia ullamcorper. Donec libero metus, ultricies vel pharetra eu, dictum non nunc. In neque sem, venenatis non elit a, imperdiet tincidunt dui. Nullam quis consequat est. Quisque ullamcorper dui eu nibh tempus, ac tempus risus consequat. Sed eu lacinia ex. Aliquam congue nulla id sem laoreet iaculis.</p>")

        })

        ////---------------------- CHECKBOX TOGGLE ------------------
        $('#button-holder').mouseleave(function() {
            $("#hoverup").remove();
        })

        //---------------------- BUTTON INTERACTION -> Filtering
        $(".change-detect").change(function() { //If change on button group
            let btn_ids = [];
            $(".btn-check").each(function() { // Get all ids in the button group
                btn_ids.push(this.id);
            });


            //CHECKS BOXES HERE
            let checks = [];
            $(".form-check-input").each(function() { // Get all ids in the button group
                checks.push({
                    value: this.value,
                    check: this.checked
                })
            });
            console.log(checks)

            let isfiltered = false;
            checks.forEach(function(check) {
                if (check.check === false) {
                    isfiltered = true;
                }
            })

            let checked_sites = [];
            if (isfiltered) {
                console.log("Filtered")
                let temp = checks.filter(d => d.check === true)
                console.log(temp)
                checked_sites = data.features

            } else {
                checked_sites = data.features
            }

            // Iterate over to retrieve checked ones.
            let all_checked = [];
            btn_ids.forEach(function(b) {
                if ($("#" + b).is(':checked') === true) {
                    all_checked.push($("#" + b).attr("value"));
                }
            })

            // Go over all checked columns (values) to check for true values
            let filtered = []
            if (all_checked.length > 0) { // If a button is clicked
                all_checked.forEach(function(column) {
                    let temp = checked_sites.filter(item => {
                        if (item['properties'][column] == true) {
                            return item;
                        }
                    });
                    filtered = [...filtered, ...temp]
                });
                //Remove Duplicates
                filtered = filtered.filter(function(elem, index, self) {
                    return index === self.indexOf(elem);
                })
            } else { // If no button is clicked, assign all data to filtered
                filtered = checked_sites;
            }

            //console.log(filtered);
            generatePolygon(filtered, point_data, L);
            generatePanel(filtered);
        })

    });
});