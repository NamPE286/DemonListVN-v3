<script lang="ts">
	import * as Card from '$lib/components/ui/card/index.js';
	import BigTitle from '$lib/components/bigTitle.svelte';
	import { fade } from 'svelte/transition';
	import PaymentButton from '$lib/components/paymentButton.svelte';
	import { Button } from '$lib/components/ui/button';
	import { _ } from 'svelte-i18n';
	import PlayerLink from '$lib/components/playerLink.svelte';
	import { Star } from 'svelte-radix';

	export let data: any;
</script>

<svelte:head>
	<title>Nhận Supporter - Demon List VN</title>
</svelte:head>

<div in:fade={{ delay: 300, duration: 1000 }}>
	<img
		class="bgGradient absolute z-0 h-[550px] w-full object-cover"
		src={`https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1964&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D`}
		alt="bg"
	/>
</div>
<div class="relative flex flex-col items-center pl-[10px] pr-[10px]">
	<BigTitle value={$_('supporter.title')} description={$_('supporter.description')} />
	<div class="mt-[-20px] flex max-w-[1000px] flex-col items-center">
		<div class="flex items-center gap-[10px]">
			<PaymentButton title={$_('supporter.price')} />
			<span class="text-gray-400">{$_('supporter.or')}</span>
			<a href="/store">
				<Button>{$_('supporter.store_button')}</Button>
			</a>
		</div>

		{#if data.topBuyers && data.topBuyers.length > 0}
			<div class="mt-[50px] w-full max-w-[1000px]">
				<h2 class="mb-4 flex items-center justify-center gap-2 text-center text-2xl font-bold">
					<Star class="h-6 w-6 text-yellow-500" />
					{$_('supporter.top_supporters.title')}
					<Star class="h-6 w-6 text-yellow-500" />
				</h2>
				<div class="grid grid-cols-1 gap-3 md:grid-cols-3">
					{#each data.topBuyers.slice(0, 3) as buyer, index}
						<Card.Root class="relative overflow-hidden">
							<div
								class="absolute bottom-0 left-0 top-0 w-2 {index === 0
									? 'bg-yellow-500'
									: index === 1
										? 'bg-gray-400'
										: 'bg-amber-600'}"
							></div>
							<Card.Header class='flex'>
								<div
									class="text-2xl font-bold {index === 0
										? 'text-yellow-500'
										: index === 1
											? 'text-gray-400'
											: 'text-amber-600'}"
								>
									#{index + 1}
								</div>
								<div class="flex flex-col justify-between">
									<div class="flex items-center gap-3">
										<PlayerLink player={buyer.player} />
									</div>
									<div class="text-lg font-semibold text-green-600">
										{new Intl.NumberFormat('vi-VN', {
											style: 'currency',
											currency: 'VND'
										}).format(buyer.totalAmount)}
									</div>
								</div>
							</Card.Header>
						</Card.Root>
					{/each}
				</div>
				<div class="mt-4 text-center">
					<a href="/supporter/top" class="text-sm text-muted-foreground hover:underline">
						{$_('supporter.top_supporters.view_leaderboard')}
					</a>
				</div>
			</div>
		{/if}

		<h1 class="mb-[40px] mt-[75px] text-center text-3xl font-bold">
			{$_('supporter.why_support.title')}
		</h1>
		<div class="flex flex-wrap justify-center gap-[10px]">
			<Card.Root>
				<Card.Header>
					<Card.Title>{$_('supporter.why_support.support_team.title')}</Card.Title>
					<Card.Description class="w-[250px]">
						{$_('supporter.why_support.support_team.description')}
					</Card.Description>
				</Card.Header>
			</Card.Root>
			<Card.Root>
				<Card.Header>
					<Card.Title>{$_('supporter.why_support.server_infrastructure.title')}</Card.Title>
					<Card.Description class="w-[250px]">
						{$_('supporter.why_support.server_infrastructure.description')}
					</Card.Description>
				</Card.Header>
			</Card.Root>
			<Card.Root>
				<Card.Header>
					<Card.Title>{$_('supporter.why_support.self_sustaining.title')}</Card.Title>
					<Card.Description class="w-[250px]">
						{$_('supporter.why_support.self_sustaining.description')}
					</Card.Description>
				</Card.Header>
			</Card.Root>
		</div>
		<h1 class="mb-[40px] mt-[40px] text-center text-3xl font-bold">
			{$_('supporter.perks.title')}
		</h1>
		<div class="flex flex-wrap justify-center gap-[10px]">
			<Card.Root>
				<Card.Header>
					<Card.Title>{$_('supporter.perks.highlighted_name.title')}</Card.Title>
					<Card.Description class="w-[250px]">
						{$_('supporter.perks.highlighted_name.description')}
					</Card.Description>
				</Card.Header>
			</Card.Root>
			<Card.Root>
				<Card.Header>
					<Card.Title>{$_('supporter.perks.animated_media.title')}</Card.Title>
					<Card.Description class="w-[250px]">
						{$_('supporter.perks.animated_media.description')}
					</Card.Description>
				</Card.Header>
			</Card.Root>
			<Card.Root>
				<Card.Header>
					<Card.Title>{$_('supporter.perks.ads_free.title')}</Card.Title>
					<Card.Description class="w-[250px]">
						{$_('supporter.perks.ads_free.description')}
					</Card.Description>
				</Card.Header>
			</Card.Root>
			<Card.Root>
				<Card.Header>
					<Card.Title>{$_('supporter.perks.priority_queue.title')}</Card.Title>
					<Card.Description class="w-[250px]">
						{$_('supporter.perks.priority_queue.description')}
					</Card.Description>
				</Card.Header>
			</Card.Root>
			<Card.Root>
				<Card.Header>
					<Card.Title>{$_('supporter.perks.short_url.title')}</Card.Title>
					<Card.Description class="w-[250px]">
						{$_('supporter.perks.short_url.description')}<br />
						Example: <a href="/@NamPE">demonlistvn.com/@NamPE</a>
					</Card.Description>
				</Card.Header>
			</Card.Root>
			<Card.Root>
				<Card.Header>
					<Card.Title>{$_('supporter.perks.discord_role.title')}</Card.Title>
					<Card.Description class="w-[250px]">
						{$_('supporter.perks.discord_role.description')}
					</Card.Description>
				</Card.Header>
			</Card.Root>
			<Card.Root>
				<Card.Header>
					<Card.Title>{$_('supporter.perks.discord_notifications.title')}</Card.Title>
					<Card.Description class="w-[250px]">
						{$_('supporter.perks.discord_notifications.description')}
					</Card.Description>
				</Card.Header>
			</Card.Root>
			<Card.Root>
				<Card.Header>
					<Card.Title>{$_('supporter.perks.exclusive_events.title')}</Card.Title>
					<Card.Description class="w-[250px]">
						{$_('supporter.perks.exclusive_events.description')}
					</Card.Description>
				</Card.Header>
			</Card.Root>
			<Card.Root>
				<Card.Header>
					<Card.Title>{$_('supporter.perks.autofill_level.title')}</Card.Title>
					<Card.Description class="w-[250px]">
						{$_('supporter.perks.autofill_level.description')}
					</Card.Description>
				</Card.Header>
			</Card.Root>
			<Card.Root>
				<Card.Header>
					<Card.Title>{$_('supporter.perks.rating_prediction.title')}</Card.Title>
					<Card.Description class="w-[250px]">
						{$_('supporter.perks.rating_prediction.description')}
					</Card.Description>
				</Card.Header>
			</Card.Root>
			<Card.Root>
				<Card.Header>
					<Card.Title>{$_('supporter.perks.early_access.title')}</Card.Title>
					<Card.Description class="w-[250px]">
						{$_('supporter.perks.early_access.description')}
					</Card.Description>
				</Card.Header>
			</Card.Root>
			<Card.Root>
				<Card.Header>
					<Card.Title>{$_('supporter.perks.more_coming.title')}</Card.Title>
					<Card.Description class="w-[250px]">
						{$_('supporter.perks.more_coming.description')}
					</Card.Description>
				</Card.Header>
			</Card.Root>
		</div>
		<h1 class="mb-[40px] mt-[40px] text-center text-3xl font-bold">
			{$_('supporter.decision.title')}
		</h1>
		<PaymentButton title={$_('supporter.decision.button')} />
		<div class="mt-[100px] w-full pl-[10px] text-sm text-gray-400 lg:pl-[50px]">
			<p>{$_('supporter.notes.title')}</p>
			<ul>
				<li>- {$_('supporter.notes.non_recurring')}</li>
				<li>- {$_('supporter.notes.non_refundable')}</li>
				<li>- {$_('supporter.notes.extension')}</li>
				<li>- {$_('supporter.notes.duration')}</li>
			</ul>
		</div>
	</div>
</div>

<style lang="scss">
	.bgGradient {
		filter: blur(175px);
		margin-top: -55px;
		mask-image: linear-gradient(rgba(0, 0, 0, 1) 0%, rgba(0, 0, 0, 0) 100%);
	}
</style>
