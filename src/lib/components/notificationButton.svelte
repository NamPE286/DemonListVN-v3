<script lang="ts">
	import { Bell } from 'svelte-radix';
	import * as Popover from '$lib/components/ui/popover';
	import * as Card from '$lib/components/ui/card';
	import { Button } from '$lib/components/ui/button';
	import { user } from '$lib/client';
	import supabase from '$lib/client/supabase';
	import { dateStore } from 'svelte-legos';

	let notifications: any[] = [];

	function timeSince(date: any) {
		var seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);
		var interval = seconds / 31536000;

		if (interval > 1) {
			return Math.floor(interval) + ' years';
		}

		interval = seconds / 2592000;

		if (interval > 1) {
			return Math.floor(interval) + ' months';
		}

		interval = seconds / 86400;

		if (interval > 1) {
			return Math.floor(interval) + ' days';
		}

		interval = seconds / 3600;

		if (interval > 1) {
			return Math.floor(interval) + ' hours';
		}

		interval = seconds / 60;

		if (interval > 1) {
			return Math.floor(interval) + ' minutes';
		}

		return Math.floor(seconds) + ' seconds';
	}

	async function fetchNotifications() {
		try {
			notifications = await (
				await fetch(`${import.meta.env.VITE_API_URL}/notifications/${$user.data.uid}`, {
					headers: {
						Authorization: 'Bearer ' + (await $user.token())!
					}
				})
			).json();
		} catch {}

		supabase
			.channel('table-db-changes')
			.on(
				'postgres_changes',
				{
					event: 'INSERT',
					schema: 'public',
					table: 'notifications',
					filter: `to=eq.${$user.data.uid}`
				},
				(payload) => {
					notifications.unshift(payload.new);
					notifications = notifications;
				}
			)
			.subscribe();

		if ($user.data.recordCount === 0) {
			notifications = [
				{
					content: 'Beat Platinum Adventure to fully unlock your account',
					redirect: '/level/5904109',
					timestamp: new Date().toISOString()
				}
			];
		}
	}

	async function clear() {
		notifications = [];

		if ($user.data.recordCount === 0) {
			notifications = [
				{
					content: 'Beat Platinum Adventure to fully unlock your account',
					redirect: '/level/5904109',
					timestamp: new Date().toISOString()
				}
			];
		}

		fetch(`${import.meta.env.VITE_API_URL}/notifications/${$user.data.uid}`, {
			method: 'DELETE',
			headers: {
				Authorization: 'Bearer ' + (await $user.token())!
			}
		});
	}

	$: ($user, fetchNotifications());
</script>

<Popover.Root>
	<Popover.Trigger>
		<button class="clickable">
			<Button variant="ghost" size="icon" class="overflow-hidden rounded-full">
				<div>
					<Bell size={20} />
					{#if notifications.length != 0}
						<div class="whiteDot" />
					{/if}
				</div>
			</Button>
		</button>
	</Popover.Trigger>
	<Popover.Content class="z-[99999] w-[350px]">
		<div class="header">
			<h4 class="font-medium leading-none">Notifications</h4>
			<div class="buttonWrapper">
				<Button variant="link" on:click={clear}>Clear all</Button>
			</div>
		</div>
		{#if notifications.length == 0}
			<p class="noNoti">No notification</p>
		{:else}
			<div class="notiWrapper">
				{#each notifications as notification}
					<Card.Root>
						<Card.Header>
							<Card.Title>
								<a class="notiContent" href={notification.redirect ? notification.redirect : '#!'}
									>{notification.content}
									{#if notification.redirect}
										<span class="navigate"> - Click to navigate</span>
									{/if}
								</a></Card.Title
							>
							<Card.Description>{timeSince(notification.timestamp)} ago</Card.Description>
						</Card.Header>
					</Card.Root>
				{/each}
			</div>
		{/if}
	</Popover.Content>
</Popover.Root>

<style lang="scss">
	.navigate {
		color: var(--textColor2);
	}

	.whiteDot {
		position: absolute;
		width: 10px;
		height: 10px;
		background-color: var(--textColor);
		border-radius: 50%;
		transform: translateX(12px) translateY(-23px);
	}

	.notiContent {
		font-weight: 400;
	}

	.header {
		display: flex;
		align-items: center;
		gap: 10px;
	}

	.buttonWrapper {
		margin-left: auto;
	}

	.notiWrapper {
		margin-top: 10px;
		display: flex;
		flex-direction: column;
		gap: 10px;
		height: fit-content;
		max-height: 300px;
		overflow: scroll;
		overflow-x: hidden;
	}

	.noNoti {
		color: var(--textColor2);
		text-align: center;
		font-size: 14px;
	}
</style>
