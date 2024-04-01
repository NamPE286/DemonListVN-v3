<script lang="ts">
	import { Input } from '$lib/components/ui/input/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import { MagnifyingGlass } from 'svelte-radix';
    import { fade } from 'svelte/transition';

	export let toggled: boolean;
	export let value: string = '';
</script>

{#if toggled}
	<!-- svelte-ignore a11y-click-events-have-key-events -->
	<!-- svelte-ignore a11y-no-static-element-interactions -->
	<div class="bg" transition:fade={{ duration: 150 }} on:click={() => toggled = false}/>

	<div class="wrapper" transition:fade={{ duration: 150 }}>
		<div class="searchWrapper">
			<div class="inputWrapper">
				<Input bind:value placeholder="Search" />
			</div>
			<Button type="submit">
				<MagnifyingGlass size={20} />
			</Button>
		</div>
	</div>
{/if}

<style lang="scss">
	.bg {
		position: fixed;
		z-index: 10;
		height: 100%;
		width: 100%;
		backdrop-filter: blur(10px);
        
	}

	.wrapper {
		position: fixed;
		z-index: 11;
		display: flex;
		justify-content: center;
		box-sizing: border-box;
		padding-top: 50px;
        left: 50%;
        transform: translateX(-50%);
	}

	.inputWrapper {
		background-color: var(--background);
        border-radius: var(--radius);
		width: 350px;
        height: fit-content;
	}

	.searchWrapper {
		display: flex;
		gap: 10px;
	}
</style>
