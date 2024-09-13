<script lang="ts">
	import * as Avatar from '$lib/components/ui/avatar';
	import * as HoverCard from '$lib/components/ui/hover-card/index.js';
	import * as Tooltip from '$lib/components/ui/tooltip';
	import { Separator } from '$lib/components/ui/separator';
	import { getTitle } from '$lib/client';
	import { badgeVariants } from '$lib/components/ui/badge';
	import { getExpLevel } from '$lib/client/getExpLevel';

	export let player: any;
	export let showTitle = false;
</script>

<div class="wrapper">
	<HoverCard.Root>
		{#if player.data.clan}
			{#if showTitle && getTitle('dl', player.data)}
				<Tooltip.Root>
					<Tooltip.Trigger>
						<div class="rank" style={`background-color: ${getTitle('dl', player.data)?.color}`}>
							<span>{getTitle('dl', player.data)?.title}</span>
						</div>
					</Tooltip.Trigger>
					<Tooltip.Content>{getTitle('dl', player.data)?.fullTitle}</Tooltip.Content>
				</Tooltip.Root>
			{/if}
			<a
				href={`/clan/${player.data.clan}`}
				class={badgeVariants({ variant: 'secondary' })}
				style={`background-color: ${player.data.clans.tagBgColor}; color: ${player.data.clans.tagTextColor};`}
				>{player.data.clans.tag}</a
			>
		{/if}
		<HoverCard.Trigger
			href={`/player/${player.data.uid}`}
			rel="noreferrer noopener"
			class="rounded-sm underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-8 focus-visible:outline-black"
		>
			{player.data.name}
		</HoverCard.Trigger>
		<HoverCard.Content class="w-80">
			<div class="hoverName">
				<Avatar.Root>
					<Avatar.Image
						class="object-cover"
						src={`${import.meta.env.VITE_SUPABASE_API_URL}/storage/v1/object/public/avatars/${player.data.uid}.jpg`}
						alt="@shadcn"
					/>
					<Avatar.Fallback>{player.data.name[0]}</Avatar.Fallback>
				</Avatar.Root>
				{#if player.data.clan}
					<a
						href={`/clan/${player.data.clan}`}
						class={badgeVariants({ variant: 'secondary' })}
						style={`background-color: ${player.data.clans.tagBgColor}; color: ${player.data.clans.tagTextColor};`}
						>{player.data.clans.tag}</a
					>
				{/if}
				<h4 class="font-semibold">{player.data.name}</h4>
			</div>
			<Separator />
			<div class="content">
				<div class="rating">
					<div class="flex justify-center">
						<div class="leftCol">
							<b>Lv.{getExpLevel(player.data.exp).level}</b>
						</div>
					</div>
					<div class="progressBar">
						<div class="progress" style={`width: ${getExpLevel(player.data.exp).progress}%`}>
							<b>{getExpLevel(player.data.exp).progress}%</b>
						</div>
					</div>
				</div>
				<div class="rating">
					<Tooltip.Root>
						<Tooltip.Trigger>
							<div class="leftCol">
								<div
									class="title"
									style={`background-color: ${getTitle('dl', player.data)?.color}`}
								>
									{player.data.rating}
								</div>
							</div>
						</Tooltip.Trigger>
						<Tooltip.Content>{getTitle('dl', player.data)?.fullTitle}</Tooltip.Content>
					</Tooltip.Root>
					<div class="rankWrapper">
						Demon List rating
						<div class="rank">
							#{player.data.overallRank}
						</div>
					</div>
				</div>
				<div class="rating">
					<div class="leftCol">
						<div class="title">{player.data.totalFLpt}</div>
					</div>
					<div class="rankWrapper">
						Total Featured List point
						<div class="rank">
							#{player.data.flrank}
						</div>
					</div>
				</div>
			</div>
		</HoverCard.Content>
	</HoverCard.Root>
</div>

<style lang="scss">
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
