<script lang="ts">
	import * as Tooltip from '$lib/components/ui/tooltip';

	let year: number = new Date().getFullYear();
	let data: number[] = Array(366).fill(0);

	function daysInMonth(year: number, month: number) {
		return new Date(year, month, 0).getDate();
	}

	function monthOffset(year: number, month: number) {
		let x = new Date(year, month, 1).getDay();
		return (x - 1 + 7) % 7;
	}

	function dayOfYear(year: number, month: number, date: number) {
		let x = new Date(year, 0, 1).getTime();
		let y = new Date(year, month, date).getTime();

		return Math.floor((y - x) / 86400000);
	}

    function getColor(x: number) {
        if(data[x] == 0) {
            return 'rgba(128, 128, 128, 0.2)'
        }

        let opacity = data[x] / 2500;
        opacity = Math.max(opacity, 0.1)
        opacity = Math.min(opacity, 1)

        console.log(opacity)

        return `rgba(0, 255, 0, ${opacity})`
    }
</script>

<div class="heatmapWrapper">
	{#each { length: 12 } as _, month}
		<div class="month">
			{#each { length: monthOffset(year, month) } as item}
				<div class="emptyCell" />
			{/each}
			{#each { length: daysInMonth(year, month + 1) } as item, date}
				<Tooltip.Root>
					<Tooltip.Trigger>
						<div class="cell" style={`background-color: ${getColor(dayOfYear(year, month, date + 1))}`} />
					</Tooltip.Trigger>
					<Tooltip.Content>
						<p>
							{new Date(year, month, date + 1).toLocaleDateString('en-IN')}
                            ({data[dayOfYear(year, month, date + 1)]} attempts)
						</p>
					</Tooltip.Content>
				</Tooltip.Root>
			{/each}
		</div>
	{/each}
</div>

<style lang="scss">
	.heatmapWrapper {
		display: flex;
		flex-wrap: wrap;
		gap: 15px;
	}
	.month {
		display: flex;
		flex-wrap: wrap;
		flex-direction: column;
		height: calc(16px * 7);
		width: fit-content;
		gap: 1px;
	}

	.cell {
		height: 15px;
		width: 15px;
		border-radius: 5px;
	}

	.emptyCell {
		height: 15px;
		width: 15px;
		border-radius: 5px;
	}
</style>
