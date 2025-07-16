<script lang="ts">
	import type { PageData } from '../$types';
	import { fly } from 'svelte/transition';
	import Button from '$lib/components/ui/button/button.svelte';
	import { Skeleton } from '$lib/components/ui/skeleton';
	import { getTitle, user } from '$lib/client';
	import * as AlertDialog from '$lib/components/ui/alert-dialog/index.js';
	import { toast } from 'svelte-sonner';
	import * as Card from '$lib/components/ui/card';
	import { isSupporterActive } from '$lib/client/isSupporterActive';
	import * as Avatar from '$lib/components/ui/avatar';
	import { badgeVariants } from '$lib/components/ui/badge';
	import { getExpLevel } from '$lib/client/getExpLevel';
	import * as Tooltip from '$lib/components/ui/tooltip';
	import { onMount } from 'svelte';

	export let data: PageData;

	let isBannerFailedToLoad = false;
	let exp = data.owner ? data.players.exp + data.players.extraExp : 0;
	let loaded = false;

	async function link() {
		toast.promise(
			fetch(`${import.meta.env.VITE_API_URL}/card/${data.id}/link`, {
				method: 'PATCH',
				headers: {
					Authorization: `Bearer ${await $user.token()}`
				}
			}),
			{
				success: () => {
					window.location.reload();
					return 'Linked!';
				},
				error: 'Failed to link',
				loading: 'Linking...'
			}
		);
	}

	onMount(() => {
		setTimeout(() => {
			loaded = true;
		}, 1000);
	});
</script>

<svelte:head>
	<title>{data.name} Card - Demon List VN</title>
</svelte:head>

<div
	class="wrapper relative ml-auto mr-auto flex w-[500px] max-w-full flex-col items-center gap-[10px] pl-[5px] pr-[5px]"
	class:loaded
>
	<img
		class="relative z-10 rounded-xl border border-opacity-50 shadow-md"
		src={data.img}
		alt="card"
	/>
	<p class="text-[12px] opacity-50">ID: {data.id}</p>
	<h3 class="text-xl font-bold">{data.name} Card</h3>
	{#if loaded}
		<div class="relative z-0 w-full" transition:fly={{ y: -300, duration: 500, opacity: 100 }}>
			{#if data.activationDate == null}
				<div class="text-center">
					<p>This card is not activated.</p>
					<p>Please contact with a moderator to activate this card.</p>
				</div>
			{:else if data.owner == null}
				<div class="flex justify-center">
					{#if $user.loggedIn}
						<AlertDialog.Root>
							<AlertDialog.Trigger>
								<Button class="w-full">Link card to {$user.data.name}</Button>
							</AlertDialog.Trigger>
							<AlertDialog.Content>
								<AlertDialog.Header>
									<AlertDialog.Title
										>Link card to this account ({$user.data.name})?</AlertDialog.Title
									>
									<AlertDialog.Description>
										This will permanently link the card to this account ({$user.data.name}) and
										cannot be unlinked or transfered.
									</AlertDialog.Description>
								</AlertDialog.Header>
								<AlertDialog.Footer>
									<AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
									<AlertDialog.Action on:click={link}>Continue</AlertDialog.Action>
								</AlertDialog.Footer>
							</AlertDialog.Content>
						</AlertDialog.Root>
					{:else}
						<Skeleton class="h-[35px] w-[150px]" />
					{/if}
				</div>
			{:else if data.owner}
				<Card.Root
					class="mt-[20px] w-full"
					style={isSupporterActive(data.players.supporterUntil)
						? `background-color: ${data.players.bgColor}; border-color: ${data.players.borderColor}; ${data.players.bgColor ? 'color: white' : ''}`
						: ''}
				>
					{#if isSupporterActive(data.players.supporterUntil) && !isBannerFailedToLoad}
						<img
							on:error={() => {
								isBannerFailedToLoad = true;
							}}
							class="bgGradient absolute z-0 rounded-xl object-cover"
							src={`${import.meta.env.VITE_SUPABASE_API_URL}/storage/v1/object/public/banners/${data.players.uid}${
								data.players.isBannerGif ? '.gif' : '.jpg'
							}`}
							alt=""
						/>
					{/if}
					<Card.Content class="z-1 relative mt-[22.5px] flex flex-col gap-[15px]">
						<div class="flex items-center gap-[10px]">
							<Avatar.Root>
								<Avatar.Image
									class="object-cover"
									src={`${import.meta.env.VITE_SUPABASE_API_URL}/storage/v1/object/public/avatars/${data.players.uid}${
										isSupporterActive(data.players.supporterUntil) && data.players.isAvatarGif
											? '.gif'
											: '.jpg'
									}`}
									alt=""
								/>
								<Avatar.Fallback>{data.players.name[0]}</Avatar.Fallback>
							</Avatar.Root>
							{#if data.players.clan}
								<a
									href={`/clan/${data.players.clan}`}
									class={badgeVariants({ variant: 'secondary' })}
									style={`background-color: ${data.players.clans.tagBgColor}; color: ${data.players.clans.tagTextColor};`}
									>{data.players.clans.tag}</a
								>
							{/if}
							<a href={`/player/${data.players.uid}`}>
								<h4 class="font-semibold">
									{#if isSupporterActive(data.players.supporterUntil)}
										<span class="text-yellow-500">
											{data.players.name}
										</span>
									{:else}
										{data.players.name}
									{/if}
								</h4>
							</a>
						</div>
						<div class="flex flex-col gap-[2px]">
							<div class="rating">
								<div class="flex justify-center">
									<div class="leftCol">
										<b>Lv.{getExpLevel(exp).level}</b>
									</div>
								</div>
								<div class="progressBar">
									<div class="progress" style={`width: ${getExpLevel(exp).progress}%`}>
										<b>{getExpLevel(exp).progress}%</b>
									</div>
								</div>
							</div>
							<div class="rating">
								<Tooltip.Root>
									<Tooltip.Trigger>
										<div class="leftCol">
											<div
												class="title text-white"
												style={`background-color: ${getTitle('dl', data.players)?.color}`}
											>
												{data.players.rating}
											</div>
										</div>
									</Tooltip.Trigger>
									<Tooltip.Content>{getTitle('dl', data.players)?.fullTitle}</Tooltip.Content>
								</Tooltip.Root>
								<div class="rankWrapper">
									Demon List rating
									<div class="rank">
										#{data.players.overallRank}
									</div>
								</div>
							</div>
							<div class="rating">
								<div class="leftCol">
									<div class="title">{data.players.totalFLpt}</div>
								</div>
								<div class="rankWrapper">
									Total Featured List point
									<div class="rank">
										#{data.players.flrank}
									</div>
								</div>
							</div>
						</div>
					</Card.Content>
				</Card.Root>
			{/if}
		</div>
	{/if}
</div>

<style lang="scss">
	.wrapper {
		height: 100vh;
		display: flex;
		flex-direction: column;
		justify-content: center;
	}
	.rating {
		.title {
			padding: 2px;
			padding-inline: 5px;
			border-radius: 5px;
			font-weight: bold;
			font-size: 12px;
			user-select: none;
			width: fit-content;
		}

		display: flex;
		gap: 10px;
		align-items: center;
		font-size: 13px;
	}
	.bgGradient {
		mask-image: linear-gradient(rgba(0, 0, 0, 1) 0%, rgba(0, 0, 0, 1) 25%, rgba(0, 0, 0, 0) 100%);
		width: calc(100% - 2px);
		height: 100px;
	}
	.progressBar {
		background-color: gray;
		width: 100%;
		border-radius: 10px;
		overflow: hidden;
		scale: 0.7;
		b {
			color: var(--textColorInverted);
			margin-right: 5px;
		}

		.progress {
			background-color: var(--textColor);
			text-align: right;
			border-radius: 10px;
		}
	}

	.wrapper {
		display: flex;
		align-items: center;
		gap: 7px;
	}

	.leftCol {
		width: 50px;
		display: flex;
		justify-content: center;
	}

	.hoverName {
		display: flex;
		gap: 10px;
		align-items: center;
		padding-bottom: 10px;
	}

	.content {
		padding-top: 10px;
	}

	.rankWrapper {
		display: flex;
		gap: 5px;

		.rank {
			background-color: var(--textColor);
			color: var(--textColorInverted);
			padding-inline: 6px;
			height: fit-content;
			border-radius: 5px;
			font-weight: 600;
		}
	}

	.rating {
		.title {
			padding: 2px;
			padding-inline: 5px;
			border-radius: 5px;
			font-weight: bold;
			font-size: 12px;
			user-select: none;
			width: fit-content;
		}

		display: flex;
		gap: 10px;
		align-items: center;
		font-size: 13px;
	}

	.rank {
		color: white;
		font-size: 10px;
		width: fit-content;
		padding-inline: 5px;
		border-radius: 5px;
		font-weight: 600;
	}

	.loaded {
		transform: translateY(-100px);
		transition: transform 0.5s;
	}

	img {
		background-color: var(--textColorInverted);
		width: 100%;
		aspect-ratio: 245/155.48;
	}
</style>
