<script lang="ts">
	import { onMount } from 'svelte';
	import { user } from '$lib/client';
	import { browser } from '$app/environment';
	import PlayerCard from '$lib/components/playerCard.svelte';
	import * as Card from '$lib/components/ui/card';
	import { Button } from '$lib/components/ui/button/index.js';
	import { Skeleton } from '$lib/components/ui/skeleton';
	import Gear from 'svelte-radix/Gear.svelte';
	import ChevronDown from 'svelte-radix/ChevronDown.svelte';
	import { _ } from 'svelte-i18n';
	import RecordDetail from '$lib/components/recordDetail.svelte';
	import DashboardSettings from '$lib/components/dashboardSettings.svelte';
	import DashboardSearch from '$lib/components/dashboardSearch.svelte';
	import DashboardWeather from '$lib/components/dashboardWeather.svelte';
	import DashboardSubmissions from '$lib/components/dashboardSubmissions.svelte';
	import DashboardEvents from '$lib/components/dashboardEvents.svelte';

	export let events: any[];

	let selectedSubmission: any = null;
	let recordDetailOpen = false;

	let dashboardBg: string = '';
	let overlayType: 'none' | 'dark' | 'blur' | 'both' = 'none';
	let settingsOpen = false;
	let submissions: any[] = [];
	let loadingSubmissions = true;
	let currentTime = new Date();

	// Web search settings
	let searchEnabled = true;
	let searchEngine: keyof typeof SEARCH_ENGINES = 'google';
	let searchPosition: 'top' | 'center' | 'bottom' = 'center';
	let shortcutsVisible = true;
	let shortcuts: Array<{ name: string; url: string; icon: string }> = [];

	// Dashboard settings storage keys
	const DASHBOARD_BG_KEY = 'dashboard.backgroundUrl';
	const DASHBOARD_OVERLAY_KEY = 'dashboard.overlayType';
	const DASHBOARD_SEARCH_ENABLED_KEY = 'dashboard.searchEnabled';
	const DASHBOARD_SEARCH_ENGINE_KEY = 'dashboard.searchEngine';
	const DASHBOARD_SEARCH_POSITION_KEY = 'dashboard.searchPosition';
	const DASHBOARD_SHORTCUTS_VISIBLE_KEY = 'dashboard.shortcutsVisible';
	const DASHBOARD_SHORTCUTS_KEY = 'dashboard.shortcuts';

	// Search engines configuration
	const SEARCH_ENGINES = {
		google: { name: 'Google', url: 'https://www.google.com/search?q=' },
		bing: { name: 'Bing', url: 'https://www.bing.com/search?q=' },
		duckduckgo: { name: 'DuckDuckGo', url: 'https://duckduckgo.com/?q=' },
		yahoo: { name: 'Yahoo', url: 'https://search.yahoo.com/search?p=' },
		yandex: { name: 'Yandex', url: 'https://yandex.com/search/?text=' },
		ecosisa: { name: 'Ecosia', url: 'https://www.ecosia.org/search?q=' }
	};

	// Default shortcuts
	const DEFAULT_SHORTCUTS = [
		{
			name: 'YouTube',
			url: 'https://youtube.com',
			icon: 'https://www.google.com/s2/favicons?domain=youtube.com&sz=64'
		},
		{
			name: 'GitHub',
			url: 'https://github.com',
			icon: 'https://www.google.com/s2/favicons?domain=github.com&sz=64'
		},
		{
			name: 'Twitter',
			url: 'https://twitter.com',
			icon: 'https://www.google.com/s2/favicons?domain=twitter.com&sz=64'
		},
		{
			name: 'Discord',
			url: 'https://discord.com',
			icon: 'https://www.google.com/s2/favicons?domain=discord.com&sz=64'
		}
	];

	function loadDashboardSettings() {
		if (browser) {
			dashboardBg = localStorage.getItem(DASHBOARD_BG_KEY) || '';
			overlayType = (localStorage.getItem(DASHBOARD_OVERLAY_KEY) as typeof overlayType) || 'none';

			// Load search settings
			const savedSearchEnabled = localStorage.getItem(DASHBOARD_SEARCH_ENABLED_KEY);
			searchEnabled = savedSearchEnabled === null ? true : savedSearchEnabled === 'true';

			searchEngine =
				(localStorage.getItem(DASHBOARD_SEARCH_ENGINE_KEY) as keyof typeof SEARCH_ENGINES) ||
				'google';

			searchPosition =
				(localStorage.getItem(DASHBOARD_SEARCH_POSITION_KEY) as typeof searchPosition) || 'center';

			const savedShortcutsVisible = localStorage.getItem(DASHBOARD_SHORTCUTS_VISIBLE_KEY);
			shortcutsVisible = savedShortcutsVisible === null ? true : savedShortcutsVisible === 'true';

			const savedShortcuts = localStorage.getItem(DASHBOARD_SHORTCUTS_KEY);
			if (savedShortcuts) {
				try {
					shortcuts = JSON.parse(savedShortcuts);
				} catch {
					shortcuts = [...DEFAULT_SHORTCUTS];
				}
			} else {
				shortcuts = [...DEFAULT_SHORTCUTS];
			}
		}
	}

	async function fetchSubmissions() {
		if (!$user.loggedIn || !$user.data) return;

		try {
			const res = await fetch(
				`${import.meta.env.VITE_API_URL}/players/${$user.data.uid}/submissions?end=10`
			);
			if (res.ok) {
				submissions = await res.json();
			}
		} catch (e) {
			console.error('Failed to fetch submissions:', e);
		} finally {
			loadingSubmissions = false;
		}
	}

	function getEventInterval(event: any) {
		if (!event.end) {
			return $_('events.permanent') || 'Permanent';
		}

		const eventStart = new Date(event.start);
		if (eventStart > currentTime) {
			return `${$_('events.starts_at') || 'Starts'} ${eventStart.toLocaleDateString('vi-VN')}`;
		}

		const second = (new Date(event.end).getTime() - currentTime.getTime()) / 1000;

		if (second < 0) {
			return $_('events.ended') || 'Ended';
		}

		const day = Math.floor(second / 86400);
		const hour = Math.floor((second - day * 86400) / 3600);
		const minute = Math.floor((second - day * 86400 - hour * 3600) / 60);

		return `${day}d ${hour}h ${minute}m`;
	}

	function scrollToContent() {
		window.scrollTo({
			top: window.innerHeight,
			behavior: 'smooth'
		});
	}

	onMount(() => {
		loadDashboardSettings();

		// Update every second for live clock
		const interval = setInterval(() => {
			currentTime = new Date();
		}, 1000);

		return () => clearInterval(interval);
	});

	$: if ($user.loggedIn && $user.checked) {
		fetchSubmissions();
	}
</script>

<!-- Dashboard Settings Component -->
<DashboardSettings
	bind:open={settingsOpen}
	bind:dashboardBg
	bind:overlayType
	bind:searchEnabled
	bind:searchEngine
	bind:searchPosition
	bind:shortcutsVisible
	bind:shortcuts
/>

<div
	class="dashboard-hero relative mt-[-50px] flex min-h-[100vh] w-full flex-col"
	style={dashboardBg ? `background-image: url('${dashboardBg}')` : ''}
>
	<!-- Customizable Overlay -->
	{#if overlayType === 'dark' || overlayType === 'both'}
		<div class="absolute inset-0 z-[1] bg-black/40"></div>
	{/if}
	{#if overlayType === 'blur' || overlayType === 'both'}
		<div class="absolute inset-0 z-[1] backdrop-blur-sm"></div>
	{/if}

	<!-- Mobile Layout: Stacked content -->
	<div
		class="relative z-20 flex h-full min-h-[100vh] w-full flex-col px-3 pt-[70px] sm:px-4 lg:hidden"
	>
		<!-- Top Search Bar (Mobile) -->
		{#if searchEnabled && searchPosition === 'top'}
			<div class="mb-4 w-full">
				<DashboardSearch
					bind:searchEnabled
					bind:searchPosition
					bind:searchEngine
					bind:shortcutsVisible
					bind:shortcuts
				/>
			</div>
		{/if}

		<!-- Top: Clock & Date + Weather + Settings -->
		<div class="flex items-start justify-between gap-2">
			<div class="rounded-xl bg-background/60 p-3 backdrop-blur-md sm:p-4">
				<div class="xs:text-3xl text-2xl font-bold tracking-tight sm:text-4xl">
					{currentTime.toLocaleTimeString('vi-VN', {
						hour: '2-digit',
						minute: '2-digit',
						second: '2-digit'
					})}
				</div>
				<div class="mt-1 text-xs text-muted-foreground sm:text-sm">
					{currentTime.toLocaleDateString('vi-VN', {
						weekday: 'short',
						year: 'numeric',
						month: 'short',
						day: 'numeric'
					})}
				</div>
			</div>
			<div class="flex items-start gap-2">
				<!-- Weather Card -->
				<DashboardWeather />
				<button
					class="flex-shrink-0 rounded-full bg-background/60 p-2.5 backdrop-blur-md transition-all hover:bg-background/80 sm:p-3"
					on:click={() => (settingsOpen = true)}
				>
					<Gear class="h-4 w-4 sm:h-5 sm:w-5" />
				</button>
			</div>
		</div>

		<!-- Middle: Cards Grid -->
		<div class="mt-4 flex flex-1 flex-col gap-3 pb-20 sm:gap-4">
			<!-- Player Profile -->
			<div class="w-full">
				{#if $user.loggedIn && $user.data}
					<PlayerCard player={$user.data} />
				{:else if $user.checked}
					<Card.Root class="bg-background/60 backdrop-blur-md">
						<Card.Content
							class="flex flex-col items-center gap-3 py-4 text-center sm:gap-4 sm:py-6"
						>
							<p class="text-sm text-muted-foreground sm:text-base">
								{$_('dashboard.login_prompt') || 'Sign in to view your profile'}
							</p>
							<Button variant="outline" href="/discord" size="sm">
								{$_('dashboard.login') || 'Sign In'}
							</Button>
						</Card.Content>
					</Card.Root>
				{:else}
					<Card.Root class="bg-background/60 backdrop-blur-md">
						<Card.Content class="space-y-2 py-3 sm:space-y-3 sm:py-4">
							<Skeleton class="h-10 w-10 rounded-full sm:h-12 sm:w-12" />
							<Skeleton class="h-3 w-24 sm:h-4 sm:w-32" />
							<Skeleton class="h-16 w-full sm:h-20" />
						</Card.Content>
					</Card.Root>
				{/if}
			</div>
		</div>

		<!-- Pending Submissions -->
		{#if $user.loggedIn}
			<DashboardSubmissions bind:submissions bind:loading={loadingSubmissions} />
		{/if}

		<!-- Event Carousel -->
		<DashboardEvents bind:events bind:currentTime />

		<!-- Center Search Bar (Mobile) -->
		{#if searchEnabled && searchPosition === 'center'}
			<div class="my-4 flex w-full flex-1 items-center justify-center">
				<DashboardSearch
					bind:searchEnabled
					bind:searchPosition
					bind:searchEngine
					bind:shortcutsVisible
					bind:shortcuts
				/>
			</div>
		{/if}

		<!-- Bottom Search Bar (Mobile) -->
		{#if searchEnabled && searchPosition === 'bottom'}
			<div class="mb-20 w-full">
				<DashboardSearch
					bind:searchEnabled
					bind:searchPosition
					bind:searchEngine
					bind:shortcutsVisible
					bind:shortcuts
				/>
			</div>
		{/if}

		<!-- Scroll Down Indicator (Mobile) -->
		<button
			class="absolute bottom-4 left-1/2 z-20 flex -translate-x-1/2 animate-bounce flex-col items-center gap-1 text-foreground/80 transition-colors hover:text-foreground sm:bottom-6"
			on:click={scrollToContent}
		>
			<span
				class="rounded-full bg-background/60 px-3 py-1 text-xs font-medium backdrop-blur-md sm:px-4 sm:text-sm"
				>{$_('dashboard.scroll_down') || 'Scroll down for more'}</span
			>
			<ChevronDown class="h-5 w-5 sm:h-6 sm:w-6" />
		</button>
	</div>

	<!-- Desktop Layout: Absolute positioned elements -->
	<div class="hidden lg:block">
		<!-- Top Search Bar (Desktop) -->
		{#if searchEnabled && searchPosition === 'top'}
			<div class="absolute left-1/2 top-[70px] z-20 w-full max-w-xl -translate-x-1/2 px-8">
				<DashboardSearch
					bind:searchEnabled
					bind:searchPosition
					bind:searchEngine
					bind:shortcutsVisible
					bind:shortcuts
				/>
			</div>
		{/if}

		<!-- Center Search Bar (Desktop) -->
		{#if searchEnabled && searchPosition === 'center'}
			<div
				class="absolute left-1/2 top-1/2 z-20 w-full max-w-xl -translate-x-1/2 -translate-y-1/2 px-8"
			>
				<DashboardSearch
					bind:searchEnabled
					bind:searchPosition
					bind:searchEngine
					bind:shortcutsVisible
					bind:shortcuts
				/>
			</div>
		{/if}

		<!-- Bottom Search Bar (Desktop) -->
		{#if searchEnabled && searchPosition === 'bottom'}
			<div class="absolute bottom-32 left-1/2 z-20 w-full max-w-xl -translate-x-1/2 px-8">
				<DashboardSearch
					bind:searchEnabled
					bind:searchPosition
					bind:searchEngine
					bind:shortcutsVisible
					bind:shortcuts
				/>
			</div>
		{/if}

		<!-- Bottom Search Bar (Desktop) -->
		{#if searchEnabled && searchPosition === 'bottom'}
			<div class="absolute bottom-32 left-1/2 z-20 w-full max-w-xl -translate-x-1/2 px-8">
				<DashboardSearch
					bind:searchEnabled
					bind:searchPosition
					bind:searchEngine
					bind:shortcutsVisible
					bind:shortcuts
				/>
			</div>
		{/if}

		<!-- Top Left: Clock & Date -->
		<div class="absolute left-8 top-[70px] z-20">
			<div class="rounded-xl bg-background/60 p-4 backdrop-blur-md">
				<div class="text-5xl font-bold tracking-tight xl:text-6xl">
					{currentTime.toLocaleTimeString('vi-VN', {
						hour: '2-digit',
						minute: '2-digit',
						second: '2-digit'
					})}
				</div>
				<div class="mt-1 text-base text-muted-foreground">
					{currentTime.toLocaleDateString('vi-VN', {
						weekday: 'long',
						year: 'numeric',
						month: 'long',
						day: 'numeric'
					})}
				</div>
			</div>
		</div>

		<!-- Top Right: Settings Button -->
		<button
			class="absolute right-8 top-[70px] z-20 rounded-full bg-background/60 p-3 backdrop-blur-md transition-all hover:bg-background/80"
			on:click={() => (settingsOpen = true)}
		>
			<Gear class="h-5 w-5" />
		</button>

		<!-- Left Side: Player Profile + Pending Submissions -->
		<div class="absolute bottom-24 left-8 z-20 flex flex-col gap-4">
			<!-- Pending Submissions -->
			{#if $user.loggedIn}
				<div class="w-[350px] xl:w-[380px]">
					<DashboardSubmissions bind:submissions bind:loading={loadingSubmissions} />
				</div>
			{/if}

			<!-- Player Profile -->
			<div class="w-[350px] xl:w-[380px]">
				{#if $user.loggedIn && $user.data}
					<PlayerCard player={$user.data} />
				{:else if $user.checked}
					<Card.Root class="bg-background/60 backdrop-blur-md">
						<Card.Content class="flex flex-col items-center gap-4 py-6 text-center">
							<p class="text-muted-foreground">
								{$_('dashboard.login_prompt') || 'Sign in to view your profile'}
							</p>
							<Button variant="outline" href="/discord">
								{$_('dashboard.login') || 'Sign In'}
							</Button>
						</Card.Content>
					</Card.Root>
				{:else}
					<Card.Root class="bg-background/60 backdrop-blur-md">
						<Card.Content class="space-y-3 py-4">
							<Skeleton class="h-12 w-12 rounded-full" />
							<Skeleton class="h-4 w-32" />
							<Skeleton class="h-20 w-full" />
						</Card.Content>
					</Card.Root>
				{/if}
			</div>
		</div>

		<!-- Bottom Right: Event Carousel -->
		<div class="absolute bottom-24 right-8 z-20 w-[380px] xl:w-[420px]">
			<DashboardEvents bind:events bind:currentTime />
		</div>

		<!-- Scroll Down Indicator (Desktop) -->
		<button
			class="absolute bottom-8 left-1/2 z-20 flex -translate-x-1/2 animate-bounce flex-col items-center gap-1 text-foreground/80 transition-colors hover:text-foreground"
			on:click={scrollToContent}
		>
			<span class="rounded-full bg-background/60 px-4 py-1 text-sm font-medium backdrop-blur-md"
				>{$_('dashboard.scroll_down') || 'Scroll down for more'}</span
			>
			<ChevronDown class="h-6 w-6" />
		</button>
	</div>
</div>

{#if selectedSubmission && $user.data}
	<RecordDetail
		uid={$user.data.uid}
		levelID={selectedSubmission.levelid}
		bind:open={recordDetailOpen}
	/>
{/if}

<style lang="scss">
	.dashboard-hero {
		background-size: cover;
		background-position: center;
		// Use scroll on mobile for better performance
		background-attachment: scroll;

		@media (min-width: 1024px) {
			background-attachment: fixed;
		}
	}

	@keyframes bounce {
		0%,
		100% {
			transform: translateX(-50%) translateY(0);
		}
		50% {
			transform: translateX(-50%) translateY(-10px);
		}
	}

	.animate-bounce {
		animation: bounce 2s infinite;
	}

	// Extra small breakpoint for very small phones
	@media (max-width: 350px) {
		:global(.dashboard-hero) {
			padding-left: 0.5rem !important;
			padding-right: 0.5rem !important;
		}
	}
</style>
