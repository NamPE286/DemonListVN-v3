<script lang="ts">
	import PlayerHoverCard from '$lib/components/playerHoverCard.svelte';
	import type { PageData } from './$types';
	import Button from '$lib/components/ui/button/button.svelte';
	import { fade, scale, fly } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';

	export let data: PageData;

	let banned = Array(data.levels.length).fill(false);
	let order = Array(data.levels.length).fill(0);
	let phase = 0;
	let levels: any[] = [null, null, null];

	function ban(index: number) {
		banned[index] = true;
		phase++;
	}

	function pick(index: number) {
		order[index] = phase - 2;
		levels[phase - 3] = data.levels[index];
		phase++;
	}

	function formatOrder(x: number) {
		if (x == 1) {
			return '1st';
		}

		if (x == 2) {
			return '2nd';
		}

		if (x == 3) {
			return 'Tiebreaker';
		}
	}
</script>

<img
	class="bgGradient absolute z-0 mt-[-50px] h-[100vh] w-[800px] object-cover"
	src={`${import.meta.env.VITE_SUPABASE_API_URL}/storage/v1/object/public/banners/${data.players[0].uid}${
		data.players[0].isBannerGif ? '.gif' : '.jpg'
	}?version=${data.players[0].bannerVersion}`}
	alt="banner"
/>
<img
	class="bgGradient1 absolute right-0 z-0 mt-[-50px] h-[100vh] w-[800px] object-cover"
	src={`${import.meta.env.VITE_SUPABASE_API_URL}/storage/v1/object/public/banners/${data.players[1].uid}${
		data.players[1].isBannerGif ? '.gif' : '.jpg'
	}?version=${data.players[1].bannerVersion}`}
	alt="banner"
/>

<div
	class="relative z-[1px] flex flex-col items-center gap-[30px] pl-[20px] pr-[20px]"
	in:fade={{ duration: 600, easing: quintOut }}
>
	<div
		class="mt-[50px] flex justify-center gap-[50px] text-xl"
		in:fly={{ y: -30, duration: 800, delay: 200, easing: quintOut }}
	>
		<PlayerHoverCard player={data.players[0]} showTitle={true} />
		<span class="animate-pulse font-bold">VS</span>
		<PlayerHoverCard player={data.players[1]} showTitle={true} />
	</div>
	<div class="flex gap-[10px]" in:fly={{ y: -20, duration: 600, delay: 400, easing: quintOut }}>
		{#each levels as level, index}
			<div
				class="flex w-[200px] flex-col items-center gap-[10px] rounded-md border-[1px] p-[10px] text-center transition-all duration-300 hover:scale-105 hover:shadow-lg"
				style="
                    backdrop-filter: blur(10px);
                "
			>
				<div class="font-bold">{formatOrder(index + 1)} level</div>
				<div class="ml-[100px]">
					{#if !level}
						<div class="text-bold h-[70px] animate-pulse opacity-50">?</div>
					{:else}
						<div class="text-bold" in:scale={{ duration: 400, easing: quintOut }}>
							<b>{level.name}</b><br />
							<span class="text-sm opacity-50">by {level.author}</span><br />
							<span class="text-sm">{level.difficulty}</span>
						</div>
					{/if}
				</div>
			</div>
		{/each}
	</div>
	<div
		class="flex flex-col items-center gap-[10px]"
		in:fly={{ y: 20, duration: 600, delay: 600, easing: quintOut }}
	>
		{#each data.levels as level, index}
			<div
				class="flex w-[500px] items-center rounded-md border-[1px] p-[10px] transition-all duration-300"
				style={`
                ${banned[index] ? 'opacity: 50%;' : ''}
                backdrop-filter: blur(10px);
            `}
				in:fly={{ x: -50, duration: 400, delay: 100 * index, easing: quintOut }}
			>
				<div class="text-bold">
					<b>{level.name}</b> <span class="text-sm opacity-50">by {level.author}</span><br />
					<span class="text-sm">{level.difficulty}</span>
				</div>
				{#if banned[index]}
					<Button variant="destructive" class="ml-auto transition-all duration-200" disabled
						>Banned</Button
					>
				{:else if order[index]}
					<Button class="ml-auto animate-bounce transition-all duration-200" disabled
						>{formatOrder(order[index])} level picked</Button
					>
				{:else if phase < 3}
					<Button
						variant="destructive"
						class="ml-auto transition-all duration-200"
						on:click={() => ban(index)}>Ban</Button
					>
				{:else}
					<Button class="ml-auto transition-all duration-200" on:click={() => pick(index)}
						>Pick</Button
					>
				{/if}
			</div>
		{/each}
	</div>
</div>

<style lang="scss">
	.bgGradient {
		mask-image: linear-gradient(90deg, rgba(0, 0, 0, 1) 0%, rgba(0, 0, 0, 0) 75%);
	}

	.bgGradient1 {
		mask-image: linear-gradient(-90deg, rgba(0, 0, 0, 1) 0%, rgba(0, 0, 0, 0) 75%);
	}
</style>
