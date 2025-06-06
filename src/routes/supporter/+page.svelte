<script lang="ts">
	import * as Card from '$lib/components/ui/card/index.js';
	import BigTitle from '$lib/components/bigTitle.svelte';
	import { fade } from 'svelte/transition';
	import PaymentButton from '$lib/components/paymentButton.svelte';
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
<div class="relative pl-[10px] pr-[10px] flex flex-col items-center">
	<BigTitle value="Become a Supporter 💖" description="Get exclusive perks and help us grow!" />
	<div class="mt-[-20px] flex flex-col items-center max-w-[1000px]">
		<PaymentButton title="22.000₫/month" />
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
						>Contributions go towards the servers for running the website</Card.Description
					>
				</Card.Header>
			</Card.Root>
			<Card.Root>
				<Card.Header>
					<Card.Title>Keep Demon List VN self-sustaining</Card.Title>
					<Card.Description class="w-[250px]"
						>Your contributions help keep the game independent and completely free from ads and
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
						>Catch everyone's eye with a dynamic avatar and banner that bring your profile to life
						on the leaderboard</Card.Description
					>
				</Card.Header>
			</Card.Root>
			<Card.Root>
				<Card.Header>
					<Card.Title>Track your submission status</Card.Title>
					<Card.Description class="w-[250px]"
						>Quickly check where your submission stands in the queue and see how close it is to
						being reviewed</Card.Description
					>
				</Card.Header>
			</Card.Root>
			<Card.Root>
				<Card.Header>
					<Card.Title>Be the first to try our newest feature</Card.Title>
					<Card.Description class="w-[250px]"
						>Gain early access to new releases with new features before they go public!</Card.Description
					>
				</Card.Header>
			</Card.Root>
			<Card.Root>
				<Card.Header>
					<Card.Title>Umm... that pretty much it</Card.Title>
					<Card.Description class="w-[250px]"
						>Don't worry. More feature for supporters will be added in the future.</Card.Description
					>
				</Card.Header>
			</Card.Root>
		</div>
		<h1 class="mb-[40px] mt-[40px] text-3xl font-bold">So... Have you made your decision?</h1>
		<PaymentButton title="Support us with just 22.000₫/month" />
		<div class="mt-[100px] w-full pl-[50px] text-sm text-gray-400">
			<p>Note:</p>
			<ul>
				<li>- Demon List VN Supporter roles are non-recurring payments</li>
				<li>
					- If you buy one while you still have an active roles, it will extend the duration in
					addition to any remaining time.
				</li>
				<li>- 1 Month = 30 Days</li>
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
