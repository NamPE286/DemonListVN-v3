<script lang="ts">
	import MagnifyingGlass from 'svelte-radix/MagnifyingGlass.svelte';
	import Calendar from 'svelte-radix/Calendar.svelte';
	import Star from 'svelte-radix/Star.svelte';
	import MixerHorizontal from 'svelte-radix/MixerHorizontal.svelte';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { Card, CardContent, CardHeader, CardTitle } from '$lib/components/ui/card';
	import { Separator } from '$lib/components/ui/separator';
    import { _ } from 'svelte-i18n';
	import { onMount } from 'svelte';

	let search = '';
	let isContest = false;
	let hasRanking = false;
	let startDate = '';
	let endDate = '';
	let isExpanded = false;
	
	
	onMount(() => {
		const checkWidth = () => {
			isExpanded = window.innerWidth >= 1024;
		};
		
		checkWidth();
		window.addEventListener('resize', checkWidth);
		
		return () => {
			window.removeEventListener('resize', checkWidth);
		};
	});
</script>

<Card class="w-full">
	<CardHeader class="pb-4">
		<div class="flex items-center justify-between">
			<CardTitle class="flex items-center gap-2">
				<MixerHorizontal class="h-5 w-5" />
				{$_('event_filter.title')}
			</CardTitle>
			<Button
				on:click={() => {
					isExpanded = !isExpanded;
				}}
				variant="ghost"
				size="sm"
			>
				{isExpanded ? $_('event_filter.collapse') : $_('event_filter.expand')}
			</Button>
		</div>
	</CardHeader>

	<CardContent class="space-y-4">
		<div class="relative">
			<MagnifyingGlass
				class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
			/>
			<Input type="text" placeholder={$_('event_filter.search_placeholder')} value={search} class="pl-10" />
		</div>

		{#if isExpanded}
			<Separator />

			<div class="grid gap-4 lg:grid-cols-1 md:grid-cols-2">
				<div class="space-y-3">
					<Label class="text-sm font-medium">{$_('event_filter.event_type')}</Label>
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
							<Label for="all-events" class="text-sm">{$_('event_filter.all_events')}</Label>
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
							<Label for="contest-only" class="text-sm">{$_('event_filter.contest_only')}</Label>
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
							<Label for="non-contest" class="text-sm">{$_('event_filter.non_contest')}</Label>
						</div>
					</div>
				</div>

				<div class="space-y-3">
					<Label class="flex items-center gap-2 text-sm font-medium">
						<Star class="h-4 w-4" />
						{$_('event_filter.ranking')}
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
								{$_('event_filter.all_ranking')}
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
								{$_('event_filter.has_ranking')}
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
								{$_('event_filter.no_ranking')}
							</Label>
						</div>
					</div>
				</div>
			</div>

			<Separator />

			<div class="space-y-3">
				<Label class="flex items-center gap-2 text-sm font-medium">
					<Calendar class="h-4 w-4" />
					{$_('event_filter.time_period')}
				</Label>
				<div class="grid gap-3 lg:grid-cols-1 md:grid-cols-2">
					<div class="space-y-2">
						<Label for="start-date" class="text-xs text-muted-foreground">{$_('event_filter.start_date')}</Label>
						<Input id="start-date" type="date" value={startDate} class="text-sm" />
					</div>
					<div class="space-y-2">
						<Label for="end-date" class="text-xs text-muted-foreground">{$_('event_filter.end_date')}</Label>
						<Input id="end-date" type="date" value={endDate} class="text-sm" />
					</div>
				</div>
			</div>

			<div class="flex justify-end gap-2">
				<Button variant="outline" size="sm">{$_('event_filter.clear_filters')}</Button>
				<Button size="sm">{$_('event_filter.apply')}</Button>
			</div>
		{:else}
			<div class="flex justify-end">
				<Button size="sm">{$_('event_filter.apply')}</Button>
			</div>
		{/if}
	</CardContent>
</Card>