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
        },
        style:style,
        onEachFeature: onEachFeature
    }).addTo(map);
}

//Right panel Conent will go here.
function fillRigthPanel(filtered){
    props = filtered[0].properties
    panel = $("#right-panel")
    panel.html( `<div> 
                    <h2>${props.SiteName} </h2>
                    <p>${props.History}</p>
                    <p>${props.AcquisitionCat}</p>
                    <p>${props.Acreage}</p>
    
                </div>` )
}

function emptyRigthPanel(){
    panel = $("#right-panel")
    panel.html( `<div> 
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Cumque debitis facilis voluptatibus sunt, quo magni possimus perferendis dolorem. Aut eum quo praesentium eligendi iusto fugit culpa doloremque a labore et.
                </div>` )

}

let url_working = "https://raw.githubusercontent.com/PrattSAVI/RAM/main/data/Working.geojson"
let url_retired = "https://raw.githubusercontent.com/PrattSAVI/RAM/main/data/Retired.geojson"
let url_completed = 'https://raw.githubusercontent.com/PrattSAVI/RAM/main/data/Completed.geojson'

$.getJSON(url_retired, function(data_retired) {
    $.getJSON(url_working, function(data_working) {
        $.getJSON( url_completed, function(point_data) {

            generatePanel(data_working.features, data_retired.features, point_data.features);
            generatePolygon(data_working.features, data_retired.features, point_data, L);

            let checked_working = data_working.features;
            let checked_retired = data_retired.features;
            let checked_points = point_data.features;

            // ------------------------------ CLICKS & INTERACTION
            // Watch clicks on #holder to fly to the bounds of the clicked element.
            $('.place-list').click(function(d) {
                let uid = $(this).attr("id")
                
                // extract clicked on geometry
                let filtered = [...checked_working,...checked_retired,...checked_points].filter(function(f) {
                    return f.properties.CRPID == uid
                });

                fillRigthPanel(filtered);

                active_polygon = $(`#map #${uid}` )
                //active_polygon.attr("id" , `${uid} active-poly`)
                
                map.setView( L.geoJson(filtered).getBounds().getCenter() , 12); // Zoom to point
            })

            //Scroll to clicked Element
            //Check after fixing the right panel
            $('path').click(function(d) {

                //Zoom to clicked polygon.
                let uid = $(this).attr("id")

                let filtered = [...checked_working,...checked_retired,...checked_points].filter(function(f) {
                    return f.properties.CRPID == uid
                });

                fillRigthPanel(filtered)

                map.setView( L.geoJson(filtered).getBounds().getCenter() , 12);

                uid = `#holder #${uid}`;
                $("#holder").scrollTo($(uid), {
                    axis: "y",
                    duration: 1500
                })
            });

            //---------------------- POP-UP TEC ------------------------------
            $('#button-holder').mouseenter(function() {
                
                var position = $('#button-holder').offset();
                var hoverup = $("#hoverup")
                hoverup.css({
                    "visibility":"visible",
                    "top": position.top + ($('#button-holder').height() / 2) - 50,
                    "left": position.left + $('#button-holder').width() + 30
                })
            })

            $('#button-holder').mouseleave(function() {
                var hoverup = $("#hoverup")
                hoverup.css({
                    "visibility":"hidden",
                })
            })

            //---------------------- BUTTON INTERACTION -> Filtering
            $(".change-detect").change(function() { //If change on button groups -> Both checks and Buttons
                let btn_ids = [];
                $(".tec-buttons").each(function() { // Get all ids in the button group
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

                // ---- Filter Completed Sites
                // Point Data has a different column naming.
                let filtered_completed = []
                if (all_checked.length > 0) { // If a button is clicked
                    all_checked.forEach(function(column) {
                        let temp = point_data.features.filter(item => {
                            if (item['properties']["Primary TEC"] == column) {
                                return item;
                            }
                        });
                        filtered_completed = [...filtered_completed, ...temp]
                    });
                    //Remove Duplicates
                    filtered_completed = filtered_completed.filter(function(elem, index, self) {
                        return index === self.indexOf(elem);
                    })

                }else { // If no button is clicked, assign all data to filtered
                    filtered_completed = point_data.features;
                }

                //CHECKS FILTERING

                //-------------CHECKS BOXES HERE
                let all_buttons = []
                $(".btn-2").each(function() { // Get all ids in the button group
                    all_buttons.push( this.id );
                });

                //All checked boxes
                let all_pressed = [];
                all_buttons.forEach(function(b) {

                    let the_div = $(`div[id=${b}]`);

                    if ( $("#" + b).is(':checked') === true) {
                        all_pressed.push($("#" + b).attr("value"));
                        the_div.css("background-color","white");
                    }else{
                        the_div.css("background-color","rgba(0,0,0,0.1)");
                    }
                })

                //Format check boxes
                let checks = [
                    {"value":"Working Sites" , "check":false},
                    {"value":"Retired Sites" , "check":false},
                    {"value":"Completed Sites" , "check":false}
                ];

                if( all_pressed.length > 0){
                    all_pressed.forEach(function(pressed){
                        objIndex = checks.findIndex((obj => obj.value == pressed));
                        checks[objIndex].check = true;
                    })
                }              

                checked_working = []
                checked_retired = []
                checked_completed = []

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
                            checked_completed = filtered_completed;
                        }else{
                            checked_completed = [];
                        }
                    }

                })

                generatePanel(filtered_working, filtered_retired, filtered_completed);
                generatePolygon(checked_working, checked_retired , checked_completed, L);
    
            })

        });
    });
});

