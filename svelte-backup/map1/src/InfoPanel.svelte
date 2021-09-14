<script>

    import Title from './Title.svelte'
    export let active_data;
    let photo_link

    if (active_data) {
        active_data = active_data[0].properties;
        photo_link = `https://raw.githubusercontent.com/PrattSAVI/RAM/main/img/photos/${active_data.CRPID}.jpg`
    }

    let columns = [
        //{label:"Planning Region",name:"PlanRegion"},
        {label:"Acerage",name:"Acerage"},
        {label:"Ownership",name:"Ownership"},
        {label:"Protection Status",name:"ProtectionCat"},
        {label:"Acquisition Status",name:"AcquisitionCat"},
        {label:"Restoration Status",name:"RestorationCat"},
        {label:"Development Status",name:"DevelopmentCat"},
        {label:"Use Description",name:"UseDescrip"},
        {label:"Known Contaminants",name:"KnownContaminates"},
        {label:"Contact",name:"Contact"},
        {label:"Photo_Credit",name:"Photo_Credit"}
    ]

    let comp_columns = [
        {name:"Municipality or Borough", label:'Municipality or Borough'},
        {name:"State", label:'State'},
        {name:"Year Completed", label:'Year Completed'},
        {name:"Acerage", label:'Acres'},
        {name:"Narrative", label:'Narrative'},
        {name:"Key Partners", label:'Key Partners'},
        {name:"Contact", label:'Contact'},
    ]

    let ace = [
		{region:'LOWER BAY STUDY AREA', link:'https://www.nan.usace.army.mil/Portals/37/docs/harbor/CRP%20Planning%20Regions/PR_Lower%20Bay_8_2014.pdf'},
		{region:'ARTHUR KILL/KILL VAN KULL STUDY AREA',link:'https://www.nan.usace.army.mil/Portals/37/docs/harbor/CRP%20Planning%20Regions/PR_KVK_AK_8_2014.pdf'},
        {region:'JAMAICA BAY STUDY AREA',link:'https://www.nan.usace.army.mil/Portals/37/docs/harbor/CRP%20Planning%20Regions/PR_Jam_Bay_8_2014.pdf'},
		{region:'HARLEM RIVER, EAST RIVER, & WESTERN LONG ISLAND SOUND STUDY AREA',link:'https://www.nan.usace.army.mil/Portals/37/docs/harbor/CRP%20Planning%20Regions/PR_Harlem_East_Rivers_8_2014.pdf'},
        {region:'NEWARK BAY, HACKENSACK & PASSAIC RIVERS STUDY AREA',link:'https://www.nan.usace.army.mil/Portals/37/docs/harbor/CRP%20Planning%20Regions/PR_Nwk%20Bay_Passaic_Hack_8_2014.pdf'},
        {region:'UPPER BAY STUDY AREA',link:'https://www.nan.usace.army.mil/Portals/37/docs/harbor/CRP%20Planning%20Regions/PR_Upper%20Bay__8_2014.pdf'},
        {region:'JAMAICA BAY STUDY AREA',link:'https://www.nan.usace.army.mil/Portals/37/docs/harbor/CRP%20Planning%20Regions/PR_Jam_Bay_8_2014.pdf'},
        {region:'LOWER RARITAN RIVER STUDY AREA',link:'https://www.nan.usace.army.mil/Portals/37/docs/harbor/CRP%20Planning%20Regions/PR_Lower_Raritan__8_2014.pdf'},
        {region:'LOWER HUDSON RIVER STUDY AREA',link:'https://www.nan.usace.army.mil/Portals/37/docs/harbor/CRP%20Planning%20Regions/PR_Lower%20Hudson_8_2014.pdf'},
        {region:'HARLEM RIVER, EAST RIVER, & WESTERN LONG ISLAND SOUND STUDY AREA ',link:'https://www.nan.usace.army.mil/Portals/37/docs/harbor/CRP%20Planning%20Regions/PR_Harlem_East_Rivers_8_2014.pdf'}
    ]

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

    //Bring all active_data to filter this better. 
    // Ace sheet connects to region reports
    // Direct links go to the links themselves.
    function replaceRegion( active_data ){

        // If Link To field is ACE Sheet
        if (active_data['Link to'] === "ACE Sheet"){
            let filtered_ace = ace.filter( function(d){
                return d.region === active_data['PlanRegion']
            })
            return filtered_ace[0].link
        }else if ( active_data['Link to'].includes("http") ){
            return active_data['Link to'];
        }else{
            return null;
        }
        
    }

    //filters TEC list by selected, active_data
    function findtecs(active_data){

        let site_tecs = []
        tecs.forEach( function(tec){
            if (active_data[ tec.value ] == true ){
                site_tecs.push( tec )
            }
        })
        
        if ( site_tecs.length > 0){
            return site_tecs;
        }else{
            //Remove icon holder if there are no TECS
            return null;
        }
    }

</script>


{#if active_data}

    {#if active_data.Photo}
        <div class="this_rect">
            <img alt={active_data.CRPID} src={photo_link} />
        </div>
    {/if}

    <div class="detail">

        {#if active_data.db == "Working"}
            <p><span id='info-title' style="color:var(--blue)">{active_data.SiteLabel}</span></p>

            {#if findtecs(active_data) }
                <div>

                    <p class="t3">Target Ecosystem Characteristics:</p>
                    <div class="tec-logos r">
                        {#each findtecs(active_data) as tecs }
                                <img alt={tecs.value} style="width:35px" src= {tecs.source}/>
                        {/each}
                    </div>
                </div>

            {/if}

            {#each columns as col }
                {#if active_data[col.name] }
                    <p><strong> {col.label}: </strong> {active_data[col.name]}</p>
                {/if}
            {/each}

            {#if replaceRegion( active_data ) }
                <p><a target="_blank" href={ replaceRegion( active_data )}>Click here for more information about this site</a></p>
            {/if}


        {/if}

        {#if active_data.db == "Retired"}
            <p><span id='info-title' style="color:var(--green)">{active_data.SiteLabel}</span></p>

            {#each columns as col }
                {#if active_data[col.name] }
                    <p><strong> {col.label}: </strong> {active_data[col.name]}</p>
                {/if}
            {/each}
            
        {/if}

        {#if active_data.db == "Completed"}
            <p><span id='info-title' style="color:var(--green)">{active_data.SiteName}</span></p>

            {#each comp_columns as col }
                {#if active_data[col.name] }
                    <p><strong> {col.label}: </strong> {active_data[col.name]}</p>
                {/if}
            {/each}

        {/if}
    </div>
{:else}

    <div class="detail">
        <span class="t2" style="color:var(--blue)">About the Map</span>
        <p>The <a href="https://www.hudsonriver.org/article/hrecrp">Comprehensive Restoration Plan</a> (CRP) is a blueprint to protect existing habitat and restore or enhance ecological characteristics of the Hudson-Raritan Estuary.  The CRP is organized around 12 Target Ecosystem Characteristics (TECs) for which measurable restoration goals were set for both 2020 and 2050.  These targets represent what is desirable and achievable and focus on the specific habitat types, support structures, and public health and social values that are key to a healthy estuary.
        <br><br>The restoration site opportunities compiled in this map represent an extensive research and nomination process conducted by HEP’s Restoration Work Group and the US Army Corps of Engineers. HEP partners report the completed restoration projects on an annual basis with earlier projects compiled by Alderson and Bowers, 2012.</p>
        
        <div class="logos">
            <div class="logo">
                <img src="https://raw.githubusercontent.com/PrattSAVI/RAM/main/img/iconsSv/logo-hrf.svg" alt="Hrf Logo">
            </div>
            <div class="logo">
                <img src="https://raw.githubusercontent.com/PrattSAVI/RAM/main/img/iconsSv/logo-hep.svg" alt="Hep Logo">
            </div>
        </div>

        <br>
        <p><strong>Contact:&nbsp;</strong>istinnette@hudsonriver.org</p>
    </div>

{/if}


<style>
    img{
        width: 90px;
        height: auto;
        float:left;
        margin: 0px 5px;
    }

    .logos{
        margin-top:15px;
        margin-bottom: 15px;
    }



</style>