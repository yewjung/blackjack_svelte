<script lang="ts">
	import { fade } from "svelte/transition";
	import { cubicIn } from "svelte/easing";
	import Hand from "src/routes/game/Hand.svelte";
	import Money from "src/routes/game/Money.svelte";
	import Controls from "src/routes/game/Controls.svelte";
	import Outcome from "src/routes/game/Outcome.svelte";
	import type { IHand } from "src/models/interfaces/hand.interface";
	import type { EOutcome } from "src/models/enums/outcome.enum";
	import { EProgress } from "src/models/enums/progress.enum";
	import { EDuration } from "src/models/enums/duration.enum";
	import { evaluateOutcome, evaluateBlackjack } from "src/functions/gameplay";
	import { roomId } from "src/stores";
	import RoomId from "./RoomId.svelte";
	import { idToName, userId } from "src/socket";

	export let playerHand: IHand;
	export let dealerHand: IHand;
	export let otherPlayersHand: Map<string, IHand>;
	export let progress: EProgress;
	export let bet: number;
	let outcome: EOutcome | undefined;
	let hasPlacedBet: boolean;
	$: allHandHidden = progress === EProgress.NewGame || progress === EProgress.PlayersTurn;

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
/>
<div class="table">
	<Hand
		{...dealerHand}
		playerName={"dealer"}
		hasHoleCard={allHandHidden}
	/>
	{#each [...otherPlayersHand] as [playerId, hand], index}
		{#if playerId !== $userId}
		{@const playerIndex = index >= 2 ? index + 1 : index}
		<Hand 
			{...hand}
			{playerId}
			index={playerIndex}
			playerName={$idToName.get(playerId) ?? "unknown"}
			hasHoleCard={allHandHidden}
			/>
		{/if}
	{/each}
	<Hand
		{...playerHand}
		playerId={$userId}
		index={2}
		playerName={"You"}
	/>
</div>
<Money
	{progress}
	{outcome}
	bind:bet={bet}
	on:betPlaced={(e) => hasPlacedBet = e.detail}
/>
<RoomId string={$roomId}></RoomId>
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
		/* justify-content: space-around; */
		align-items: center;
		margin: 96px 0;
	}
</style>