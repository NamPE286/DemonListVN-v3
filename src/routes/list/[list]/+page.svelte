<script lang="ts">
	import LevelCard from '$lib/components/levelCard.svelte';
	import { page } from '$app/stores';
	import type { PageData } from './$types';
	import { onMount } from 'svelte';

	export let data: PageData;
	let curPage = 1;
	let loaded = true;

	async function fetchData() {
		if (!loaded) {
			return;
		}

		curPage++;
		loaded = false;

		const query = new URLSearchParams({
			start: String((curPage - 1) * 50),
			end: String(curPage * 50 - 1),
			sortBy: `${$page.params.list}Top`,
			ascending: 'true'
		});

		const res = await (
			await fetch(`${import.meta.env.VITE_API_URL}/list/${$page.params.list}?${query.toString()}`)
		).json();

		data.levels = data.levels.concat(res);
		loaded = true;
	}

	onMount(() => {
		window.onscroll = function (ev) {
			if (window.innerHeight + window.pageYOffset >= document.body.offsetHeight - 1500) {
				fetchData();
			}
		};
	});
</script>

<svelte:head>
	<title>{$page.params.list == 'dl' ? 'Demon' : 'Featured'} List - Demon List VN</title>
</svelte:head>

<div class="levelsWrapper">
	<div class="levels">
		{#each data.levels as level}
			<LevelCard {level} type={$page.params.list} />
		{/each}
	</div>
</div>

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
