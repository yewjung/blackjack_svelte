<style>
.container {
    display: flex;
    align-items: center;
    background-color: #626262;
    padding: 10px;
    border-radius: 10px;
    cursor: pointer;
    position: absolute;
    top: 30px;
    right: 20px
}

.text {
    flex: 1;
}

.tooltip {
    position: absolute;
    top: 100%;
    right: 0;
    background-color: black;
    color: white;
    padding: 5px 10px;
    border-radius: 5px;
    opacity: 0;
    transition: opacity 0.5s;
}

.container:hover .tooltip,
.container:focus .tooltip {
    opacity: 1;
}
</style>

<script>
export let string = "";
let copied = false;

async function copyString() {
    try {
        await navigator.clipboard.writeText(string);
        copied = true;
        setTimeout(() => {
            copied = false;
        }, 1000);
    } catch (error) {
        console.error(error);
    }
}
</script>

<div class="container" on:click={copyString} on:keydown={()=>{}}>
    <p class="text">{string}</p>
    {#if copied}
        <div class="tooltip">Copied!</div>
    {/if}
</div>
