<script lang="ts">
	import MagnifyingGlass from 'svelte-radix/MagnifyingGlass.svelte';
	import Calendar from 'svelte-radix/Calendar.svelte';
	import Star from 'svelte-radix/Star.svelte';
	import MixerHorizontal from 'svelte-radix/MixerHorizontal.svelte';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { Switch } from '$lib/components/ui/switch';
	import { Card, CardContent, CardHeader, CardTitle } from '$lib/components/ui/card';
	import { Separator } from '$lib/components/ui/separator';

	let search = '';
	let isContest = false;
	let hasRanking = false;
	let startDate = '';
	let endDate = '';
	let isExpanded = false;
</script>

<Card class="w-full">
	<CardHeader class="pb-4">
		<div class="flex items-center justify-between">
			<CardTitle class="flex items-center gap-2">
				<MixerHorizontal class="h-5 w-5" />
				Bộ lọc sự kiện
			</CardTitle>
			<Button
				on:click={() => {
					isExpanded = !isExpanded;
				}}
				variant="ghost"
				size="sm"
			>
				{isExpanded ? 'Thu gọn' : 'Mở rộng'}
			</Button>
		</div>
	</CardHeader>

	<CardContent class="space-y-4">
		<!-- Search Bar -->
		<div class="relative">
			<MagnifyingGlass
				class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
			/>
			<Input type="text" placeholder="Tìm kiếm sự kiện..." value={search} class="pl-10" />
		</div>

		{#if isExpanded}
			<Separator />

			<div class="grid gap-4 md:grid-cols-2">
				<!-- Contest Filter -->
				<div class="space-y-3">
					<Label class="text-sm font-medium">Loại sự kiện</Label>
					<div class="space-y-2">
						<div class="flex items-center space-x-2">
							<input
								type="radio"
								id="all-events"
								name="contest-filter"
								value="all"
								checked={isContest}
								class="h-4 w-4"
							/>
							<Label for="all-events" class="text-sm">Tất cả</Label>
						</div>
						<div class="flex items-center space-x-2">
							<input
								type="radio"
								id="contest-only"
								name="contest-filter"
								value="contest"
								checked={isContest}
								class="h-4 w-4"
							/>
							<Label for="contest-only" class="text-sm">Chỉ contest</Label>
						</div>
						<div class="flex items-center space-x-2">
							<input
								type="radio"
								id="non-contest"
								name="contest-filter"
								value="non-contest"
								checked={isContest}
								class="h-4 w-4"
							/>
							<Label for="non-contest" class="text-sm">Không phải contest</Label>
						</div>
					</div>
				</div>

				<!-- Ranking Filter (only for contests) -->
				<div class="space-y-3">
					<Label class="flex items-center gap-2 text-sm font-medium">
						<Star class="h-4 w-4" />
						Xếp hạng (Contest)
					</Label>
					<div class="space-y-2">
						<div class="flex items-center space-x-2">
							<input
								type="radio"
								id="all-ranking"
								name="ranking-filter"
								value="all"
								checked={hasRanking}
								disabled={!isContest}
								class="h-4 w-4"
							/>
							<Label
								for="all-ranking"
								class={`text-sm ${isContest ? 'text-muted-foreground' : ''}`}
							>
								Tất cả
							</Label>
						</div>
						<div class="flex items-center space-x-2">
							<input
								type="radio"
								id="has-ranking"
								name="ranking-filter"
								value="has-ranking"
								class="h-4 w-4"
							/>
							<Label
								for="has-ranking"
								class={`text-sm ${isContest === false ? 'text-muted-foreground' : ''}`}
							>
								Có xếp hạng
							</Label>
						</div>
						<div class="flex items-center space-x-2">
							<input
								type="radio"
								id="no-ranking"
								name="ranking-filter"
								value="no-ranking"
								class="h-4 w-4"
							/>
							<Label
								for="no-ranking"
								class={`text-sm ${isContest === false ? 'text-muted-foreground' : ''}`}
							>
								Không có xếp hạng
							</Label>
						</div>
					</div>
				</div>
			</div>

			<Separator />

			<div class="space-y-3">
				<Label class="flex items-center gap-2 text-sm font-medium">
					<Calendar class="h-4 w-4" />
					Thời gian
				</Label>
				<div class="grid gap-3 md:grid-cols-2">
					<div class="space-y-2">
						<Label for="start-date" class="text-xs text-muted-foreground">Ngày bắt đầu</Label>
						<Input id="start-date" type="date" value={startDate} class="text-sm" />
					</div>
					<div class="space-y-2">
						<Label for="end-date" class="text-xs text-muted-foreground">Ngày kết thúc</Label>
						<Input id="end-date" type="date" value={endDate} class="text-sm" />
					</div>
				</div>
			</div>
			<div class="flex justify-end gap-2">
				<Button variant="outline" size="sm">Xóa bộ lọc</Button>
				<Button size="sm">Áp dụng</Button>
			</div>
		{/if}
	</CardContent>
</Card>

<style>
	:global(.text-muted-foreground) {
		opacity: 0.5;
	}
</style>
