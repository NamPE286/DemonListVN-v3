<script lang="ts">
	import BaseCard from './BaseCard.svelte';
	import * as Card from '$lib/components/ui/card';
	import * as Tooltip from '$lib/components/ui/tooltip';
	import { getTitle } from '$lib/client';
	import { _ } from 'svelte-i18n';
	import { getExpLevel } from '$lib/client/getExpLevel';
	import { isActive } from '$lib/client/isSupporterActive';
	import type { CardConfig } from './types';
	import { getBorderStyle } from './getBorderStyle';

	export let data: any;
	export let cardConfigs: CardConfig[];
	export let config: CardConfig;
	export let draggedCard: string | null;
	export let isCustomizing: boolean = false;

	$: exp = data.player.exp + data.player.extraExp;
	$: expLevel = getExpLevel(exp);
</script>

<BaseCard bind:draggedCard bind:cardConfigs bind:config bind:isCustomizing>
	<Card.Root class="h-full" style={getBorderStyle(data.player)}>
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
</BaseCard>

<style lang="scss">
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

	@media screen and (max-width: 768px) {
		.ratings-grid {
			grid-template-columns: 1fr;
		}
	}
</style>
