<script lang="typescript" >

    import L from "leaflet";
    import { count } from "./store.js";
    import { afterUpdate } from 'svelte';
    import {createEventDispatcher} from 'svelte';
    const dispatch = createEventDispatcher();

    export let geojson;
    export let filters;
    
    //countValue is map object stored in the store.js
    let map;
    count.subscribe(value => {map = value});

    //Prepare data to be filtered by geojson object
    function dataFilter(feature) {
        //Site Filters
        let site_remain = true;
        if (filters.site_filters.includes(feature.properties.db) ) {
            site_remain = false;
        } else {
            site_remain = true;
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

    //Filter with text Bar
    if ( filters.text_filter.length > 0) {
        map_data = map_data.filter( function(feature){
        if (feature.properties.SiteName.toUpperCase().includes( filters.text_filter.toUpperCase() ) ){
            return true;
        } else {
            return false;
        }
        })
    }

    //When an item from the list is clicked.
    //1. Set view, 2. update and dispatch clicked polygon
    function clickHandle(e){
        let clicked_polygon = geojson.filter( function(d){
            return d.properties.CRPID == e.target.id
        }) 
        dispatch('message', {
                active: clicked_polygon
            });
        map.setView( L.geoJson(clicked_polygon).getBounds().getCenter() , 13); // Zoom to point
    }


    function expander(){
        let holder = document.getElementById('holder');
        holder.hidden = !holder.hidden;

        let plus = document.getElementById('collapse-nav-button');
        if (plus.innerHTML == "+"){
            plus.innerHTML = "&#8722;"
        }else{
            plus.innerHTML = "+"
        }       
    }

    // scroll to after loading.
    afterUpdate(() => {

        let this_cont;
        let prev_cont;

        let placelists = [...document.getElementsByClassName( 'place-list' )];
        placelists.forEach( function(place){
            if (place.id === filters.active){
                this_cont = place;
            }

            if (place.id === filters.previous){
                prev_cont = place;
            }
        })

		let place_cont = document.getElementById('holder');

		if (this_cont && place_cont ){ //If both already are created

            if(prev_cont){
                place_cont.scroll({
                top:prev_cont.offsetTop,
                behavior:'auto'
                    })
            }

			place_cont.scroll({
				top:this_cont.offsetTop,
				behavior:'smooth'
			})
        }
    });

</script>

<!-- svelte-ignore missing-declaration -->
<button on:click={expander}> 
    <div class="site-button">                    
        <span class="t2" id="target-eco">Restoration Site List</span>
        <span id="collapse-nav-button">&#8722;</span>
</button>
<div id="holder">
        {#if map_data.length > 0}
            {#each map_data as d }
                <div class="place-list t3 {d.properties.db}" id= {d.properties.CRPID} on:click={e=>{clickHandle(e)}}>
                    {d.properties.SiteName}
                </div>
            {/each}
        {:else}
            <span class="t3">There are no sites matching with the search criteria</span>

        {/if}
</div>    

<style>

    #collapse-nav-button:before {
        /*content: "\2012";*/
        font-weight: bold;
    }

</style>