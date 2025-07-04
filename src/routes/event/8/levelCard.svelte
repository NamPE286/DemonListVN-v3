<script lang="ts">
	import type { Level } from './type';
	import * as Card from '$lib/components/ui/card/index.js';
	import { Button } from '$lib/components/ui/button/index.js';

	export let level: Level;
</script>

<Card.Root class="mb-[10px] ml-auto mr-auto flex w-[1000px] max-w-full items-center">
	<a href={`https://www.youtube.com/watch?v=${level.videoID}`}>
		<img
			src={`https://img.youtube.com/vi/${level.videoID}/0.jpg`}
			alt="level"
			class="h-[100px] w-[177px] rounded-xl object-cover"
		/>
	</a>
	<Card.Content class="mt-[22.5px] flex flex-col justify-center">
		<div class="flex items-center gap-[10px]">
			<h2 class="text-xl font-bold">{level.name}</h2>
			<span
				class="rounded-sm bg-[var(--textColor)] pl-[5px] pr-[5px] text-sm text-[var(--textColorInverted)]"
				>{level.point}pt</span
			>
		</div>
		<p>by {level.creator} - ID: {level.id}</p>
	</Card.Content>
	<Button class='ml-auto mr-[22.5px]'>Submit</Button>
</Card.Root>
