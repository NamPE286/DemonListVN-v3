<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import * as ContextMenu from '$lib/components/ui/context-menu';
	import { toast } from 'svelte-sonner';
	import { Skeleton } from '$lib/components/ui/skeleton';

	export let level: any;
	export let type: string;
</script>

{#if level}
	<div class="level">
		<Card.Root>
			<Card.Content>
				<ContextMenu.Root>
					<ContextMenu.Trigger>
						<a href={`/level/${level.data.id}`} data-sveltekit-preload-data="tap">
							<img
								src={`https://img.youtube.com/vi/${level.data.videoID}/0.jpg`}
								alt=""
								loading="lazy"
								class="thumbnail"
							/>
						</a>
						<a href={`/level/${level.data.id}`} data-sveltekit-preload-data="tap">
							<div class="levelInfo">
								<div class="top">#{level.data[`${type}Top`]}</div>
								<div class="info">
									<div class="levelName">
										<div class="name">
											{level.data.name}
										</div>
										<div class="pt">
											{#if type == 'dl'}
												{level.data.rating}pt
											{:else if type == 'fl'}
												{level.data.flPt}pt
											{/if}
										</div>
									</div>
									<div class="creator">by {level.data.creator}</div>
								</div>
							</div></a
						>
					</ContextMenu.Trigger>
					<ContextMenu.Content class="w-64">
						<ContextMenu.Item
							inset
							on:click={async () => {
								await navigator.clipboard.writeText(String(level.data.id));
								toast.success('Copied to clipboard!');
							}}>Copy level ID</ContextMenu.Item
						>
						<ContextMenu.Item
							inset
							on:click={async () => {
								await navigator.clipboard.writeText(
									`https://img.youtube.com/vi/${level.data.videoID}/0.jpg`
								);
								toast.success('Copied to clipboard!');
							}}>Copy thumbnail image URL</ContextMenu.Item
						>
					</ContextMenu.Content>
				</ContextMenu.Root>
			</Card.Content>
		</Card.Root>
	</div>
{:else}
	<div class="level">
		<Card.Root>
			<Card.Content>
				<ContextMenu.Root>
					<ContextMenu.Trigger>
						<a href="#!" data-sveltekit-preload-data="tap">
							<Skeleton class="h-[200px] w-full mt-[20px] mb-[15px]" />
						</a>
						<a href="#!" data-sveltekit-preload-data="tap">
							<div class="levelInfo">
								<div class="top"><Skeleton class="h-[60px] w-[60px] mb-[10px] mt-[10px]" /></div>
								<div class="info">
									<div class="levelName">
										<div class="name"><Skeleton class="h-[30px] w-[200px] mb-[10px]" /></div>
									</div>
									<div class="creator"><Skeleton class="h-[20px] w-[100px]" /></div>
								</div>
							</div></a
						>
					</ContextMenu.Trigger>
				</ContextMenu.Root>
			</Card.Content>
		</Card.Root>
	</div>
{/if}

<style lang="scss">
	.thumbnail {
		height: 200px;
		width: 500px;
		object-fit: cover;
		margin-top: 20px;
		border-radius: var(--radius);
		border: 1px solid var(--border1);
		margin-bottom: 15px;
		margin-inline: auto;
	}

	.level {
		overflow: hidden;

		.levelInfo {
			margin-top: -5px;
			margin-bottom: -15px;
			display: flex;
			gap: 15px;

			.top {
				font-size: 44px;
				font-weight: 600;
			}

			.info {
				display: flex;
				flex-direction: column;
				line-height: 20px;
				margin-top: 10px;

				.levelName {
					font-size: 18px;
					font-weight: 500;
					display: flex;
					align-items: center;
					gap: 10px;

					.pt {
						background-color: var(--textColor);
						color: var(--textColorInverted);
						padding: 4px;
						font-size: 11px;
						border-radius: var(--radius);
						line-height: 18px;
					}
				}

				.creator {
					color: var(--textColor2);
				}
			}
		}
	}
</style>
