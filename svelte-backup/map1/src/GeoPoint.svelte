
<script>
    import * as L from 'leaflet';
    import { count } from "./store.js";

    import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher();
   
    export let geojson;
    export let filters;

    let map_green = "var(--green)";

    //countValue is map object stored in the store.js
    let map;
    count.subscribe(value => {
        map = value;
    });

    //Zoom to active polygon and write id to store.
    function activePolygon(e){
        map.setView( [e.target._latlng.lat , e.target._latlng.lng] ,13)
        dispatch('message', {
			active: e.target
		});
    }

    function onEachFeature(feature, layer) {

        var popupContent = `<span class="Retired-popup-type">Completed Site</span><br><span class="Retired-popup-text">${feature.properties.SiteName}</span>`;
        layer.bindPopup(popupContent);
        layer.on({
            click:activePolygon,
            mouseover: e => {layer.openPopup()},
            mouseout: e => {layer.closePopup()}

        })
    };

    //Prepare data to be filtered by geojson object
    function dataFilter(feature) {
        //Site Filters
        let site_remain = true;
        if( filters.site_filters.length === 0){
            site_remain = true;
        }else{
            if (filters.site_filters.includes(feature.properties.db) ) {
            site_remain = true;
            } else {
                site_remain = false;
            }
        }

        //STEC Filters
        let tec_remain = false;
        if (filters.tec_filters.length === 0){
            tec_remain=true;
        }else{
            tec_remain=false;
            filters.tec_filters.forEach(function(filter){
                if (feature.properties['Primary TEC'] === filter){
                    tec_remain=true;
                }
            })
        }
        let remain = site_remain && tec_remain 
        return remain;
    }

    //Create new filtered data -> Dispatch this to place-holder
    let map_data = geojson.filter( dataFilter );

    //Remove existing Elements
    let all_paths = document.querySelectorAll('path')
    all_paths.forEach( function(paths){
        if (paths.id.includes("AllPoints")){
            paths.remove()
        }
    })

    // create a vector circle centered on each point feature's latitude and longitude
    function createCircles (feature, latlng) {
        return L.circleMarker(latlng)
    }

    function getStrokeWeight(d) {
        return String(d) == filters.active ? 3 : 1;
    }

    function getRadius(d) {
        return String(d) == filters.active ? 10 : 2.5;
    }

    function style(feature) {
        return {
        radius: getRadius(feature.properties.CRPID),
        fillColor: map_green,
        weight: getStrokeWeight(feature.properties.CRPID),
        color:"white",
        opacity: 1,
        fillOpacity: 1
        }
    }

    const layer = L.geoJSON(map_data,{
        pointToLayer: createCircles,
        onEachFeature: onEachFeature,
        style:style
    }).addTo(map);

    layer.eachLayer(function (polygon) {
        polygon._path.id = polygon.feature.properties.CRPID + " AllPoints" ;
    });


</script>


<slot />