<script>
	import '../app.pcss';
	import '../app.scss';
	import 'non.geist';
	import { Button } from '$lib/components/ui/button';
	import Sun from 'svelte-radix/Sun.svelte';
	import Moon from 'svelte-radix/Moon.svelte';
	import { ModeWatcher, resetMode, setMode, toggleMode } from 'mode-watcher';
	import Search from '$lib/icons/search.svelte';
	import { onMount } from 'svelte';

	const links = [
		{ route: '/DL', name: 'Demon List' },
		{ route: '/PL', name: 'Platfromer List' },
		{ route: '/FL', name: 'Featured List' },
		{ route: '/playerSearch', name: 'Player Search' },
		{ route: '/about', name: 'About' }
	];

	let loggedIn = false;
</script>

<ModeWatcher defaultMode='dark'/>

<div class="navbarWrapper">
	<div class="right">
		<a href="/" class="logo">
			<img src="/favicon.png" alt="logo" id="logo" />
			<span><b>Demon List VN</b></span>
		</a>
		{#each links as link}
			<a href={link.route} class="link">{link.name}</a>
		{/each}
	</div>
	<div class="left">
		<Search clickable on:click={() => console.log('ok')} />
		{#if !loggedIn}
			<Button variant="outline">Sign In</Button>
		{/if}
		<Button on:click={toggleMode} variant="outline" size="icon">
			<Sun
				class="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0"
			/>
			<Moon
				class="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100"
			/>
			<span class="sr-only">Toggle theme</span>
		</Button>
	</div>
</div>

<div class="filler"></div>

<slot />

<style lang="scss">
	#logo {
		-webkit-filter: invert(1);
		filter: invert(1);
	}

	.filler {
		width: 100%;
		height: 55px;
	}

	.navbarWrapper {
		position: fixed;
		width: 100%;
		height: 55px;
		background-color: var(--background);
		overflow: hidden;
		display: flex;
		align-items: center;
		box-sizing: border-box;
		padding-inline: 30px;
		border-bottom: 1px solid var(--border);

		.right {
			display: flex;

			img {
				filter: invert(1);
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
			gap: 15px;
			align-items: center;
			margin-left: auto;
		}
	}
</style>
