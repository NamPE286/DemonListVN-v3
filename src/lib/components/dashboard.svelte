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
	import { Switch } from '$lib/components/ui/switch';
	import * as Select from '$lib/components/ui/select';
	import Autoplay from 'embla-carousel-autoplay';
	import Clock from 'svelte-radix/Clock.svelte';
	import Gear from 'svelte-radix/Gear.svelte';
	import ChevronDown from 'svelte-radix/ChevronDown.svelte';
	import ExternalLink from 'svelte-radix/ExternalLink.svelte';
	import MagnifyingGlass from 'svelte-radix/MagnifyingGlass.svelte';
	import Cross2 from 'svelte-radix/Cross2.svelte';
	import Pencil1 from 'svelte-radix/Pencil1.svelte';
	import Plus from 'svelte-radix/Plus.svelte';
	import Trash from 'svelte-radix/Trash.svelte';
	import { toast } from 'svelte-sonner';
	import { _ } from 'svelte-i18n';
	import RecordDetail from '$lib/components/recordDetail.svelte';

	export let events: any[];

	let selectedSubmission: any = null;
	let recordDetailOpen = false;

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

	// Web search state
	let searchEnabled = true;
	let searchEngine: keyof typeof SEARCH_ENGINES = 'google';
	let searchPosition: 'top' | 'center' | 'bottom' = 'center';
	let shortcutsVisible = true;
	let shortcuts: Array<{ name: string; url: string; icon: string }> = [...DEFAULT_SHORTCUTS];
	let searchQuery = '';

	// Temp values for settings
	let tempSearchEnabled = true;
	let tempSearchEngine: keyof typeof SEARCH_ENGINES = 'google';
	let tempSearchPosition: 'top' | 'center' | 'bottom' = 'center';
	let tempShortcutsVisible = true;
	let tempShortcuts: Array<{ name: string; url: string; icon: string }> = [...DEFAULT_SHORTCUTS];

	// Shortcut editing state
	let editingShortcutIndex: number | null = null;
	let editingShortcut = { name: '', url: '', icon: '' };
	let shortcutDialogOpen = false;

	function loadDashboardSettings() {
		if (browser) {
			dashboardBg = localStorage.getItem(DASHBOARD_BG_KEY) || '';
			tempBgUrl = dashboardBg;
			overlayType = (localStorage.getItem(DASHBOARD_OVERLAY_KEY) as typeof overlayType) || 'none';
			tempOverlayType = overlayType;

			// Load search settings
			const savedSearchEnabled = localStorage.getItem(DASHBOARD_SEARCH_ENABLED_KEY);
			searchEnabled = savedSearchEnabled === null ? true : savedSearchEnabled === 'true';
			tempSearchEnabled = searchEnabled;

			searchEngine =
				(localStorage.getItem(DASHBOARD_SEARCH_ENGINE_KEY) as keyof typeof SEARCH_ENGINES) ||
				'google';
			tempSearchEngine = searchEngine;

			searchPosition =
				(localStorage.getItem(DASHBOARD_SEARCH_POSITION_KEY) as typeof searchPosition) || 'center';
			tempSearchPosition = searchPosition;

			const savedShortcutsVisible = localStorage.getItem(DASHBOARD_SHORTCUTS_VISIBLE_KEY);
			shortcutsVisible = savedShortcutsVisible === null ? true : savedShortcutsVisible === 'true';
			tempShortcutsVisible = shortcutsVisible;

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
			tempShortcuts = shortcuts.map((s) => ({ ...s }));
		}
	}

	function saveDashboardBackground() {
		if (browser) {
			localStorage.setItem(DASHBOARD_BG_KEY, tempBgUrl);
			localStorage.setItem(DASHBOARD_OVERLAY_KEY, tempOverlayType);
			localStorage.setItem(DASHBOARD_SEARCH_ENABLED_KEY, String(tempSearchEnabled));
			localStorage.setItem(DASHBOARD_SEARCH_ENGINE_KEY, tempSearchEngine);
			localStorage.setItem(DASHBOARD_SEARCH_POSITION_KEY, tempSearchPosition);
			localStorage.setItem(DASHBOARD_SHORTCUTS_VISIBLE_KEY, String(tempShortcutsVisible));
			localStorage.setItem(DASHBOARD_SHORTCUTS_KEY, JSON.stringify(tempShortcuts));

			dashboardBg = tempBgUrl;
			overlayType = tempOverlayType;
			searchEnabled = tempSearchEnabled;
			searchEngine = tempSearchEngine;
			searchPosition = tempSearchPosition;
			shortcutsVisible = tempShortcutsVisible;
			shortcuts = tempShortcuts.map((s) => ({ ...s }));

			toast.success($_('dashboard.settings.saved') || 'Settings saved!');
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

	function resetSearchSettings() {
		if (browser) {
			localStorage.removeItem(DASHBOARD_SEARCH_ENABLED_KEY);
			localStorage.removeItem(DASHBOARD_SEARCH_ENGINE_KEY);
			localStorage.removeItem(DASHBOARD_SEARCH_POSITION_KEY);
			localStorage.removeItem(DASHBOARD_SHORTCUTS_VISIBLE_KEY);
			localStorage.removeItem(DASHBOARD_SHORTCUTS_KEY);

			searchEnabled = true;
			tempSearchEnabled = true;
			searchEngine = 'google';
			tempSearchEngine = 'google';
			searchPosition = 'center';
			tempSearchPosition = 'center';
			shortcutsVisible = true;
			tempShortcutsVisible = true;
			shortcuts = [...DEFAULT_SHORTCUTS];
			tempShortcuts = shortcuts.map((s) => ({ ...s }));

			toast.success($_('dashboard.settings.search_reset') || 'Search settings reset!');
		}
	}

	function handleSearch(e: Event) {
		e.preventDefault();
		if (searchQuery.trim()) {
			const engineUrl = SEARCH_ENGINES[searchEngine].url;
			window.open(engineUrl + encodeURIComponent(searchQuery.trim()), '_blank');
			searchQuery = '';
		}
	}

	function openShortcutDialog(index: number | null = null) {
		if (index !== null && tempShortcuts[index]) {
			editingShortcutIndex = index;
			editingShortcut = { ...tempShortcuts[index] };
		} else {
			editingShortcutIndex = null;
			editingShortcut = { name: '', url: '', icon: '' };
		}
		shortcutDialogOpen = true;
	}

	function saveShortcut() {
		if (!editingShortcut.name.trim() || !editingShortcut.url.trim()) {
			toast.error($_('dashboard.settings.shortcut_required') || 'Name and URL are required');
			return;
		}

		// Auto-generate icon if not provided
		if (!editingShortcut.icon.trim()) {
			try {
				const url = new URL(editingShortcut.url);
				editingShortcut.icon = `https://www.google.com/s2/favicons?domain=${url.hostname}&sz=64`;
			} catch {
				editingShortcut.icon = '';
			}
		}

		if (editingShortcutIndex !== null) {
			tempShortcuts[editingShortcutIndex] = { ...editingShortcut };
		} else {
			tempShortcuts = [...tempShortcuts, { ...editingShortcut }];
		}

		shortcutDialogOpen = false;
		editingShortcutIndex = null;
		editingShortcut = { name: '', url: '', icon: '' };
	}

	function deleteShortcut(index: number) {
		tempShortcuts = tempShortcuts.filter((_, i) => i !== index);
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
	<Dialog.Content class="max-h-[90vh] overflow-y-auto sm:max-w-[600px]">
		<Dialog.Header>
			<Dialog.Title>{$_('dashboard.settings.title') || 'Dashboard Settings'}</Dialog.Title>
			<Dialog.Description>
				{$_('dashboard.settings.description') || 'Customize your dashboard appearance'}
			</Dialog.Description>
		</Dialog.Header>
		<ScrollArea class="max-h-[60vh] pr-4">
			<div class="grid gap-6 py-4">
				<!-- Background Settings Section -->
				<div class="space-y-4">
					<h3 class="text-sm font-semibold">
						{$_('dashboard.settings.background_section') || 'Background'}
					</h3>

					<div class="grid gap-2">
						<Label for="bg-url">{$_('dashboard.settings.bg_url') || 'Background Image URL'}</Label>
						<Input id="bg-url" bind:value={tempBgUrl} placeholder="https://example.com/image.jpg" />
						<p class="text-xs text-muted-foreground">
							{$_('dashboard.settings.bg_hint') ||
								'Enter a URL to an image for your dashboard background'}
						</p>
					</div>

					<!-- Overlay Options -->
					<div class="grid gap-2">
						<Label>{$_('dashboard.settings.overlay') || 'Background Overlay'}</Label>
						<div class="flex flex-wrap gap-2">
							<Button
								variant={tempOverlayType === 'none' ? 'default' : 'outline'}
								size="sm"
								on:click={() => (tempOverlayType = 'none')}
							>
								{$_('dashboard.settings.overlay_none') || 'None'}
							</Button>
							<Button
								variant={tempOverlayType === 'dark' ? 'default' : 'outline'}
								size="sm"
								on:click={() => (tempOverlayType = 'dark')}
							>
								{$_('dashboard.settings.overlay_dark') || 'Darker'}
							</Button>
							<Button
								variant={tempOverlayType === 'blur' ? 'default' : 'outline'}
								size="sm"
								on:click={() => (tempOverlayType = 'blur')}
							>
								{$_('dashboard.settings.overlay_blur') || 'Blur'}
							</Button>
							<Button
								variant={tempOverlayType === 'both' ? 'default' : 'outline'}
								size="sm"
								on:click={() => (tempOverlayType = 'both')}
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

					<Button variant="outline" size="sm" on:click={clearDashboardBackground}>
						{$_('dashboard.settings.clear_bg') || 'Clear Background'}
					</Button>
				</div>

				<!-- Divider -->
				<div class="border-t"></div>

				<!-- Web Search Settings Section -->
				<div class="space-y-4">
					<h3 class="text-sm font-semibold">
						{$_('dashboard.settings.search_section') || 'Web Search'}
					</h3>

					<!-- Enable/Disable Search -->
					<div class="flex items-center justify-between">
						<div>
							<Label>{$_('dashboard.settings.enable_search') || 'Enable Web Search'}</Label>
							<p class="text-xs text-muted-foreground">
								{$_('dashboard.settings.enable_search_hint') || 'Show search bar on dashboard'}
							</p>
						</div>
						<Switch bind:checked={tempSearchEnabled} />
					</div>

					{#if tempSearchEnabled}
						<!-- Search Engine Selection -->
						<div class="grid gap-2">
							<Label>{$_('dashboard.settings.search_engine') || 'Search Engine'}</Label>
							<Select.Root
								selected={{ value: tempSearchEngine, label: SEARCH_ENGINES[tempSearchEngine].name }}
								onSelectedChange={(v) => {
									if (v) tempSearchEngine = v.value;
								}}
							>
								<Select.Trigger class="w-full">
									<Select.Value placeholder="Select search engine" />
								</Select.Trigger>
								<Select.Content>
									{#each Object.entries(SEARCH_ENGINES) as [key, engine]}
										<Select.Item value={key}>{engine.name}</Select.Item>
									{/each}
								</Select.Content>
							</Select.Root>
						</div>

						<!-- Search Bar Position -->
						<div class="grid gap-2">
							<Label>{$_('dashboard.settings.search_position') || 'Search Bar Position'}</Label>
							<div class="flex flex-wrap gap-2">
								<Button
									variant={tempSearchPosition === 'top' ? 'default' : 'outline'}
									size="sm"
									on:click={() => (tempSearchPosition = 'top')}
								>
									{$_('dashboard.settings.position_top') || 'Top'}
								</Button>
								<Button
									variant={tempSearchPosition === 'center' ? 'default' : 'outline'}
									size="sm"
									on:click={() => (tempSearchPosition = 'center')}
								>
									{$_('dashboard.settings.position_center') || 'Center'}
								</Button>
								<Button
									variant={tempSearchPosition === 'bottom' ? 'default' : 'outline'}
									size="sm"
									on:click={() => (tempSearchPosition = 'bottom')}
								>
									{$_('dashboard.settings.position_bottom') || 'Bottom'}
								</Button>
							</div>
						</div>

						<!-- Show/Hide Shortcuts -->
						<div class="flex items-center justify-between">
							<div>
								<Label>{$_('dashboard.settings.show_shortcuts') || 'Show Shortcuts'}</Label>
								<p class="text-xs text-muted-foreground">
									{$_('dashboard.settings.show_shortcuts_hint') ||
										'Display quick access links below search'}
								</p>
							</div>
							<Switch bind:checked={tempShortcutsVisible} />
						</div>

						{#if tempShortcutsVisible}
							<!-- Shortcuts Management -->
							<div class="grid gap-2">
								<div class="flex items-center justify-between">
									<Label>{$_('dashboard.settings.shortcuts') || 'Shortcuts'}</Label>
									<Button variant="outline" size="sm" on:click={() => openShortcutDialog()}>
										<Plus class="mr-1 h-3 w-3" />
										{$_('dashboard.settings.add_shortcut') || 'Add'}
									</Button>
								</div>
								<div class="space-y-2 rounded-md border p-2">
									{#if tempShortcuts.length === 0}
										<p class="py-2 text-center text-xs text-muted-foreground">
											{$_('dashboard.settings.no_shortcuts') || 'No shortcuts added'}
										</p>
									{:else}
										{#each tempShortcuts as shortcut, index}
											<div class="flex items-center gap-2 rounded-md bg-muted/50 p-2">
												{#if shortcut.icon}
													<img src={shortcut.icon} alt="" class="h-5 w-5 rounded" />
												{:else}
													<div
														class="flex h-5 w-5 items-center justify-center rounded bg-muted text-[10px] font-bold"
													>
														{shortcut.name.charAt(0).toUpperCase()}
													</div>
												{/if}
												<span class="flex-1 truncate text-sm">{shortcut.name}</span>
												<Button
													variant="ghost"
													size="sm"
													class="h-7 w-7 p-0"
													on:click={() => openShortcutDialog(index)}
												>
													<Pencil1 class="h-3 w-3" />
												</Button>
												<Button
													variant="ghost"
													size="sm"
													class="h-7 w-7 p-0 text-destructive"
													on:click={() => deleteShortcut(index)}
												>
													<Trash class="h-3 w-3" />
												</Button>
											</div>
										{/each}
									{/if}
								</div>
							</div>
						{/if}

						<Button variant="outline" size="sm" on:click={resetSearchSettings}>
							{$_('dashboard.settings.reset_search') || 'Reset Search Settings'}
						</Button>
					{/if}
				</div>
			</div>
		</ScrollArea>
		<Dialog.Footer>
			<Button variant="outline" on:click={() => (settingsOpen = false)}>
				{$_('general.cancel') || 'Cancel'}
			</Button>
			<Button on:click={saveDashboardBackground}>
				{$_('dashboard.settings.save') || 'Save'}
			</Button>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>

<!-- Shortcut Edit Dialog -->
<Dialog.Root bind:open={shortcutDialogOpen}>
	<Dialog.Content class="sm:max-w-[400px]">
		<Dialog.Header>
			<Dialog.Title>
				{editingShortcutIndex !== null
					? $_('dashboard.settings.edit_shortcut') || 'Edit Shortcut'
					: $_('dashboard.settings.add_shortcut') || 'Add Shortcut'}
			</Dialog.Title>
		</Dialog.Header>
		<div class="grid gap-4 py-4">
			<div class="grid gap-2">
				<Label for="shortcut-name">{$_('dashboard.settings.shortcut_name') || 'Name'}</Label>
				<Input id="shortcut-name" bind:value={editingShortcut.name} placeholder="YouTube" />
			</div>
			<div class="grid gap-2">
				<Label for="shortcut-url">{$_('dashboard.settings.shortcut_url') || 'URL'}</Label>
				<Input
					id="shortcut-url"
					bind:value={editingShortcut.url}
					placeholder="https://youtube.com"
				/>
			</div>
			<div class="grid gap-2">
				<Label for="shortcut-icon"
					>{$_('dashboard.settings.shortcut_icon') || 'Icon URL (optional)'}</Label
				>
				<Input id="shortcut-icon" bind:value={editingShortcut.icon} placeholder="https://..." />
				<p class="text-xs text-muted-foreground">
					{$_('dashboard.settings.shortcut_icon_hint') ||
						'Leave empty to auto-generate from website'}
				</p>
			</div>
		</div>
		<Dialog.Footer>
			<Button variant="outline" on:click={() => (shortcutDialogOpen = false)}>
				{$_('general.cancel') || 'Cancel'}
			</Button>
			<Button on:click={saveShortcut}>
				{$_('general.save') || 'Save'}
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
	<div
		class="relative z-20 flex h-full min-h-[100vh] w-full flex-col px-3 pt-[70px] sm:px-4 lg:hidden"
	>
		<!-- Top Search Bar (Mobile) -->
		{#if searchEnabled && searchPosition === 'top'}
			<div class="mb-4 w-full">
				<form on:submit={handleSearch} class="flex w-full flex-col items-center gap-3">
					<div class="relative w-full max-w-md">
						<div class="pointer-events-none absolute left-3 top-1/2 z-10 -translate-y-1/2">
							<MagnifyingGlass class="h-4 w-4 text-foreground/70" />
						</div>
						<input
							type="text"
							bind:value={searchQuery}
							placeholder={$_('dashboard.search.placeholder') ||
								`Search with ${SEARCH_ENGINES[searchEngine].name}...`}
							class="w-full rounded-full border border-border/50 bg-background/60 py-2.5 pl-10 pr-4 text-sm backdrop-blur-md transition-all placeholder:text-muted-foreground focus:border-primary focus:bg-background/80 focus:outline-none focus:ring-2 focus:ring-primary/20"
						/>
					</div>
					{#if shortcutsVisible && shortcuts.length > 0}
						<div class="flex flex-wrap justify-center gap-3">
							{#each shortcuts as shortcut}
								<a
									href={shortcut.url}
									target="_blank"
									rel="noopener noreferrer"
									class="flex flex-col items-center gap-1 rounded-lg bg-background/60 p-2 backdrop-blur-md transition-all hover:scale-105 hover:bg-background/80"
								>
									{#if shortcut.icon}
										<img src={shortcut.icon} alt={shortcut.name} class="h-8 w-8 rounded-lg" />
									{:else}
										<div
											class="flex h-8 w-8 items-center justify-center rounded-lg bg-muted text-sm font-bold"
										>
											{shortcut.name.charAt(0).toUpperCase()}
										</div>
									{/if}
									<span class="max-w-[60px] truncate text-[10px] text-muted-foreground"
										>{shortcut.name}</span
									>
								</a>
							{/each}
						</div>
					{/if}
				</form>
			</div>
		{/if}

		<!-- Top: Clock & Date + Settings -->
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

			<!-- Pending Submissions -->
			{#if $user.loggedIn}
				<Card.Root class="w-full bg-background/60 backdrop-blur-md">
					<Card.Header class="px-3 pb-2 pt-3 sm:px-6 sm:pt-6">
						<Card.Title class="flex items-center justify-between text-sm sm:text-base">
							<span>{$_('dashboard.pending_submissions') || 'Pending Submissions'}</span>
							{#if submissions.length > 0}
								<a
									href={`/mySubmission/${$user.data?.uid}`}
									class="text-xs text-muted-foreground hover:text-foreground sm:text-sm"
								>
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
							<p class="py-2 text-center text-xs text-muted-foreground sm:text-sm">
								{$_('dashboard.no_submissions') || 'No pending submissions'}
							</p>
						{:else}
							<div class="space-y-1">
								{#each submissions.slice(0, 3) as submission}
									<button
										on:click={() => {
											selectedSubmission = submission;
											recordDetailOpen = true;
										}}
										class="items flex w-full gap-2 rounded-md p-1.5 transition-colors hover:bg-muted/50 sm:gap-3 sm:p-2"
									>
										<div class="flex-1 overflow-hidden">
											<p class="truncate text-xs font-medium sm:text-sm">
												{submission.levels.name}
											</p>
											<div
												class="flex items-center gap-1 text-[10px] text-muted-foreground sm:text-xs"
											>
												{#if !submission.levels?.isPlatformer}
													<span>{submission.progress}%</span>
												{/if}
												{#if submission.levels?.isPlatformer}
													<span
														>{Math.floor(submission.progress / 60000)}:{Math.floor(
															(submission.progress % 60000) / 1000
														)
															.toString()
															.padStart(2, '0')}.{(submission.progress % 1000)
															.toString()
															.padStart(3, '0')}</span
													>
												{/if}
												<span>•</span>
												{#if submission.needMod}
													<span>{$_('submissions.forwarded')}</span>
												{:else if !submission.queueNo}
													<span>-</span>
												{:else}
													<span>Queue: {submission.queueNo}</span>
												{/if}
											</div>
										</div>
									</button>
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
						<a
							href="/events"
							class="text-xs text-muted-foreground hover:text-foreground sm:text-sm"
						>
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
													src={event.imgUrl ||
														`https://cdn.demonlistvn.com/event-banner/${event.id}.webp`}
													alt={event.title}
													class="aspect-[16/9] w-full object-cover"
												/>
												<div
													class="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"
												></div>
												<div class="absolute bottom-0 left-0 right-0 p-2 sm:p-3">
													<div class="mb-1 flex flex-wrap items-center gap-1">
														<div
															class="flex items-center gap-1 rounded-full bg-white/20 px-1.5 py-0.5 text-[10px] text-white backdrop-blur-sm sm:px-2 sm:text-xs"
														>
															<Clock class="h-2.5 w-2.5 sm:h-3 sm:w-3" />
															{getEventInterval(event)}
														</div>
														{#if event.isRanked}
															<div
																class="rounded-full bg-yellow-500/80 px-1.5 py-0.5 text-[10px] text-white sm:px-2 sm:text-xs"
															>
																{$_('events.ranked') || 'Ranked'}
															</div>
														{/if}
													</div>
													<h3 class="line-clamp-1 text-xs font-semibold text-white sm:text-sm">
														{event.title}
													</h3>
												</div>
											</div>
										</a>
									</Carousel.Item>
								{/each}
							</Carousel.Content>
							<div class="mt-2 flex justify-center gap-2">
								<Carousel.Previous
									class="static h-6 w-6 translate-x-0 translate-y-0 sm:h-7 sm:w-7"
								/>
								<Carousel.Next class="static h-6 w-6 translate-x-0 translate-y-0 sm:h-7 sm:w-7" />
							</div>
						</Carousel.Root>
					{:else}
						<div class="flex aspect-[16/9] items-center justify-center rounded-lg bg-muted">
							<p class="text-xs text-muted-foreground sm:text-sm">
								{$_('dashboard.no_events') || 'No active events'}
							</p>
						</div>
					{/if}
				</Card.Content>
			</Card.Root>
		</div>

		<!-- Center Search Bar (Mobile) -->
		{#if searchEnabled && searchPosition === 'center'}
			<div class="my-4 flex w-full flex-1 items-center justify-center">
				<form on:submit={handleSearch} class="flex w-full flex-col items-center gap-3">
					<div class="relative w-full max-w-md">
						<div class="pointer-events-none absolute left-3 top-1/2 z-10 -translate-y-1/2">
							<MagnifyingGlass class="h-4 w-4 text-foreground/70" />
						</div>
						<input
							type="text"
							bind:value={searchQuery}
							placeholder={$_('dashboard.search.placeholder') ||
								`Search with ${SEARCH_ENGINES[searchEngine].name}...`}
							class="w-full rounded-full border border-border/50 bg-background/60 py-2.5 pl-10 pr-4 text-sm backdrop-blur-md transition-all placeholder:text-muted-foreground focus:border-primary focus:bg-background/80 focus:outline-none focus:ring-2 focus:ring-primary/20"
						/>
					</div>
					{#if shortcutsVisible && shortcuts.length > 0}
						<div class="flex flex-wrap justify-center gap-3">
							{#each shortcuts as shortcut}
								<a
									href={shortcut.url}
									target="_blank"
									rel="noopener noreferrer"
									class="flex flex-col items-center gap-1 rounded-lg bg-background/60 p-2 backdrop-blur-md transition-all hover:scale-105 hover:bg-background/80"
								>
									{#if shortcut.icon}
										<img src={shortcut.icon} alt={shortcut.name} class="h-8 w-8 rounded-lg" />
									{:else}
										<div
											class="flex h-8 w-8 items-center justify-center rounded-lg bg-muted text-sm font-bold"
										>
											{shortcut.name.charAt(0).toUpperCase()}
										</div>
									{/if}
									<span class="max-w-[60px] truncate text-[10px] text-muted-foreground"
										>{shortcut.name}</span
									>
								</a>
							{/each}
						</div>
					{/if}
				</form>
			</div>
		{/if}

		<!-- Bottom Search Bar (Mobile) -->
		{#if searchEnabled && searchPosition === 'bottom'}
			<div class="mb-20 w-full">
				<form on:submit={handleSearch} class="flex w-full flex-col items-center gap-3">
					<div class="relative w-full max-w-md">
						<div class="pointer-events-none absolute left-3 top-1/2 z-10 -translate-y-1/2">
							<MagnifyingGlass class="h-4 w-4 text-foreground/70" />
						</div>
						<input
							type="text"
							bind:value={searchQuery}
							placeholder={$_('dashboard.search.placeholder') ||
								`Search with ${SEARCH_ENGINES[searchEngine].name}...`}
							class="w-full rounded-full border border-border/50 bg-background/60 py-2.5 pl-10 pr-4 text-sm backdrop-blur-md transition-all placeholder:text-muted-foreground focus:border-primary focus:bg-background/80 focus:outline-none focus:ring-2 focus:ring-primary/20"
						/>
					</div>
					{#if shortcutsVisible && shortcuts.length > 0}
						<div class="flex flex-wrap justify-center gap-3">
							{#each shortcuts as shortcut}
								<a
									href={shortcut.url}
									target="_blank"
									rel="noopener noreferrer"
									class="flex flex-col items-center gap-1 rounded-lg bg-background/60 p-2 backdrop-blur-md transition-all hover:scale-105 hover:bg-background/80"
								>
									{#if shortcut.icon}
										<img src={shortcut.icon} alt={shortcut.name} class="h-8 w-8 rounded-lg" />
									{:else}
										<div
											class="flex h-8 w-8 items-center justify-center rounded-lg bg-muted text-sm font-bold"
										>
											{shortcut.name.charAt(0).toUpperCase()}
										</div>
									{/if}
									<span class="max-w-[60px] truncate text-[10px] text-muted-foreground"
										>{shortcut.name}</span
									>
								</a>
							{/each}
						</div>
					{/if}
				</form>
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
				<form on:submit={handleSearch} class="flex w-full flex-col items-center gap-4">
					<div class="relative w-full">
						<div class="pointer-events-none absolute left-4 top-1/2 z-10 -translate-y-1/2">
							<MagnifyingGlass class="h-5 w-5 text-foreground/70" />
						</div>
						<input
							type="text"
							bind:value={searchQuery}
							placeholder={$_('dashboard.search.placeholder') ||
								`Search with ${SEARCH_ENGINES[searchEngine].name}...`}
							class="w-full rounded-full border border-border/50 bg-background/60 py-3 pl-12 pr-6 text-base backdrop-blur-md transition-all placeholder:text-muted-foreground focus:border-primary focus:bg-background/80 focus:outline-none focus:ring-2 focus:ring-primary/20"
						/>
					</div>
					{#if shortcutsVisible && shortcuts.length > 0}
						<div class="flex flex-wrap justify-center gap-4">
							{#each shortcuts as shortcut}
								<a
									href={shortcut.url}
									target="_blank"
									rel="noopener noreferrer"
									class="flex flex-col items-center gap-1.5 rounded-xl bg-background/60 p-3 backdrop-blur-md transition-all hover:scale-105 hover:bg-background/80"
								>
									{#if shortcut.icon}
										<img src={shortcut.icon} alt={shortcut.name} class="h-10 w-10 rounded-lg" />
									{:else}
										<div
											class="flex h-10 w-10 items-center justify-center rounded-lg bg-muted text-base font-bold"
										>
											{shortcut.name.charAt(0).toUpperCase()}
										</div>
									{/if}
									<span class="max-w-[80px] truncate text-xs text-muted-foreground"
										>{shortcut.name}</span
									>
								</a>
							{/each}
						</div>
					{/if}
				</form>
			</div>
		{/if}

		<!-- Center Search Bar (Desktop) -->
		{#if searchEnabled && searchPosition === 'center'}
			<div
				class="absolute left-1/2 top-1/2 z-20 w-full max-w-xl -translate-x-1/2 -translate-y-1/2 px-8"
			>
				<form on:submit={handleSearch} class="flex w-full flex-col items-center gap-4">
					<div class="relative w-full">
						<div
							class="pointer-events-none absolute left-4 top-1/2 z-10 mt-[-1px] -translate-y-1/2"
						>
							<MagnifyingGlass class="h-5 w-5 text-foreground/70" />
						</div>
						<input
							type="text"
							bind:value={searchQuery}
							placeholder={$_('dashboard.search.placeholder') ||
								`Search with ${SEARCH_ENGINES[searchEngine].name}...`}
							class="w-full rounded-full border border-border/50 bg-background/60 py-3 pl-12 pr-6 text-base backdrop-blur-md transition-all placeholder:text-muted-foreground focus:border-primary focus:bg-background/80 focus:outline-none focus:ring-2 focus:ring-primary/20"
						/>
					</div>
					{#if shortcutsVisible && shortcuts.length > 0}
						<div class="flex flex-wrap justify-center gap-4">
							{#each shortcuts as shortcut}
								<a
									href={shortcut.url}
									target="_blank"
									rel="noopener noreferrer"
									class="flex flex-col items-center gap-1.5 rounded-xl bg-background/60 p-3 backdrop-blur-md transition-all hover:scale-105 hover:bg-background/80"
								>
									{#if shortcut.icon}
										<img src={shortcut.icon} alt={shortcut.name} class="h-10 w-10 rounded-lg" />
									{:else}
										<div
											class="flex h-10 w-10 items-center justify-center rounded-lg bg-muted text-base font-bold"
										>
											{shortcut.name.charAt(0).toUpperCase()}
										</div>
									{/if}
									<span class="max-w-[80px] truncate text-xs text-muted-foreground"
										>{shortcut.name}</span
									>
								</a>
							{/each}
						</div>
					{/if}
				</form>
			</div>
		{/if}

		<!-- Bottom Search Bar (Desktop) -->
		{#if searchEnabled && searchPosition === 'bottom'}
			<div class="absolute bottom-32 left-1/2 z-20 w-full max-w-xl -translate-x-1/2 px-8">
				<form on:submit={handleSearch} class="flex w-full flex-col items-center gap-4">
					<div class="relative w-full">
						<div
							class="pointer-events-none absolute left-4 top-1/2 z-10 mt-[-1px] -translate-y-1/2"
						>
							<MagnifyingGlass class="h-5 w-5 text-foreground/70" />
						</div>
						<input
							type="text"
							bind:value={searchQuery}
							placeholder={$_('dashboard.search.placeholder') ||
								`Search with ${SEARCH_ENGINES[searchEngine].name}...`}
							class="w-full rounded-full border border-border/50 bg-background/60 py-3 pl-12 pr-6 text-base backdrop-blur-md transition-all placeholder:text-muted-foreground focus:border-primary focus:bg-background/80 focus:outline-none focus:ring-2 focus:ring-primary/20"
						/>
					</div>
					{#if shortcutsVisible && shortcuts.length > 0}
						<div class="flex flex-wrap justify-center gap-4">
							{#each shortcuts as shortcut}
								<a
									href={shortcut.url}
									target="_blank"
									rel="noopener noreferrer"
									class="flex flex-col items-center gap-1.5 rounded-xl bg-background/60 p-3 backdrop-blur-md transition-all hover:scale-105 hover:bg-background/80"
								>
									{#if shortcut.icon}
										<img src={shortcut.icon} alt={shortcut.name} class="h-10 w-10 rounded-lg" />
									{:else}
										<div
											class="flex h-10 w-10 items-center justify-center rounded-lg bg-muted text-base font-bold"
										>
											{shortcut.name.charAt(0).toUpperCase()}
										</div>
									{/if}
									<span class="max-w-[80px] truncate text-xs text-muted-foreground"
										>{shortcut.name}</span
									>
								</a>
							{/each}
						</div>
					{/if}
				</form>
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
				<Card.Root class="w-[350px] bg-background/60 backdrop-blur-md xl:w-[380px]">
					<Card.Header class="pb-2">
						<Card.Title class="flex items-center justify-between text-base">
							<span>{$_('dashboard.pending_submissions') || 'Pending Submissions'}</span>
							{#if submissions.length > 0}
								<a
									href={`/mySubmission/${$user.data?.uid}`}
									class="text-sm text-muted-foreground hover:text-foreground"
								>
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
										<div class="flex-1">
											<Skeleton class="mb-1 h-3 w-24" />
											<Skeleton class="h-2 w-16" />
										</div>
									</div>
								{/each}
							</div>
						{:else if submissions.length === 0}
							<p class="py-2 text-center text-sm text-muted-foreground">
								{$_('dashboard.no_submissions') || 'No pending submissions'}
							</p>
						{:else}
							<div class="space-y-1">
								{#each submissions.slice(0, 3) as submission}
									<button
										on:click={() => {
											selectedSubmission = submission;
											recordDetailOpen = true;
										}}
										class="flex w-full items-center gap-3 rounded-md p-2 transition-colors hover:bg-muted/50"
									>
										<div class="flex flex-col overflow-hidden">
											<p class="truncate text-sm font-medium">{submission.levels.name}</p>
											<div class="flex items-center gap-1 text-xs text-muted-foreground">
												{#if !submission.levels?.isPlatformer}
													<span>{submission.progress}%</span>
												{/if}
												{#if submission.levels?.isPlatformer}
													<span
														>{Math.floor(submission.progress / 60000)}:{Math.floor(
															(submission.progress % 60000) / 1000
														)
															.toString()
															.padStart(2, '0')}.{(submission.progress % 1000)
															.toString()
															.padStart(3, '0')}</span
													>
												{/if}
												<span>•</span>
												{#if submission.needMod}
													<span>{$_('submissions.forwarded') || 'Forwarded'}</span>
												{:else if !submission.queueNo}
													<span>-</span>
												{:else}
													<span>{$_('submissions.queue')}: {submission.queueNo}</span>
												{/if}
											</div>
										</div>
									</button>
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
													src={event.imgUrl ||
														`https://cdn.demonlistvn.com/event-banner/${event.id}.webp`}
													alt={event.title}
													class="aspect-[16/9] w-full object-cover"
												/>
												<div
													class="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"
												></div>
												<div class="absolute bottom-0 left-0 right-0 p-3">
													<div class="mb-1 flex flex-wrap items-center gap-1">
														<div
															class="flex items-center gap-1 rounded-full bg-white/20 px-2 py-0.5 text-xs text-white backdrop-blur-sm"
														>
															<Clock class="h-3 w-3" />
															{getEventInterval(event)}
														</div>
														{#if event.isRanked}
															<div
																class="rounded-full bg-yellow-500/80 px-2 py-0.5 text-xs text-white"
															>
																{$_('events.ranked') || 'Ranked'}
															</div>
														{/if}
													</div>
													<h3 class="line-clamp-1 text-sm font-semibold text-white">
														{event.title}
													</h3>
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
							<p class="text-sm text-muted-foreground">
								{$_('dashboard.no_events') || 'No active events'}
							</p>
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
