<script>
	import * as Tabs from '$lib/components/ui/tabs';
	import * as Pagination from '$lib/components/ui/pagination';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import BigTitle from '$lib/components/bigTitle.svelte';

	let totalCount = 1;
	let pageSize = 30;
	let curPage = -1;
	let calibrated = false;

	async function update() {
		curPage = parseInt($page.url.searchParams.get('page') || '1');
	}

	$: $page.url, update();

	onMount(() => {
		document.getElementById(`page${curPage}`)?.click();
	});
</script>

<svelte:head>
	<title>Leaderboard - Demon List - Demon List VN</title>
</svelte:head>

<BigTitle value="Demon List" description="Hardest level beaten by Vietnamese" />

<Tabs.Root value="leaderboard" class="tabs">
	<div class="tabsWrapper">
		<Tabs.List>
			<Tabs.Trigger
				value="levels"
				on:click={() => {
					goto('/DL');
				}}>Levels</Tabs.Trigger
			>
			<Tabs.Trigger
				value="leaderboard"
				on:click={() => {
					goto('/DL/leaderboard');
				}}>Leaderboard</Tabs.Trigger
			>
		</Tabs.List>
	</div>
</Tabs.Root>

<Pagination.Root count={totalCount} perPage={pageSize} let:pages let:currentPage>
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
								goto(`/DL/leaderboard?page=${page.value}`);
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
	.tabsWrapper {
		display: flex;
		justify-content: center;
		gap: 10px;
		margin-bottom: 25px;
	}
</style>
