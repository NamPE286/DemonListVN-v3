<script lang="ts">
	type CardSize = '1x1' | '2x1' | '3x1' | '4x1';

	interface CardConfig {
		id: string;
		visible: boolean;
		size: CardSize;
		order: number;
	}

	export let cardConfigs: CardConfig[];
	export let config: CardConfig;
	export let draggedCard: string | null;
	export let isCustomizing: boolean = false;

	function handleDragStart(e: DragEvent, cardId: string) {
		if (!isCustomizing) return;
		draggedCard = cardId;
		if (e.dataTransfer) {
			e.dataTransfer.effectAllowed = 'move';
		}
	}

	function handleDragOver(e: DragEvent) {
		if (!isCustomizing) return;
		e.preventDefault();
		if (e.dataTransfer) {
			e.dataTransfer.dropEffect = 'move';
		}
	}

	function handleDrop(e: DragEvent, targetCardId: string) {
		if (!isCustomizing || !draggedCard) return;
		e.preventDefault();

		const draggedIndex = cardConfigs.findIndex((c) => c.id === draggedCard);
		const targetIndex = cardConfigs.findIndex((c) => c.id === targetCardId);

		if (draggedIndex !== -1 && targetIndex !== -1) {
			const draggedOrder = cardConfigs[draggedIndex].order;
			const targetOrder = cardConfigs[targetIndex].order;

			cardConfigs = cardConfigs.map((c) => {
				if (c.id === draggedCard) {
					return { ...c, order: targetOrder };
				}
				if (c.id === targetCardId) {
					return { ...c, order: draggedOrder };
				}
				return c;
			});
		}

		draggedCard = null;
	}
</script>

<div
	class="card-wrapper card-{config.size}"
	class:dragging={isCustomizing}
	draggable={isCustomizing}
	role="button"
	tabindex={isCustomizing ? 0 : -1}
	on:dragstart={(e) => handleDragStart(e, config.id)}
	on:dragover={handleDragOver}
	on:drop={(e) => handleDrop(e, config.id)}
>
	<slot />
</div>

<style>
	.card-wrapper {
		transition: all 0.2s ease;
		position: relative;
	}

	.card-wrapper.dragging {
		cursor: move;
		opacity: 0.8;
	}

	.card-wrapper.dragging:hover {
		transform: scale(1.02);
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
	}

	.card-wrapper.dragging::before {
		content: '⋮⋮';
		position: absolute;
		top: 10px;
		right: 10px;
		font-size: 1.2rem;
		opacity: 0.3;
		pointer-events: none;
		z-index: 10;
	}

	.card-1x1 {
		grid-column: span 1;
	}

	.card-2x1 {
		grid-column: span 2;
	}

	.card-3x1 {
		grid-column: span 3;
	}

	.card-4x1 {
		grid-column: span 4;
	}

	@media screen and (max-width: 900px) {
		.card-2x1,
		.card-3x1,
		.card-4x1 {
			grid-column: span 1;
		}
	}
</style>
