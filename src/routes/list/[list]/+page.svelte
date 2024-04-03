<script lang="ts">
	import * as Tabs from '$lib/components/ui/tabs';
	import * as Pagination from '$lib/components/ui/pagination';

	import BigTitle from '$lib/components/bigTitle.svelte';
	import LevelCard from '$lib/components/levelCard.svelte';

	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import type { PageData } from './$types';

	export let data: PageData;

	let curPage = -1;
	let calibrated = false;

	async function update() {
		curPage = parseInt($page.url.searchParams.get('page') || '1');
	}

	$: $page.url, update();

	onMount(async () => {
		document.getElementById(`page${curPage}`)?.click();
	});
</script>

<svelte:head>
	<title>Demon List - Demon List VN</title>
</svelte:head>

{#if data.list == 'dl'}
	<BigTitle value="Demon List" description="Hardest level beaten by Vietnamese" />
{:else if data.list == 'fl'}
	<BigTitle value="Featured List" description="Hardest level created by Vietnamese" />
{/if}

<Tabs.Root value="levels" class="tabs">
	<div class="tabsWrapper">
		<Tabs.List>
			<Tabs.Trigger
				value="levels"
				on:click={() => {
					goto('/${data.list}');
				}}>Levels</Tabs.Trigger
			>
			<Tabs.Trigger
				value="leaderboard"
				on:click={() => {
					goto('/${data.list}/leaderboard');
				}}>Leaderboard</Tabs.Trigger
			>
		</Tabs.List>
	</div>
</Tabs.Root>

<div class="levelsWrapper">
	<div class="levels">
		{#each data.levels as level}
			<LevelCard {level} type={data.list} />
		{/each}
	</div>
</div>

<Pagination.Root count={data.count} perPage={20} let:pages let:currentPage>
	<Pagination.Content>
		<Pagination.Item>
			<Pagination.PrevButton on:click={() => goto(`/${data.list}?page=${currentPage - 1}`)} />
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
								goto(`/${data.list}?page=${page.value}`);
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
			<Pagination.NextButton on:click={() => goto(`/${data.list}?page=${currentPage + 1}`)} />
		</Pagination.Item>
	</Pagination.Content>
</Pagination.Root>

<style lang="scss">
	.levelsWrapper {
		display: flex;
		justify-content: center;
	}

	.levels {
		display: grid;
		align-items: center;
		gap: 10px;
		grid-template-columns: 500px 500px;
		margin-inline: auto;
		margin-bottom: 20px;
		padding-inline: 10px;
	}

	.tabsWrapper {
		display: flex;
		justify-content: center;
		gap: 10px;
		margin-bottom: 25px;
	}

	@media screen and (max-width: 1100px) {
		.levels {
			grid-template-columns: 100%;
		}
	}
</style>
