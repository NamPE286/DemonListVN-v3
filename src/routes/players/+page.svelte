<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import * as Table from '$lib/components/ui/table';
	import * as Select from '$lib/components/ui/select';
	import { Switch } from '$lib/components/ui/switch';
	import { Button } from '$lib/components/ui/button';
	import { Label } from '$lib/components/ui/label/index.js';
	import { toast } from 'svelte-sonner';
	import { ScrollArea } from '$lib/components/ui/scroll-area/index.js';
	import Loading from '$lib/components/animation/loading.svelte';
	import type { PageData } from './$types';

	export let data: PageData;
    let players: any[] = []

	const defaultValue: any = {
		province: null,
		city: null,
		sortBy: null,
		ascending: true
	};

	let filter = structuredClone(defaultValue);
	let state = 0;
    let pointProp: string = 'rating'

	function reset() {
		filter = structuredClone(defaultValue);
	}

	async function apply() {
		state = 1;
		const x: any = structuredClone(filter);

		try {
			x.province = x.province.value;
			x.city = x.city.value;
			x.sortBy = x.sortBy.value;
		} catch {
			toast.error('Invalid query.');
			state = 0;
			return;
		}

        pointProp = x.sortBy.value
		const query = new URLSearchParams(x);

		toast.error('An error occured.');
	}
</script>

<svelte:head>
	<title>Players - Demon List VN</title>
</svelte:head>

<div class="wrapper">
	<Card.Root class="ml-auto mr-auto max-w-[1000px] mb-[50px]">
		<Card.Header>
			<Card.Title>Filter</Card.Title>
		</Card.Header>
		<Card.Content>
			<h4>Location</h4>
			<div class="selectWrapper">
				<Select.Root bind:selected={filter.province}>
					<Select.Trigger>
						<Select.Value placeholder="Province" />
					</Select.Trigger>
					<Select.Content>
						<ScrollArea class="h-[300px]">
							{#each data.provinces.list as province}
								<Select.Item value={province.name} on:click={() => (filter = filter)}
									>{province.name}</Select.Item
								>
							{/each}
						</ScrollArea>
					</Select.Content>
				</Select.Root>
				<Select.Root disabled={filter.province == null} bind:selected={filter.city}>
					<Select.Trigger>
						<Select.Value placeholder="City" />
					</Select.Trigger>
					<Select.Content>
						<ScrollArea class="h-[300px]">
							{#each data.provinces.map[filter.province.value].cities as city}
								<Select.Item value={city}>{city}</Select.Item>
							{/each}
						</ScrollArea>
					</Select.Content>
				</Select.Root>
			</div>
			<h4 class="mt-[10px]">Option</h4>
			<div class="selectWrapper">
				<Select.Root bind:selected={filter.sortBy}>
					<Select.Trigger>
						<Select.Value placeholder="Sort by" />
					</Select.Trigger>
					<Select.Content>
						<Select.Item value="rating">Rating</Select.Item>
						<Select.Item value="totalFLpt">Featured list point</Select.Item>
					</Select.Content>
				</Select.Root>
				<div class="flex items-center space-x-2">
					<Switch id="airplane-mode" bind:checked={filter.ascending} />
					<Label for="airplane-mode">Sort ascending</Label>
				</div>
			</div>
		</Card.Content>
		<Card.Footer>
			<Button variant="outline" class="ml-auto" on:click={reset}>Reset</Button>
			<Button type="submit" class="ml-[10px] transition-all" on:click={apply}>
				{#if state == 0}
					Apply
				{:else}
					<Loading />
				{/if}
			</Button>
		</Card.Footer>
	</Card.Root>
	<Table.Root>
		<Table.Caption>Total player: {players.length}</Table.Caption>
		<Table.Header>
			<Table.Row>
				<Table.Head>Player</Table.Head>
				<Table.Head class="w-[80px] text-center">
                    {pointProp == 'rating' ? 'Rating' : 'Total point'}
                </Table.Head>
			</Table.Row>
		</Table.Header>
		<Table.Body>
			<Table.Row>
				<Table.Cell class="font-medium">INV001</Table.Cell>
				<Table.Cell class="text-center">$250.00</Table.Cell>
			</Table.Row>
		</Table.Body>
	</Table.Root>
</div>

<style lang="scss">
	h4 {
		font-weight: 600;
		margin-bottom: 10px;
	}

	.wrapper {
		padding-top: 50px;
		padding-inline: 100px;
	}

	.selectWrapper {
		display: grid;
		grid-template-columns: calc(50% - 10px) calc(50% - 10px);
		gap: 20px;
	}

	@media screen and (max-width: 900px) {
		.wrapper {
			padding-inline: 20px;
		}
	}

	@media screen and (max-width: 600px) {
		.selectWrapper {
			grid-template-columns: 100%;
			gap: 10px;
		}
	}
</style>
