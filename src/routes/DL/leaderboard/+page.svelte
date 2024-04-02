<script>
	import * as Tabs from '$lib/components/ui/tabs';
	import * as Popover from '$lib/components/ui/popover';
	import * as Pagination from '$lib/components/ui/pagination';
	import { Button } from '$lib/components/ui/button';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';

	let totalCount = 1;
	let pageSize = 30;

	async function getTotalPage() {
		const query = new URLSearchParams({
			start: '0',
			end: '0',
			sortBy: 'dlTop',
			ascending: 'false'
		});

		fetch(`${import.meta.env.VITE_API_URL}/list/DL?${query.toString()}`)
			.then((res) => res.json())
			.then((res) => {
				totalCount = res[0].data.dlTop;
			});
	}

	onMount(() => {
		getTotalPage();
	});
</script>

<svelte:head>
	<title>Demon List - Demon List VN</title>
</svelte:head>

<div class="title">
	<h1>Demon List</h1>
	<p>Hardest level beaten by Vietnamese</p>
</div>

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
		<Popover.Root>
			<Popover.Trigger>
				<Button variant="outline">Filter</Button>
			</Popover.Trigger>
			<Popover.Content>Place content for the popover here.</Popover.Content>
		</Popover.Root>
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
					<Pagination.Link {page} isActive={currentPage == page.value}>
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
