<script lang="ts">
    import supabase from '$lib/client/supabase';
    import LevelCard from '$lib/components/levelCard.svelte';
    import { onMount } from 'svelte';
    import { Input } from '$lib/components/ui/input';
    import { Button } from '$lib/components/ui/button';

    let levels: any[] = [];
    let filteredLevels: any[] = [];
    let result: any = null;
    let spinning = false;
    let displayLevel: any = null;
    let timer: any;
    let error: string | null = null;

    let topFrom: number | null = null;
    let topTo: number | null = null;

    let completionInput = 1;
    let showCongrats = false;

    let usedLevels: any[] = [];
    let levelCardClickable = false;

    let minDlTop: number | null = null;
    let maxDlTop: number | null = null;

    onMount(async () => {
        const { data, error: err } = await supabase.from('levels').select('*');
        if (err) {
            error = 'Failed to load level list!';
        } else {
            levels = (data ?? []).filter(lv => lv.dlTop !== undefined && lv.dlTop !== null);
            if (levels.length > 0) {
                minDlTop = Math.min(...levels.map(lv => lv.dlTop));
                maxDlTop = Math.max(...levels.map(lv => lv.dlTop));
                const random = levels[Math.floor(Math.random() * levels.length)];
                displayLevel = random;
                result = random;
            }
            filterByRange();
        }
    });

    function filterByRange() {
        if (topFrom == null || topTo == null) {
            filteredLevels = levels.filter(
                lv => lv.dlTop && !usedLevels.some(u => u.id === lv.id)
            );
            return;
        }
        filteredLevels = levels.filter(
            lv =>
                lv.dlTop &&
                topFrom !== null && topTo !== null &&
                lv.dlTop >= topFrom && lv.dlTop <= topTo &&
                !usedLevels.some(u => u.id === lv.id)
        );
    }

    function spinRoulette() {
        filterByRange();
        if (!filteredLevels.length) return;
        spinning = true;
        result = null;
        let count = 0;
        timer = setInterval(() => {
            const random = filteredLevels[Math.floor(Math.random() * filteredLevels.length)];
            displayLevel = random;
            count++;
            if (count > 20) {
                clearInterval(timer);
                result = random;
                displayLevel = random;
                spinning = false;
                if (random && !usedLevels.some(u => u.id === random.id)) {
                    usedLevels.push(random);
                }
                if (completionInput < 102) {
                    completionInput = Math.min(102, Number(completionInput) + 1);
                }
                if (completionInput >= 102) {
                    showCongrats = true;
                }
                filterByRange();
            }
        }, 80);
    }

    function skipRoulette() {
        if (!filteredLevels.length) return;
        spinning = true;
        result = null;
        let count = 0;
        timer = setInterval(() => {
            const random = filteredLevels[Math.floor(Math.random() * filteredLevels.length)];
            displayLevel = random;
            count++;
            if (count > 20) {
                clearInterval(timer);
                result = random;
                displayLevel = random;
                spinning = false;
                if (random && !usedLevels.some(u => u.id === random.id)) {
                    usedLevels.push(random);
                }
                filterByRange();
            }
        }, 80);
    }

    const emptyLevel = {
        name: 'Unknown',
        dlTop: 'N/A',
        creator: 'Unknown',
        thumbnail: '<thumbnail_url>',
    };
</script>

<div class="pt-[9rem] pb-[3rem]">
    <h1 class="text-6xl font-bold text-center">Roulette</h1>
    <p class="text-[1.25rem] font-normal text-[#9b9b9b] text-center mb-1 pt-[1rem]">
        A roulette will select any Extreme Demon for you to try with increasing minimum percentages
    </p>
    <p class="text-[1.25rem] font-normal text-[#9b9b9b] text-center">
        If you reach 100% minimum percentages then you have completed roulette
    </p>
</div>
<div class="roulette-flex">
    <div class="roulette-left">
        {#if showCongrats}
            <div class="congrats flex flex-col items-center justify-center text-center">
                <h2 class="text-2xl font-bold text-white mb-4">Congratulations!</h2>
                <p class="mb-2">You have completed Demon List VN roulette.</p>
            </div>
        {:else if filteredLevels.length === 0 && usedLevels.length > 0}
            <div class="congrats flex flex-col items-center justify-center text-center">
                <h2 class="text-2xl font-bold text-white mb-4">Oops!</h2>
                <p class="mb-2">There are no levels left in this range.</p>
            </div>
        {:else}
            <LevelCard
                level={
                    spinning
                        ? (displayLevel ?? emptyLevel)
                        : (result ?? emptyLevel)
                }
                type="dl"
            />
            {#if result}
                <div class="mt-4 flex items-center gap-2">
                    <span class="font-semibold">Minimum % to be achieved:</span>
                    <Input
                        type="number"
                        min="0"
                        max="100"
                        bind:value={completionInput}
                        class="w-[5rem]"
                    />
                </div>
            {/if}
        {/if}
    </div>
    <div class="roulette-right">
        {#if minDlTop !== null && maxDlTop !== null}
            <div class="mb-2 text-sm text-gray-400">
                Demon List range: <span class="font-semibold text-white">#{minDlTop}</span> to <span class="font-semibold text-white">#{maxDlTop}</span>
            </div>
        {/if}
        <div class="flex gap-4 items-center">
            <Input
                type="number"
                min={minDlTop ?? 1}
                max={maxDlTop ?? 9999}
                bind:value={topFrom}
                class="w-[6rem]"
                placeholder="From"
                on:change={() => { filterByRange(); result = null; }}
            />
            <span>-</span>
            <Input
                type="number"
                min={minDlTop ?? 1}
                max={maxDlTop ?? 9999}
                bind:value={topTo}
                class="w-[6rem]"
                placeholder="To"
                on:change={() => { filterByRange(); result = null; }}
            />
        </div>
        <Button on:click={spinRoulette} disabled={spinning} class="spin-btn">
            {spinning ? "Spinning..." : "Start"}
        </Button>
        {#if levelCardClickable && !showCongrats && filteredLevels.length > 0}
            <Button on:click={skipRoulette} class="spin-btn mt-2" variant="outline">
                Skip
            </Button>
        {/if}
        {#if error}
            <p class="error">{error}</p>
        {/if}
        {#if !filteredLevels.length && !error && usedLevels.length === 0}
            <p class="text-gray-400 mt-2">No levels in this range.</p>
        {/if}
    </div>
</div>

<style lang="scss">
.roulette-flex {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 30px;
    min-height: 40vh;
}
.roulette-left {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-width: 250px;
    min-height: 180px;
}
.roulette-right {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 18px;
}
.error {
    color: #ef4444;
    margin-top: 8px;
}
.congrats {
    padding: 16px;
    border-radius: 8px;
    background-color: #09090b;
    border: 1px solid #27272a;
}
@media (max-width: 900px) {
    .roulette-flex {
        flex-direction: column;
        gap: 24px;
    }
    .roulette-left, .roulette-right {
        min-width: unset;
    }
}
</style>