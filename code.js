// START MAP HERE

let initial_position = [40.632, -73.923];
let initial_zoom = 10;
var map = L.map('map').setView(initial_position, initial_zoom);

//let tileURL = 'https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw'
let tileURL = 'https://api.mapbox.com/styles/v1/eichners/cjp2020t41o7k2snzc9l82rpu/tiles/512/{z}/{x}/{y}@2x?access_token=pk.eyJ1IjoiZWljaG5lcnMiLCJhIjoiY2lrZzVneDI4MDAyZ3VkbTZmYWlyejUzayJ9.vEGckM-D3AjV4jXmdibXyw'
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
function generatePanel(data1,data2,data3) {

    const data = [...data1,...data2,...data3] // Merge Datasets

    console.log( data3 )
    data.forEach(f => {

        let name = f.properties.SiteName;
        let html_text = `<b>${name}</b><br>`;
        let uid = f.properties.CRPID;

        //Assign seperate class's for working/ retired / completed sites
        if (f.properties.db === 'working sites') {
            $("<div/>").appendTo('#holder')
                .attr('class', 'place-list working-site')
                .attr('id' , uid )
                .html(html_text);
        } 
        if (f.properties.db === 'retired') {
            $("<div/>").appendTo('#holder')
                .attr('class', 'place-list retired-site')
                .attr('id' , uid )
                .html(html_text);
        }

        if (f.properties.db === 'Completed Sites') {
            $("<div/>").appendTo('#holder')
                .attr('class', 'place-list completed-site')
                .attr('id' , uid )
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
function generatePolygon(data_working, data_retired, point_data, L) {

    $(".leaflet-interactive").remove();

    let geoJsonLayer_working = L.geoJSON(data_working, {
        style: style,
        onEachFeature: onEachFeature
    }).addTo(map);

    geoJsonLayer_working.eachLayer(function(layer) {
        layer._path.id = layer.feature.properties.CRPID;
    });

    let geoJsonLayer_retired = L.geoJSON(data_retired, {
        style: style,
        onEachFeature: onEachFeature
    }).addTo(map);

    geoJsonLayer_retired.eachLayer(function(layer) {
        layer._path.id = layer.feature.properties.CRPID;
    });

    //Point Layer does not have ID Property
    let pointLayer = L.geoJSON(point_data, {
        pointToLayer: function(feature, latlng) {
            return L.circleMarker(latlng, pointstyle);
        }
    }).addTo(map);
}

let url_working = "https://raw.githubusercontent.com/PrattSAVI/RAM/main/data/Working.geojson"
let url_retired = "https://raw.githubusercontent.com/PrattSAVI/RAM/main/data/Retired.geojson"
let url_completed = 'https://raw.githubusercontent.com/PrattSAVI/RAM/main/data/Completed.geojson'

$.getJSON(url_retired, function(data_retired) {
    $.getJSON(url_working, function(data_working) {
        $.getJSON( url_completed, function(point_data) {

            generatePanel(data_working.features, data_retired.features, point_data.features);
            generatePolygon(data_working.features, data_retired.features, point_data, L);

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

            $('#button-holder').mouseleave(function() {
                $("#hoverup").remove();
            })

            //---------------------- BUTTON INTERACTION -> Filtering
            $(".change-detect").change(function() { //If change on button groups -> Both checks and Buttons
                let btn_ids = [];
                $(".btn-check").each(function() { // Get all ids in the button group
                    btn_ids.push(this.id);
                });

                //-----------   BUTTONS HERE
                // Iterate to retrieve pressed ones.
                let all_checked = [];
                btn_ids.forEach(function(b) {
                    if ($("#" + b).is(':checked') === true) {
                        all_checked.push($("#" + b).attr("value"));
                    }
                })

                // Go over all checked columns (values) to check for true values
                // ---- Filter Working Sites
                let filtered_working = []
                if (all_checked.length > 0) { // If a button is clicked
                    all_checked.forEach(function(column) {
                        let temp = data_working.features.filter(item => {
                            if (item['properties'][column] == true) {
                                return item;
                            }
                        });
                        filtered_working = [...filtered_working, ...temp]
                    });
                    //Remove Duplicates
                    filtered_working = filtered_working.filter(function(elem, index, self) {
                        return index === self.indexOf(elem);
                    })
                }else { // If no button is clicked, assign all data to filtered
                    filtered_working = data_working.features;
                }

                // ---- Filter Retired Sites
                let filtered_retired = []
                if (all_checked.length > 0) { // If a button is clicked
                    all_checked.forEach(function(column) {
                        let temp = data_retired.features.filter(item => {
                            if (item['properties'][column] == true) {
                                return item;
                            }
                        });
                        filtered_retired = [...filtered_retired, ...temp]
                    });
                    //Remove Duplicates
                    filtered_retired = filtered_retired.filter(function(elem, index, self) {
                        return index === self.indexOf(elem);
                    })
                }else { // If no button is clicked, assign all data to filtered
                    filtered_retired = data_retired.features;
                }

                //CHECKS FILTERING

                //-------------CHECKS BOXES HERE
                let checks = [];
                $(".form-check-input").each(function() { // Get all ids in the button group
                    checks.push({
                        value: this.value,
                        check: this.checked
                    })
                });

                let checked_working = []
                let checked_retired = []
                let checked_points = []
                checks.forEach(function(check){
                    
                    // -- For Working Sites
                    if( check.value === "Working Sites"){
                        if (check.check === true){
                            checked_working = filtered_working;
                        }else{
                            checked_working = [];
                        }
                    }

                    // -- For Retired Sites
                    if( check.value === "Retired Sites"){
                        if (check.check === true){
                            checked_retired = filtered_retired;
                        }else{
                            checked_retired = [];
                        }
                    }

                    // -- For Completed Sites
                    if( check.value === "Completed Sites"){
                        if (check.check === true){
                            checked_completed = point_data;
                        }else{
                            checked_completed = [];
                        }
                    }

                })

                generatePanel(filtered_working, filtered_retired, point_data.features);
                generatePolygon(checked_working, checked_retired , checked_completed, L);
    
            })

        });
    });
});