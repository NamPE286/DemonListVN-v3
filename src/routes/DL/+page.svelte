<script lang="ts">
	import * as Tabs from '$lib/components/ui/tabs';
	import * as Pagination from '$lib/components/ui/pagination';
	import * as Card from '$lib/components/ui/card';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import BigTitle from '$lib/components/bigTitle.svelte';
	import type { PageData } from './$types';

	export let data: PageData;

	let curPage = -1;

	async function update() {
		curPage = parseInt($page.url.searchParams.get('page') || '1');
	}

	$: $page.url, update();

	onMount(async () => {
		document.getElementById(`page${curPage}`)?.click();
		console.log(data);
	});
</script>

<svelte:head>
	<title>Demon List - Demon List VN</title>
</svelte:head>

<BigTitle value='Demon List' description='Hardest level beaten by Vietnamese'/>

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

<div class="levelsWrapper">
	<div class="levels">
		{#each data.levels as level}
			<div class="level">
				<Card.Root>
					<Card.Content>
						<a href="#!">
							<img
								src={`https://img.youtube.com/vi/${level.data.videoID}/0.jpg`}
								alt=""
								loading="lazy"
								class="thumbnail"
							/>
						</a>
						<a href="#!">
							<div class="levelInfo">
								<div class="top">#{level.data.dlTop}</div>
								<div class="info">
									<div class="levelName">{level.data.name}</div>
									<div class="creator">{level.data.creator}</div>
								</div>
							</div></a
						>
					</Card.Content>
				</Card.Root>
			</div>
		{/each}
	</div>
</div>

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
	.levelsWrapper {
		display: flex;
		justify-content: center;
	}

	.thumbnail {
		height: 200px;
		width: 500px;
		object-fit: cover;
		margin-top: 20px;
		border-radius: var(--radius);
		border: 1px solid var(--border1);
		margin-bottom: 15px;
		margin-inline: auto;
	}

	.levels {
		display: grid;
		align-items: center;
		gap: 10px;
		grid-template-columns: 500px 500px;
		margin-inline: auto;
		margin-bottom: 20px;
		.level {
			.levelInfo {
				margin-bottom: -10px;
				display: flex;
				gap: 15px;
				.top {
					font-size: 40px;
					font-weight: 600;
				}
				.info {
					display: flex;
					flex-direction: column;
					line-height: 20px;
					margin-top: 10px;
					.levelName {
						font-size: 18px;
						font-weight: 500;
					}
					.creator {
						color: var(--textColor2);
					}
				}
			}
		}
	}

	.tabsWrapper {
		display: flex;
		justify-content: center;
		gap: 10px;
		margin-bottom: 25px;
	}

</style>
