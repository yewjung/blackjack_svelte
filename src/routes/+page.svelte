<script>
	import RoomForm from "src/routes/RoomForm.svelte";

</script>
<div>
	<h1>Call object Svelte demo</h1>
	<p>Demo a custom call interface built using Daily call object for Svelte.</p>

	<!-- Provide a form to enter name and optional Daily URL -->
	<RoomForm />
	<p class="subtext">If prompted, select "Allow" to use your camera and mic for this call</p>
</div>
<style>
	div {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		flex: 1;
        height: 100vh;
	}

	h1 {
		text-align: center;
		font-size: 2rem;
		font-weight: 700;
		margin-bottom: 0;
	}
    h1,
    p {
        font-weight: 400;
        color: var(--dark-blue);
        text-align: center;
    }

	.subtext {
		font-size: 12px;
		color: #6b7785;
	}

</style>