<script>
	
	import LeafletMap from './Map.svelte'
	import GeoJson from './Geojson.svelte';
	import GeoPoint from './GeoPoint.svelte';
	import {onMount} from 'svelte'
	import PlaceList from './PlaceList.svelte';
	import InfoPanel from './InfoPanel.svelte';
	import Header from './Header.svelte';	
	import Hoverup from './Hoverup.svelte';
	import Title from './Title.svelte';
	import {afterUpdate} from 'svelte';
	import HomeButton from './Home.svelte'


	let data;
	let active_data;
	let completed_Data;
	let all_data;
	const data_url_working = "https://raw.githubusercontent.com/PrattSAVI/RAM/main/data/Working_R2.geojson";
	const data_url_retired = "https://raw.githubusercontent.com/PrattSAVI/RAM/main/data/Retired_R2.geojson";
	const data_url_completed = "https://raw.githubusercontent.com/PrattSAVI/RAM/main/data/Completed_R2.geojson";

	onMount(async () => {
		const res = await fetch( data_url_working );
		let working_Data = await res.json();

		const res2 = await fetch( data_url_retired );
		let retired_Data = await res2.json();

		const res3 = await fetch( data_url_completed );
		completed_Data = await res3.json();
		completed_Data = completed_Data.features;
		//Remove Enteries without Lat Long -> Just Lat
		completed_Data = completed_Data.filter( function(feature){
			return typeof(feature.properties.Lat) === 'number';
		})

		data = [...working_Data.features,...retired_Data.features];
		all_data = [...completed_Data , ...data ]

		//Sort All Data Alphabetically
		all_data = all_data.sort( function( a, b ) {
			a = a.properties.SiteName.toLowerCase();
			b = b.properties.SiteName.toLowerCase();

			return a < b ? -1 : a > b ? 1 : 0;
		});

	});

	//Filter Function. Filter goes to GeoJSON.svelte
	//Declare Empty filter. All Filters are together
	let filters = {
		site_filters:[],
		tec_filters:[],
		text_filter:"",
		active:[],
		previous:[]
	};

	//Use these for creating buttons and hover pop up
	let tecs = [
		{value:"STECAccess",name:"Public Access" , source:"https://raw.githubusercontent.com/PrattSAVI/RAM/main/img/iconsSv/STECAccess.svg" ,desc:"Improve direct access to the water and create linkages to other recreational areas, as well as provide increased opportunities for fishing, boating, swimming, hiking, education, or passive recreation."},
		{value:"STECAcquisition",name:"Acquisition", source: "https://raw.githubusercontent.com/PrattSAVI/RAM/main/img/iconsSv/STECAcquisition.svg" ,desc:"Protect ecologically valuable coastal lands throughout the Hudson-Raritan Estuary from future development through land acquisition."},
		{value:"STECEelgrass",name:"Eelgrass Beds" , source:"https://raw.githubusercontent.com/PrattSAVI/RAM/main/img/iconsSv/STECEelgrass.svg" ,desc:"Establish eelgrass beds at several locations in the HRE study area."},
		{value:"STECForests",name:"Coastal and Maritime Forests", source: "https://raw.githubusercontent.com/PrattSAVI/RAM/main/img/iconsSv/STECForests.svg" ,desc:"Create a linkage of forests accessible to avian migrants and dependent plant communities."},
		{value:"STECAquaticHab",name:"Habitat for Fish, Crab, and Lobsters" , source:"https://raw.githubusercontent.com/PrattSAVI/RAM/main/img/iconsSv/STECAquaticHab.svg" ,desc:"Create functionally related habitats in each of the eight regions of the Hudson-Raritan Estuary."},
		{value:"STECIslands",name:"Habitats for Waterbirds", source: "https://raw.githubusercontent.com/PrattSAVI/RAM/main/img/iconsSv/STECIslands.svg" ,desc:"Restore and protect roosting, nesting, and foraging habitat (i.e., inland trees, wetlands, shallow shorlines) for long-legged wading birds."},
		{value:"STECOyster",name:"Oyster Reefs" , source:"https://raw.githubusercontent.com/PrattSAVI/RAM/main/img/iconsSv/STECOyster.svg" ,desc:"Establish sustainable oyster reefs at several locations."},
		{value:"STECSediment",name:"Sediment Contamination", source: "https://raw.githubusercontent.com/PrattSAVI/RAM/main/img/iconsSv/STECSediments.svg" ,desc:"Isolate or remove one or more sediment zone(s) that is contaminated until such time as all HRE sediments are considered uncontaminated based on all related water quality standards, related fishing / shelling bans or fish consumption advisories, and any newly-promulgated sediment quality standards, criteria or protocols"},
		{value:"STECShore",name:"Shorelines and Shallows" , source:"https://raw.githubusercontent.com/PrattSAVI/RAM/main/img/iconsSv/STECShore.svg" ,desc:"Create or restore shorline and shallow sites with a vegetated riparian zone, an inter-tidal zone with a stable slope, and illuminated shallow water."},
		{value:"STECTributary",name:"Tributary Connections" , source:"https://raw.githubusercontent.com/PrattSAVI/RAM/main/img/iconsSv/STECTributary.svg" ,desc:"Reconnect and restore freshwater streams to the estuary to provide a range of quality habitats to aquatic organisms."},
		{value:"STECWater",name:"Enclosed and Confined Water" , source:"https://raw.githubusercontent.com/PrattSAVI/RAM/main/img/iconsSv/STECWater.svg" ,desc:"Improve water quality in all enclosed waterways and tidal creeks within the estuary to match or surpass the quality of their receiving waters."},
		{value:"STECWetland",name:"Wetlands" , source:"https://raw.githubusercontent.com/PrattSAVI/RAM/main/img/iconsSv/STECWetland.svg" ,desc:"Create and restore coastal and freshwater wetlands at a rate exceeding the annual loss or degradation, to produce a net gain in acreage."},
	]
      

	//Handle Site Filters
	function clickHandleSite(e){
		//Get Clicked Element value
		let value = e.target.parentNode.parentNode.value;
		//if value in the array remove, if not add it. 
		if ( filters.site_filters.includes(value) ){
			filters.site_filters = filters.site_filters.filter( f => f !== value)
		}else{
			filters.site_filters = [ ...filters.site_filters, value];
		}

		// Change Element background Color
		let clicked_site = []
		let all_sites = [...document.getElementsByClassName("site-buttons")]
		all_sites.forEach( function(button){
			button.className = "site-buttons"
		})
		filters.site_filters.forEach( function(filter){
			clicked_site.push( [...document.querySelectorAll(`button[id=${filter}]`)][0] );
		})

		//Clicked Sites -> Add a new class pressed
		clicked_site.forEach(function(site){
			site.className = "site-buttons pressed"
		})

	}

	//Handle TEC Filters
	function clickHandleTEC(e){
		if ( filters.tec_filters.includes(e.target.value) ){
			filters.tec_filters = filters.tec_filters.filter( f => f !== e.target.value)
		}else{
			filters.tec_filters = [ ...filters.tec_filters, e.target.value];
		}

		//Color Clicked buttons -> use .active class
		//1. Remove active class from all tec-buttons
		let all_buttons = [...document.getElementsByClassName( "tec-buttons" )]
		all_buttons.forEach( function(button){
			button.className = "tec-buttons"
		})

		//If filter class matches, add active to class. 
		filters.tec_filters.forEach(function(filter){
			let clicked_button = document.getElementById( filter );
			clicked_button.parentNode.className = "tec-buttons active"
			console.log(clicked_button)
		})
	}

	//Handle Clicked Geojson Object, Point or Polygon.
	function handleMessage(e){
		if(filters.active) filters.previous = filters.active;
		 filters.active = e.detail.active._path.id;
		 filters.active = filters.active.replace(" AllPolygons","").replace(" AllPoints","")
		 active_data = all_data.filter( function(f){
			return String(f.properties.CRPID) === filters.active;
		 })	
	}

	function handlePlaceMessage(e){
		//console.log(e.detail.active[0].properties.CRPID)
		if(filters.active) filters.previous = filters.active;
		filters.active = String(e.detail.active[0].properties.CRPID )
		active_data = all_data.filter( function(f){
			return String(f.properties.CRPID) === filters.active;
		 })	
	}

	function showHover(e){
		let eco = [...document.getElementsByClassName('hoverup')][0];
		eco.hidden = !eco.hidden; // Show - hide

		eco.style.left = e.target.parentNode.parentNode.clientWidth;
		eco.style.top = e.target.offsetHeight + e.target.offsetTop;
	}

	let title_hover = {
		x:null,
		y:null,
		name:null
	}

	function enter(e,name){
		e.preventDefault();
		title_hover.x = e.clientX;
		title_hover.y = e.clientY;
		title_hover.name = name;
	}

	function leave(e){
		title_hover.name=null;
	}

	//Hide Hover at Start-Up
	afterUpdate( () => {
		let eco = [...document.getElementsByClassName('hoverup')][0];
		if( eco ) eco.hidden = true;
	})
	
	function handleClick(e){
		active_data = null;
		//let active = document.getElementsByClassName("active")[0];
		//active.className.baseVal = "leaflet-interactive"
	}

</script>

<svelte:head>
	<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/leaflet-easybutton@2/src/easy-button.css">
	<script src="https://cdn.jsdelivr.net/npm/leaflet-easybutton@2/src/easy-button.js"></script>
</svelte:head>

{#if all_data}
	<Header />

	<!-- Initiate Map Here-->
	<div class="full-site">
		<LeafletMap >
			<HomeButton on:homebutton={handleClick}/>
			{#key filters}
				<GeoJson on:message={handleMessage} geojson={data} {filters}/>
				<GeoPoint on:message={handleMessage} geojson={completed_Data} {filters}/>
			{/key}
		</LeafletMap>
	</div>

	<div class="left-panel panel">

		<div class="r">
            <span class="t1">Filters</span><br>
            <span class="t2" id="target-eco" on:click={(e) => showHover(e)}>Target Ecosystem Characteristics</span><br>
            <span class="t3">Filter by TEC</span>
        </div>

		<!-- TEC BUTTONS-->
		<div class="tec-filters r">
			{#each tecs as tec}
				<label on:mouseenter={(e) => enter(e,tec.name)} on:mouseleave={leave} class="tec-buttons"><img alt={tec.value} style="width:35px" src= {tec.source}/>
					<input class="tec-input" type="checkbox" on:click={e=>{clickHandleTEC(e)}} value={tec.value} id={tec.value}>
				</label> 
			{/each}
		</div>

		<div class="r">
            <span class="t2">Restoration Projects</span><br>
            <span class="t3">Filter by site category</span>
        </div>

		<!-- SITE BUTTONS-->
		<div class="site-filters r">	
			<button type="button" class="site-buttons" id="Working" on:click={e=>{clickHandleSite(e)}} value="Working"> <div class="legend-item" style="width:100% "><div style="width:15px;height:15px;background: var(--blue);margin-top: 5px;"></div> <span class="t2 site-text Working">Opportunities</span></div>  </button>
			<button type="button" class="site-buttons" id="Retired" on:click={e=>{clickHandleSite(e)}} value="Retired">  <div class="legend-item" style="width:100% "><div style="width:15px;height:15px;background: var(--green);margin-top: 5px;"></div> <span class="t2 site-text Retired">Former Opportunities</span> </div></button>
			<button type="button" class="site-buttons" id="Completed" on:click={e=>{clickHandleSite(e)}} value="Completed"> <div class="legend-item" style="width:100% "> <div style="width:15px;height:15px;background: var(--green);margin-top: 5px;border-radius: 50%;"></div> <span class="t2 site-text Completed">Completed Sites</span></div></button>
		</div>

		<!-- Search Input Box-->
		<div class="searcher r">
			<input id="searcher" placeholder="Search Sites" type="text" bind:value={filters.text_filter}>
		</div>

		<!-- Accordion List -->
		{#key filters}
			<PlaceList on:message={handlePlaceMessage} geojson={all_data} {filters}/>
		{/key}


		
	</div>

	<!-- Right Panel -->
	<div class = "info-panel panel">
		{#key active_data}
			<InfoPanel {active_data} />
		{/key}
	</div>

	<Hoverup {tecs} />

	<Title {title_hover}/>

{:else}
	<div>Loading...</div>
{/if}

