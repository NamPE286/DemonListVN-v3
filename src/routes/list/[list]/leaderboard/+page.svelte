<script lang="ts">
	import * as Pagination from '$lib/components/ui/pagination';
	import * as Table from '$lib/components/ui/table';
	import PlayerHoverCard from '$lib/components/playerHoverCard.svelte';

	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';

	import type { PageData } from './$types';
	import { Play } from 'svelte-radix';

	export let data: PageData;
	let curPage = -1;
	let calibrated = false;

	async function update() {
		curPage = parseInt($page.url.searchParams.get('page') || '1');
	}

	$: $page.url, update();

	onMount(() => {
		console.log(data);
		document.getElementById(`page${curPage}`)?.click();
	});
</script>

<svelte:head>
	<title>Leaderboard - Demon List - Demon List VN</title>
</svelte:head>

<div class="tableWrapper">
	<Table.Root>
		<Table.Header>
			<Table.Row>
				<Table.Head class="w-[55px]">Rank</Table.Head>
				<Table.Head>Player</Table.Head>
				<Table.Head class="text-right">
					{$page.params.list == 'dl' ? 'Rating' : 'Total point'}
				</Table.Head>
			</Table.Row>
		</Table.Header>
		<Table.Body>
			{#each data.leaderboard as player}
				<Table.Row>
					<Table.Cell class="font-medium">
						#{$page.params.list == 'dl'
							? player.data.overallRank
							: player.data[$page.params.list + 'rank']}
					</Table.Cell>
					<Table.Cell>
						<PlayerHoverCard player={player} />
					</Table.Cell>
					<Table.Cell class="text-right">
						{$page.params.list == 'dl'
							? player.data.rating
							: player.data['total' + $page.params.list.toUpperCase() + 'pt']}
					</Table.Cell>
				</Table.Row>
			{/each}
		</Table.Body>
	</Table.Root>
</div>

<Pagination.Root count={data.count} perPage={50} let:pages let:currentPage>
	<Pagination.Content>
		<Pagination.Item>
			<Pagination.PrevButton />
		</Pagination.Item>
		{#each pages as page (page.key)}
			{#if page.type === 'ellipsis'}
				<Pagination.Item>
					<Pagination.Ellipsis />
				</Pagination.Item>
			{:else}
				<Pagination.Item isVisible={currentPage == page.value}>
					<Pagination.Link
						{page}
						isActive={currentPage == page.value}
						on:click={() => {
							if (!calibrated) {
								calibrated = true;
							} else {
								goto(`/list/dl/leaderboard?page=${page.value}`);
							}
						}}
						id={`page${page.value}`}
					>
						{page.value}
					</Pagination.Link>
				</Pagination.Item>
			{/if}
		{/each}
		<Pagination.Item>
			<Pagination.NextButton />
		</Pagination.Item>
	</Pagination.Content>
</Pagination.Root>

<style lang="scss">
	.tableWrapper {
		margin-inline: auto;
		margin-bottom: 25px;
		width: 1000px;
		max-width: calc(100% - 40px);
	}

</style>
