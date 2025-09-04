<script lang="ts">
import { onMount } from 'svelte';
import { Input } from '$lib/components/ui/input';
import { Button } from '$lib/components/ui/button';
import { Card, CardContent } from '$lib/components/ui/card';
import { Label } from '$lib/components/ui/label';
import LevelCard from '$lib/components/levelCard.svelte';

/** Level type for Demon/Featured/Platformer List. */
interface Level {
  dlTop?: number | null;
  flTop?: number | null;
  plTop?: number | null;
  [key: string]: unknown;
}

// State variables
let dlLevels: Level[] = [];
let flLevels: Level[] = [];
let plLevels: Level[] = [];
let currentLevel: Level | null = null;
let currentType: 'dl' | 'fl' | 'pl' = 'dl';
let finished = false;
let message = '';
let listType: 'all' | 'dl' | 'fl' | 'pl' = 'all';
let inputValue = '';
let targetPercent = 2;
let inputError = '';
let maxDlTop = 0;
let maxFlTop = 0;
let maxPlTop = 0;

// Range filter state
let rangeStart: number | '' = '';
let rangeEnd: number | '' = '';
let pendingRangeStart: number | '' = '';
let pendingRangeEnd: number | '' = '';

onMount(() => {
  void fetchLevelsFromApi();
});

/**
 * Fetch all levels from API with pagination.
 * @param endpoint API endpoint
 * @param sortBy Field to sort by
 * @returns Array of Level
 */
async function fetchAllLevels(endpoint: string, sortBy: string): Promise<Level[]> {
  const allLevels: Level[] = [];
  let start = 0;
  const pageSize = 100;
  while (true) {
    const end = start + pageSize - 1;
    const res = await fetch(`${endpoint}?start=${start}&end=${end}&sortBy=${sortBy}&ascending=false`);
    const json = (await res.json()) as { data?: Level[] } | Level[];
    const levels: Level[] = Array.isArray(json) ? json : (json.data || []);
    allLevels.push(...levels);
    if (levels.length < pageSize) break;
    start += pageSize;
  }
  return allLevels;
}

/**
 * Fetch Classic, Featured List, and Platformer levels, set max tops, and reset roulette.
 */
async function fetchLevelsFromApi(): Promise<void> {
  try {
    dlLevels = await fetchAllLevels('https://api.demonlistvn.com/list/dl', 'dlTop');
    flLevels = await fetchAllLevels('https://api.demonlistvn.com/list/fl', 'flTop');
    plLevels = await fetchAllLevels('https://api.demonlistvn.com/list/pl', 'dlTop');
    maxDlTop = dlLevels.reduce((max, lvl) => typeof lvl.dlTop === 'number' && lvl.dlTop > max ? lvl.dlTop : max, 0);
    maxFlTop = flLevels.reduce((max, lvl) => typeof lvl.flTop === 'number' && lvl.flTop > max ? lvl.flTop : max, 0);
    maxPlTop = plLevels.reduce((max, lvl) => typeof lvl.dlTop === 'number' && lvl.dlTop > max ? lvl.dlTop : max, 0);
    resetRoulette();
  } catch (error) {
    console.error('Error fetching levels from API:', error);
    message = 'Error loading levels from API.';
    finished = true;
  }
}

/**
 * Reset roulette state and fetch a new random level.
 */
function resetRoulette(): void {
  currentLevel = null;
  currentType = 'dl';
  inputValue = '';
  targetPercent = 2;
  finished = false;
  message = '';
  inputError = '';
  fetchRandomLevel();
}

/**
 * Apply the selected range and reset roulette.
 */
function applyRange(): void {
  rangeStart = pendingRangeStart;
  rangeEnd = pendingRangeEnd;
  resetRoulette();
}

/**
 * Filter levels by range and list type.
 * @param levels Array of Level
 * @param type 'dl', 'fl', or 'pl'
 * @returns Filtered levels
 */
function filterLevelsByRange(levels: Level[], type: 'dl' | 'fl' | 'pl'): Level[] {
  return levels.filter((l: Level) => {
    const top = type === 'dl' ? l.dlTop : type === 'fl' ? l.flTop : l.dlTop;
    if (rangeStart !== '' && (typeof top !== 'number' || top < Number(rangeStart))) return false;
    if (rangeEnd !== '' && (typeof top !== 'number' || top > Number(rangeEnd))) return false;
    return true;
  });
}

/**
 * Fetch a random level from the filtered list.
 */
async function fetchRandomLevel(): Promise<void> {
  if (finished) return;
  try {
    let levels: Level[] = [];
    let type: 'dl' | 'fl' | 'pl';
    if (listType === 'dl') {
      levels = dlLevels;
      type = 'dl';
      currentType = 'dl';
    } else if (listType === 'fl') {
      levels = flLevels;
      type = 'fl';
      currentType = 'fl';
    } else if (listType === 'pl') {
      levels = plLevels;
      type = 'pl';
      currentType = 'pl';
    } else {
      const random = Math.random();
      if (random < 0.5) {
        levels = dlLevels;
        type = 'dl';
        currentType = 'dl';
      } else {
        levels = flLevels;
        type = 'fl';
        currentType = 'fl';
      }
    }
    const filtered = filterLevelsByRange(levels, type);
    if (filtered.length === 0) {
      finished = true;
      message = 'No levels found!';
      return;
    }
    const randomIndex = Math.floor(Math.random() * filtered.length);
    currentLevel = filtered[randomIndex];
  } catch (error) {
    console.error('Error fetching random level:', error);
    finished = true;
    message = 'Error loading level. Please try again.';
  }
}

/**
 * Validate the input value for percentage.
 * @param val Input string
 * @returns True if valid
 */
function validateInput(val: string): boolean {
  if (targetPercent > 100) return false;
  if (val.trim() === '') {
    inputError = '';
    return false;
  }
  const num = Number(val);
  if (!/^[0-9]+$/.test(val) || isNaN(num) || !Number.isInteger(num)) {
    inputError = 'Please enter a valid integer.';
    return false;
  }
  if (targetPercent === 100 && num !== 100) {
    inputError = 'You must enter exactly 100% to finish!';
    return false;
  }
  if (targetPercent < 100 && num < targetPercent) {
    inputError = `You must enter at least ${targetPercent}%`;
    return false;
  }
  if (num > 100) {
    inputError = 'Maximum is 100%';
    return false;
  }
  inputError = '';
  return true;
}

/**
 * Handle input event for percentage.
 * @param e Input event
 */
function onInput(e: Event): void {
  inputValue = (e.target as HTMLInputElement).value;
  validateInput(inputValue);
}

/**
 * Handle completion of roulette step.
 */
async function doneRoulette(): Promise<void> {
  if (!validateInput(inputValue)) return;
  const num = Number(inputValue);
  if (num >= 100) {
    finished = true;
    currentLevel = null;
    message = '🎉 Congratulations! You have completed the Roulette!';
    return;
  }
  targetPercent = num + 1;
  inputValue = '';
  inputError = '';
  await fetchRandomLevel();
}

/**
 * Handle list type change and reset roulette.
 * @param type List type
 */
function handleListTypeChange(type: 'all' | 'dl' | 'fl' | 'pl'): void {
  listType = type;
  resetRoulette();
}
</script>

<div class="flex flex-col items-center min-h-screen dark:text-white text-black pb-10 px-2">
  <h1 class="text-5xl font-bold mt-16 mb-2 text-center">Roulette</h1>
  <div class="dark:text-zinc-300 text-zinc-700 text-lg text-center mb-8">
    A roulette will select any Extreme Demon for you to try with increasing minimum percentages<br>
    If you reach 100% minimum percentages then you have completed roulette
  </div>

  <div class="flex flex-col md:flex-row gap-6 md:gap-10 mt-6 items-start w-full max-w-5xl">
    <Card class="rounded-2xl shadow-xl min-w-[0] w-full max-w-[auto] md:max-w-[520px] flex flex-col items-center dark:bg-black bg-white mb-6 md:mb-0">
      <CardContent class="w-full flex-col items-center p-4 sm:p-8">
        {#if currentLevel}
          <LevelCard level={currentLevel} type={currentType} />
        {/if}
        {#if !currentLevel && !finished}
          <div class="h-[120px] sm:h-[220px] flex items-center justify-center dark:text-zinc-400 text-zinc-500 text-base sm:text-xl mb-4">Loading...</div>
        {/if}
        {#if finished}
          <div class="text-green-500 text-lg sm:text-xl font-bold my-4 sm:my-8 text-center">{message}</div>
        {/if}
        {#if !finished && currentLevel && targetPercent <= 100}
          <div class="flex flex-col items-center gap-2 mt-6 w-full">
            <Label for="percent" class="font-light dark:text-white text-black text-base sm:text-lg">Fill in the number in the box below</Label>
            <Input
              id="percent"
              class="w-28 sm:w-40 text-center text-base font-medium sm:text-lg dark:bg-black bg-white placeholder:dark:text-zinc-600 placeholder:text-zinc-400 dark:text-white text-black"
              type="text"
              inputmode="numeric"
              pattern="[0-9]*"
              placeholder={`At least ${targetPercent}%`}
              value={inputValue}
              on:input={onInput}
              autocomplete="off"
            />
            {#if inputError}
              <div class="text-red-500 text-xs sm:text-sm text-center mt-2">{inputError}</div>
            {/if}
          </div>
        {/if}
      </CardContent>
    </Card>
    <Card class="rounded-2xl shadow-xl min-w-[0] w-full max-w-[auto] md:max-w-[350px] flex flex-col items-center dark:bg-black bg-white">
      <CardContent class="w-full flex flex-col items-center p-4 sm:p-8 gap-3 sm:gap-5">
        <div class="dark:text-zinc-300 text-zinc-700 text-sm sm:text-base mb-1 text-center">
          Range: <b>#{(listType === 'all' || listType === 'dl') ? (dlLevels.length ? Math.min(...dlLevels.map(l => l.dlTop ?? Infinity)) : 1) : (listType === 'fl') ? (flLevels.length ? Math.min(...flLevels.map(l => l.flTop ?? Infinity)) : 1) : (plLevels.length ? Math.min(...plLevels.map(l => l.dlTop ?? Infinity)) : 1)} to {(listType === 'all' || listType === 'dl') ? (dlLevels.length ? Math.max(...dlLevels.map(l => l.dlTop ?? 0)) : 0) : (listType === 'fl') ? (flLevels.length ? Math.max(...flLevels.map(l => l.flTop ?? 0)) : 0) : (plLevels.length ? Math.max(...plLevels.map(l => l.dlTop ?? 0)) : 0)}</b>
        </div>
        <div class="flex items-center gap-2 mb-2 w-full justify-center">
          <Input class="w-24 sm:w-24 text-left text-sm sm:text-base dark:bg-black bg-white dark:text-white text-black" placeholder="From" type="number" min="1" bind:value={pendingRangeStart} />
          <span class="dark:text-zinc-400 text-zinc-500 text-lg">-</span>
          <Input class="w-24 sm:w-24 text-left text-sm sm:text-base dark:bg-black bg-white dark:text-white text-black" placeholder="To" type="number" min="1" bind:value={pendingRangeEnd} />
        </div>
        <div class="flex gap-2 mb-2 w-full justify-center flex-wrap">
          <Button variant={listType === 'all' ? 'default' : 'secondary'} class={listType === 'all' ? 'dark:bg-white bg-black dark:text-black text-white ' : 'dark:bg-black bg-white dark:text-white text-black '} on:click={() => handleListTypeChange('all')}>All</Button>
          <Button variant={listType === 'dl' ? 'default' : 'secondary'} class={listType === 'dl' ? 'dark:bg-white bg-black dark:text-black text-white ' : 'dark:bg-black bg-white dark:text-white text-black '} on:click={() => handleListTypeChange('dl')}>Classic</Button>
        <!-- <Button variant={listType === 'pl' ? 'default' : 'secondary'} class={listType === 'pl' ? 'dark:bg-white bg-black dark:text-black text-white ' : 'dark:bg-black bg-white dark:text-white text-black '} on:click={() => handleListTypeChange('pl')}>Platformer</Button> -->
          <Button variant={listType === 'fl' ? 'default' : 'secondary'} class={listType === 'fl' ? 'dark:bg-white bg-black dark:text-black text-white ' : 'dark:bg-black bg-white dark:text-white text-black '} on:click={() => handleListTypeChange('fl')}>Featured</Button>
        </div>
        <Button variant="secondary" class="w-full py-2 text-sm sm:text-base font-medium dark:bg-black bg-white dark:text-white text-black" on:click={applyRange} disabled={pendingRangeStart === rangeStart && pendingRangeEnd === rangeEnd}>Apply</Button>
        <Button class="w-full py-2 sm:py-3 text-base sm:text-lg font-medium mb-2 dark:bg-white bg-black dark:text-black text-white" on:click={doneRoulette} disabled={finished || targetPercent > 100 || !validateInput(inputValue)}>Start</Button>
        <Button variant="secondary" class="w-full py-2 text-sm sm:text-base font-medium dark:bg-black bg-white dark:text-white text-black" on:click={resetRoulette}>Reset</Button>
      </CardContent>
    </Card>
  </div>
</div>

<h1 class="text-lg font-medium text-center text-zinc-800">Created by vradient</h1>