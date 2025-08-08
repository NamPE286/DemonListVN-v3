<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import * as ContextMenu from '$lib/components/ui/context-menu';
	import { toast } from 'svelte-sonner';
	import { Skeleton } from '$lib/components/ui/skeleton';
	import Check from 'svelte-radix/Check.svelte';
	import Clock from 'svelte-radix/Clock.svelte';
	import * as Tooltip from '$lib/components/ui/tooltip';
	import { user } from '$lib/client';
	import { calcRating } from '$lib/client/rating';
	import { isSupporterActive } from '$lib/client/isSupporterActive';

	export let level: any;
	export let type: string;
</script>

{#if level}
	<div class="level">
		<Card.Root>
			<Card.Content>
				<ContextMenu.Root>
					<ContextMenu.Trigger>
						<a href={`/level/${level.id}`} data-sveltekit-preload-data="tap">
							<img
								src={`https://img.youtube.com/vi/${level.videoID}/0.jpg`}
								alt=""
								loading="lazy"
								class="thumbnail"
							/>
						</a>
						<a href={`/level/${level.id}`} data-sveltekit-preload-data="tap">
							<div class="levelInfo">
								<div class="top">#{level[`${type}Top`]}</div>
								<div class="info">
									<div class="levelName">
										<div class="name">
											{level.name}
										</div>
										<div class="pt">
											{#if type == 'dl'}
												{level.rating}pt
											{:else if type == 'fl'}
												{level.flPt}pt
											{/if}
										</div>
										{#key $user}
											{#if $user.loggedIn && isSupporterActive($user.data.supporterUntil)}
												{#if !level.record}
													<Tooltip.Root>
														<Tooltip.Trigger>
															<div class="pt">
																+{calcRating($user.ratings, level.rating) - $user.data.rating}
															</div>
														</Tooltip.Trigger>
														<Tooltip.Content>
															<p>
																{$user.data.rating} -> {calcRating($user.ratings, level.rating)}
															</p>
														</Tooltip.Content>
													</Tooltip.Root>
												{/if}
											{/if}
										{/key}
										{#if level.minProgress != 100 && type == 'dl'}
											<div class="pt">
												{level.minProgress}% Min
											</div>
										{/if}
									</div>
									<div class="creator">by {level.creator}</div>
								</div>
								{#if level.record}
									<div class="progress">
										{#if level.record.isChecked}
											{#if level.record.progress == 100}
												<Check />
											{:else}
												{level.record.progress}%
											{/if}
										{:else}
											<Clock />
										{/if}
									</div>
								{/if}
							</div>
						</a>
					</ContextMenu.Trigger>
					<ContextMenu.Content class="w-64">
						<ContextMenu.Item
							inset
							on:click={async () => {
								await navigator.clipboard.writeText(String(level.id));
								toast.success('Copied to clipboard!');
							}}>Copy level ID</ContextMenu.Item
						>
						<ContextMenu.Item
							inset
							on:click={async () => {
								await navigator.clipboard.writeText(
									`https://img.youtube.com/vi/${level.videoID}/0.jpg`
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
							<Skeleton class="mb-[15px] mt-[20px] h-[200px] w-full" />
						</a>
						<a href="#!" data-sveltekit-preload-data="tap">
							<div class="levelInfo">
								<div class="top"><Skeleton class="mb-[10px] mt-[10px] h-[60px] w-[60px]" /></div>
								<div class="info">
									<div class="levelName">
										<div class="name"><Skeleton class="mb-[10px] h-[30px] w-[200px]" /></div>
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
	.name {
		margin-right: 3px;
	}
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
			align-items: center;

			.top {
				font-size: 44px;
				font-weight: 600;
			}

			.info {
				display: flex;
				flex-direction: column;
				line-height: 20px;

				.levelName {
					font-size: 18px;
					font-weight: 500;
					display: flex;
					flex-wrap: wrap;
					align-items: center;
					gap: 5px;

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

			.progress {
				margin-left: auto;
				font-weight: 500;
			}
		}
	}
</style>
