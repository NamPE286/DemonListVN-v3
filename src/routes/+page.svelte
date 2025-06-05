<script lang="ts">
	import * as Carousel from '$lib/components/ui/carousel/index.js';
	import LevelCard from '$lib/components/levelCard.svelte';
	import ExternalLink from 'svelte-radix/ExternalLink.svelte';
	import Clock from 'svelte-radix/Clock.svelte';
	import Star from 'svelte-radix/Star.svelte';
	import { onMount } from 'svelte';
	import { Skeleton } from '$lib/components/ui/skeleton';
	import Autoplay from 'embla-carousel-autoplay';

	let time = new Date().toLocaleTimeString("vi-VN");
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

	function getInterval(end: string | null) {
		if (!end) {
			return 'Permanent';
		}

		const second = (new Date(end).getTime() - new Date().getTime()) / 1000;
		const day = Math.floor(second / 86400);
		const hour = Math.floor((second - day * 86400) / 3600);

		return `${day}d ${hour}h`;
	}

	onMount(() => {
		visible = true;

		getRecentDemonListLevel().then((data) => (recent.dl = data));
		getRecentFeaturedListLevel().then((data) => (recent.fl = data));
		getEvents().then((data) => (events = data));

		const interval = setInterval(() => {
			time = new Date().toLocaleTimeString("vi-VN");
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

<div class="promotionWrapper w-full pl-[50px] pr-[50px]">
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
							<div class="p-1">
								<div class="promotion" style={`background-image: url('${item.imgUrl}')`}>
									<div class="promotionContent">
										<div class="flex gap-[10px]">
											<div class="period">
												<Clock size={16} />
												{getInterval(item.end)}
											</div>
											{#if item.isSupporterOnly}
												<div class="period">
													<Star size={16} />
													Supporter Only
												</div>
											{/if}
											{#if item.exp}
												<div class="period">
													{item.exp} EXP
												</div>
											{/if}
										</div>
										<h2>{item.title}</h2>
										{#if item.redirect}
											<a href={item.redirect} target="_blank">
												<div class="flex gap-[10px]">
													<ExternalLink />
													{item.redirect}
												</div>
											</a>
										{/if}
										<p class="desc">{item.description}</p>
									</div>
								</div>
							</div>
						</a>
					</Carousel.Item>
				{/each}
			{:else}
				<Carousel.Item>
					<div class="p-1">
						<div class="promotion">
							<div class="promotionContent">
								<div class="flex flex-col gap-[10px]">
									<Skeleton class="h-[20px] w-[75px]" />
									<Skeleton class="h-[45px] w-[200px]" />
									<Skeleton class="h-[25px] w-[150px]" />
								</div>
							</div>
						</div>
					</div>
				</Carousel.Item>
			{/if}
		</Carousel.Content>
		<Carousel.Previous />
		<Carousel.Next />
	</Carousel.Root>
</div>

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
	.desc {
		width: 650px;
		max-width: 100%;
	}

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
		min-height: 250px;
		max-width: 100%;

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
			line-height: 0;
			padding-top: 3px;
			padding-bottom: 3px;
		}

		.promotionContent {
			margin-top: auto;
			height: 175px;
			padding: 21px;
			text-shadow: black 1px 0 10px;
		}

		h2 {
			font-weight: bold;
			font-size: 28px;
			line-height: 32px;
			margin-top: 5px;
			margin-bottom: 5px;
		}
	}

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
