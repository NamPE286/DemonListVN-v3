<script lang="ts">
	import * as Pagination from '$lib/components/ui/pagination';

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

<div class="levelsWrapper">
	<div class="levels">
		{#each data.levels as level}
			<LevelCard {level} type={$page.params.list} />
		{/each}
	</div>
</div>

<Pagination.Root count={data.count} perPage={20} let:pages let:currentPage>
	<Pagination.Content>
		<Pagination.Item>
			<Pagination.PrevButton on:click={() => goto(`/list/${$page.params.list}?page=${currentPage - 1}`)} />
		</Pagination.Item>
		{#each pages as page_1 (page_1.key)}
			{#if page_1.type === 'ellipsis'}
				<Pagination.Item>
					<Pagination.Ellipsis />
				</Pagination.Item>
			{:else}
				<Pagination.Item isVisible={currentPage == page_1.value}>
					<Pagination.Link
						page={page_1}
						isActive={currentPage == page_1.value}
						on:click={() => {
							if (!calibrated) {
								calibrated = true;
							} else {
								goto(`/list/${$page.params.list}?page=${page_1.value}`);
							}
						}}
						id={`page${page_1.value}`}
					>
						{page_1.value}
					</Pagination.Link>
				</Pagination.Item>
			{/if}
		{/each}
		<Pagination.Item>
			<Pagination.NextButton on:click={() => goto(`/list/${$page.params.list}?page=${currentPage + 1}`)} />
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

	@media screen and (max-width: 1100px) {
		.levels {
			grid-template-columns: 100%;
		}
	}
</style>
