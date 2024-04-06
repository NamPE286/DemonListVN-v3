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
	import { LoadingBar } from 'svelte-loading-bar';

	import Search from '$lib/components/search.svelte';
	import SubmitButton from '$lib/components/submitButton.svelte';
	import SettingButton from '$lib/components/settingButton.svelte';

	import supabase from '$lib/client/supabase';
	import { user } from '$lib/client';
	import { mediaQuery } from 'svelte-legos';
	import NotificationButton from '$lib/components/notificationButton.svelte';
	import { goto } from '$app/navigation';

	const links = [
		{ route: '/list/dl', name: 'Demon List' },
		{ route: '/list/fl', name: 'Featured List' },
		{ route: '/players', name: 'Players' },
		{ route: '/about', name: 'About' }
	];

	let searchQuery = '';
	let searchToggled = false;
	let notificationToggled = false;
	const isDesktop = mediaQuery('(min-width: 1200px)');

	function signIn() {
		supabase.auth.signInWithOAuth({
			provider: 'google'
		});
	}

	function signOut() {
		supabase.auth.signOut();
		window.location.reload();
	}
</script>

<ModeWatcher defaultMode="system" />
<Toaster />
<Search bind:open={searchToggled} bind:value={searchQuery} />
<LoadingBar />

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
								src={`${import.meta.env.VITE_SUPABASE_API_URL}/storage/v1/object/public/avatars/${$user.data.uid}.jpg`}
								alt=""
							/>
							<Avatar.Fallback>{$user.data.name[0]}</Avatar.Fallback>
						</Avatar.Root>
					</Button>
				</DropdownMenu.Trigger>
				<DropdownMenu.Content align="end" class="w-56">
					<DropdownMenu.Label>{$user.data.name}</DropdownMenu.Label>
					<DropdownMenu.Separator />
					<DropdownMenu.Item on:click={() => goto(`/player/${$user.data.uid}`)}>My profile</DropdownMenu.Item>
					<DropdownMenu.Item>My Submission</DropdownMenu.Item>
					<DropdownMenu.Separator />
					<DropdownMenu.Item on:click={signOut}>
						<span style='color: red'>Sign out</span>
					</DropdownMenu.Item>
				</DropdownMenu.Content>
			</DropdownMenu.Root>
		{/if}
		<SettingButton />
	</div>
</div>

<div class="filler"></div>

<slot />

<style lang="scss">
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

	@media screen and (max-width: 900px) {
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
