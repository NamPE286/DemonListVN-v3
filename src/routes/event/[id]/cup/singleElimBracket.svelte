<script lang="ts">
	import PlayerHoverCard from '$lib/components/playerHoverCard.svelte';

	export let data;
</script>

<div class="flex items-center justify-center gap-[50px]">
	<div class="flex flex-col gap-[20px]">
		{#each { length: 8 } as _, index}
			<div class="flex flex-col gap-[10px]">
				{#each data.data.bracket.slice(2 * index, 2 * index + 2) as player, j}
					<div
						class="flex h-[35px] w-[250px] items-center rounded-md border-[1px] border-[hsl(var(--border))] pl-[10px] pr-[10px]"
					>
						{#if player}
							<PlayerHoverCard {player} showTitle={true} truncate={15} />
						{/if}
						<div class="ml-auto">
							{data.data.bracketResult[2 * index + j]
								? data.data.bracketResult[2 * index + j]
								: '-'}
						</div>
					</div>
				{/each}
			</div>
		{/each}
	</div>
	<div class="flex flex-col gap-[70px]">
		{#each { length: 4 } as _, index}
			<div class="flex flex-col gap-[60px]">
				{#each data.data.bracket.slice(16 + 2 * index, 16 + 2 * index + 2) as player, j}
					<div
						class="flex h-[35px] w-[250px] items-center rounded-md border-[1px] border-[hsl(var(--border))] pl-[10px] pr-[10px]"
					>
						{#if player}
							<PlayerHoverCard {player} showTitle={true} truncate={15} />
						{:else}
							<span class="opacity-50"> Unknown </span>
						{/if}
						<div class="ml-auto">
							{data.data.bracketResult[2 * index + j]
								? data.data.bracketResult[2 * index + j]
								: '-'}
						</div>
					</div>
				{/each}
			</div>
		{/each}
	</div>
	<div class="flex flex-col gap-[170px]">
		{#each { length: 2 } as _, index}
			<div class="flex flex-col gap-[160px]">
				{#each data.data.bracket.slice(16 + 8 + 2 * index, 16 + 8 + 2 * index + 2) as player, j}
					<div
						class="flex h-[35px] w-[250px] items-center rounded-md border-[1px] border-[hsl(var(--border))] pl-[10px] pr-[10px]"
					>
						{#if player}
							<PlayerHoverCard {player} showTitle={true} truncate={15} />
						{:else}
							<span class="opacity-50"> Unknown </span>
						{/if}
						<div class="ml-auto">
							{data.data.bracketResult[2 * index + j]
								? data.data.bracketResult[2 * index + j]
								: '-'}
						</div>
					</div>
				{/each}
			</div>
		{/each}
	</div>
	<div class="flex flex-col">
		{#each { length: 1 } as _, index}
			<div class="flex flex-col gap-[360px]">
				{#each data.data.bracket.slice(16 + 8 + 4 + 2 * index, 16 + 8 + 4 + 2 * index + 2) as player, j}
					<div
						class="flex h-[35px] w-[250px] items-center rounded-md border-[1px] border-[hsl(var(--border))] pl-[10px] pr-[10px]"
					>
						{#if player}
							<PlayerHoverCard {player} showTitle={true} truncate={15} />
						{:else}
							<span class="opacity-50"> Unknown </span>
						{/if}
						<div class="ml-auto">
							{data.data.bracketResult[2 * index + j]
								? data.data.bracketResult[2 * index + j]
								: '-'}
						</div>
					</div>
				{/each}
			</div>
		{/each}
	</div>
	<div class="flex flex-col">
		{#each { length: 1 } as _, index}
			<div class="flex flex-col gap-[360px]">
				{#each data.data.bracket.slice(16 + 8 + 4 + 2 + 2 * index, 16 + 8 + 4 + 2 + 2 * index + 1) as player, j}
					<div
						class="flex h-[35px] w-[250px] items-center rounded-md border-[1px] border-[hsl(var(--border))] pl-[10px] pr-[10px]"
					>
						{#if player}
							<PlayerHoverCard {player} showTitle={true} truncate={15} />
						{:else}
							<span class="opacity-50"> Unknown </span>
						{/if}
						<div class="ml-auto">
							{data.data.bracketResult[2 * index + j]
								? data.data.bracketResult[2 * index + j]
								: '-'}
						</div>
					</div>
				{/each}
			</div>
		{/each}
	</div>
</div>
