<script lang="ts">
	import { onMount } from 'svelte';
	import * as Card from '$lib/components/ui/card/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import * as Popover from '$lib/components/ui/popover/index.js';
	import { get } from 'svelte/store';
	import { _ } from 'svelte-i18n';
	import { user } from '$lib/client';

	export let quest: any;
	let claimBtnDisabled = true;

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

	async function checkQuest() {
		const res = await fetch(`${import.meta.env.VITE_API_URL}/event/quest/${quest.id}/check`, {
			method: 'GET',
			headers: {
				Authorization: 'Bearer ' + (await $user.token())
			}
		});

		return res.ok;
	}

	onMount(async () => {
		const claimable = await checkQuest();

		if (claimable) {
			claimBtnDisabled = false;
		}
	});
</script>

<Card.Root>
	<Card.Header>
		<div class="flex w-full items-center">
			<div class="flex flex-col gap-[10px]">
				<Card.Title>{quest.title}</Card.Title>
				<div class="flex gap-[10px]">
					{#each quest.rewards as reward}
						<Popover.Root>
							<Popover.Trigger>
								<button class="clickable">
									<div
										class="flex h-[75px] w-[75px] items-center justify-center overflow-hidden rounded-md bg-neutral-800"
										style="border-bottom: 4px solid {rarityColor(reward.rarity)};"
									>
										<img
											class="max-h-full max-w-full object-contain p-2"
											src={`https://cdn.demonlistvn.com/items/${reward.id}.webp`}
											alt={reward.name}
										/>
									</div>
								</button>
							</Popover.Trigger>
							<Popover.Content>
								<div class="flex items-start gap-3">
									<img
										class="h-16 w-16 object-contain"
										src={`https://cdn.demonlistvn.com/items/${reward.id}.webp`}
										alt={reward.name}
									/>
									<div>
										<div class="font-medium">{reward.name}</div>
										<div class="text-sm text-neutral-400">
											Rarity:
											<span class="font-bold" style="color: {rarityColor(reward.rarity)}"
												>{rarityName(reward.rarity)}</span
											>
										</div>
										{#if reward.description}
											<div class="text-sm text-neutral-400">{reward.description}</div>
										{/if}
									</div>
								</div>
							</Popover.Content>
						</Popover.Root>
					{/each}
				</div>
			</div>
			<Button class="ml-auto" disabled={claimBtnDisabled}>Claim</Button>
		</div>
	</Card.Header>
</Card.Root>
