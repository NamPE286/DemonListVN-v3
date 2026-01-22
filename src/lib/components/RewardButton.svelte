<script lang="ts">
	import Gift from 'lucide-svelte/icons/gift';
	import Lock from 'lucide-svelte/icons/lock';
	import * as Popover from '$lib/components/ui/popover/index.js';
	import { get } from 'svelte/store';
	import { _ } from 'svelte-i18n';

	export let reward: any;
	export let isPremiumActivated: boolean = false;
	export let isPremiumTrack: boolean = false;
	export let isClaimable: boolean = false;
	export let editable: boolean = false;
	export let onRewardClick: (() => void) | null = null;
	export let onClaimReward: (() => void) | null = null;

	// Determine if item is locked due to premium requirement
	$: isPremiumLocked = isPremiumTrack && !isPremiumActivated;
	// Determine if item should have reduced opacity (tier not reached but accessible)
	$: shouldReduceOpacity = !isClaimable && !isPremiumLocked;

	function rarityColor(r: number) {
		switch (r) {
			case 1:
				return '#3b82f6';
			case 2:
				return '#a855f7';
			case 3:
				return '#ec4899';
			case 4:
				return '#dc2626';
			default:
				return '#9ca3af';
		}
	}

	function rarityName(r: number) {
		switch (r) {
			case 1:
				return get(_)('inventory.rarity_names.uncommon');
			case 2:
				return get(_)('inventory.rarity_names.rare');
			case 3:
				return get(_)('inventory.rarity_names.epic');
			case 4:
				return get(_)('inventory.rarity_names.legendary');
			default:
				return get(_)('inventory.rarity_names.common');
		}
	}

	$: itemData = reward?.items || reward;
</script>

{#if !editable}
	<Popover.Root>
		<Popover.Trigger asChild let:builder>
			<button
				{...builder}
				use:builder.action
				class="reward-slot relative flex h-20 w-20 items-center justify-center rounded-xl border-2 transition-all"
				class:border-yellow-500={isPremiumTrack && !isPremiumLocked}
				class:bg-yellow-500-10={isPremiumTrack && !isPremiumLocked}
				class:border-yellow-500-30={isPremiumTrack && isPremiumLocked}
				class:bg-yellow-500-5={isPremiumTrack && isPremiumLocked}
				class:border-blue-500={!isPremiumTrack && isClaimable}
				class:bg-blue-500-10={!isPremiumTrack && isClaimable}
				class:border-muted={!isPremiumTrack && !isClaimable}
				class:bg-muted-30={!isPremiumTrack && !isClaimable}
				class:opacity-50={shouldReduceOpacity}
				class:hover:scale-105={isClaimable}
				class:reward-claimable={isClaimable}
				on:click={() => {
					if (isClaimable && onClaimReward) {
						onClaimReward();
					}
				}}
			>
				{#if reward.quantity > 1}
					<span
						class="quantity-badge absolute bottom-0.5 right-0.5 flex h-5 min-w-5 items-center justify-center rounded-full px-1 text-xs font-bold"
						class:bg-yellow-500={isPremiumTrack}
						class:text-black={isPremiumTrack}
						class:bg-blue-500={!isPremiumTrack}
						class:text-white={!isPremiumTrack}
					>
						{reward.quantity}
					</span>
				{/if}
				{#if isPremiumLocked}
					<div class="absolute inset-0 flex items-center justify-center rounded-xl bg-black/50">
						<Lock class="h-6 w-6 text-muted-foreground" />
					</div>
				{:else if isClaimable}
					<div class="absolute inset-0 flex items-center justify-center rounded-xl bg-green-500/20">
						<Gift class="h-8 w-8 text-green-400" />
					</div>
				{/if}
				<div class="flex items-center justify-center p-2">
					{#if reward.items?.id || reward.itemId}
						<img
							class="h-12 w-12 object-contain"
							src={`https://cdn.demonlistvn.com/items/${reward.items?.id || reward.itemId}.webp`}
							alt={reward.description}
						/>
					{:else}
						<Gift class="h-8 w-8" />
					{/if}
				</div>
			</button>
		</Popover.Trigger>
		{#if itemData}
			<Popover.Content>
				<div class="flex items-start gap-3">
					<img
						class="h-16 w-16 object-contain"
						src={`https://cdn.demonlistvn.com/items/${itemData.id || reward.itemId}.webp`}
						alt={itemData.name}
					/>
					<div>
						<div class="font-medium">{itemData.name}</div>
						{#if itemData.rarity !== undefined}
							<div class="text-sm text-neutral-400">
								<b>{get(_)('events.quest.rarity_label')}</b>
								<span class="font-bold" style="color: {rarityColor(itemData.rarity)}"
									>{rarityName(itemData.rarity)}</span
								>
							</div>
						{/if}
						{#if itemData.description}
							<div class="text-sm text-neutral-400">
								<b>{get(_)('events.quest.description_label')}:</b>
								{itemData.description}
							</div>
						{/if}
						{#if reward.quantity > 1}
							<div class="text-sm text-neutral-400">
								<b>{get(_)('events.quest.quantity_label')}:</b>
								{reward.quantity}
							</div>
						{/if}
					</div>
				</div>
			</Popover.Content>
		{/if}
	</Popover.Root>
{:else}
	<button
		class="reward-slot relative flex h-20 w-20 items-center justify-center rounded-xl border-2 transition-all"
		class:border-yellow-500={isPremiumTrack}
		class:bg-yellow-500-10={isPremiumTrack}
		class:border-blue-500={!isPremiumTrack}
		class:bg-blue-500-10={!isPremiumTrack}
		class:hover:scale-105={true}
		class:hover:bg-yellow-500-20={isPremiumTrack}
		class:hover:bg-blue-500-20={!isPremiumTrack}
		on:click={() => {
			if (onRewardClick) {
				onRewardClick();
			}
		}}
	>
		{#if reward.quantity > 1}
			<span
				class="quantity-badge absolute bottom-0.5 right-0.5 flex h-5 min-w-5 items-center justify-center rounded-full px-1 text-xs font-bold"
				class:bg-yellow-500={isPremiumTrack}
				class:text-black={isPremiumTrack}
				class:bg-blue-500={!isPremiumTrack}
				class:text-white={!isPremiumTrack}
			>
				{reward.quantity}
			</span>
		{/if}
		<div class="flex items-center justify-center p-2">
			{#if reward.items?.id || reward.itemId}
				<img
					class="h-12 w-12 object-contain"
					src={`https://cdn.demonlistvn.com/items/${reward.items?.id || reward.itemId}.webp`}
					alt={reward.description}
				/>
			{:else}
				<Gift class="h-8 w-8" />
			{/if}
		</div>
	</button>
{/if}

<style lang="scss">
	.reward-claimable {
		cursor: pointer;
		transition: all 0.2s;

		&:hover {
			background-color: rgba(34, 197, 94, 0.3) !important;
		}
	}

	.quantity-badge {
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
	}

	/* Custom background color classes with opacity */
	:global(.bg-yellow-500-5) {
		background-color: rgb(234 179 8 / 0.05);
	}

	:global(.bg-yellow-500-10) {
		background-color: rgb(234 179 8 / 0.1);
	}

	:global(.bg-yellow-500-20) {
		background-color: rgb(234 179 8 / 0.2);
	}

	:global(.border-yellow-500-30) {
		border-color: rgb(234 179 8 / 0.3);
	}

	:global(.bg-blue-500-10) {
		background-color: rgb(59 130 246 / 0.1);
	}

	:global(.bg-blue-500-20) {
		background-color: rgb(59 130 246 / 0.2);
	}

	:global(.bg-muted-30) {
		background-color: hsl(var(--muted) / 0.3);
	}
</style>
