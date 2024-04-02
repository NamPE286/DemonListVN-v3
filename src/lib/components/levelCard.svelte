<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import * as ContextMenu from '$lib/components/ui/context-menu';
	import { toast } from 'svelte-sonner';

	export let level: any;
	export let type: string;

	function getPoint() {
		if (type == 'dl') {
			return level.data.rating;
		}

		if (type == 'fl') {
			return level.data.flTop;
		}
	}
</script>

<div class="level">
	<Card.Root>
		<Card.Content>
			<ContextMenu.Root>
				<ContextMenu.Trigger>
					<a href="#!">
						<img
							src={`https://img.youtube.com/vi/${level.data.videoID}/0.jpg`}
							alt=""
							loading="lazy"
							class="thumbnail"
						/>
					</a>
					<a href="#!">
						<div class="levelInfo">
							<div class="top">#{level.data[`${type}Top`]}</div>
							<div class="info">
								<div class="levelName">
									{level.data.name}
									<div class="pt">
										{getPoint()}pt
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
		.levelInfo {
			margin-bottom: -10px;
			display: flex;
			gap: 15px;
			
			.top {
				font-size: 40px;
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
						padding: 5px;
						font-size: 13px;
						border-radius: var(--radius);
						line-height: 15px;
					}
				}

				.creator {
					color: var(--textColor2);
				}
			}
		}
	}
</style>
