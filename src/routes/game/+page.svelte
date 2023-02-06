<script>
	import App from "src/routes/game/App.svelte";
	window.onpopstate = function () {
		if (confirm("Are you sure you want to leave the room?")) {
				window.history.back();
		}
	};
</script>
<App></App>