<script lang="ts">
	import PlayerHoverCard from '$lib/components/playerHoverCard.svelte';

	export let data;
</script>

<div class="w-[1800px]">
	<div class="mb-[10px] flex w-full gap-[50px] pl-[10px] 2xl:pl-[200px]">
		<div class="w-[250px] text-center">Round of 16</div>
		<div class="w-[250px] text-center">Quarterfinals</div>
		<div class="w-[250px] text-center">Semifinals</div>
		<div class="w-[250px] text-center">Finals</div>
	</div>
	<div class="flex items-center pl-[10px] 2xl:pl-[200px]">
		<div class="flex flex-col gap-[20px]">
			{#each { length: 8 } as _, index}
				<div class="flex">
					<div class="flex flex-col gap-[10px]">
						{#each data.data.bracket.slice(2 * index, 2 * index + 2) as player, j}
							<div
								class="flex h-[35px] w-[250px] items-center rounded-md border-[1px] border-[hsl(var(--border))] pl-[10px] pr-[10px]"
							>
								{#if player}
									<PlayerHoverCard {player} showTitle={true} truncate={20} />
								{/if}
								<div class="ml-auto">
									{data.data.bracketResult[2 * index + j]
										? data.data.bracketResult[2 * index + j]
										: '-'}
								</div>
							</div>
						{/each}
					</div>
					<div class="w-[50px]">
						<div class="flex h-full items-center justify-center">
							<div class="relative h-full w-full">
								<div
									class="absolute left-0 top-[17.5px] h-[1px] w-[25px] bg-[hsl(var(--border))]"
								></div>
								<div
									class="absolute left-0 top-[62.5px] h-[1px] w-[25px] bg-[hsl(var(--border))]"
								></div>
								<div
									class="absolute left-[25px] top-[17.5px] h-[45px] w-[1px] bg-[hsl(var(--border))]"
								></div>
								<div
									class="absolute left-[25px] top-[40px] h-[1px] w-[25px] bg-[hsl(var(--border))]"
								></div>
							</div>
						</div>
					</div>
				</div>
			{/each}
		</div>
		<div class="flex flex-col gap-[70px]">
			{#each { length: 4 } as _, index}
				<div class="flex">
					<div class="flex flex-col gap-[60px]">
						{#each data.data.bracket.slice(16 + 2 * index, 16 + 2 * index + 2) as player, j}
							<div
								class="flex h-[35px] w-[250px] items-center rounded-md border-[1px] border-[hsl(var(--border))] pl-[10px] pr-[10px]"
							>
								{#if player}
									<PlayerHoverCard {player} showTitle={true} truncate={20} />
								{:else}
									<span class="opacity-50"> Unknown </span>
								{/if}
								<div class="ml-auto">
									{data.data.bracketResult[16 + 2 * index + j]
										? data.data.bracketResult[16 + 2 * index + j]
										: '-'}
								</div>
							</div>
						{/each}
					</div>
					<div class="w-[50px]">
						<div class="flex h-full items-center justify-center">
							<div class="relative h-full w-full">
								<div
									class="absolute left-0 top-[17.5px] h-[1px] w-[25px] bg-[hsl(var(--border))]"
								></div>
								<div
									class="absolute left-0 top-[113px] h-[1px] w-[25px] bg-[hsl(var(--border))]"
								></div>
								<div
									class="absolute left-[25px] top-[17.5px] h-[97px] w-[1px] bg-[hsl(var(--border))]"
								></div>
								<div
									class="absolute left-[25px] top-[67px] h-[1px] w-[25px] bg-[hsl(var(--border))]"
								></div>
							</div>
						</div>
					</div>
				</div>
			{/each}
		</div>
		<div class="flex flex-col gap-[170px]">
			{#each { length: 2 } as _, index}
				<div class="flex">
					<div class="flex flex-col gap-[160px]">
						{#each data.data.bracket.slice(16 + 8 + 2 * index, 16 + 8 + 2 * index + 2) as player, j}
							<div
								class="flex h-[35px] w-[250px] items-center rounded-md border-[1px] border-[hsl(var(--border))] pl-[10px] pr-[10px]"
							>
								{#if player}
									<PlayerHoverCard {player} showTitle={true} truncate={20} />
								{:else}
									<span class="opacity-50"> Unknown </span>
								{/if}
								<div class="ml-auto">
									{data.data.bracketResult[16 + 8 + 2 * index + j]
										? data.data.bracketResult[16 + 8 + 2 * index + j]
										: '-'}
								</div>
							</div>
						{/each}
					</div>
					<div class="w-[50px]">
						<div class="flex h-full items-center justify-center">
							<div class="relative h-full w-full">
								<div
									class="absolute left-0 top-[17.5px] h-[1px] w-[25px] bg-[hsl(var(--border))]"
								></div>
								<div
									class="absolute left-0 top-[212px] h-[1px] w-[25px] bg-[hsl(var(--border))]"
								></div>
								<div
									class="absolute left-[25px] top-[17.5px] h-[196px] w-[1px] bg-[hsl(var(--border))]"
								></div>
								<div
									class="absolute left-[25px] top-[117px] h-[1px] w-[25px] bg-[hsl(var(--border))]"
								></div>
							</div>
						</div>
					</div>
				</div>
			{/each}
		</div>
		<div class="flex flex-col">
			{#each { length: 1 } as _, index}
				<div class="flex">
					<div class="flex flex-col gap-[360px]">
						{#each data.data.bracket.slice(16 + 8 + 4 + 2 * index, 16 + 8 + 4 + 2 * index + 2) as player, j}
							<div
								class="flex h-[35px] w-[250px] items-center rounded-md border-[1px] border-[hsl(var(--border))] pl-[10px] pr-[10px]"
							>
								{#if player}
									<PlayerHoverCard {player} showTitle={true} truncate={20} />
								{:else}
									<span class="opacity-50"> Unknown </span>
								{/if}
								<div class="ml-auto">
									{data.data.bracketResult[16 + 8 + 4 + 2 * index + j]
										? data.data.bracketResult[16 + 8 + 4 + 2 * index + j]
										: '-'}
								</div>
							</div>
						{/each}
					</div>
					<div class="w-[50px]">
						<div class="flex h-full items-center justify-center">
							<div class="relative h-full w-full">
								<div
									class="absolute left-0 top-[17.5px] h-[1px] w-[25px] bg-[hsl(var(--border))]"
								></div>
								<div
									class="absolute left-0 top-[412px] h-[1px] w-[25px] bg-[hsl(var(--border))]"
								></div>
								<div
									class="absolute left-[25px] top-[17.5px] h-[396px] w-[1px] bg-[hsl(var(--border))]"
								></div>
								<div
									class="absolute left-[25px] top-[214px] h-[1px] w-[25px] bg-[hsl(var(--border))]"
								></div>
							</div>
						</div>
					</div>
				</div>
			{/each}
		</div>
		<div class="mt-[360px] flex flex-col gap-[250px]">
			<div class="flex flex-col">
				{#each { length: 1 } as _, index}
					<div class="flex flex-col gap-[360px]">
						{#each data.data.bracket.slice(16 + 8 + 4 + 2 + 2 * index, 16 + 8 + 4 + 2 + 2 * index + 1) as player, j}
							<div
								class="flex h-[35px] w-[250px] items-center rounded-md border-[1px] border-yellow-400 pl-[10px] pr-[10px]"
							>
								{#if player}
									<PlayerHoverCard {player} showTitle={true} truncate={20} />
								{:else}
									<span class="opacity-50"> Unknown </span>
								{/if}
							</div>
						{/each}
					</div>
				{/each}
			</div>
			<div class="flex flex-col">
				<p class="mb-[10px] text-center">3rd Place</p>
				{#each { length: 1 } as _, index}
					<div class="flex flex-col gap-[10px]">
						{#each data.data.bracket.slice(16 + 8 + 4 + 2 + 1 + 2 * index, 16 + 8 + 4 + 2 + 1 + 2 * index + 2) as player, j}
							<div
								class="flex h-[35px] w-[250px] items-center rounded-md border-[1px] border-[hsl(var(--border))] pl-[10px] pr-[10px]"
							>
								{#if player}
									<PlayerHoverCard {player} showTitle={true} truncate={20} />
								{:else}
									<span class="opacity-50"> Unknown </span>
								{/if}
								<div class="ml-auto">
									{data.data.bracketResult[16 + 8 + 4 + 2 + 1 + 2 * index + j]
										? data.data.bracketResult[16 + 8 + 4 + 2 + 1 + 2 * index + j]
										: '-'}
								</div>
							</div>
						{/each}
					</div>
				{/each}
			</div>
		</div>
	</div>
</div>
