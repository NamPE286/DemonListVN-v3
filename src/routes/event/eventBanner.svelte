<script lang="ts">
	import Clock from 'svelte-radix/Clock.svelte';
	import ExternalLink from 'svelte-radix/ExternalLink.svelte';
	import Star from 'svelte-radix/Star.svelte';

	export let data: any;

	function isEventStarted() {
		return new Date(data.start) <= new Date();
	}

	function getInterval(end: string | null) {
		if (!end) {
			return 'Permanent';
		}

		if (!isEventStarted()) {
			return `Start at ${new Date(data.start).toLocaleString('vi-vn')}`;
		}

		const second = (new Date(end).getTime() - new Date().getTime()) / 1000;

		if (second < 0) {
			return 'Expired';
		}

		const day = Math.floor(second / 86400);
		const hour = Math.floor((second - day * 86400) / 3600);

		return `${day}d ${hour}h`;
	}
</script>

<div class="p-1">
	<div class="promotion" style={`background-image: url('${data.imgUrl}')`}>
		<div class="promotionContent">
			<div class="flex gap-[10px]">
				<div class="period">
					<Clock size={16} />
					{getInterval(data.end)}
				</div>
				{#if data.isSupporterOnly}
					<div class="period">
						<Star size={16} />
						Supporter Only
					</div>
				{/if}
				{#if data.exp}
					<div class="period">
						{data.exp} EXP
					</div>
				{/if}
			</div>
			<h2>{data.title}</h2>
			{#if data.redirect}
				<a href={data.redirect} target="_blank">
					<div class="flex gap-[10px]">
						<ExternalLink />
						{data.redirect}
					</div>
				</a>
			{/if}
			<p class="desc">{data.description}</p>
		</div>
	</div>
</div>

<style lang="scss">
	.desc {
		width: 650px;
		max-width: 100%;
	}

	.promotion {
		border: 1px solid hsl(var(--border));
		border-radius: 10px;
		background-position: center;
		aspect-ratio: 40 / 10;
		background-size: cover;
		display: flex;
		flex-direction: column;
		overflow: hidden;
		color: white;
		min-height: 250px;
		max-width: 100%;

		.period {
			background-color: white;
			width: fit-content;
			padding-inline: 8px;
			color: black;
			font-weight: 600;
			text-shadow: none;
			border-radius: 10px;
			display: flex;
			align-items: center;
			gap: 5px;
			line-height: 0;
			padding-top: 3px;
			padding-bottom: 3px;
		}

		.promotionContent {
			margin-top: auto;
			height: 175px;
			padding: 21px;
			text-shadow: black 1px 0 10px;
		}

		h2 {
			font-weight: bold;
			font-size: 28px;
		}
	}
</style>