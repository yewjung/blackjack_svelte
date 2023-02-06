<script lang="ts">
	import { fade } from "svelte/transition";
	import { cubicIn } from "svelte/easing";
	import Hand from "src/routes/Hand.svelte";
	import Money from "src/routes/Money.svelte";
	import Controls from "src/routes/Controls.svelte";
	import Outcome from "src/routes/Outcome.svelte";
	import type { IHand } from "src/models/interfaces/hand.interface";
	import type { EOutcome } from "src/models/enums/outcome.enum";
	import { EProgress } from "src/models/enums/progress.enum";
	import { EDuration } from "src/models/enums/duration.enum";
	import { evaluateOutcome, evaluateBlackjack } from "src/functions/gameplay";

	export let playerHand: IHand;
	export let dealerHand: IHand;
	export let progress: EProgress;
	let outcome: EOutcome | undefined;
	let hasPlacedBet: boolean;
	$: dealerHandHidden = progress === EProgress.NewGame || progress === EProgress.PlayerTurn;

	// Clear outcome variable on new games
	$: {
		if (progress === EProgress.Betting && outcome) {
			outcome = undefined;
		}
	}

	// Cards are dealt
	$: {
		if (progress === EProgress.BlackjackDealt && !outcome) {
			outcome = evaluateBlackjack(playerHand.total, dealerHand.total);
		}
	}

	// Game ends
	$: {
		if (progress === EProgress.GameOver && !outcome) {
			outcome = evaluateOutcome(playerHand.total, dealerHand.total);
		}
	}
</script>

{#if progress === EProgress.Betting}
	<h1 class="prompt"
		in:fade={{
			duration: EDuration.Text,
			delay: EDuration.Card,
			easing: cubicIn 
		}}
	>
		Place your bets
	</h1>
{/if}
<Outcome
	{outcome}
	on:acceptOutcome
/>
<div class="table">
	<Hand
		{...dealerHand}
		hasHoleCard={dealerHandHidden}
	/>
	<Hand
		{...playerHand}
	/>
</div>
<Money
	{progress}
	{outcome}
	on:betPlaced={(e) => hasPlacedBet = e.detail}
/>
{#if hasPlacedBet}
	<Controls
		{progress}
		on:deal
		on:hit
		on:stand
	/>
{/if}

<style>
	.prompt {
		position: absolute;
		font-size: 64px;
		width: 100%;
		text-align: center;
		top: 128px;
	}

	.table {
		flex: 1;
		display: flex;
		flex-direction: column;
		justify-content: space-around;
		align-items: center;
		margin: 96px 0;
	}
</style>