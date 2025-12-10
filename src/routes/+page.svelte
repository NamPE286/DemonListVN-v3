<script lang="ts">
	import * as Carousel from '$lib/components/ui/carousel/index.js';
	import LevelCard from '$lib/components/levelCard.svelte';
	import { onMount } from 'svelte';
	import Autoplay from 'embla-carousel-autoplay';
	import EventBanner from './event/eventBanner.svelte';
	import Ads from '$lib/components/ads.svelte';
	import { _ } from 'svelte-i18n';
	import * as Alert from '$lib/components/ui/alert';
	import { X } from 'lucide-svelte';
	import Dashboard from '$lib/components/dashboard.svelte';
	import { user } from '$lib/client';
	import { isActive } from '$lib/client/isSupporterActive';
	import { browser } from '$app/environment';

	let time = new Date().toLocaleTimeString('vi-VN');
	let visible = false;
	let showDiscordAlert = false;
	let dashboardEnabled = false;
	let showDashboard = true; // Show dashboard by default until user is checked
	let dashboardVisible = true; // Show dashboard by default until user is checked
	let userChecked = false;
	let recent: any = {
		dl: null,
		fl: null,
		pl: null
	};
	let events: any = null;
	let showEventBanner = true;

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

	async function getRecentPlatformerListLevel() {
		const query = new URLSearchParams({
			end: '9',
			sortBy: 'created_at',
			ascending: 'false'
		});

		return await (
			await fetch(`${import.meta.env.VITE_API_URL}/list/pl?${query.toString()}`)
		).json();
	}

	async function getEvents() {
		return await (await fetch(`${import.meta.env.VITE_API_URL}/events/ongoing`)).json();
	}

	function dismissDiscordAlert() {
		showDiscordAlert = false;
		localStorage.setItem('discordAlertDismissed', 'true');
	}

	function animateScrollDown() {
		window.scrollTo({
			top: window.innerHeight - 50,
			behavior: 'smooth'
		});
		setTimeout(() => {
			dashboardVisible = false;
			showDashboard = false;
			window.scrollTo({ top: 0, behavior: 'instant' });
		}, 500);
	}

	$: if (browser && $user.checked && !userChecked) {
		userChecked = true;
		const isSupporter = $user.loggedIn && isActive($user.data?.supporterUntil);
		const enabled = localStorage.getItem('settings.dashboardEnabled') === 'true';
		const shouldShow = isSupporter && enabled;

		if (!shouldShow) {
			setTimeout(() => animateScrollDown(), 50);
		} else {
			showEventBanner = false;
		}
	}

	onMount(() => {
		visible = true;

		const discordAlertDismissed = localStorage.getItem('discordAlertDismissed');
		if (!discordAlertDismissed) {
			showDiscordAlert = true;
		}

		dashboardEnabled = localStorage.getItem('settings.dashboardEnabled') === 'true';

		getRecentDemonListLevel().then((data) => (recent.dl = data));
		getRecentFeaturedListLevel().then((data) => (recent.fl = data));
		getRecentPlatformerListLevel().then((data) => (recent.pl = data));
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
		content="Chào mừng đến với Demon List VN, nơi chúng tôi theo dõi những demon khó nhất được tạo ra, xác minh và những demon khó nhất được đánh bại bởi người Việt Nam!"
	/>
</svelte:head>

{#if dashboardVisible}
	<Dashboard {events} />
{/if}

{#if showDiscordAlert}
	<div class="px-[5px] pt-[20px] md:px-[55px]">
		<Alert.Root
			class="relative flex items-center gap-[10px] border-blue-200 bg-blue-50 pb-[7px] dark:border-blue-800 dark:bg-blue-950"
		>
			<img src="/discord.svg" alt="Discord" class="mt-[-4px] scale-75 invert dark:invert-0" />
			<div>
				<Alert.Title class="pr-8">{$_('home.discord_alert.title')}</Alert.Title>
				<Alert.Description>
					{$_('home.discord_alert.description')}
					<a
						href="https://discord.gg/MnGVdtjq49"
						target="_blank"
						class="font-semibold underline hover:text-blue-600"
						>{$_('home.discord_alert.join_now')}</a
					>
				</Alert.Description>
				<button
					on:click={dismissDiscordAlert}
					class="absolute right-4 top-4 rounded-sm opacity-70 transition-opacity hover:opacity-100"
					aria-label="Dismiss"
				>
					<X class="h-4 w-4" />
				</button>
			</div>
		</Alert.Root>
	</div>
{/if}

{#if showEventBanner}
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
{/if}
<Ads dataAdFormat="auto" unit="leaderboard" />
<div class="wrapper">
	<h4>{$_('home.newest_dl')}</h4>
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
	<h4>{$_('home.newest_fl')}</h4>
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
	<h4>{$_('home.newest_pl')}</h4>
	<div class="carouselWrapper">
		{#if recent.pl}
			<Carousel.Root>
				<Carousel.Content>
					{#each recent.pl as level}
						<Carousel.Item class="sm:basis-1/1 md:basis-1/2 lg:basis-1/3 xl:basis-1/4">
							<LevelCard {level} type="pl" />
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
							<LevelCard level={null} type="pl" />
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
