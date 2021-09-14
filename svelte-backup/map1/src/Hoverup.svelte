<script>
    export let tecs;
    //console.log( tecs);

</script>


<div class="hoverup">
    <p class="t2">About Target Ecosystem Characteristics</p>
    <div class="grid-container">
    {#each tecs as tec}
        <div class='grid-item'>
            <img alt={tec.value} style="width:30px" src= {tec.source}/>
            <div style="margin-left:5px">
                <div id="hover-title">{tec.name}</div>
                <div id="hover-text">{tec.desc}</div>
            </div>
        </div>
    {/each}

    </div>
</div>

<style>

    #hover-title{
        font-size: 7pt;
        font-weight: 700;
        color:#666
    }

    #hover-text{
        font-size: 7pt;
        font-weight: 400;
        color:#888
    }

    .hoverup{
        padding: 5px 10px 15px 10px;
        position: absolute;
        background: white;
        max-width: 450px;
        top:100px;
        left:310px;
        border-radius: 8px;
        z-index:6;
        border: 1px solid rgba(0, 0, 0, 0.2);
        box-shadow: 5px 5px rgba(0, 0, 0, 0.1);
    }

    .grid-container {
        display: flex;
        flex-direction: column;
        flex-wrap: wrap;
        margin-top: 10px;
        max-height: 500px;
    }

    .grid-item {
        display: grid;
        max-width: 48%;
        grid-template-columns: 0.1fr 1fr;
        padding: 3px;
    }

</style>