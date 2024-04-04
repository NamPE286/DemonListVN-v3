<script lang="ts">
	import * as Carousel from '$lib/components/ui/carousel/index.js';
	import * as Card from '$lib/components/ui/card';
	import LevelCard from '$lib/components/levelCard.svelte';
	import DiscordLogo from 'svelte-radix/DiscordLogo.svelte';
	import type { PageData } from './$types';
	import { Button } from '$lib/components/ui/button/index.js';
	import { user } from '$lib/client';

	export let data: PageData;
</script>

<svelte:head>
	<title>Demon List VN</title>
	<script src="https://cdn.jsdelivr.net/npm/@widgetbot/html-embed"></script>
</svelte:head>
<div class="alertWrapper">
	<Card.Root>
		<div class="content">
			<DiscordLogo />
			<div>
				<div class="header">
					<Card.Title>Hey there!</Card.Title>
				</div>
				<Card.Description>Join our discord server for latest news and announcement.</Card.Description
				>
				<Button variant="outline">
					<a href="https://discord.gg/MnGVdtjq49">Take me there</a>
				</Button>
			</div>
		</div>
	</Card.Root>
</div>

<h4>Newest levels from Demon List</h4>

<div class="carouselWrapper">
	<Carousel.Root>
		<Carousel.Content>
			{#each data.recent.dl as level}
				<Carousel.Item class="sm:basis-1/1 md:basis-1/2 lg:basis-1/3 xl:basis-1/4">
					<LevelCard {level} type="dl" />
				</Carousel.Item>
			{/each}
		</Carousel.Content>
		<Carousel.Previous />
		<Carousel.Next />
	</Carousel.Root>
</div>
<h4>Newest levels from Featured List</h4>
<div class="carouselWrapper">
	<Carousel.Root>
		<Carousel.Content>
			{#each data.recent.fl as level}
				<Carousel.Item class="sm:basis-1/1 md:basis-1/2 lg:basis-1/3 xl:basis-1/4">
					<LevelCard {level} type="fl" />
				</Carousel.Item>
			{/each}
		</Carousel.Content>
		<Carousel.Previous />
		<Carousel.Next />
	</Carousel.Root>
</div>

<div class="wrapper">
	{#if $user.loggedIn}
		<div class="right">
			<Card.Root class="h-full">
				<Card.Header>
					<Card.Title>My submission</Card.Title>
				</Card.Header>
			</Card.Root>
		</div>
	{/if}
</div>

<style lang="scss">
	.alertWrapper {
		width: 550px;
		margin-inline: auto;
		margin-top: 20px;
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

	.wrapper {
		margin-top: 30px;
		max-width: 100%;
		padding-inline: 50px;
		display: flex;
	}

	.right {
		display: grid;
		width: 500px;
		grid-template-rows: 60px calc(100% - 60px - 20px);
		gap: 20px;
	}

	h4 {
		font-weight: 600;
		font-size: 18px;
		margin-top: 30px;
		margin-left: 25px;
		padding-inline: 25px;
	}

	@media screen and (max-width: 900px) {
		.alertWrapper {
			padding-inline: 20px;
		}

		.wrapper {
			padding-inline: 20px;
		}

		.right {
			width: 100%;
		}

		h4 {
			padding-inline: 10px;
		}
	}
</style>
