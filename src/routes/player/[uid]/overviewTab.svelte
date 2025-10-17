<script lang="ts">
	import type { PageData } from './$types';
	import * as Card from '$lib/components/ui/card';
	import * as Tooltip from '$lib/components/ui/tooltip';
	import * as Select from '$lib/components/ui/select';
	import { Button } from '$lib/components/ui/button';
	import Heatmap from '$lib/components/heatmap.svelte';
	import LevelCard from '$lib/components/levelCard.svelte';
	import RecordDetail from '$lib/components/recordDetail.svelte';
	import { getTitle } from '$lib/client';
	import { _ } from 'svelte-i18n';
	import { getExpLevel } from '$lib/client/getExpLevel';
	import { isActive } from '$lib/client/isSupporterActive';
	import { user } from '$lib/client';
	import { onMount } from 'svelte';

	export let data: PageData;

	$: exp = data.player.exp + data.player.extraExp;
	$: expLevel = getExpLevel(exp);
	$: dlRecords = data.records.dl || [];
	$: flRecords = data.records.fl || [];
	$: plRecords = data.records.pl || [];
	$: allRecords = [...dlRecords, ...flRecords, ...plRecords];
	$: mobileRecords = allRecords.filter((r) => r.mobile).length;
	$: pcRecords = allRecords.filter((r) => !r.mobile).length;
	$: hardestLevel = dlRecords.length > 0 ? dlRecords[0] : null;
	$: recentRecords = allRecords
		.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
		.slice(0, 5);
	$: avgRefreshRate =
		allRecords.filter((r) => r.refreshRate).length > 0
			? Math.round(
					allRecords.filter((r) => r.refreshRate).reduce((acc, r) => acc + r.refreshRate, 0) /
						allRecords.filter((r) => r.refreshRate).length
				)
			: 0;
	$: isOwner = $user.loggedIn && $user.data?.uid === data.player.uid;
	$: canCustomize = isOwner && isActive(data.player.supporterUntil);

	let selectedRecord: { uid: string; levelID: number } | null = null;
	let recordDetailOpen = false;

	let isCustomizing = false;
	let draggedCard: string | null = null;

	type CardSize = '1x1' | '2x1' | '3x1' | '4x1';

	interface CardConfig {
		id: string;
		visible: boolean;
		size: CardSize;
		order: number;
	}

	const defaultCards: CardConfig[] = [
		{ id: 'ratings', visible: true, size: '2x1', order: 0 },
		{ id: 'heatmap', visible: true, size: '2x1', order: 1 },
		{ id: 'totalRecords', visible: false, size: '1x1', order: 2 },
		{ id: 'deviceStats', visible: false, size: '1x1', order: 3 },
		{ id: 'hardestDemon', visible: false, size: '2x1', order: 4 },
		{ id: 'recentActivity', visible: false, size: '2x1', order: 5 }
	];

	let cardConfigs: CardConfig[] = [];
	let savedCardConfigs: CardConfig[] = [];

	onMount(() => {
		const saved = localStorage.getItem(`player-cards-${data.player.uid}`);
		if (saved) {
			try {
				cardConfigs = JSON.parse(saved);
			} catch {
				cardConfigs = [...defaultCards];
			}
		} else {
			cardConfigs = [...defaultCards];
		}
	});

	function saveConfig() {
		localStorage.setItem(`player-cards-${data.player.uid}`, JSON.stringify(cardConfigs));
	}

	$: visibleCards = cardConfigs.filter((c) => c.visible).sort((a, b) => a.order - b.order);

	function toggleCardVisibility(cardId: string) {
		cardConfigs = cardConfigs.map((c) => (c.id === cardId ? { ...c, visible: !c.visible } : c));
	}

	function changeCardSize(cardId: string, size: CardSize) {
		cardConfigs = cardConfigs.map((c) => (c.id === cardId ? { ...c, size } : c));
	}

	function startCustomizing() {
		// Save current state before entering customize mode
		savedCardConfigs = JSON.parse(JSON.stringify(cardConfigs));
		isCustomizing = true;
	}

	function cancelCustomizing() {
		// Revert to saved state
		cardConfigs = JSON.parse(JSON.stringify(savedCardConfigs));
		isCustomizing = false;
	}

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

	function resetToDefault() {
		cardConfigs = [...defaultCards];
		saveConfig();
	}

	function openRecordDetail(uid: string, levelID: number) {
		selectedRecord = { uid, levelID };
		recordDetailOpen = true;
	}

	function getBorderStyle() {
		if (isActive(data.player.supporterUntil)) {
			return `border-color: ${data.player.borderColor}`;
		}

		return '';
	}

	function saveCardPositions(
		positions: Record<string, { order: number; visible: boolean; size: CardSize }>
	) {
		// TODO: Implement save card positions logic
		console.log('Saving card positions:', positions);
	}

	function handleSavePositions() {
		const positions: Record<string, { order: number; visible: boolean; size: CardSize }> = {};
		cardConfigs.forEach((card) => {
			positions[card.id] = {
				order: card.order,
				visible: card.visible,
				size: card.size
			};
		});
		saveCardPositions(positions);
		saveConfig();
		isCustomizing = false;
	}
</script>

{#if selectedRecord}
	<RecordDetail
		uid={selectedRecord.uid}
		levelID={selectedRecord.levelID}
		bind:open={recordDetailOpen}
	/>
{/if}

{#if canCustomize}
	<div class="customize-controls">
		<Button
			variant={isCustomizing ? 'default' : 'outline'}
			size="sm"
			on:click={() => (isCustomizing ? cancelCustomizing() : startCustomizing())}
		>
			{isCustomizing ? $_('player.overview.exit_customize') : $_('player.overview.customize')}
		</Button>
		{#if isCustomizing}
			<Button variant="outline" size="sm" on:click={resetToDefault}>
				{$_('player.overview.reset_layout')}
			</Button>
			<Button variant="default" size="sm" on:click={handleSavePositions}>
				{$_('player.overview.save') || 'Save'}
			</Button>
		{/if}
	</div>
{/if}

{#if isCustomizing && canCustomize}
	<div class="customize-panel">
		<h3>{$_('player.overview.card_settings')}</h3>
		<div class="card-controls">
			{#each cardConfigs as config}
				<div class="card-control-item">
					<label class="card-control-label">
						<input
							type="checkbox"
							checked={config.visible}
							on:change={() => toggleCardVisibility(config.id)}
						/>
						<span>{$_(`player.overview.card_${config.id}`)}</span>
					</label>
					{#if config.visible}
						<Select.Root
							selected={{ label: config.size, value: config.size }}
							onSelectedChange={(e) => {
								if (e && e.value) {
									changeCardSize(config.id, e.value);
								}
							}}
						>
							<Select.Trigger class="w-[100px]">
								<Select.Value />
							</Select.Trigger>
							<Select.Content>
								<Select.Item value="1x1">1x1</Select.Item>
								<Select.Item value="2x1">2x1</Select.Item>
								<Select.Item value="3x1">3x1</Select.Item>
								<Select.Item value="4x1">4x1</Select.Item>
							</Select.Content>
						</Select.Root>
					{/if}
				</div>
			{/each}
		</div>
		<p class="customize-hint">{$_('player.overview.drag_hint')}</p>
	</div>
{/if}

<div class="overview-grid" class:customizing={isCustomizing}>
	{#each visibleCards as config (config.id)}
		{#if config.id === 'heatmap'}
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
				<div class="heatmap-wrapper">
					{#key data.player.uid}
						<Heatmap uid={data.player.uid} />
					{/key}
				</div>
			</div>
		{:else if config.id === 'ratings'}
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
				<Card.Root style={getBorderStyle()}>
					<Card.Header>
						<Card.Title class="text-lg">{$_('player.overview.ratings')}</Card.Title>
					</Card.Header>
					<Card.Content>
						<div class="exp-section">
							<div class="exp-level">
								<b>{$_('player.level')}.{expLevel.level}</b>
							</div>
							<div class="progressBar">
								<div class="progress" style={`width: ${expLevel.progress}%`}>
									<b>{expLevel.progress}%</b>
								</div>
							</div>
							<Tooltip.Root>
								<Tooltip.Trigger class="exp-text">{exp}/{expLevel.upperBound}</Tooltip.Trigger>
								<Tooltip.Content>
									<p>{expLevel.upperBound - exp} {$_('player.exp_to_next')}</p>
								</Tooltip.Content>
							</Tooltip.Root>
						</div>
						<div class="ratings-grid">
							<div class="rating-item">
								<span class="rating-label">{$_('player_card.rating')}</span>
								<Tooltip.Root>
									<Tooltip.Trigger>
										<div
											class="rating-badge text-white"
											style={`background-color: ${getTitle('dl', data.player)?.color}`}
										>
											{data.player.rating}
										</div>
									</Tooltip.Trigger>
									<Tooltip.Content>{getTitle('dl', data.player)?.fullTitle}</Tooltip.Content>
								</Tooltip.Root>
								<span class="rating-rank">#{data.player.overallRank}</span>
							</div>
							<div class="rating-item">
								<span class="rating-label">{$_('player_card.featured')}</span>
								<div class="rating-badge">
									{data.player.totalFLpt}
								</div>
								<span class="rating-rank">#{data.player.flrank}</span>
							</div>
							<div class="rating-item">
								<span class="rating-label">{$_('player_card.contest')}</span>
								<Tooltip.Root>
									<Tooltip.Trigger>
										<div
											class="rating-badge"
											style={`background-color: ${getTitle('elo', data.player)?.color}`}
										>
											{#if data.player.matchCount < 5}
												<span class="opacity-50">{data.player.elo}?</span>
											{:else}
												{data.player.elo}
											{/if}
										</div>
									</Tooltip.Trigger>
									<Tooltip.Content>{getTitle('elo', data.player)?.fullTitle}</Tooltip.Content>
								</Tooltip.Root>
							</div>
						</div>
					</Card.Content>
				</Card.Root>
			</div>
		{:else if config.id === 'totalRecords'}
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
				<Card.Root style={getBorderStyle()}>
					<Card.Header>
						<Card.Title class="text-lg">{$_('player.overview.total_records')}</Card.Title>
					</Card.Header>
					<Card.Content>
						<div class="stat-value">{allRecords.length}</div>
						<div class="stat-breakdown">
							<div class="stat-item">
								<span class="stat-label">Classic</span>
								<span class="stat-number">{dlRecords.length}</span>
							</div>
							<div class="stat-item">
								<span class="stat-label">Featured</span>
								<span class="stat-number">{flRecords.length}</span>
							</div>
							<div class="stat-item">
								<span class="stat-label">Platformer</span>
								<span class="stat-number">{plRecords.length}</span>
							</div>
						</div>
					</Card.Content>
				</Card.Root>
			</div>
		{:else if config.id === 'deviceStats'}
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
				<Card.Root style={getBorderStyle()}>
					<Card.Header>
						<Card.Title class="text-lg">{$_('player.overview.device_stats')}</Card.Title>
					</Card.Header>
					<Card.Content>
						<div class="device-stats">
							<div class="device-item">
								<div class="device-icon">💻</div>
								<div class="device-info">
									<div class="device-label">PC</div>
									<div class="device-value">{pcRecords}</div>
									<div class="device-percent">
										{allRecords.length > 0 ? Math.round((pcRecords / allRecords.length) * 100) : 0}%
									</div>
								</div>
							</div>
							<div class="device-item">
								<div class="device-icon">📱</div>
								<div class="device-info">
									<div class="device-label">Mobile</div>
									<div class="device-value">{mobileRecords}</div>
									<div class="device-percent">
										{allRecords.length > 0
											? Math.round((mobileRecords / allRecords.length) * 100)
											: 0}%
									</div>
								</div>
							</div>
						</div>
						{#if avgRefreshRate > 0}
							<div class="mt-3 text-center text-sm opacity-70">
								{$_('player.overview.avg_fps')}: {avgRefreshRate}fps
							</div>
						{/if}
					</Card.Content>
				</Card.Root>
			</div>
		{:else if config.id === 'hardestDemon'}
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
				<Card.Root style={getBorderStyle()}>
					<Card.Header>
						<Card.Title class="text-lg">{$_('player.overview.hardest_demon')}</Card.Title>
					</Card.Header>
					<Card.Content>
						{#if hardestLevel}
							<LevelCard level={hardestLevel.levels} type="dl" />
						{:else}
							<div class="no-records">{$_('player.overview.no_data')}</div>
						{/if}
					</Card.Content>
				</Card.Root>
			</div>
		{:else if config.id === 'recentActivity'}
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
				<Card.Root style={getBorderStyle()}>
					<Card.Header>
						<Card.Title class="text-lg">{$_('player.overview.recent_activity')}</Card.Title>
					</Card.Header>
					<Card.Content>
						{#if recentRecords.length > 0}
							<div class="recent-list">
								{#each recentRecords as record}
									<button
										class="recent-item"
										on:click={() => openRecordDetail(record.userid, record.levelid)}
									>
										<span class="recent-level-name">
											{record.levels.name}
										</span>
										<div class="recent-meta">
											<span class="recent-device">{record.mobile ? '📱' : '💻'}</span>
											<span class="recent-date">
												{new Date(record.timestamp).toLocaleDateString('vi-VN')}
											</span>
										</div>
									</button>
								{/each}
							</div>
						{:else}
							<div class="no-records">{$_('player.overview.no_records')}</div>
						{/if}
					</Card.Content>
				</Card.Root>
			</div>
		{/if}
	{/each}
</div>

<style lang="scss">
	.customize-controls {
		display: flex;
		gap: 10px;
		justify-content: center;
		margin-bottom: 15px;
		padding: 10px;
	}

	.customize-panel {
		background-color: rgba(128, 128, 128, 0.1);
		border-radius: 8px;
		padding: 20px;
		margin-bottom: 20px;

		h3 {
			font-size: 1.2rem;
			font-weight: bold;
			margin-bottom: 15px;
		}
	}

	.card-controls {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
		gap: 15px;
		margin-bottom: 15px;
	}

	.card-control-item {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 10px;
		padding: 10px;
		background-color: rgba(128, 128, 128, 0.1);
		border-radius: 6px;
	}

	.card-control-label {
		display: flex;
		align-items: center;
		gap: 8px;
		cursor: pointer;

		input[type='checkbox'] {
			width: 18px;
			height: 18px;
			cursor: pointer;
		}

		span {
			font-size: 0.95rem;
		}
	}

	.customize-hint {
		font-size: 0.9rem;
		opacity: 0.7;
		text-align: center;
		margin-top: 10px;
	}

	.card-wrapper {
		transition: all 0.2s ease;

		&.dragging {
			cursor: move;
			opacity: 0.8;

			&:hover {
				transform: scale(1.02);
				box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
			}
		}
	}

	.overview-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
		gap: 20px;
		padding: 20px;
		width: 100%;
		margin: 0 auto;

		&.customizing {
			.card-wrapper {
				position: relative;

				&::before {
					content: '⋮⋮';
					position: absolute;
					top: 10px;
					right: 10px;
					font-size: 1.2rem;
					opacity: 0.3;
					pointer-events: none;
					z-index: 10;
				}
			}
		}
	}

	.heatmap-wrapper {
		grid-column: 1 / -1;
		display: flex;
		justify-content: center;
		align-items: center;
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

	.exp-section {
		display: flex;
		align-items: center;
		gap: 15px;
		margin-bottom: 20px;
		padding: 15px;
		background-color: rgba(128, 128, 128, 0.1);
		border-radius: 8px;
	}

	.exp-level {
		min-width: 60px;
		text-align: center;
		font-size: 1rem;
	}

	.progressBar {
		background-color: gray;
		flex: 1;
		border-radius: 10px;
		overflow: hidden;

		b {
			color: var(--textColorInverted);
			margin-right: 5px;
		}

		.progress {
			background-color: var(--textColor);
			text-align: right;
			border-radius: 10px;
			padding: 2px 0;
		}
	}

	.stat-value {
		font-size: 3rem;
		font-weight: bold;
		text-align: center;
		margin-bottom: 10px;
	}

	.stat-breakdown {
		display: flex;
		flex-direction: column;
		gap: 8px;
		margin-top: 15px;
	}

	.stat-item {
		display: flex;
		justify-content: space-between;
		padding: 8px 12px;
		background-color: rgba(128, 128, 128, 0.1);
		border-radius: 8px;
	}

	.stat-label {
		font-size: 0.9rem;
		opacity: 0.8;
	}

	.stat-number {
		font-weight: 600;
		font-size: 1.1rem;
	}

	.device-stats {
		display: flex;
		justify-content: space-around;
		gap: 20px;
	}

	.device-item {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 10px;
		flex: 1;
	}

	.device-icon {
		font-size: 2.5rem;
	}

	.device-info {
		text-align: center;
	}

	.device-label {
		font-size: 0.9rem;
		opacity: 0.7;
		margin-bottom: 5px;
	}

	.device-value {
		font-size: 2rem;
		font-weight: bold;
	}

	.device-percent {
		font-size: 0.85rem;
		opacity: 0.6;
		margin-top: 2px;
	}

	.recent-list {
		display: flex;
		flex-direction: column;
		gap: 12px;
	}

	.recent-item {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 10px;
		background-color: rgba(128, 128, 128, 0.1);
		border-radius: 8px;
		transition: background-color 0.2s;
		width: 100%;
		border: none;
		color: inherit;
		cursor: pointer;
		text-align: left;

		&:hover {
			background-color: rgba(128, 128, 128, 0.2);
		}
	}

	.recent-level-name {
		font-weight: 500;
		flex: 1;
	}

	.recent-meta {
		display: flex;
		align-items: center;
		gap: 8px;
		font-size: 0.85rem;
		opacity: 0.7;
	}

	.recent-device {
		font-size: 1rem;
	}

	.no-records {
		text-align: center;
		padding: 20px;
		opacity: 0.6;
	}

	.ratings-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
		gap: 15px;
	}

	.rating-item {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 10px;
		padding: 15px;
		background-color: rgba(128, 128, 128, 0.1);
		border-radius: 8px;
	}

	.rating-label {
		font-size: 0.85rem;
		opacity: 0.7;
		text-align: center;
	}

	.rating-badge {
		padding: 8px 16px;
		border-radius: 8px;
		font-weight: bold;
		font-size: 1.5rem;
		background-color: rgba(128, 128, 128, 0.2);
		cursor: pointer;
	}

	.rating-rank {
		font-size: 0.9rem;
		font-weight: 600;
		opacity: 0.8;
	}

	@media screen and (max-width: 900px) {
		.card-2x1,
		.card-3x1,
		.card-4x1 {
			grid-column: span 1;
		}
	}

	@media screen and (max-width: 768px) {
		.overview-grid {
			grid-template-columns: 1fr;
			padding: 10px;
		}

		.stat-value {
			font-size: 2.5rem;
		}

		.device-icon {
			font-size: 2rem;
		}

		.device-value {
			font-size: 1.5rem;
		}

		.ratings-grid {
			grid-template-columns: 1fr;
		}

		.card-controls {
			grid-template-columns: 1fr;
		}
	}
</style>
