<script lang="ts">
	import { onMount } from 'svelte';
	import { user } from '$lib/client';
	import { browser } from '$app/environment';
	import PlayerCard from '$lib/components/playerCard.svelte';
	import * as Carousel from '$lib/components/ui/carousel/index.js';
	import * as Dialog from '$lib/components/ui/dialog';
	import * as Card from '$lib/components/ui/card';
	import { Button } from '$lib/components/ui/button/index.js';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { Skeleton } from '$lib/components/ui/skeleton';
	import { ScrollArea } from '$lib/components/ui/scroll-area';
	import Autoplay from 'embla-carousel-autoplay';
	import Clock from 'svelte-radix/Clock.svelte';
	import Gear from 'svelte-radix/Gear.svelte';
	import ChevronDown from 'svelte-radix/ChevronDown.svelte';
	import ExternalLink from 'svelte-radix/ExternalLink.svelte';
	import { toast } from 'svelte-sonner';
	import { _ } from 'svelte-i18n';

	export let events: any[];

	let dashboardBg: string = '';
	let tempBgUrl: string = '';
	let overlayType: 'none' | 'dark' | 'blur' | 'both' = 'none';
	let tempOverlayType: 'none' | 'dark' | 'blur' | 'both' = 'none';
	let settingsOpen = false;
	let submissions: any[] = [];
	let loadingSubmissions = true;
	let currentTime = new Date();

	// Dashboard settings storage keys
	const DASHBOARD_BG_KEY = 'dashboard.backgroundUrl';
	const DASHBOARD_OVERLAY_KEY = 'dashboard.overlayType';

	function loadDashboardSettings() {
		if (browser) {
			dashboardBg = localStorage.getItem(DASHBOARD_BG_KEY) || '';
			tempBgUrl = dashboardBg;
			overlayType = (localStorage.getItem(DASHBOARD_OVERLAY_KEY) as typeof overlayType) || 'none';
			tempOverlayType = overlayType;
		}
	}

	function saveDashboardBackground() {
		if (browser) {
			localStorage.setItem(DASHBOARD_BG_KEY, tempBgUrl);
			localStorage.setItem(DASHBOARD_OVERLAY_KEY, tempOverlayType);
			dashboardBg = tempBgUrl;
			overlayType = tempOverlayType;
			toast.success($_('dashboard.settings.bg_saved') || 'Background saved!');
			settingsOpen = false;
		}
	}

	function clearDashboardBackground() {
		if (browser) {
			localStorage.removeItem(DASHBOARD_BG_KEY);
			localStorage.removeItem(DASHBOARD_OVERLAY_KEY);
			dashboardBg = '';
			tempBgUrl = '';
			overlayType = 'none';
			tempOverlayType = 'none';
			toast.success($_('dashboard.settings.bg_cleared') || 'Background cleared!');
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

<!-- Dashboard Settings Dialog -->
<Dialog.Root bind:open={settingsOpen}>
	<Dialog.Content class="sm:max-w-[500px]">
		<Dialog.Header>
			<Dialog.Title>{$_('dashboard.settings.title') || 'Dashboard Settings'}</Dialog.Title>
			<Dialog.Description>
				{$_('dashboard.settings.description') || 'Customize your dashboard appearance'}
			</Dialog.Description>
		</Dialog.Header>
		<div class="grid gap-4 py-4">
			<div class="grid gap-2">
				<Label for="bg-url">{$_('dashboard.settings.bg_url') || 'Background Image URL'}</Label>
				<Input
					id="bg-url"
					bind:value={tempBgUrl}
					placeholder="https://example.com/image.jpg"
				/>
				<p class="text-sm text-muted-foreground">
					{$_('dashboard.settings.bg_hint') || 'Enter a URL to an image for your dashboard background'}
				</p>
			</div>
			
			<!-- Overlay Options -->
			<div class="grid gap-2">
				<Label>{$_('dashboard.settings.overlay') || 'Background Overlay'}</Label>
				<div class="flex flex-wrap gap-2">
					<Button 
						variant={tempOverlayType === 'none' ? 'default' : 'outline'} 
						size="sm"
						on:click={() => tempOverlayType = 'none'}
					>
						{$_('dashboard.settings.overlay_none') || 'None'}
					</Button>
					<Button 
						variant={tempOverlayType === 'dark' ? 'default' : 'outline'} 
						size="sm"
						on:click={() => tempOverlayType = 'dark'}
					>
						{$_('dashboard.settings.overlay_dark') || 'Darker'}
					</Button>
					<Button 
						variant={tempOverlayType === 'blur' ? 'default' : 'outline'} 
						size="sm"
						on:click={() => tempOverlayType = 'blur'}
					>
						{$_('dashboard.settings.overlay_blur') || 'Blur'}
					</Button>
					<Button 
						variant={tempOverlayType === 'both' ? 'default' : 'outline'} 
						size="sm"
						on:click={() => tempOverlayType = 'both'}
					>
						{$_('dashboard.settings.overlay_both') || 'Dark + Blur'}
					</Button>
				</div>
			</div>

			{#if tempBgUrl}
				<div class="relative aspect-video w-full overflow-hidden rounded-md border">
					<img
						src={tempBgUrl}
						alt="Preview"
						class="h-full w-full object-cover"
						on:error={() => toast.error('Invalid image URL')}
					/>
					<!-- Preview overlay -->
					{#if tempOverlayType === 'dark' || tempOverlayType === 'both'}
						<div class="absolute inset-0 bg-black/40"></div>
					{/if}
					{#if tempOverlayType === 'blur' || tempOverlayType === 'both'}
						<div class="absolute inset-0 backdrop-blur-sm"></div>
					{/if}
				</div>
			{/if}
		</div>
		<Dialog.Footer>
			<Button variant="outline" on:click={clearDashboardBackground}>
				{$_('dashboard.settings.clear') || 'Clear'}
			</Button>
			<Button on:click={saveDashboardBackground}>
				{$_('dashboard.settings.save') || 'Save'}
			</Button>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>

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
	<div class="relative z-20 flex h-full min-h-[100vh] w-full flex-col px-3 pt-[70px] sm:px-4 lg:hidden">
		<!-- Top: Clock & Date + Settings -->
		<div class="flex items-start justify-between gap-2">
			<div class="rounded-xl bg-background/60 p-3 backdrop-blur-md sm:p-4">
				<div class="text-2xl font-bold tracking-tight xs:text-3xl sm:text-4xl">
					{currentTime.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
				</div>
				<div class="mt-1 text-xs text-muted-foreground sm:text-sm">
					{currentTime.toLocaleDateString('vi-VN', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}
				</div>
			</div>
			<button
				class="flex-shrink-0 rounded-full bg-background/60 p-2.5 backdrop-blur-md transition-all hover:bg-background/80 sm:p-3"
				on:click={() => (settingsOpen = true)}
			>
				<Gear class="h-4 w-4 sm:h-5 sm:w-5" />
			</button>
		</div>

		<!-- Middle: Cards Grid -->
		<div class="mt-4 flex flex-1 flex-col gap-3 pb-20 sm:gap-4">
			<!-- Player Profile -->
			<div class="w-full">
				{#if $user.loggedIn && $user.data}
					<PlayerCard player={$user.data} />
				{:else if $user.checked}
					<Card.Root class="bg-background/60 backdrop-blur-md">
						<Card.Content class="flex flex-col items-center gap-3 py-4 text-center sm:gap-4 sm:py-6">
							<p class="text-sm text-muted-foreground sm:text-base">{$_('dashboard.login_prompt') || 'Sign in to view your profile'}</p>
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

			<!-- Pending Submissions -->
			{#if $user.loggedIn}
				<Card.Root class="w-full bg-background/60 backdrop-blur-md">
					<Card.Header class="px-3 pb-2 pt-3 sm:px-6 sm:pt-6">
						<Card.Title class="flex items-center justify-between text-sm sm:text-base">
							<span>{$_('dashboard.pending_submissions') || 'Pending Submissions'}</span>
							{#if submissions.length > 0}
								<a href={`/mySubmission/${$user.data?.uid}`} class="text-xs text-muted-foreground hover:text-foreground sm:text-sm">
									{$_('dashboard.view_all') || 'View All'} →
								</a>
							{/if}
						</Card.Title>
					</Card.Header>
					<Card.Content class="px-3 pb-3 sm:px-6 sm:pb-6">
						{#if loadingSubmissions}
							<div class="space-y-2">
								{#each { length: 2 } as _}
									<div class="flex items-center gap-2 sm:gap-3">
										<Skeleton class="h-7 w-7 rounded sm:h-8 sm:w-8" />
										<div class="flex-1">
											<Skeleton class="mb-1 h-2.5 w-20 sm:h-3 sm:w-24" />
											<Skeleton class="h-2 w-12 sm:w-16" />
										</div>
									</div>
								{/each}
							</div>
						{:else if submissions.length === 0}
							<p class="py-2 text-center text-xs text-muted-foreground sm:text-sm">{$_('dashboard.no_submissions') || 'No pending submissions'}</p>
						{:else}
							<div class="space-y-1">
								{#each submissions.slice(0, 3) as submission}
									<a
										href={`/level/${submission.levelid}`}
										class="flex items-center gap-2 rounded-md p-1.5 transition-colors hover:bg-muted/50 sm:gap-3 sm:p-2"
									>
										<div class="flex h-7 w-7 items-center justify-center rounded bg-muted text-[10px] font-bold sm:h-8 sm:w-8 sm:text-xs">
											{submission.progress}%
										</div>
										<div class="flex-1 overflow-hidden">
											<p class="truncate text-xs font-medium sm:text-sm">{submission.levels?.name || `Level #${submission.levelid}`}</p>
											<p class="text-[10px] text-muted-foreground sm:text-xs">#{submission.queueNo || '-'}</p>
										</div>
									</a>
								{/each}
							</div>
						{/if}
					</Card.Content>
				</Card.Root>
			{/if}

			<!-- Event Carousel -->
			<Card.Root class="w-full bg-background/60 backdrop-blur-md">
				<Card.Header class="px-3 pb-2 pt-3 sm:px-6 sm:pt-6">
					<Card.Title class="flex items-center justify-between text-sm sm:text-base">
						<span>{$_('dashboard.events') || 'Events'}</span>
						<a href="/events" class="text-xs text-muted-foreground hover:text-foreground sm:text-sm">
							{$_('dashboard.view_all') || 'View All'} →
						</a>
					</Card.Title>
				</Card.Header>
				<Card.Content class="px-3 pb-3 sm:px-6 sm:pb-6">
					{#if events && events.length > 0}
						<Carousel.Root
							class="w-full"
							plugins={[
								Autoplay({
									delay: 5000
								})
							]}
						>
							<Carousel.Content>
								{#each events as event}
									<Carousel.Item>
										<a href={`/event/${event.id}`} class="block">
											<div class="event-card relative overflow-hidden rounded-lg">
												<img
													src={event.imgUrl || `https://cdn.demonlistvn.com/event-banner/${event.id}.webp`}
													alt={event.title}
													class="aspect-[16/9] w-full object-cover"
												/>
												<div class="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
												<div class="absolute bottom-0 left-0 right-0 p-2 sm:p-3">
													<div class="mb-1 flex flex-wrap items-center gap-1">
														<div class="flex items-center gap-1 rounded-full bg-white/20 px-1.5 py-0.5 text-[10px] text-white backdrop-blur-sm sm:px-2 sm:text-xs">
															<Clock class="h-2.5 w-2.5 sm:h-3 sm:w-3" />
															{getEventInterval(event)}
														</div>
														{#if event.isRanked}
															<div class="rounded-full bg-yellow-500/80 px-1.5 py-0.5 text-[10px] text-white sm:px-2 sm:text-xs">
																{$_('events.ranked') || 'Ranked'}
															</div>
														{/if}
													</div>
													<h3 class="line-clamp-1 text-xs font-semibold text-white sm:text-sm">{event.title}</h3>
												</div>
											</div>
										</a>
									</Carousel.Item>
								{/each}
							</Carousel.Content>
							<div class="mt-2 flex justify-center gap-2">
								<Carousel.Previous class="static h-6 w-6 translate-x-0 translate-y-0 sm:h-7 sm:w-7" />
								<Carousel.Next class="static h-6 w-6 translate-x-0 translate-y-0 sm:h-7 sm:w-7" />
							</div>
						</Carousel.Root>
					{:else}
						<div class="flex aspect-[16/9] items-center justify-center rounded-lg bg-muted">
							<p class="text-xs text-muted-foreground sm:text-sm">{$_('dashboard.no_events') || 'No active events'}</p>
						</div>
					{/if}
				</Card.Content>
			</Card.Root>
		</div>

		<!-- Scroll Down Indicator (Mobile) -->
		<button
			class="absolute bottom-4 left-1/2 z-20 flex -translate-x-1/2 animate-bounce flex-col items-center gap-1 text-foreground/80 transition-colors hover:text-foreground sm:bottom-6"
			on:click={scrollToContent}
		>
			<span class="rounded-full bg-background/60 px-3 py-1 text-xs font-medium backdrop-blur-md sm:px-4 sm:text-sm">{$_('dashboard.scroll_down') || 'Scroll down for more'}</span>
			<ChevronDown class="h-5 w-5 sm:h-6 sm:w-6" />
		</button>
	</div>

	<!-- Desktop Layout: Absolute positioned elements -->
	<div class="hidden lg:block">
		<!-- Top Left: Clock & Date -->
		<div class="absolute left-8 top-[70px] z-20">
			<div class="rounded-xl bg-background/60 p-4 backdrop-blur-md">
				<div class="text-5xl font-bold tracking-tight xl:text-6xl">
					{currentTime.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
				</div>
				<div class="mt-1 text-base text-muted-foreground">
					{currentTime.toLocaleDateString('vi-VN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
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
				<Card.Root class="w-[350px] bg-background/60 backdrop-blur-md xl:w-[380px]">
					<Card.Header class="pb-2">
						<Card.Title class="flex items-center justify-between text-base">
							<span>{$_('dashboard.pending_submissions') || 'Pending Submissions'}</span>
							{#if submissions.length > 0}
								<a href={`/mySubmission/${$user.data?.uid}`} class="text-sm text-muted-foreground hover:text-foreground">
									{$_('dashboard.view_all') || 'View All'} →
								</a>
							{/if}
						</Card.Title>
					</Card.Header>
					<Card.Content>
						{#if loadingSubmissions}
							<div class="space-y-2">
								{#each { length: 2 } as _}
									<div class="flex items-center gap-3">
										<Skeleton class="h-8 w-8 rounded" />
										<div class="flex-1">
											<Skeleton class="mb-1 h-3 w-24" />
											<Skeleton class="h-2 w-16" />
										</div>
									</div>
								{/each}
							</div>
						{:else if submissions.length === 0}
							<p class="py-2 text-center text-sm text-muted-foreground">{$_('dashboard.no_submissions') || 'No pending submissions'}</p>
						{:else}
							<div class="space-y-1">
								{#each submissions.slice(0, 3) as submission}
									<a
										href={`/level/${submission.levelid}`}
										class="flex items-center gap-3 rounded-md p-2 transition-colors hover:bg-muted/50"
									>
										<div class="flex h-8 w-8 items-center justify-center rounded bg-muted text-xs font-bold">
											{submission.progress}%
										</div>
										<div class="flex-1 overflow-hidden">
											<p class="truncate text-sm font-medium">{submission.levels?.name || `Level #${submission.levelid}`}</p>
											<p class="text-xs text-muted-foreground">#{submission.queueNo || '-'}</p>
										</div>
									</a>
								{/each}
							</div>
						{/if}
					</Card.Content>
				</Card.Root>
			{/if}

			<!-- Player Profile -->
			<div class="w-[350px] xl:w-[380px]">
				{#if $user.loggedIn && $user.data}
					<PlayerCard player={$user.data} />
				{:else if $user.checked}
					<Card.Root class="bg-background/60 backdrop-blur-md">
						<Card.Content class="flex flex-col items-center gap-4 py-6 text-center">
							<p class="text-muted-foreground">{$_('dashboard.login_prompt') || 'Sign in to view your profile'}</p>
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
			<Card.Root class="bg-background/60 backdrop-blur-md">
				<Card.Header class="pb-2">
					<Card.Title class="flex items-center justify-between text-base">
						<span>{$_('dashboard.events') || 'Events'}</span>
						<a href="/events" class="text-sm text-muted-foreground hover:text-foreground">
							{$_('dashboard.view_all') || 'View All'} →
						</a>
					</Card.Title>
				</Card.Header>
				<Card.Content>
					{#if events && events.length > 0}
						<Carousel.Root
							class="w-full"
							plugins={[
								Autoplay({
									delay: 5000
								})
							]}
						>
							<Carousel.Content>
								{#each events as event}
									<Carousel.Item>
										<a href={`/event/${event.id}`} class="block">
											<div class="event-card relative overflow-hidden rounded-lg">
												<img
													src={event.imgUrl || `https://cdn.demonlistvn.com/event-banner/${event.id}.webp`}
													alt={event.title}
													class="aspect-[16/9] w-full object-cover"
												/>
												<div class="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
												<div class="absolute bottom-0 left-0 right-0 p-3">
													<div class="mb-1 flex flex-wrap items-center gap-1">
														<div class="flex items-center gap-1 rounded-full bg-white/20 px-2 py-0.5 text-xs text-white backdrop-blur-sm">
															<Clock class="h-3 w-3" />
															{getEventInterval(event)}
														</div>
														{#if event.isRanked}
															<div class="rounded-full bg-yellow-500/80 px-2 py-0.5 text-xs text-white">
																{$_('events.ranked') || 'Ranked'}
															</div>
														{/if}
													</div>
													<h3 class="line-clamp-1 text-sm font-semibold text-white">{event.title}</h3>
												</div>
											</div>
										</a>
									</Carousel.Item>
								{/each}
							</Carousel.Content>
							<div class="mt-2 flex justify-center gap-2">
								<Carousel.Previous class="static h-7 w-7 translate-x-0 translate-y-0" />
								<Carousel.Next class="static h-7 w-7 translate-x-0 translate-y-0" />
							</div>
						</Carousel.Root>
					{:else}
						<div class="flex aspect-[16/9] items-center justify-center rounded-lg bg-muted">
							<p class="text-sm text-muted-foreground">{$_('dashboard.no_events') || 'No active events'}</p>
						</div>
					{/if}
				</Card.Content>
			</Card.Root>
		</div>

		<!-- Scroll Down Indicator (Desktop) -->
		<button
			class="absolute bottom-8 left-1/2 z-20 flex -translate-x-1/2 animate-bounce flex-col items-center gap-1 text-foreground/80 transition-colors hover:text-foreground"
			on:click={scrollToContent}
		>
			<span class="rounded-full bg-background/60 px-4 py-1 text-sm font-medium backdrop-blur-md">{$_('dashboard.scroll_down') || 'Scroll down for more'}</span>
			<ChevronDown class="h-6 w-6" />
		</button>
	</div>
</div><style lang="scss">
	.dashboard-hero {
		background-size: cover;
		background-position: center;
		// Use scroll on mobile for better performance
		background-attachment: scroll;
		
		@media (min-width: 1024px) {
			background-attachment: fixed;
		}
	}

	.event-card {
		transition: transform 0.2s ease;
		
		&:hover {
			transform: scale(1.02);
		}
	}

	.line-clamp-1 {
		display: -webkit-box;
		-webkit-line-clamp: 1;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}

	@keyframes bounce {
		0%, 100% {
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
