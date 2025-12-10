<script lang="ts">
	import PlayerCard from '$lib/components/playerCard.svelte';
	import { Badge } from '$lib/components/ui/badge';
	import { Star } from 'lucide-svelte';

	interface Props {
		buyer: any;
		rank: number;
	}

	let { buyer, rank }: Props = $props();

	function formatAmount(amount: number): string {
		return new Intl.NumberFormat('vi-VN', {
			style: 'currency',
			currency: 'VND'
		}).format(amount);
	}

	function getRankColor(rank: number): string {
		if (rank === 1) return 'text-yellow-500';
		if (rank === 2) return 'text-gray-400';
		if (rank === 3) return 'text-amber-600';
		return 'text-foreground/60';
	}

	function getRankBadgeVariant(rank: number): 'default' | 'secondary' | 'outline' {
		if (rank === 1) return 'default';
		if (rank === 2) return 'secondary';
		return 'outline';
	}
</script>

<div class="relative">
	<div class="flex items-center gap-2 mb-[10px]">
		<Badge
			variant={getRankBadgeVariant(rank)}
			class={`${getRankColor(rank)} flex items-center gap-1 text-base font-bold`}
		>
			{#if rank <= 3}
				<Star class="h-4 w-4" />
			{/if}
			#{rank}
		</Badge>
		<Badge variant="default" class="bg-green-600 text-white hover:bg-green-700">
			{formatAmount(buyer.totalAmount)}
		</Badge>
	</div>
	<PlayerCard player={buyer.player} />
</div>
