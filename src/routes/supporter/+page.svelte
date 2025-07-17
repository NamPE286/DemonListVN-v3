<script lang="ts">
	import * as Card from '$lib/components/ui/card/index.js';
	import BigTitle from '$lib/components/bigTitle.svelte';
	import { fade } from 'svelte/transition';
	import PaymentButton from '$lib/components/paymentButton.svelte';
	import { Button } from '$lib/components/ui/button';
</script>

<svelte:head>
	<title>Get Supporter - Demon List VN</title>
</svelte:head>

<div in:fade={{ delay: 300, duration: 1000 }}>
	<img
		class="bgGradient absolute z-0 h-[550px] w-full object-cover"
		src={`https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1964&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D`}
		alt="bg"
	/>
</div>
<div class="relative flex flex-col items-center pl-[10px] pr-[10px]">
	<BigTitle value="Become a Supporter 💖" description="Get exclusive perks and help us grow!" />
	<div class="mt-[-20px] flex max-w-[1000px] flex-col items-center">
		<div class="flex items-center gap-[10px]">
			<PaymentButton title="49.000₫/month" />
			<span class="text-gray-400">or</span>
			<a href="/store">
				<Button>Check out our store</Button>
			</a>
		</div>
		<h1 class="mb-[40px] mt-[75px] text-center text-3xl font-bold">
			Why should you support Demon List VN
		</h1>
		<div class="flex flex-wrap justify-center gap-[10px]">
			<Card.Root>
				<Card.Header>
					<Card.Title>Support the Team</Card.Title>
					<Card.Description class="w-[250px]"
						>A <s>small</s> single person team develops and runs Demon List VN. Your support gives
						<s>them</s> him the motivation to develop and maintain the website.</Card.Description
					>
				</Card.Header>
			</Card.Root>
			<Card.Root>
				<Card.Header>
					<Card.Title>Server Infrastructure</Card.Title>
					<Card.Description class="w-[250px]"
						>Contributions go towards the servers for running the website.</Card.Description
					>
				</Card.Header>
			</Card.Root>
			<Card.Root>
				<Card.Header>
					<Card.Title>Keep Demon List VN self-sustaining</Card.Title>
					<Card.Description class="w-[250px]"
						>Your contributions help keep the site independent and completely free from ads and
						outside sponsors.</Card.Description
					>
				</Card.Header>
			</Card.Root>
		</div>
		<h1 class="mb-[40px] mt-[40px] text-center text-3xl font-bold">What perks will you get</h1>
		<div class="flex flex-wrap justify-center gap-[10px]">
			<Card.Root>
				<Card.Header>
					<Card.Title>Highlighted name</Card.Title>
					<Card.Description class="w-[250px]"
						>Stand out on the leaderboard with a flashy golden name.</Card.Description
					>
				</Card.Header>
			</Card.Root>
			<Card.Root>
				<Card.Header>
					<Card.Title>Animated Avatar and Banner</Card.Title>
					<Card.Description class="w-[250px]"
						>Catch everyone's eye with a dynamic avatar and banner that bring your profile to life.</Card.Description
					>
				</Card.Header>
			</Card.Root>
			<Card.Root>
				<Card.Header>
					<Card.Title>Access priority queue</Card.Title>
					<Card.Description class="w-[250px]"
						>Supporters enjoy reduced submission wait times, jumping ahead in the review line.</Card.Description
					>
				</Card.Header>
			</Card.Root>
			<Card.Root>
				<Card.Header>
					<Card.Title>Unlock exclusive Discord role</Card.Title>
					<Card.Description class="w-[250px]"
						>Gain access to a special role on DLVN and partner Discord servers.</Card.Description
					>
				</Card.Header>
			</Card.Root>
			<Card.Root>
				<Card.Header>
					<Card.Title>Discord DM notifications</Card.Title>
					<Card.Description class="w-[250px]">
						Receive notifications directly through Discord DMs.
					</Card.Description>
				</Card.Header>
			</Card.Root>
			<Card.Root>
				<Card.Header>
					<Card.Title>Supporter-Only events</Card.Title>
					<Card.Description class="w-[250px]">
						Join special events reserved just for our cherished supporters — giveaways, secret
						games, and more surprises await!
					</Card.Description>
				</Card.Header>
			</Card.Root>
			<Card.Root>
				<Card.Header>
					<Card.Title>Autofill level ID when submit</Card.Title>
					<Card.Description class="w-[250px]">
						Automatically populate the level ID field when submitting a level, saving you time and
						effort.
					</Card.Description>
				</Card.Header>
			</Card.Root>
			<Card.Root>
				<Card.Header>
					<Card.Title>Be the first to try our newest feature</Card.Title>
					<Card.Description class="w-[250px]">
						Gain early access to new releases with new features before they go public!
					</Card.Description>
				</Card.Header>
			</Card.Root>
			<Card.Root>
				<Card.Header>
					<Card.Title>Umm... that pretty much it</Card.Title>
					<Card.Description class="w-[250px]">
						Don't worry. More feature for supporters will be added in the future.
					</Card.Description>
				</Card.Header>
			</Card.Root>
		</div>
		<h1 class="mb-[40px] mt-[40px] text-center text-3xl font-bold">
			So... Have you made your decision?
		</h1>
		<PaymentButton title="Support us with just 49.000₫/month" />
		<div class="mt-[100px] w-full pl-[10px] text-sm text-gray-400 lg:pl-[50px]">
			<p>Note:</p>
			<ul>
				<li>- Demon List VN Supporter roles are non-recurring payments,</li>
				<li>- Demon List VN Supporter roles are non-refundable,</li>
				<li>
					- If you buy one while you still have an active roles, it will extend the duration in
					addition to any remaining time.
				</li>
				<li>- 1 Month = 30 Days.</li>
			</ul>
		</div>
	</div>
</div>

<style lang="scss">
	.bgGradient {
		filter: blur(175px);
		margin-top: -50px;
		mask-image: linear-gradient(rgba(0, 0, 0, 1) 0%, rgba(0, 0, 0, 0) 100%);
	}
</style>
