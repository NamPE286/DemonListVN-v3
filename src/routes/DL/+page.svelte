<script lang="ts">
	import * as Tabs from '$lib/components/ui/tabs';
	import * as Pagination from '$lib/components/ui/pagination';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import type { PageData } from './$types';

	export let data: PageData;

	let curPage = -1;

	async function update() {
		curPage = parseInt($page.url.searchParams.get('page') || '1');
	}

	$: $page.url, update();

	onMount(async () => {
		document.getElementById(`page${curPage}`)?.click();
		console.log(data)
	});
</script>

<svelte:head>
	<title>Demon List - Demon List VN</title>
</svelte:head>

<div class="title">
	<h1>Demon List</h1>
	<p>Hardest level beaten by Vietnamese</p>
</div>

<Tabs.Root value="levels" class="tabs">
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

<Pagination.Root count={data.count} perPage={30} let:pages let:currentPage>
	<Pagination.Content>
		<Pagination.Item>
			<Pagination.PrevButton on:click={() => goto(`/DL?page=${currentPage - 1}`)} />
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
						on:click={() => goto(`/DL?page=${page.value}`)}
						id={`page${page.value}`}
					>
						{page.value}
					</Pagination.Link>
				</Pagination.Item>
			{/if}
		{/each}
		<Pagination.Item>
			<Pagination.NextButton on:click={() => goto(`/DL?page=${currentPage + 1}`)} />
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

	.title {
		display: flex;
		flex-direction: column;
		align-items: center;
		margin-top: 120px;
		margin-bottom: 50px;
	}

	h1 {
		font-size: 3.75rem;
		font-weight: 800;
	}

	p {
		font-size: 1.25rem;
		color: var(--textColor2);
	}

	@media screen and (max-width: 900px) {
		h1 {
			font-size: 1.875rem;
		}

		.title {
			margin-top: 80px;
		}
	}
</style>
