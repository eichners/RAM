
<script>
    import * as L from 'leaflet';
    import { count } from "./store.js";
    import { afterUpdate } from 'svelte';

    import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher();

    let map_orange = "var(--orange)";
    let map_blue = "var(--blue)";
    let map_green = "var(--green)";
   
    export let geojson;
    export let filters;

    //countValue is map object stored in the store.js
    let map;
    count.subscribe(value => {
        map = value;
    });

    //Zoom to active polygon and write id to store.
    function activePolygon(e){
        map.setView( e.target.getBounds().getCenter() ,13)
        dispatch('message', {
			active: e.target
		}); 
    }

    function getColor(d) {
        return d == "Working" ? map_blue : map_green;
    }

    //for active polygon
    function getStrokeWeight(d) {
        return String(d) == filters.active ? 2.5 : 0;
    }

    function getStrokeColor(d) {
        return d == "Working" ? "#007FD4": "#668740";
    }

    function style(data) {
        return {
            fillColor: getColor(data.properties.db),
            color: getStrokeColor(data.properties.db),
            weight: getStrokeWeight(data.properties.CRPID),
            opacity: 1,
            fillOpacity: 0.7
        };
    }

    function ConvertText(text) {
        return text == "Working" ? "Opportunity"
            : text == "Retired" ? "Former Opportunity" 
            : "Other";
    }

    function onEachFeature(feature, layer) {

        let site_type = ConvertText(feature.properties.db)

        var popupContent = `<span class="${feature.properties.db}-popup-type">${site_type}</span><br><span class="${feature.properties.db}-popup-text">${feature.properties.SiteName}</span>`;
        layer.bindPopup(popupContent);
        layer.on({
            click:activePolygon,
            mouseover: e => {layer.openPopup()},
            mouseout: e => {layer.closePopup()}
        })       
    };

    //Prepare data to be filtered by geojson object
    function dataFilter(feature) {

        //Site Filters - Change to Opposite. 
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
            filters.tec_filters.forEach( function(tec_filter){
                if( feature.properties[tec_filter] === true ){
                    tec_remain = true
                }
            })
        }
        let remain = site_remain && tec_remain 
        return remain;
    }

    //Create new filtered data -> Dispatch this to place-holder
    let map_data = geojson.filter( dataFilter );

    //Remove All Polygons
    let all_paths = document.querySelectorAll('path')
    all_paths.forEach( function(paths){
        if (paths.id.includes("AllPolygons")){
            paths.remove()
        }
    })

    const layer = L.geoJSON(map_data,{
        style: style,
        onEachFeature: onEachFeature,
    }).addTo(map);

    layer.eachLayer(function (polygon) {
            polygon._path.id = polygon.feature.properties.CRPID + " AllPolygons";
        });


</script>


<slot />