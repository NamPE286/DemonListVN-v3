<script lang="ts">
	import * as Carousel from '$lib/components/ui/carousel/index.js';
	import * as Card from '$lib/components/ui/card';
	import LevelCard from '$lib/components/levelCard.svelte';
	import DiscordLogo from 'svelte-radix/DiscordLogo.svelte';
	import type { PageData } from './$types';
	import { Button } from '$lib/components/ui/button/index.js';
	import { fade } from 'svelte/transition';
	import { user } from '$lib/client';
	import { onMount } from 'svelte';
	import { settings } from '$lib/client';
	import Ads from '$lib/components/ads.svelte';

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

{#if visible && $settingsValue.dashboardBackgroundURL != ''}
	<img
		in:fade={{ delay: 300, duration: 300 }}
		class="bg"
		src={$settingsValue.dashboardBackgroundURL}
		alt="thumbnail"
	/>
{/if}

<div
	class="head"
	style={$settingsValue.dashboardBackgroundURL == '' ? `max-height: 200px; min-height: 200px` : ''}
>
	<p>{time}</p>
	{#if $user.loggedIn}
		<h2>{data.greeting}, {$user.data.name}!</h2>
	{:else}
		<h2>{data.greeting}!</h2>
	{/if}
</div>
<div class="wrapper">
	<Ads dataAdFormat="horizontal" />
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
	.bg {
		width: 100%;
		height: 42vw;
		max-height: 700px;
		min-height: 400px;
		object-fit: cover;
		position: fixed;
		z-index: 0;
		top: 0;
	}

	.wrapper {
		position: relative;
		z-index: 1;
		background-color: hsl(var(--background));
	}

	.head {
		position: relative;
		background: linear-gradient(rgba(0, 0, 0, 0) 10%, hsl(var(--background)) calc(60% + 10vw));
		padding-bottom: 20px;
		height: 33vw;
		max-height: 500px;
		min-height: 200px;
		z-index: 10;
		display: flex;
		flex-direction: column-reverse;
		padding-inline: 50px;
		margin-bottom: -2px;

		h2 {
			font-size: 35px;
			font-weight: 600;
		}
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
		.head {
			padding-inline: 25px;
		}

		h4 {
			padding-inline: 0px;
		}
	}
</style>
