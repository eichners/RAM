<script>
  import L from "leaflet";
  import { setContext, onMount } from "svelte";

  import { count } from "./store.js";
  
  let mapContainer;
  let map = L.map(L.DomUtil.create("div"), {
    center: [40.734, -73.957],
    zoom: 10,
  });

  count.set(map)

  setContext("leafletMapInstance", map);

  let tileURL = 'https://api.mapbox.com/styles/v1/eichners/cjp2020t41o7k2snzc9l82rpu/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1IjoiZWljaG5lcnMiLCJhIjoiY2lrZzVneDI4MDAyZ3VkbTZmYWlyejUzayJ9.vEGckM-D3AjV4jXmdibXyw'

  L.tileLayer(tileURL, {
    maxZoom: 18,
    zoomControl:false,
    attribution:'Design by <a href="https://commons.pratt.edu/savi/">SAVI</a>, Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>',
  }).addTo(map);

  onMount(() => {
    mapContainer.appendChild(map.getContainer());
    map.getContainer().style.width = "100%";
    map.getContainer().style.height = "100%";
    map.invalidateSize();

  });

</script>

<svelte:head>
  <link rel="stylesheet" href="https://unpkg.com/leaflet@1.6.0/dist/leaflet.css" integrity="sha512-xwE/Az9zrjBIphAcBb3F6JVqxf46+CDLwfLMHloNu6KEQCAWi6HcDUbeOfBIptF7tcCzusKFjFw2yuvEpDL9wQ==" crossorigin=""/>
  <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.12.1/css/all.min.css" rel="stylesheet"/>
</svelte:head>


<style>
  .map {
    height: 100%;
    width: 100%;
  }
</style>
<div class="map" bind:this="{mapContainer}">
  <slot></slot>
</div>