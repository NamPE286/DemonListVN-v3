<script lang="ts">
	import BigTitle from '$lib/components/bigTitle.svelte';
</script>

<svelte:head>
	<title>Rules - Demon List VN</title>
</svelte:head>

<BigTitle value="Rules" description="Read the rules" />
<div class="wrapper">
	<h2>General rules</h2>
	<ul>
		<li>
			Only the players who have Vietnamese citizenship or Vietnamese bloodline can submit records.
		</li>
		<li>Records without FPS counter, clicks and raw footage will be rejected immediately.</li>
		<li>Records must reach minimum progress requirement of any level to be accepted.</li>
		<li>
			Records using disallowed hacks or secret routes (bypassing the hardest parts of the level), or
			stolen from others will not be accepted. It is recommended to check <a
				href="https://docs.google.com/spreadsheets/d/1evE4nXATxRAQWu2Ajs54E6cVUqHBoSid8I7JauJnOzg/edit?usp=sharing"
				>the list of allowed hacks from Pointercrate</a
			>.
		</li>
		<li>
			Records not showing the in-game endscreen after completing the level will not be accepted.
		</li>
		<li>Records should be available on YouTube (public or unlisted).</li>
		<li>
			Players are allowed to fix bugs that are caused by varying refresh rates or in-game physics
			changes.
		</li>
		<li>
			If you use a custom LDM version, you must show the LDM level's ID in the comment section when
			submitting. Otherwise, your submission will be rejected immediately.
		</li>
		<li>
			If you get banned from the GDVN or CDGDVN facebook group, your record will be rejected until
			you get unbanned.
		</li>
	</ul>
	<h2>Demon List rule</h2>
	<ul>
		<li>All levels must be insane or extreme demons at the time of submission..</li>
		<li>All records must be 360p 25fps or better</li>
		<li>Raw is required for all records. (except for Insane Demon)</li>
		<li>
			Note: Insane Demons will not receive a rating, but submissions are still accepted for archival
			purposes.
		</li>
	</ul>
	<h2>Featured List rule</h2>
	<ul>
		<li>
			All levels must be rated demons, created and uploaded by the Vietnamese (or having at least
			50% Vietnamese contribution).
		</li>
	</ul>
	<h2>Rating</h2>
	<ul>
		<li>Overview:</li>
		<ul>
			<li>Rating is a metric represents player potential.</li>
			<li>
				Rating is based on player's best performance and performance on other levels on Demon List.
			</li>
		</ul>
		<li>Rules:</li>
		<ul>
			<li>Rating is only applied to Demon List.</li>
			<li>Banned and hidden accounts will be unrated.</li>
		</ul>
		<li>Rating distribution:</li>
		<ul>
			<li>C: > 0</li>
			<li>B: >= 250</li>
			<li>A: >= 500</li>
			<li>Specialist: >= 800</li>
			<li>Expert: >= 1500</li>
			<li>Candidate Master: >= 2200</li>
			<li>Master: >= 3500</li>
			<li>Grandmaster: >= 4500</li>
			<li>Legendary Grandmaster: >= 5500</li>
			<li>Ascended Grandmaster: >= 6000</li>
		</ul>
	</ul>
</div>

<style lang="scss">
	.wrapper {
		padding-inline: 100px;

		h2 {
			display: block;
			font-size: 1.5em;
			margin-top: 0.83em;
			margin-bottom: 0.83em;
			margin-left: 0;
			margin-right: 0;
			font-weight: bold;
		}

		ul {
			list-style: initial;
			margin: initial;
			padding: 0 0 0 40px;
		}

		li {
			display: list-item;
		}
	}

	@media screen and (max-width: 900px) {
		.wrapper {
			padding-inline: 15px;
		}
	}
</style>
