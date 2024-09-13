<script lang="ts">
	import * as Carousel from '$lib/components/ui/carousel/index.js';
	import * as Card from '$lib/components/ui/card';
	import LevelCard from '$lib/components/levelCard.svelte';
	import DiscordLogo from 'svelte-radix/DiscordLogo.svelte';
	import Clock from 'svelte-radix/Clock.svelte';
	import type { PageData } from './$types';
	import { Button } from '$lib/components/ui/button/index.js';
	import { onMount } from 'svelte';
	import { settings } from '$lib/client';

	export let data: PageData;
	let time = new Date().toLocaleTimeString();
	const settingsValue = settings.value;
	let visible = false;
	let recent: any = {
		dl: null,
		fl: null
	};

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

	onMount(() => {
		visible = true;

		getRecentDemonListLevel().then((data) => (recent.dl = data));
		getRecentFeaturedListLevel().then((data) => (recent.fl = data));

		const interval = setInterval(() => {
			time = new Date().toLocaleTimeString();
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

<div class="w-full pl-[50px] pr-[50px]">
	<Carousel.Root class="h-fit w-full">
		<Carousel.Content>
			{#each Array(5) as _, i (i)}
				<Carousel.Item>
					<div class="p-1">
						<div
							class="promotion"
							style={`background-image: url('https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRSYbl1xiecZolTDFI54hT0emEyea-Tpx1ECA&s')`}
						>
							<div class="promotionContent">
								<div class="period">
									<Clock size={18}/>
									1d 7h
								</div>
								<h2>Demon List VN Cup 2025</h2>
								<p>Coming soon</p>
							</div>
						</div>
					</div>
				</Carousel.Item>
			{/each}
		</Carousel.Content>
		<Carousel.Previous />
		<Carousel.Next />
	</Carousel.Root>
</div>

<div class="wrapper">
	{#if $settingsValue.hideDiscord == 'false'}
		<div class="alertWrapper">
			<Card.Root>
				<div class="content">
					<DiscordLogo />
					<div>
						<div class="header">
							<Card.Title>Hey there!</Card.Title>
						</div>
						<Card.Description
							>Join our discord server for latest news and announcement.</Card.Description
						>
						<Button variant="outline">
							<a href="https://discord.gg/MnGVdtjq49">Take me there</a>
						</Button>
					</div>
				</div>
			</Card.Root>
		</div>
	{/if}

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
	.promotion {
		border: 1px solid hsl(var(--border));
		border-radius: 10px;
		background-position: center;
		aspect-ratio: 40 / 10;
		background-size: cover;
		display: flex;
		flex-direction: column;
		overflow: hidden;
		margin-top: 30px;
		color: white;

		.period {
			background-color: white;
			width: fit-content;
			padding-inline: 8px;
			color: black;
			font-weight: 600;
			text-shadow: none;
			border-radius: 10px;
			display: flex;
			align-items: center;
			gap: 5px;
		}

		.promotionContent {
			margin-top: auto;
			height: 45%;
			padding: 21px;
			text-shadow: black 1px 0 10px;
		}

		h2 {
			font-weight: bold;
			font-size: 28px;
		}
	}

	.wrapper {
		position: relative;
		z-index: 1;
		background-color: hsl(var(--background));
	}

	.alertWrapper {
		width: 550px;
		margin-inline: auto;
		padding-top: 50px;
		max-width: 100%;

		.header {
			margin-bottom: 5px;
		}

		.content {
			padding-top: 15px;
			padding-bottom: 5px;
			padding-inline: 20px;
			display: flex;
			gap: 15px;
		}
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
	}
</style>
