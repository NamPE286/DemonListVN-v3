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

	const links = [
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

	onMount(() => {
		isVisible = true;
	});
</script>

<ModeWatcher defaultMode="system" />
<Toaster position="top-center" />
<Search bind:open={searchToggled} bind:value={searchQuery} />
<LoadingBar
	--loading-bar-background-color="rgb(0 100 160 / 80%)"
	--loading-bar-train-background-color="rgb(0 100 220 / 90%)"
/>

<div class="navbarWrapper">
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
									src={`${import.meta.env.VITE_SUPABASE_API_URL}/storage/v1/object/public/avatars/${$user.data.uid}.jpg`}
									alt=""
								/>
								<Avatar.Fallback>{$user.data.name[0]}</Avatar.Fallback>
							</Avatar.Root>
						</Button>
					</DropdownMenu.Trigger>
					<DropdownMenu.Content align="end" class="w-56 z-99999">
						<DropdownMenu.Label>{$user.data.name}</DropdownMenu.Label>
						<DropdownMenu.Separator />
						<DropdownMenu.Item on:click={() => goto(`/player/${$user.data.uid}`)}
							>Profile</DropdownMenu.Item
						>
						<DropdownMenu.Item on:click={() => goto(`/mySubmission/${$user.data.uid}`)}
							>Submission</DropdownMenu.Item
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
	<p>
		© Copyright 2020-2024 demonlistvn.com.<br />
		All rights reserved demonlistvn.com and Demon List VN are in no way affiliated with RobTopGamesAB ®
	</p>
	<div class="links">
		<a href="/about">About</a>
		<a href="/privacyPolicy">Privacy Policy</a>
		<a href="/tos">Terms of service</a>
	</div>
</footer>

<style lang="scss">
	footer {
		height: 100px;
		border-top: 1px solid var(--border1);
		padding-top: 20px;
		margin-bottom: -80px;
		color: var(--textColor2);

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
		position: fixed;
		width: 100%;
		height: 55px;
		background-color: var(--navbar-bg);
		overflow: hidden;
		display: flex;
		align-items: center;
		box-sizing: border-box;
		padding-inline: 30px;
		border-bottom: 1px solid var(--border1);
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
