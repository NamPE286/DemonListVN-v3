<script lang="ts">
	import BigTitle from '$lib/components/bigTitle.svelte';
	import { Button } from '$lib/components/ui/button';
	import { toast } from 'svelte-sonner';
	import { user } from '$lib/client';
	import * as Card from '$lib/components/ui/card/index.js';

	async function purchase() {
		toast.loading('You will be redirected to our payment portal');

		const res: any = await (
			await fetch(`${import.meta.env.VITE_API_URL}/payment/getPaymentLink/1/1`, {
				method: 'GET',
				headers: {
					Authorization: 'Bearer ' + (await $user.token()),
					'Content-Type': 'application/json'
				}
			})
		).json();

		window.location.href = res.checkoutUrl;
	}
</script>

<svelte:head>
	<title>Get Supporter - Demon List VN</title>
</svelte:head>

<BigTitle value="Become a Supporter 💖" description="Get exclusive perks and help us grow!" />
<div class="mt-[-20px] flex flex-col items-center">
	<Button on:click={purchase}>22.000₫/month</Button>
	<h1 class="mb-[40px] mt-[75px] text-3xl font-bold">Why should you support Demon List VN</h1>
	<div class="flex gap-[10px]">
		<Card.Root>
			<Card.Header>
				<Card.Title>Support the Team</Card.Title>
				<Card.Description
					>A <s>small</s> single person team develops <br />and runs Demon List VN. <br />Your
					support gives <s>them</s> him the motivation to <br />develop and maintain the website.</Card.Description
				>
			</Card.Header>
		</Card.Root>
		<Card.Root>
			<Card.Header>
				<Card.Title>Server Infrastructure</Card.Title>
				<Card.Description
					>Contributions go towards the servers for <br /> running the website</Card.Description
				>
			</Card.Header>
		</Card.Root>
		<Card.Root>
			<Card.Header>
				<Card.Title>Keep Demon List VN self-sustaining</Card.Title>
				<Card.Description
					>Your contributions help keep the<br /> game independent and completely free <br />from
					ads and outside sponsors.</Card.Description
				>
			</Card.Header>
		</Card.Root>
	</div>
	<h1 class="mb-[40px] mt-[40px] text-3xl font-bold">What perks will you get</h1>
	<div class="flex gap-[10px]">
		<Card.Root>
			<Card.Header>
				<Card.Title>Highlighted name</Card.Title>
				<Card.Description
					>Stand out on the leaderboard with a <br />flashy golden name.</Card.Description
				>
			</Card.Header>
		</Card.Root>
		<Card.Root>
			<Card.Header>
				<Card.Title>Umm... that pretty much it</Card.Title>
				<Card.Description
					>Don't worry. More feature for supporter <br />will be added in the future.</Card.Description
				>
			</Card.Header>
		</Card.Root>
	</div>
	<h1 class="mb-[40px] mt-[40px] text-3xl font-bold">So... Have you made your decision?</h1>
	<Button on:click={purchase}>22.000₫/month</Button>
</div>
