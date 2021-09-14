
<script>
    import { count } from "./store.js";
    import L from "leaflet";

    import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher();

    let map;
    count.subscribe(value => {
        map = value;
    });

    let home = L.easyButton( '<i class="fa fa-home" aria-hidden="true"></i>' , function(btn, map){
        map.setView([40.734, -73.957],11);
    });
    
    home.button.onclick = function(){
        dispatch('homebutton', {
			text: 'Hello!'
		});
    }
    
    home.addTo(map);

</script>



