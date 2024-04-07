<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import * as Table from '$lib/components/ui/table';
	import ExternalLink from 'svelte-radix/ExternalLink.svelte';
	import type { PageData } from './$types';
	import PlayerHoverCard from '$lib/components/playerHoverCard.svelte';

	export let data: PageData;
</script>

<svelte:head>
	<title>{data.level.name} by {data.level.creator} - Demon List VN</title>
	<meta name="description" content={data.levelAPI.description} />
</svelte:head>

<img class="bg" src={`https://img.youtube.com/vi/${data.level.videoID}/0.jpg`} alt="thumbnail" />
<div class="head">
	<div class="cardWrapper">
		<Card.Root>
			<Card.Content>
				<div class="content">
					<div class="levelName">
						<h2>{data.level.name}</h2>
						<span class="creator">by {data.level.creator}</span>
					</div>
				</div>
			</Card.Content>
		</Card.Root>
	</div>
</div>
<div class="detailWrapper">
	<div class="cardWrapper1 point">
		<Card.Root>
			<Card.Content>
				<div class="content">
					<div class="pointLabel">
						Rating: {data.level.rating}
						<div class="top">#{data.level.dlTop}</div>
					</div>
					<div class="pointLabel">
						Featured List point: {data.level.flPt}
						<div class="top">#{data.level.flTop}</div>
					</div>
				</div>
			</Card.Content>
		</Card.Root>
	</div>
	<div class="cardWrapper1 detail">
		<Card.Root>
			<Card.Content>
				<iframe
					src={`https://www.youtube.com/embed/${data.level.videoID}?si=3M9vP_nLFlxX-0hE`}
					title="YouTube video player"
					frameborder="0"
					allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
					referrerpolicy="strict-origin-when-cross-origin"
					allowfullscreen
				></iframe>
			</Card.Content>
		</Card.Root>

		<Card.Root>
			<Card.Content>
				<div class="content">
					<p><b>Description:</b> <span>{data.levelAPI.description}</span></p>
					<p><b>Difficulty: </b><span>{data.levelAPI.difficulty}</span></p>
					<p><b>ID: </b><span>{data.level.id}</span></p>
					<p>
						<b>Song: </b>
						{#if data.level.songID == null}
							<span>Avaliable on Newground</span>
						{:else}
							<a href={`${import.meta.env.VITE_API_URL}/level/${data.level.id}/song`}
								><u>Download</u></a
							>
						{/if}
					</p>
				</div>
			</Card.Content>
		</Card.Root>
	</div>
	<div class="cardWrapper1 table">
		<Table.Root>
			<Table.Caption>Total record: {data.records.length}</Table.Caption>
			<Table.Header>
				<Table.Row>
					<Table.Head>Player</Table.Head>
					<Table.Head class="w-[220px] text-center">Submitted on</Table.Head>
					<Table.Head class='w-[100px] text-center'>Device</Table.Head>
					<Table.Head class="w-[80px] text-center">Progress</Table.Head>
					<Table.Head class="w-[0px] text-center"></Table.Head>
				</Table.Row>
			</Table.Header>
			<Table.Body>
				{#each data.records as record}
					<Table.Row>
						<Table.Cell class="font-medium">
							<PlayerHoverCard player={{ data: record.data.players }} />
						</Table.Cell>
						<Table.Cell class="text-center">
							{new Date(record.data.timestamp).toLocaleString()}
						</Table.Cell>
						<Table.Cell class="text-center">
							{record.data.mobile ? 'Mobile' : 'PC'} ({record.data.refreshRate}fps)
						</Table.Cell>
						<Table.Cell class="text-center">
							{record.data.progress}%
						</Table.Cell>
						<Table.Cell class="text-center">
							<button>
								<a href={record.data.videoLink} target="_blank">
									<ExternalLink size={20} />
								</a>
							</button>
						</Table.Cell>
					</Table.Row>
				{/each}
			</Table.Body>
		</Table.Root>
	</div>
</div>

<style lang="scss">
	.table {
		margin-bottom: 20px;
	}

	.detail {
		display: grid;
		grid-template-columns: calc(50% - 10px) calc(50% - 10px);
		gap: 20px;

		iframe {
			width: 100%;
			height: 280px;
			margin-top: 20px;
			border-radius: var(--radius);
		}

		.content {
			p {
				line-height: 20px;
				margin-bottom: 5px;
			}
			span {
				color: var(--textColor2);
			}
		}
	}

	h2 {
		font-weight: bold;
		font-size: 30px;
	}

	.creator {
		color: var(--textColor2);
	}

	.bg {
		width: 100%;
		height: 33vw;
		max-height: 500px;
		min-height: 300px;
		object-fit: cover;
		position: fixed;
		z-index: 0;
	}

	.detailWrapper {
		background-color: hsl(var(--background));
		position: relative;
		z-index: 1;
	}

	.cardWrapper {
		width: 1200px;
		max-width: 100%;
		margin-inline: auto;
		margin-top: auto;
		padding-inline: 10px;

		.content {
			padding-top: 20px;
		}
	}

	.cardWrapper1 {
		width: 1200px;
		max-width: 100%;
		margin-inline: auto;
		padding-inline: 10px;
		padding-top: 20px;
		position: relative;
		z-index: 2;

		.content {
			padding-top: 20px;
		}
	}

	.point {
		.content {
			display: flex;
			justify-content: space-evenly;

			.pointLabel {
				display: flex;
				gap: 10px;
				font-weight: 600;

				.top {
					background-color: var(--textColor);
					color: var(--textColorInverted);
					padding-inline: 10px;
					border-radius: 4px;
				}
			}
		}
	}

	.head {
		position: relative;
		background: linear-gradient(rgba(0, 0, 0, 0) 0%, hsl(var(--background)) 400px);
		height: 33vw;
		max-height: 500px;
		min-height: 300px;
		z-index: 10;
		display: flex;
		flex-direction: column;
	}

	@media screen and (max-width: 900px) {
		.point {
			.content {
				flex-direction: column;
			}
		}

		.detail {
			grid-template-columns: 100%;
		}
	}
</style>