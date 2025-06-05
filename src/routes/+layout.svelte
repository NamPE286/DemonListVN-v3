<script lang="ts">
	import '../app.pcss';
	import '../app.scss';
	import 'non.geist';
	import { ModeWatcher } from 'mode-watcher';

	import HamburgerMenu from 'svelte-radix/HamburgerMenu.svelte';
	import MagnifyingGlass from 'svelte-radix/MagnifyingGlass.svelte';

	import { Button } from '$lib/components/ui/button/index.js';
	import { Toaster } from '$lib/components/ui/sonner';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import * as Avatar from '$lib/components/ui/avatar';
	import { Skeleton } from '$lib/components/ui/skeleton';
	import { LoadingBar } from 'svelte-loading-bar';

	import Search from '$lib/components/search.svelte';
	import SubmitButton from '$lib/components/submitButton.svelte';
	import SettingButton from '$lib/components/settingButton.svelte';

	import supabase from '$lib/client/supabase';
	import { user } from '$lib/client';
	import { mediaQuery } from 'svelte-legos';
	import NotificationButton from '$lib/components/notificationButton.svelte';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { isSupporterActive } from '$lib/client/isSupporterActive';

	let links = [
		{ route: '/list/dl', name: 'Demon List' },
		{ route: '/list/fl', name: 'Featured List' },
		{ route: '/players', name: 'Players' },
		{ route: '/clans', name: 'Clans' },
		{ route: 'https://github.com/NamPE286/DemonListVN-geode-mod/releases', name: 'Mod' },
		{ route: '/rules', name: 'Rules' }
	];

	let searchQuery = '';
	let searchToggled = false;
	let isVisible = false;
	const isDesktop = mediaQuery('(min-width: 1200px)');

	function signIn() {
		supabase.auth.signInWithOAuth({
			provider: 'google',
			options: {
				queryParams: {
					access_type: 'offline',
					prompt: 'consent'
				},
				redirectTo: window.location.origin
			}
		});
	}

	function signOut() {
		supabase.auth.signOut();
		window.location.reload();
	}

	function updateNavbarOnTop() {
		const navbar = document.getElementsByClassName('navbarWrapper')[0];

		if (window.scrollY === 0) {
			navbar.classList.add('navbarWrapperOnTop');
		} else {
			navbar.classList.remove('navbarWrapperOnTop');
		}
	}

	onMount(() => {
		isVisible = true;

		user.subscribe((data) => {
			if (!data.loggedIn) {
				return;
			}

			links[0].route = `/list/dl?uid=${data.data.uid}`;
			links[1].route = `/list/fl?uid=${data.data.uid}`;
		});

		updateNavbarOnTop();
		window.addEventListener('scroll', updateNavbarOnTop);
	});
</script>

<ModeWatcher defaultMode="system" />
<Toaster position="top-center" />
<Search bind:open={searchToggled} bind:value={searchQuery} />
<LoadingBar
	--loading-bar-background-color="rgb(0 100 160 / 80%)"
	--loading-bar-train-background-color="rgb(0 100 220 / 90%)"
/>

<div class="navbarWrapper navbarWrapperOnTop">
	<div class="right">
		<a href="/" class="logo" data-sveltekit-preload-data="tap">
			<div class="logo-img-wrapper">
				<img src="/favicon.png" alt="logo" />
			</div>
			<span id="logo-name"><b>Demon List VN</b></span>
		</a>
		<div class="links">
			{#each links as link}
				<a href={link.route} class="link" data-sveltekit-preload-data="tap">{link.name}</a>
			{/each}
			{#if $user.loggedIn && isSupporterActive($user.data.supporterUntil)}
				<a href="/supporter" class="link" data-sveltekit-preload-data="tap">Support Us</a>
			{:else}
				<Button class="ml-[10px] bg-yellow-400 hover:bg-yellow-500" href="/supporter"
					>Support Us</Button
				>
			{/if}
		</div>
		<div class="menu">
			<DropdownMenu.Root>
				<DropdownMenu.Trigger asChild let:builder>
					<Button builders={[builder]} variant="outline" size="icon">
						<HamburgerMenu size={18} />
					</Button>
				</DropdownMenu.Trigger>
				<DropdownMenu.Content align="end">
					{#each links as link}
						<a href={link.route} data-sveltekit-preload-data="tap">
							<DropdownMenu.Item>{link.name}</DropdownMenu.Item>
						</a>
					{/each}
					<DropdownMenu.Item>
						{#if $user.loggedIn && isSupporterActive($user.data.supporterUntil)}
							<a href="/supporter" class="link" data-sveltekit-preload-data="tap">Support Us</a>
						{:else}
							<Button class=" bg-yellow-400 hover:bg-yellow-500" href="/supporter"
								>Support Us</Button
							>
						{/if}
					</DropdownMenu.Item>
				</DropdownMenu.Content>
			</DropdownMenu.Root>
		</div>
	</div>
	<div class="left">
		{#if $isDesktop}
			<Button variant="outline" on:click={() => (searchToggled = true)}>
				<div class="searchBtn">
					<MagnifyingGlass size={20} />
					<p>Search</p>
					<kbd
						class="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100"
					>
						<span class="text-xs">Ctrl K</span>
					</kbd>
				</div>
			</Button>
		{:else}
			<button class="clickable" on:click={() => (searchToggled = true)}>
				<MagnifyingGlass size={20} />
			</button>
		{/if}
		{#if $user.checked && isVisible}
			{#if !$user.loggedIn}
				<Button variant="outline" on:click={signIn}>Sign In</Button>
			{:else}
				<SubmitButton />
				<NotificationButton />
				<DropdownMenu.Root>
					<DropdownMenu.Trigger asChild let:builder>
						<Button
							variant="outline"
							size="icon"
							class="overflow-hidden rounded-full"
							builders={[builder]}
						>
							<Avatar.Root>
								<Avatar.Image
									class="object-cover"
									src={`${import.meta.env.VITE_SUPABASE_API_URL}/storage/v1/object/public/avatars/${$user.data.uid}${
										isSupporterActive($user.data.supporterUntil) && $user.data.isAvatarGif
											? '.gif'
											: '.jpg'
									}`}
									alt=""
								/>
								<Avatar.Fallback>{$user.data.name[0]}</Avatar.Fallback>
							</Avatar.Root>
						</Button>
					</DropdownMenu.Trigger>
					<DropdownMenu.Content align="end" class="z-[99999] w-56">
						<DropdownMenu.Label>
							{#if $user.loggedIn && isSupporterActive($user.data.supporterUntil)}
								<span class="text-yellow-400">{$user.data.name}</span>
							{:else}
								{$user.data.name}
							{/if}
						</DropdownMenu.Label>
						<DropdownMenu.Separator />
						<DropdownMenu.Item on:click={() => goto(`/player/${$user.data.uid}`)}
							>Profile</DropdownMenu.Item
						>
						<DropdownMenu.Item on:click={() => goto(`/mySubmission/${$user.data.uid}`)}
							>Submissions</DropdownMenu.Item
						>
						<DropdownMenu.Item on:click={() => goto(`/orders/${$user.data.uid}`)}
							>Orders</DropdownMenu.Item
						>
						{#if $user.data.clan}
							<DropdownMenu.Item on:click={() => goto(`/clan/${$user.data.clan}`)}
								>Clan</DropdownMenu.Item
							>
						{/if}
						{#if $user.data.isTrusted || $user.data.isAdmin}
							<DropdownMenu.Item on:click={() => goto(`/overwatch`)}>Overwatch</DropdownMenu.Item>
						{/if}
						<DropdownMenu.Separator />
						<DropdownMenu.Item on:click={signOut}>
							<span style="color: red">Sign out</span>
						</DropdownMenu.Item>
					</DropdownMenu.Content>
				</DropdownMenu.Root>
			{/if}
			<SettingButton />
		{:else}
			<Skeleton class="h-[30px] w-[200px]" />
		{/if}
	</div>
</div>

<div class="filler"></div>

<slot />

<footer>
	<div class="footerFiller"></div>
	<p>
		© Copyright 2020-2025 demonlistvn.com.<br />
		All rights reserved demonlistvn.com and Demon List VN are in no way affiliated with RobTopGamesAB
		®
	</p>
	<div class="links">
		<a href="/about">About</a>
		<a href="/privacyPolicy">Privacy Policy</a>
		<a href="/tos">Terms of service</a>
	</div>
</footer>

<style lang="scss">
	:global(.markdown) {
		:global(h1) {
			display: block;
			font-size: 2em;
			margin-top: 0.67em;
			margin-bottom: 0.67em;
			margin-left: 0;
			margin-right: 0;
			font-weight: bold;
		}

		:global(h2) {
			display: block;
			font-size: 1.5em;
			margin-top: 0.83em;
			margin-bottom: 0.83em;
			margin-left: 0;
			margin-right: 0;
			font-weight: bold;
		}

		:global(h3) {
			display: block;
			font-size: 1.17em;
			margin-top: 1em;
			margin-bottom: 1em;
			margin-left: 0;
			margin-right: 0;
			font-weight: bold;
		}

		:global(h4) {
			display: block;
			margin-top: 1.33em;
			margin-bottom: 1.33em;
			margin-left: 0;
			margin-right: 0;
			font-weight: bold;
		}

		:global(h5) {
			display: block;
			font-size: 0.83em;
			margin-top: 1.67em;
			margin-bottom: 1.67em;
			margin-left: 0;
			margin-right: 0;
			font-weight: bold;
		}

		:global(h6) {
			display: block;
			font-size: 0.67em;
			margin-top: 2.33em;
			margin-bottom: 2.33em;
			margin-left: 0;
			margin-right: 0;
			font-weight: bold;
		}

		:global(ul) {
			list-style: initial;
			margin: initial;
			padding: 0 0 0 40px;
		}

		:global(li) {
			display: list-item;
		}

		:global(table) {
			border: solid 1px var(--textColor);
		}

		:global(th) {
			border: solid 1px var(--textColor);
			padding-inline: 10px;
		}

		:global(td) {
			border: solid 1px var(--textColor);
			padding-inline: 10px;
		}
	}
	footer {
		height: fit-content;
		padding-top: 20px;
		margin-bottom: -80px;
		color: var(--textColor2);
		background-color: var(--background);

		.footerFiller {
			height: 100px;
			border-bottom: 1px solid var(--border1);
			margin-bottom: 20px;
		}

		.links {
			display: flex;
			justify-content: center;
			gap: 10px;

			a {
				text-decoration: underline;
			}
		}

		p {
			text-align: center;
		}
	}

	.searchBtn {
		display: flex;
		align-items: center;
		gap: 10px;
		color: var(--textColor2);

		kbd {
			margin-left: 100px;
		}
	}

	.filler {
		width: 100%;
		height: 55px;
	}

	.menu {
		display: none;
	}

	.navbarWrapper {
		transition: all 0.3s;
		position: fixed;
		width: 100%;
		height: 55px;
		background-color: var(--navbar-bg);
		overflow: hidden;
		display: flex;
		align-items: center;
		box-sizing: border-box;
		padding-inline: 30px;
		border-bottom: 1px solid;
		border-color: var(--border1);
		backdrop-filter: blur(20px);
		z-index: 20;
		.right {
			display: flex;

			img {
				filter: invert(var(--inverted));
				max-height: 22px;
				max-width: 22px;
			}

			a {
				color: var(--textColor);
				text-decoration: none;
				display: flex;
				align-items: center;
				gap: 10px;
			}

			.links {
				display: flex;
			}

			.link {
				margin-inline: 10px;
				color: var(--textColor2);
				transition: color 0.1s;
				font-weight: 500;
				font-size: 14px;
			}

			.link:hover {
				color: var(--textColor1);
			}

			.logo {
				margin-right: 15px;
			}
		}

		.left {
			display: flex;
			gap: 10px;
			align-items: center;
			margin-left: auto;
		}
	}

	.navbarWrapperOnTop {
		background-color: transparent;
		border-color: transparent;
	}

	@media screen and (max-width: 950px) {
		.navbarWrapper {
			padding-inline: 15px;
			.right {
				.links {
					display: none;
				}

				#logo-name {
					display: none;
				}
			}

			.menu {
				display: block;
			}
		}
	}
</style>
