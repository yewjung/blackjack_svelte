<script lang="ts">
	import type { CardCode } from "src/models/types/card-code.type";
	import { EDuration } from "src/models/enums/duration.enum";
	import { getSuit, getValue } from "src/functions/card";
	import { images } from "src/stores";

	export let code: CardCode;
	export let hidden: boolean;
	const backSrc = $images.get("CARD_BACK");
	let cardAlt: string;
	$: name = getName(code);
	$: cardSrc = $images.get(name);
	$: cardAlt = getAltText(name);

	function getName(cardCode: CardCode): string {
		if (cardCode === "HIDDEN") {
			return "CARD_BACK";
		}
		const value = getValue(cardCode);
		const suit = getSuit(cardCode);
		return `${value}_${suit}`;
	}

	function getAltText(name: string) {
		if (name === "HIDDEN") {
			return "HIDDEN"
		}
		const [number, suit] = name
			.split("_")
			.map(value => value[0] + value.substring(1).toLowerCase());
		return `${number} of ${suit}`;
	}
</script>

<div class="card"
	class:hidden={hidden}
>
	<div class="container"
		style="transition-duration: {EDuration.Card}ms"
	>
		<img class="front"
			src={cardSrc}
			alt={cardAlt}
		>
		<img class="back"
			src={backSrc}
			alt="Back of card"
		/>
	</div>
</div>

<style>
	.card {
		width: var(--card-width);
		height: 223px;
		perspective: 1000px;
	}

	.container {
		position: relative;
		width: 100%;
		height: 100%;
		transition-property: transform;
		transform-style: preserve-3d;
	}

	.card.hidden .container {
		transform: rotateY(180deg);
	}

	.front,
	.back {
		position: absolute;
		width: 100%;
		height: 100%;
		-webkit-backface-visibility: hidden;
		backface-visibility: hidden;
	}

	.back {
		transform: rotateY(180deg);
	}
</style>