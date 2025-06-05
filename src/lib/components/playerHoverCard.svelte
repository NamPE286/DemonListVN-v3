<script lang="ts">
	import * as Avatar from '$lib/components/ui/avatar';
	import * as HoverCard from '$lib/components/ui/hover-card/index.js';
	import * as Tooltip from '$lib/components/ui/tooltip';
	import { getTitle } from '$lib/client';
	import { badgeVariants } from '$lib/components/ui/badge';
	import { getExpLevel } from '$lib/client/getExpLevel';
	import { isSupporterActive } from '$lib/client/isSupporterActive';

	export let player: any;
	export let showTitle = false;

	let exp = player.exp + player.extraExp;
</script>

<div class="wrapper">
	<HoverCard.Root>
		<Avatar.Root>
			<Avatar.Image
				src={`${import.meta.env.VITE_SUPABASE_API_URL}/storage/v1/object/public/avatars/${player.uid}${
					isSupporterActive(player.supporterUntil) && player.isAvatarGif ? '.gif' : '.jpg'
				}`}
				alt=""
			/>
			<Avatar.Fallback>{player.name[0]}</Avatar.Fallback>
		</Avatar.Root>
		{#if player.clan}
			{#if showTitle && getTitle('dl', player)}
				<Tooltip.Root>
					<Tooltip.Trigger>
						<div class="rank" style={`background-color: ${getTitle('dl', player)?.color}`}>
							<span>{getTitle('dl', player)?.title}</span>
						</div>
					</Tooltip.Trigger>
					<Tooltip.Content>{getTitle('dl', player)?.fullTitle}</Tooltip.Content>
				</Tooltip.Root>
			{/if}
			<a
				href={`/clan/${player.clan}`}
				class={badgeVariants({ variant: 'secondary' })}
				style={`background-color: ${player.clans.tagBgColor}; color: ${player.clans.tagTextColor};`}
				>{player.clans.tag}</a
			>
		{/if}
		<HoverCard.Trigger
			href={`/player/${player.uid}`}
			rel="noreferrer noopener"
			class="rounded-sm underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-8 focus-visible:outline-black"
		>
			<div class="flex items-center gap-[5px]">
				{#if isSupporterActive(player.supporterUntil)}
					<span class="text-yellow-400">
						{player.name}
					</span>
				{:else}
					{player.name}
				{/if}
				{#if player.isTrusted}
					<div class="mb-[2.5px] h-[12px] w-[12px] rounded-full bg-black dark:invert">
						<img class="invert" src="/tick-svgrepo-com.svg" alt="tick" />
					</div>
				{/if}
			</div>
		</HoverCard.Trigger>
		<HoverCard.Content class="w-80">
			{#if isSupporterActive(player.supporterUntil)}
				<img
					class="bgGradient absolute top-[50px] z-0 ml-[-15px] h-[80px] w-full object-cover rounded"
					src={`${import.meta.env.VITE_SUPABASE_API_URL}/storage/v1/object/public/banners/${player.uid}${
						player.isBannerGif ? '.gif' : '.jpg'
					}`}
					alt=""
				/>
			{/if}
			<div class='relative'>
				<div class="hoverName">
					<Avatar.Root>
						<Avatar.Image
							class="object-cover"
							src={`${import.meta.env.VITE_SUPABASE_API_URL}/storage/v1/object/public/avatars/${player.uid}${
								isSupporterActive(player.supporterUntil) && player.isAvatarGif ? '.gif' : '.jpg'
							}`}
							alt=""
						/>
						<Avatar.Fallback>{player.name[0]}</Avatar.Fallback>
					</Avatar.Root>
					{#if player.clan}
						<a
							href={`/clan/${player.clan}`}
							class={badgeVariants({ variant: 'secondary' })}
							style={`background-color: ${player.clans.tagBgColor}; color: ${player.clans.tagTextColor};`}
							>{player.clans.tag}</a
						>
					{/if}
					<h4 class="font-semibold">
						{#if isSupporterActive(player.supporterUntil)}
							<span class="text-yellow-400">
								{player.name}
							</span>
						{:else}
							{player.name}
						{/if}
					</h4>
				</div>
				<div class="content">
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
										style={`background-color: ${getTitle('dl', player)?.color}`}
									>
										{player.rating}
									</div>
								</div>
							</Tooltip.Trigger>
							<Tooltip.Content>{getTitle('dl', player)?.fullTitle}</Tooltip.Content>
						</Tooltip.Root>
						<div class="rankWrapper">
							Demon List rating
							<div class="rank">
								#{player.overallRank}
							</div>
						</div>
					</div>
					<div class="rating">
						<div class="leftCol">
							<div class="title">{player.totalFLpt}</div>
						</div>
						<div class="rankWrapper">
							Total Featured List point
							<div class="rank">
								#{player.flrank}
							</div>
						</div>
					</div>
				</div>
			</div>
		</HoverCard.Content>
	</HoverCard.Root>
</div>

<style lang="scss">
	.bgGradient {
		margin-top: -50px;
		mask-image: linear-gradient(rgba(0, 0, 0, 1) 0%, rgba(0, 0, 0, 0) 100%);
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
		gap: 10px;
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
</style>
