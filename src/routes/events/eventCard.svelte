<script lang="ts">
	import {
		Card,
		CardContent,
		CardDescription,
		CardHeader,
		CardTitle
	} from '$lib/components/ui/card';
	import { Badge } from '$lib/components/ui/badge';
	import { Calendar, Clock, Star } from 'svelte-radix';
    import { _ } from 'svelte-i18n';

	export let event: any;

	function formatDate(dateString: string) {
		return new Date(dateString).toLocaleDateString('vi-VN');
	}

	function formatTime(dateString: string) {
		return new Date(dateString).toLocaleTimeString('vi-VN', {
			hour: '2-digit',
			minute: '2-digit'
		});
	}
</script>

<Card class="w-full">
	<CardHeader>
		<div class="flex items-start justify-between">
			<div class="flex-1">
				<CardTitle class="text-lg">{event.title}</CardTitle>
				<CardDescription class="mt-1">{event.description}</CardDescription>
			</div>
			<div class="ml-2 flex flex-col gap-1">
				{#if event.isContest}
					<Badge variant="default" class="w-[90px] flex justify-center hover:bg-primary hover:text-primary-foreground">
						{$_('events.contest')}
					</Badge>
				{/if}
				{#if event.isSupporterOnly}
					<Badge variant="secondary" class="w-[90px] flex justify-center">
						<Star class="mr-1 h-3 w-3" />
						Supporter
					</Badge>
				{/if}
				{#if event.isRanked}
					<Badge variant="outline" class="w-[90px] flex justify-center">{$_('events.ranked')}</Badge>
				{/if}
			</div>
		</div>
	</CardHeader>
	<CardContent>
		<!-- Event Image -->
		<div class="mb-4">
			<img
				src={event.imgUrl || `https://cdn.demonlistvn.com/event-banner/${event.id}.webp`}
				alt={event.title}
				class="w-full aspect-[4/1] object-cover rounded-md"
				loading="lazy"
			/>
		</div>
		<div class="space-y-2 text-sm text-muted-foreground">
			<div class="flex items-center gap-2">
				<Calendar class="h-4 w-4" />
				<span>{formatDate(event.start)}</span>
			</div>
			<div class="flex items-center gap-2">
				<Clock class="h-4 w-4" />
				<span>{formatTime(event.start)} - {formatTime(event.end)}</span>
			</div>
			{#if event.minExp > 0}
				<div class="text-xs">
					Minimum EXP: <span class="font-medium">{event.minExp}</span>
				</div>
			{/if}
		</div>
	</CardContent>
</Card>
