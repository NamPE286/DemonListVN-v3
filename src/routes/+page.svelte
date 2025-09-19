<script lang="ts">
	import * as Carousel from '$lib/components/ui/carousel/index.js';
	import LevelCard from '$lib/components/levelCard.svelte';
	import { onMount } from 'svelte';
	import Autoplay from 'embla-carousel-autoplay';
	import EventBanner from './event/eventBanner.svelte';
	import Ads from '$lib/components/ads.svelte';
	
	let time = new Date().toLocaleTimeString('vi-VN');
	let visible = false;
	let recent: any = {
		dl: null,
		fl: null
	};
	let events: any = null;

	async function getRecentDemonListLevel() {
		const query = new URLSearchParams({
			end: '9',
			sortBy: 'created_at',
			ascending: 'false'
		});

		return await (
			await fetch(`${import.meta.env.VITE_API_URL}/list/dl?${query.toString()}`)
		).json();
	}

	async function getRecentFeaturedListLevel() {
		const query = new URLSearchParams({
			end: '9',
			sortBy: 'created_at',
			ascending: 'false'
		});

		return await (
			await fetch(`${import.meta.env.VITE_API_URL}/list/fl?${query.toString()}`)
		).json();
	}

	async function getEvents() {
		return await (await fetch(`${import.meta.env.VITE_API_URL}/events/ongoing`)).json();
	}

	onMount(() => {
		visible = true;

		getRecentDemonListLevel().then((data) => (recent.dl = data));
		getRecentFeaturedListLevel().then((data) => (recent.fl = data));
		getEvents().then((data) => (events = data));

		const interval = setInterval(() => {
			time = new Date().toLocaleTimeString('vi-VN');
		}, 1000);

		return () => {
			clearInterval(interval);
		};
	});
</script>

<svelte:head>
	<title>Demon List VN</title>
	<meta
		name="description"
		content="Welcome to Demon List VN, this is where we keep track of the hardest demons created, verified and hardest demon beaten by Vietnamese!"
	/>
</svelte:head>

<div class="promotionWrapper mt-[20px] w-full pl-[50px] pr-[50px]">
	<Carousel.Root
		class="h-fit w-full"
		plugins={[
			Autoplay({
				delay: 10000
			})
		]}
	>
		<Carousel.Content>
			{#if events}
				{#each events as item, index}
					<Carousel.Item>
						<a href={`/event/${item.id}`}>
							<EventBanner data={item} />
						</a>
					</Carousel.Item>
				{/each}
			{:else}
				<Carousel.Item>
					<EventBanner data={null} />
				</Carousel.Item>
			{/if}
		</Carousel.Content>
		<Carousel.Previous />
		<Carousel.Next />
	</Carousel.Root>
</div>
<Ads dataAdFormat="auto" unit="leaderboard" />
<div class="wrapper">
	<h4>Newest levels from Demon List</h4>
	<div class="carouselWrapper">
		{#if recent.dl}
			<Carousel.Root>
				<Carousel.Content>
					{#each recent.dl as level}
						<Carousel.Item class="sm:basis-1/1 md:basis-1/2 lg:basis-1/3 xl:basis-1/4">
							<LevelCard {level} type="dl" />
						</Carousel.Item>
					{/each}
				</Carousel.Content>
				<Carousel.Previous />
				<Carousel.Next />
			</Carousel.Root>
		{:else}
			<Carousel.Root>
				<Carousel.Content>
					{#each { length: 5 } as _}
						<Carousel.Item class="sm:basis-1/1 md:basis-1/2 lg:basis-1/3 xl:basis-1/4">
							<LevelCard level={null} type="dl" />
						</Carousel.Item>
					{/each}
				</Carousel.Content>
				<Carousel.Previous />
				<Carousel.Next />
			</Carousel.Root>
		{/if}
	</div>
	<h4>Newest levels from Featured List</h4>
	<div class="carouselWrapper">
		{#if recent.fl}
			<Carousel.Root>
				<Carousel.Content>
					{#each recent.fl as level}
						<Carousel.Item class="sm:basis-1/1 md:basis-1/2 lg:basis-1/3 xl:basis-1/4">
							<LevelCard {level} type="fl" />
						</Carousel.Item>
					{/each}
				</Carousel.Content>
				<Carousel.Previous />
				<Carousel.Next />
			</Carousel.Root>
		{:else}
			<Carousel.Root>
				<Carousel.Content>
					{#each { length: 5 } as _}
						<Carousel.Item class="sm:basis-1/1 md:basis-1/2 lg:basis-1/3 xl:basis-1/4">
							<LevelCard level={null} type="dl" />
						</Carousel.Item>
					{/each}
				</Carousel.Content>
				<Carousel.Previous />
				<Carousel.Next />
			</Carousel.Root>
		{/if}
	</div>
</div>

<style lang="scss">
	.wrapper {
		position: relative;
		z-index: 1;
		background-color: hsl(var(--background));
	}

	.carouselWrapper {
		margin-top: 30px;
		max-width: 100%;
		padding-inline: 50px;
		display: flex;
		flex-direction: column;
	}

	h4 {
		font-weight: 600;
		font-size: 18px;
		padding-top: 30px;
		margin-left: 25px;
		padding-inline: 25px;
	}

	@media screen and (max-width: 900px) {
		h4 {
			padding-inline: 0px;
		}

		.promotionWrapper {
			margin-left: -50px;
			width: calc(100% + 104px);
		}
	}
</style>
