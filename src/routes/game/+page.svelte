<script lang="ts">
	import App from "src/routes/game/App.svelte";
	function beforeunload(event: BeforeUnloadEvent) {
        event.preventDefault();
		event.returnValue = '';
    }

</script>


<svelte:window on:beforeunload={beforeunload}/>
<App></App>
