<script lang="ts">
	import { onDestroy, onMount } from "svelte";
	import Game from "src/routes/game/Game.svelte";
	import { images } from "src/stores";
	import {
		preloadImages,
	} from "src/functions/gameplay";
	import { dealerHand,otherPlayersHand, playerHand, progressStore, resetStores, sendMessage } from "src/socket";
	import { Action } from "src/models/enums/action.enum";

	let betAmount: number = 0;


	onMount(async () => {
		const imagesResponse = await preloadImages()
		images.set(imagesResponse);
	});

	onDestroy(() => {
		resetStores(true)
	})

	async function bet(): Promise<void> {
		sendMessage({
			action: Action.SEND_BET,
			bet: betAmount,
		})
	}

	async function hit(): Promise<void> {
		sendMessage({
			action: Action.SEND_HIT
		})
	}

	async function stand(): Promise<void> {
		sendMessage({
			action: Action.SEND_STAND
		})
	}
</script>

<main class="game">
	<Game
		playerHand={$playerHand}
		dealerHand={$dealerHand}
		otherPlayersHand={$otherPlayersHand}
		progress={$progressStore}
		bind:bet={betAmount}
		on:deal={bet}
		on:hit={hit}
		on:stand={stand}
	/>
</main>

<style>
	.game {
		display: flex;
		flex-direction: column;
		position: relative;
		height: 100%;
	}

</style>