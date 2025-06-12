<script lang="ts">
    import LevelCard from '$lib/components/levelCard.svelte';
    import { onMount } from 'svelte';
    import { Input } from '$lib/components/ui/input';
    import { Button } from '$lib/components/ui/button';

    const API_URL = 'https://api.demonlistvn.com';
    const SPIN_INTERVAL = 70;
    const SPIN_COUNT = 30;

    interface Level {
        id: number;
        name: string;
        creator: string;
        dlTop: number;
        thumbnail: string;
    }

    let result: Level | null = null;
    let spinning = false;
    let displayLevel: Level | null = null;
    let timer: number;
    let error: string | null = null;

    const emptyLevel: Level = {
        id: 0,
        name: 'Unknown',
        creator: 'Unknown',
        dlTop: 0,
        thumbnail: ''
    };

    let topFrom: number | null = null;
    let topTo: number | null = null;
    let minDlTop: number | null = null;
    let maxDlTop: number | null = null;

    let completionInput = 1;
    let showCongrats = false;
    let usedLevels: Level[] = [];
    let levelCardClickable = false;
    

        $: filteredLevels = usedLevels.filter(level => {
            if (topFrom !== null && topTo !== null) {
                return level.dlTop >= topFrom && level.dlTop <= topTo;
            }
            return true;
        });

    async function getRandomLevel(): Promise<Level | null> {
        try {
            const params = new URLSearchParams({
                count: '1'
            });

            if (topFrom !== null && topTo !== null) {
                params.append('dlTopRange', `${topFrom}-${topTo}`);
            }

            const response = await fetch(`${API_URL}/level/random?${params}`);
            if (!response.ok) {
                throw new Error('Failed to get random level');
            }

            const level = await response.json();
            return level;
        } catch (e) {
            error = e instanceof Error ? e.message : 'Failed to get random level';
            return null;
        }
    }

    async function spinRoulette(): Promise<void> {
        if (spinning) {
            return;
        }

        spinning = true;
        result = null;
        let count = 0;
        levelCardClickable = true;

        timer = window.setInterval(async () => {
            try {
                const random = await getRandomLevel();
                if (random) {
                    displayLevel = random;
                }
                count++;

                if (count > SPIN_COUNT) {
                    window.clearInterval(timer);
                    if (random) {
                        result = random;
                        displayLevel = random;
                        if (!usedLevels.some(u => u.id === random.id)) {
                            usedLevels = [...usedLevels, random];
                        }
                    }
                    spinning = false;

                    if (completionInput < 102) {
                        completionInput = Math.min(102, completionInput + 1);
                    }

                    if (completionInput >= 102) {
                        showCongrats = true;
                    }
                }
            } catch (e) {
                error = e instanceof Error ? e.message : 'Error during spin';
                window.clearInterval(timer);
                spinning = false;
            }
        }, SPIN_INTERVAL);
    }

    async function skipRoulette(): Promise<void> {
        if (spinning) {
            return;
        }

        spinning = true;
        result = null;
        let count = 0;

        timer = window.setInterval(async () => {
            try {
                const random = await getRandomLevel();
                if (random) {
                    displayLevel = random;
                }
                count++;

                if (count > SPIN_COUNT) {
                    window.clearInterval(timer);
                    if (random) {
                        result = random;
                        displayLevel = random;
                        if (!usedLevels.some(u => u.id === random.id)) {
                            usedLevels = [...usedLevels, random];
                        }
                    }
                    spinning = false;
                }
            } catch (e) {
                error = e instanceof Error ? e.message : 'Error during skip';
                window.clearInterval(timer);
                spinning = false;
            }
        }, SPIN_INTERVAL);
    }

    onMount(async () => {
        try {
            const initialLevel = await getRandomLevel();
            if (initialLevel) {
                displayLevel = initialLevel;
                result = initialLevel;
            }
        } catch (e) {
            error = e instanceof Error ? e.message : 'Failed to load initial level';
        }
    });
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
                on:change={() => { result = null; }}
            />
            <span>-</span>
            <Input
                type="number"
                min={minDlTop ?? 1}
                max={maxDlTop ?? 9999}
                bind:value={topTo}
                class="w-[6rem]"
                placeholder="To"
                on:change={() => { result = null; }}
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