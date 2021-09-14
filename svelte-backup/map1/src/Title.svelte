
<script>
    import {afterUpdate} from "svelte";
    export let title_hover;

    afterUpdate( () => {
        
        let div = document.getElementById('title-hover');
        if (div){
            div.style.visibility="hidden"
        }
        setTimeout(function(){
            
            if (div){
                div.style.top = title_hover.y + "px";
                div.style.left = title_hover.x + "px";
                div.style.visibility="visible"
            }
        }, 200);

    });

</script>

{#if title_hover.name}
    <div id="title-hover" >
        {title_hover.name}
    </div>
{/if}


<style>
	#title-hover{
		position:absolute;
		background: rgba(255,255,255,0.8);
		z-index: 3;
        border-radius: 4px;
        color:var(--blue);
        font-size: 10pt;
        font-weight: bold;
        padding:3px;
        border: 1px solid rgba(0,0,0,0.3);
        box-shadow: 5px 5px rgba(0,0,0,0.1);
	}
</style>