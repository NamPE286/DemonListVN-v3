<script lang="ts">
	import type { PageData } from './$types';
	import { toast } from 'svelte-sonner';
	import { Label } from '$lib/components/ui/label';
	import { Switch } from '$lib/components/ui/switch';
	import * as Avatar from '$lib/components/ui/avatar';
	import * as Tooltip from '$lib/components/ui/tooltip';
	import * as Table from '$lib/components/ui/table';
	import * as Tabs from '$lib/components/ui/tabs';
	import * as Card from '$lib/components/ui/card';
	import * as Select from '$lib/components/ui/select';
	import { user } from '$lib/client';
	import ProfileEditButton from '$lib/components/profileEditButton.svelte';
	import Heatmap from '$lib/components/heatmap.svelte';
	import RecordDetail from '$lib/components/recordDetail.svelte';
	import { badgeVariants } from '$lib/components/ui/badge';
	import Ads from '$lib/components/ads.svelte';
	import { getTitle } from '$lib/client';
	import { Button } from '$lib/components/ui/button';
	import { page } from '$app/stores';
	import { getExpLevel } from '$lib/client/getExpLevel';

	export let data: PageData;
	let list: 'dl' | 'fl' = 'dl';
	let recordDetailOpened = false;
	let selectedRecord: any = null;
	let filter = {
		sortBy: 'pt',
		ascending: false
	};
	let expLevel = getExpLevel(data.player.exp);

	async function applyFilter() {
		const records = await (
			await fetch(
				`${import.meta.env.VITE_API_URL}/player/${$page.params.uid}/records?sortBy=${filter.sortBy}&ascending=${filter.ascending}&end=500`
			)
		).json();

		data.records = records;
		data = data;
	}
</script>

<svelte:head>
	<title>{data.player.name}'s profile - Demon List VN</title>
</svelte:head>

{#if selectedRecord}
	<RecordDetail
		bind:open={recordDetailOpened}
		bind:uid={selectedRecord.userid}
		bind:levelID={selectedRecord.levelid}
	/>
{/if}

{#if data.player.isBanned}
	<div class="flex h-[50px] items-center justify-center bg-red-600">
		This player is banned. If this is your profile, contact with a moderator to appeal this
		decision.
	</div>
{:else if data.player.isHidden}
	<div class="flex h-[50px] items-center justify-center bg-yellow-600">This profile is hidden.</div>
{/if}

<div class="wrapper">
	<div class="playerInfo">
		<Avatar.Root class="h-32 w-32 lg:h-40 lg:w-40">
			<Avatar.Image
				class="object-cover"
				src={`${import.meta.env.VITE_SUPABASE_API_URL}/storage/v1/object/public/avatars/${data.player.uid}.jpg`}
				alt=""
			/>
			<Avatar.Fallback class="text-5xl lg:text-6xl">{data.player.name[0]}</Avatar.Fallback>
		</Avatar.Root>
		<div class="info">
			<div class="flex gap-[10px]">
				{#if data.player.clan}
					<a
						href={`/clan/${data.player.clan}`}
						class={badgeVariants({ variant: 'secondary' })}
						style={`background-color: ${data.player.clans.tagBgColor}; color: ${data.player.clans.tagTextColor};`}
					>
						<span class="text-[15px]">
							{data.player.clans.tag}
						</span>
					</a>
				{/if}
				<h2>
					{data.player.name}
					{#if $user.loggedIn && data.player.uid == $user.data.uid && $user.data.recordCount != 0}
						<ProfileEditButton bind:data={data.player} />
					{/if}
				</h2>
			</div>

			{#if data.player.province}
				<div class="location">
					<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"
						><path
							d="M480-480q33 0 56.5-23.5T560-560q0-33-23.5-56.5T480-640q-33 0-56.5 23.5T400-560q0 33 23.5 56.5T480-480Zm0 294q122-112 181-203.5T720-552q0-109-69.5-178.5T480-800q-101 0-170.5 69.5T240-552q0 71 59 162.5T480-186Zm0 106Q319-217 239.5-334.5T160-552q0-150 96.5-239T480-880q127 0 223.5 89T800-552q0 100-79.5 217.5T480-80Zm0-480Z"
						/></svg
					>
					{#if data.player.city}
						{data.player.province}, {data.player.city}
					{:else}
						{data.player.province}
					{/if}
				</div>
			{/if}
			<div class="social">
				{#if data.player.youtube}
					<a href={data.player.youtube} target="_blank">
						<img id="social" src="/youtube.svg" alt="" />
					</a>
				{/if}
				{#if data.player.facebook}
					<a href={data.player.facebook} target="_blank">
						<img id="social" src="/facebook.svg" alt="" />
					</a>
				{/if}
				{#if data.player.discord}
					<!-- svelte-ignore a11y-click-events-have-key-events -->
					<button
						class="clickable"
						on:click={() => {
							navigator.clipboard.writeText(data.player.discord);
							toast('Copied Discord username to clipboard!');
						}}
					>
						<img id="social" src="/discord.svg" alt="" />
					</button>
				{/if}
			</div>
		</div>
	</div>
	<div class="playerInfo2Wrapper">
		<div class="playerInfo2">
			<Card.Root>
				<Card.Header>
					<Card.Title tag="h1">Player's statistic</Card.Title>
				</Card.Header>
				<Card.Content>
					<div class="flex flex-col gap-[3px]">
						<div class="rating">
							<div class="flex justify-center">
								<div class="leftCol">
									<b>Lv.{expLevel.level}</b>
								</div>
							</div>
							<div class="progressBar">
								<div class="progress" style={`width: ${expLevel.progress}%`}>
									<b>{expLevel.progress}%</b>
								</div>
							</div>
							<Tooltip.Root>
								<Tooltip.Trigger>{data.player.exp}/{expLevel.upperBound}</Tooltip.Trigger>
								<Tooltip.Content>
									<p>{expLevel.upperBound - data.player.exp} EXP to next level</p>
								</Tooltip.Content>
							</Tooltip.Root>
						</div>
						<div class="rating">
							<Tooltip.Root>
								<Tooltip.Trigger>
									<div class="leftCol">
										<div
											class="title"
											style={`background-color: ${getTitle('dl', data.player)?.color}`}
										>
											{data.player.rating}
										</div>
									</div>
								</Tooltip.Trigger>
								<Tooltip.Content>{getTitle('dl', data.player)?.fullTitle}</Tooltip.Content>
							</Tooltip.Root>
							<div class="rankWrapper">
								Demon List rating
								<div class="rank">
									#{data.player.overallRank}
								</div>
							</div>
						</div>
						<div class="rating">
							<div class="leftCol">
								<div class="title">{data.player.totalFLpt}</div>
							</div>
							<div class="rankWrapper">
								Total Featured List point
								<div class="rank">
									#{data.player.flrank}
								</div>
							</div>
						</div>
					</div>
				</Card.Content>
			</Card.Root>
		</div>
		{#key data.player.uid}
			<Heatmap uid={data.player.uid} />
		{/key}
	</div>
	<Ads />
	<div class="filter">
		<div class="filterItem">
			<Label>Sort by</Label>
			<Select.Root
				selected={{
					label: 'Point',
					value: 'pt'
				}}
				onSelectedChange={(e) => {
					// @ts-ignore
					filter.sortBy = e.value;
				}}
			>
				<Select.Trigger class="w-[180px]">
					<Select.Value placeholder="Select item to sort by" />
				</Select.Trigger>
				<Select.Content>
					<Select.Item value="pt">Point</Select.Item>
					<Select.Item value="timestamp">Date submitted</Select.Item>
				</Select.Content>
			</Select.Root>
		</div>
		<div class="filterItem">
			<Label>Ascending</Label>
			<Switch bind:checked={filter.ascending} />
		</div>
		<div class="filterItem">
			<Button variant="outline" on:click={applyFilter}>Apply</Button>
		</div>
	</div>
	<Tabs.Root value="dl">
		<div class="tabs">
			<Tabs.List class="grid w-full grid-cols-2 lg:w-[400px]">
				<Tabs.Trigger value="dl" on:click={() => (list = 'dl')}>Demon List</Tabs.Trigger>
				<Tabs.Trigger value="fl" on:click={() => (list = 'fl')}>Featured List</Tabs.Trigger>
			</Tabs.List>
		</div>
	</Tabs.Root>
	<Table.Root>
		<Table.Caption>Total record: {data.records[list].length}</Table.Caption>
		<Table.Header>
			<Table.Row>
				<Table.Head>Level</Table.Head>
				<Table.Head class="w-[100px] text-center">Submitted on</Table.Head>
				<Table.Head class="w-[100px] text-center">Device</Table.Head>
				<Table.Head class="w-[80px] text-center">Point</Table.Head>
				<Table.Head class="w-[80px] text-center">Progress</Table.Head>
			</Table.Row>
		</Table.Header>
		<Table.Body>
			{#each data.records[list] as record}
				<Table.Row
					on:click={(e) => {
						// @ts-ignore
						if (e.target.nodeName == 'A') {
							return;
						}

						selectedRecord = record;
						recordDetailOpened = true;
					}}
				>
					<Table.Cell class="font-medium">
						<a href={`/level/${record.levels.id}`} data-sveltekit-preload-data="tap">
							{record.levels.name}
						</a>
					</Table.Cell>
					<Table.Cell class="text-center">{new Date(record.timestamp).toLocaleString()}</Table.Cell>
					<Table.Cell class="text-center">
						{record.mobile ? 'Mobile' : 'PC'}
						{#if record.refreshRate}
							<br />({record.refreshRate}fps)
						{/if}
					</Table.Cell>
					<Table.Cell class="text-center">{record[list + 'Pt']}</Table.Cell>
					<Table.Cell class="text-center">{record.progress}%</Table.Cell>
				</Table.Row>
			{/each}
		</Table.Body>
	</Table.Root>
</div>

<style lang="scss">
	.progressBar {
		background-color: gray;
		width: 100%;
		border-radius: 10px;
		overflow: hidden;

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

	.filter {
		display: flex;
		gap: 30px;
		margin-bottom: 10px;
		justify-content: center;
		border-radius: var(--radius);
		border: 1px solid var(--border1);
		padding-top: 10px;
		padding-bottom: 10px;
		width: fit-content;
		padding-inline: 20px;
		margin-inline: auto;

		.filterItem {
			display: flex;
			gap: 10px;
			align-items: center;
		}
	}

	.playerInfo2 {
		min-width: 370px;
	}
	.playerInfo2Wrapper {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 30px;
	}

	h2 {
		font-size: 28px;
		font-weight: bold;
	}

	.rating {
		display: flex;
		gap: 10px;
		align-items: center;
		font-size: 13px;

		.title {
			padding: 2px;
			padding-inline: 5px;
			border-radius: 5px;
			font-weight: bold;
			font-size: 12px;
			user-select: none;
			width: fit-content;
		}
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

	.leftCol {
		width: 50px;
		display: flex;
		justify-content: center;
	}

	.wrapper {
		padding-inline: 80px;
		padding-top: 50px;
	}

	.social {
		display: flex;
		gap: 12px;

		img {
			height: 25px;
			width: 25px;
		}
	}

	.location {
		display: flex;
		gap: 3px;
		align-items: center;
		margin-bottom: 10px;

		svg {
			fill: var(--textColor);
		}
	}

	.playerInfo {
		display: flex;
		align-items: center;
		gap: 30px;
		padding-bottom: 20px;
	}

	.tabs {
		display: flex;
		justify-content: center;
		margin-top: 10px;
		margin-bottom: 10px;
	}

	@media screen and (max-width: 1020px) {
		.playerInfo2 {
			width: 100%;
			min-width: 0;
		}

		.playerInfo2Wrapper {
			flex-direction: column;
		}
	}

	@media screen and (max-width: 900px) {
		.wrapper {
			padding-inline: 20px;
		}
	}

	@media screen and (max-width: 1200px) {
		.filter {
			flex-direction: column;
			margin-bottom: 20px;
			gap: 15px;
		}
	}
</style>
