<script lang="ts">
	import { fade, fly } from "svelte/transition";
	import { cubicInOut, sineIn } from "svelte/easing";
	import Card from "src/routes/game/Card.svelte";
	import type { ICard } from "src/models/interfaces/card.interface";
	import { EDuration } from "src/models/enums/duration.enum";
	import { addCardsToHand, createHand } from "src/functions/gameplay";
	import { playerTurn } from "src/socket";

	export let cards: ICard[];
	export let total: number;
	export let soft: boolean;
	export let hasHoleCard: boolean = false;
	export let playerName: string;
	export let index: number | undefined = undefined;
	export let playerId: string = ""
	let visibleTotal: number;
	let showFallbackTotal: boolean;

	// Update total when hole card is revealed
	$: {
		setTotal(hasHoleCard);
	}

	$: isPlayerTurn = !!playerId && $playerTurn === playerId;

	function setTotal(hasHoleCard: boolean): void {
		if (!hasHoleCard) {
			visibleTotal = total;
			showFallbackTotal = soft;
		} else {
			const visibleCards = cards.slice(1);
			const visibleHand = createHand();
			const { total, soft } = addCardsToHand(visibleHand, ...visibleCards);
			visibleTotal = total;
			showFallbackTotal = soft;
		}
	}

	function cardStyles (index: number): string {
		const x = index * -70;
		const y = index * 10;
		const rotate = -8 + (index * 3);
		return `transform: translateX(${x}%) translateY(${y}%) rotate(${rotate}deg)`;
	}

	function rotateAndTranslate(index: number | undefined): string {
		if (index === undefined) {
			return "";
		}
		const rotation = (index + 1) * 30;
		const radius = window.innerHeight / 2
		return `transform: rotate(${rotation}deg) translate(${radius}px) rotate(${-rotation}deg)`
	}

</script>

<div class="hand" style={rotateAndTranslate(index)} class:glowingBorder={isPlayerTurn} >
	<h3 class="total">
		{#if visibleTotal > 0}
			<span class="total__value"
				data-testid="total"
				in:fade={{
					easing: cubicInOut,
					duration: EDuration.Text
				}}
			>
				{visibleTotal}
				{#if showFallbackTotal}
				/ {visibleTotal - 10}
				{/if}
			</span>
		{/if}
	</h3>
	<ul class="cards">
		{#each cards as card, i}
			<li style={cardStyles(i)}
				transition:fly={{
					opacity: 1,
					x: window.innerWidth / 2,
					y: -window.innerHeight / 2,
					easing: sineIn,
					duration: EDuration.Card
				}}
				on:introend={() => setTotal(hasHoleCard)}
				on:outrostart={() => setTotal(hasHoleCard)}
			>
				<Card
					code={card.code}
					hidden={i === 0 && hasHoleCard}
				/>
			</li>
		{/each}
	</ul>
	<h2 class="name" style:color={isPlayerTurn ? 'white' : 'grey'}>{playerName}</h2>
</div>

<style>
	.hand {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		height: 302px;
		position: absolute;
	}
	.glowingBorder {
		border: 4px solid green;
		border-radius: 10px;
		animation: glow 1s ease-in-out infinite;
		animation-direction: alternate;
	}
	.name {
		margin-top: 30px;
	}
	@keyframes glow {
    from {
      box-shadow: 0 0 5px 2px green;
    }
    to {
      box-shadow: 0 0 20px 5px green;
    }
  }

	.cards {
		display: flex;
		width: var(--card-width)
	}

	.total {
		font-size: 36px;
		margin-bottom: 8px;
		height: 60px;
	}
</style>