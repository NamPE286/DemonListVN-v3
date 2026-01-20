<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { Button } from '$lib/components/ui/button';
	import { createEventDispatcher } from 'svelte';

	export let listType: 'dl' | 'pl' | 'fl' = 'dl';

	let topStart = '';
	let topEnd = '';
	let ratingMin = '';
	let ratingMax = '';
	let nameSearch = '';
	let creatorSearch = '';

	const dispatch = createEventDispatcher();

	function handleApplyFilters() {
		dispatch('filter', {
			topStart: topStart.trim() === '' ? null : topStart,
			topEnd: topEnd.trim() === '' ? null : topEnd,
			ratingMin: ratingMin.trim() === '' ? null : ratingMin,
			ratingMax: ratingMax.trim() === '' ? null : ratingMax,
			nameSearch: nameSearch.trim(),
			creatorSearch: creatorSearch.trim()
		});
	}

	function handleClearFilters() {
		topStart = '';
		topEnd = '';
		ratingMin = '';
		ratingMax = '';
		nameSearch = '';
		creatorSearch = '';
		dispatch('filter', {
			topStart: null,
			topEnd: null,
			ratingMin: null,
			ratingMax: null,
			nameSearch: '',
			creatorSearch: ''
		});
	}

	function getTopLabel() {
		return listType === 'fl' ? 'FL Top' : 'DL Top';
	}
</script>

<Card.Root class="filterCard">
	<Card.Header>
		<Card.Title>Filter Levels</Card.Title>
	</Card.Header>
	<Card.Content>
		<div class="filterGrid">
			<div class="filterRow">
				<div class="filterGroup">
					<Label for="topStart">Top Range</Label>
					<div class="rangeInputs">
						<Input
							id="topStart"
							type="number"
							placeholder="From"
							bind:value={topStart}
							on:keypress={(e) => e.key === 'Enter' && handleApplyFilters()}
						/>
						<span class="rangeSeparator">-</span>
						<Input
							id="topEnd"
							type="number"
							placeholder="To"
							bind:value={topEnd}
							on:keypress={(e) => e.key === 'Enter' && handleApplyFilters()}
						/>
					</div>
				</div>
				<div class="filterGroup">
					<Label for="ratingMin">Rating Range</Label>
					<div class="rangeInputs">
						<Input
							id="ratingMin"
							type="number"
							placeholder="Min"
							bind:value={ratingMin}
							on:keypress={(e) => e.key === 'Enter' && handleApplyFilters()}
						/>
						<span class="rangeSeparator">-</span>
						<Input
							id="ratingMax"
							type="number"
							placeholder="Max"
							bind:value={ratingMax}
							on:keypress={(e) => e.key === 'Enter' && handleApplyFilters()}
						/>
					</div>
				</div>
			</div>
			<div class="filterRow">
				<div class="filterGroup">
					<Label for="nameSearch">Level Name</Label>
					<Input
						id="nameSearch"
						type="text"
						placeholder="Search by name..."
						bind:value={nameSearch}
						on:keypress={(e) => e.key === 'Enter' && handleApplyFilters()}
					/>
				</div>
				<div class="filterGroup">
					<Label for="creatorSearch">Creator Name</Label>
					<Input
						id="creatorSearch"
						type="text"
						placeholder="Search by creator..."
						bind:value={creatorSearch}
						on:keypress={(e) => e.key === 'Enter' && handleApplyFilters()}
					/>
				</div>
			</div>
		</div>
		<div class="filterActions">
			<Button on:click={handleApplyFilters}>Apply Filters</Button>
			<Button variant="outline" on:click={handleClearFilters}>Clear</Button>
		</div>
	</Card.Content>
</Card.Root>

<style lang="scss">
	:global(.filterCard) {
		margin-bottom: 20px;
		max-width: 1020px;
		margin-inline: auto;
	}

	.filterGrid {
		display: flex;
		flex-direction: column;
		gap: 16px;
		margin-bottom: 16px;
	}

	.filterRow {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 16px;
	}

	.filterGroup {
		display: flex;
		flex-direction: column;
		gap: 8px;
	}

	.rangeInputs {
		display: flex;
		align-items: center;
		gap: 8px;
	}

	.rangeSeparator {
		font-weight: bold;
		color: var(--muted-foreground);
	}

	.filterActions {
		display: flex;
		gap: 8px;
		justify-content: flex-end;
	}

	@media screen and (max-width: 768px) {
		.filterRow {
			grid-template-columns: 1fr;
		}

		.filterActions {
			justify-content: stretch;
			flex-direction: column;
		}
	}
</style>
