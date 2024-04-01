<script>
	import * as Tabs from '$lib/components/ui/tabs';
	import { Button } from '$lib/components/ui/button';
</script>

<svelte:head>
	<title>Demon List - Demon List VN</title>
</svelte:head>

<div class="title">
	<h1>Demon List</h1>
	<p>Hardest level beaten by Vietnamese</p>
</div>

<Tabs.Root value="account" class="tabs">
	<div class="tabsWrapper">
		<Tabs.List>
			<Tabs.Trigger value="account">Levels</Tabs.Trigger>
			<Tabs.Trigger value="password">Leaderboard</Tabs.Trigger>
		</Tabs.List>
		<Button variant="outline">Filter</Button>
	</div>

	<Tabs.Content value="account">Make changes to your account here.</Tabs.Content>
	<Tabs.Content value="password">Change your password here.</Tabs.Content>
</Tabs.Root>

<style lang="scss">
	.tabsWrapper {
		display: flex;
		justify-content: center;
		gap: 10px;
		margin-bottom: 25px;
	}

	.title {
		display: flex;
		flex-direction: column;
		align-items: center;
		margin-top: 120px;
		margin-bottom: 50px;
	}

	h1 {
		font-size: 3.75rem;
		font-weight: 800;
	}

	p {
		font-size: 1.25rem;
		color: var(--textColor2);
	}

	@media screen and (max-width: 900px) {
		h1 {
			font-size: 1.875rem;
		}

		.title {
			margin-top: 80px;
		}
	}
</style>
