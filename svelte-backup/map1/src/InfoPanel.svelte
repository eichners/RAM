<script>

    export let active_data;
    let photo_link

    if (active_data) {
        active_data = active_data[0].properties;
        photo_link = `https://raw.githubusercontent.com/PrattSAVI/RAM/main/img/photos/${active_data.CRPID}.jpg`
    }

    let columns = [
        {label:"Planning Region",name:"PlanRegion"},
        {label:"Acerage",name:"Acreage"},
        {label:"Ownership",name:"Ownership"},
        {label:"Protection Category",name:"ProtectionCat"},
        {label:"Acquisition Category",name:"AcquisitionCat"},
        {label:"Restoration Category",name:"RestorationCat"},
        {label:"Development Category",name:"DevelopmentCat"},
        {label:"Use Description",name:"UseDescrip"},
        {label:"Known Contaminates",name:"KnownContaminates"},
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

    function replaceRegion( site ){
        let filtered_ace = ace.filter( function(d){
            return d.region === site
        })
        return filtered_ace[0].link
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

            {#each columns as col }
                {#if active_data[col.name] }
                    <p><strong> {col.label}: </strong> {active_data[col.name]}</p>
                {/if}
            {/each}

            {#if active_data["PlanRegion"] }
                <p><strong> ACE Sheet: </strong> <a target="_blank" href={ replaceRegion( active_data["PlanRegion"] )}>Click Here to Access ACE Sheet</a></p>
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
        <p>The <a href="https://www.hudsonriver.org/article/hrecrp">Comprehensive Restoration Plan</a> (CRP) is a blueprint to protect habitats that still exist and restore habitats that have been lost. It provides shared vision and priorities for the federal, state, and local agencies, university and non-profit partners engaged in habitat conservation and restoration in our region. 
        <br><br>Restoration under the CRP centers around 12 Target Ecosystem Characteristics (TECs), categories of restoration, in which measurable restoration goals were set for both 2020 and 2050.  These targets represent what is desirable and achievable and focus on the specific habitat types, support structures, and public health and social values that are key to a healthy estuary.
        <br><br>The restoration site opportunities compiled in this map represent an extensive research and nomination process conducted by HEP’s Restoration Work Group and the US Army Corps of Engineers. HEP partners report the completed restoration projects on an annual basis with earlier projects compiled by Alderson and Bowers, 2012.</p>
        

        <div class="logos">
            <div class="logo">
                <img src="https://raw.githubusercontent.com/PrattSAVI/RAM/main/img/iconsSv/logo-hrf.svg" alt="Hrf Logo">
            </div>
            <div class="logo">
                <img src="https://raw.githubusercontent.com/PrattSAVI/RAM/main/img/iconsSv/logo-hep.svg" alt="Hep Logo">
            </div>
        </div>

        <p><strong>Contact:</strong>name@hudsonriver.org</p>
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