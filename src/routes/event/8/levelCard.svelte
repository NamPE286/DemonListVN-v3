<script lang="ts">
	import type { Level } from './type';
	import * as Card from '$lib/components/ui/card/index.js';

	export let level: Level;
</script>

<Card.Root class="mb-[10px] ml-auto mr-auto flex w-[1000px] max-w-full">
	<img
		src={`https://img.youtube.com/vi/${level.videoID}/0.jpg`}
		alt="level"
		class="h-[100px] w-[200px] rounded-xl object-cover"
	/>
	<Card.Content class="mt-[22.5px] flex flex-col justify-center">
		<div class="flex items-center gap-[10px]">
			<h2 class="text-xl font-bold">{level.name}</h2>
            <span class="bg-[var(--textColor)] text-[var(--textColorInverted)] pl-[5px] pr-[5px] text-sm rounded-sm">{level.point}pt</span>
		</div>
		<p>by {level.creator} - ID: {level.id}</p>
	</Card.Content>
</Card.Root>
