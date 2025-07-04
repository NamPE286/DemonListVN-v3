<script lang="ts">
	import type { Level } from './type';
	import * as Card from '$lib/components/ui/card/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import { Input } from '$lib/components/ui/input/index.js';

	interface SubmitData {
		levelID: number | null;
		progress: number | null;
		videoLink: string;
		raw: string;
	}

	export let level: Level;
	export let index: number;

	let submitData: SubmitData = {
		levelID: level.id,
		progress: null,
		videoLink: '',
		raw: ''
	};

	function indexToRoman(num: number): string {
		const romanNumerals = ['M', 'CM', 'D', 'CD', 'C', 'XC', 'L', 'XL', 'X', 'IX', 'V', 'IV', 'I'];
		const values = [1000, 900, 500, 400, 100, 90, 50, 40, 10, 9, 5, 4, 1];
		let result = '';
		for (let i = 0; i < values.length; i++) {
			while (num >= values[i]) {
				num -= values[i];
				result += romanNumerals[i];
			}
		}
		return result;
	}
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
			<h2 class="text-xl font-bold">{indexToRoman(index + 1)}. {level.name}</h2>
			<span
				class="rounded-sm bg-[var(--textColor)] pl-[5px] pr-[5px] text-sm text-[var(--textColorInverted)]"
				>{level.point}pt</span
			>
		</div>
		<p>by {level.creator} - ID: {level.id}</p>
	</Card.Content>
	<Dialog.Root>
		<Dialog.Trigger class="ml-auto mr-[22.5px]">
			<Button>Submit</Button>
		</Dialog.Trigger>
		<Dialog.Content>
			<Dialog.Header>
				<Dialog.Title>Submit {level.name}</Dialog.Title>
			</Dialog.Header>
			<div class="grid grid-cols-4 items-center gap-4">
				<Label for="name" class="text-right">Progress</Label>
				<Input
					type="number"
					inputmode="numeric"
					min="1"
					max="100"
					bind:value={submitData.progress}
					class="col-span-3"
					placeholder="Required"
				/>
			</div>
			<div class="grid grid-cols-4 items-center gap-4">
				<Label for="name" class="text-right">Video's Link</Label>
				<Input bind:value={submitData.videoLink} placeholder="Required" class="col-span-3" />
			</div>
			{#if level.needRaw}
				<div class="grid grid-cols-4 items-center gap-4">
					<Label for="name" class="text-right">Raw</Label>
					<Input bind:value={submitData.raw} placeholder="Required" class="col-span-3" />
				</div>
			{/if}
			<Button>Submit</Button>
		</Dialog.Content>
	</Dialog.Root>
</Card.Root>
