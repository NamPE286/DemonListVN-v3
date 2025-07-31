<script lang="ts">
import { onMount } from 'svelte';
import LevelCard from '$lib/components/levelCard.svelte';
import supabase from '$lib/client/supabase';
import { Input } from '$lib/components/ui/input';
import { Button } from '$lib/components/ui/button';
import { Card, CardContent } from '$lib/components/ui/card';
import { Label } from '$lib/components/ui/label';

let rangeStart: number | '' = '';
let rangeEnd: number | '' = '';
let allLevels: any[] = [];
let availableLevels: any[] = [];
let currentLevel: any = null;
let currentType: 'dl' | 'fl' = 'dl';
let finished = false;
let message = '';
let listType: 'all' | 'dl' | 'fl' = 'all';
let inputValue = '';
let targetPercent = 2;
let inputError = '';
let pendingRangeStart: number | '' = '';
let pendingRangeEnd: number | '' = '';

onMount(fetchLevels);

async function fetchLevels() {
  let query = supabase.from('levels').select('*').eq('accepted', true).eq('isNonList', false).eq('isPlatformer', false);
  const { data, error } = await query;
  if (!error && data) {
    allLevels = data;
    resetRoulette();
  }
}

function resetRoulette() {
  availableLevels = allLevels.filter(l => {
    if (listType === 'dl' && (l.dlTop === null || l.dlTop === undefined)) return false;
    if (listType === 'fl' && (l.flTop === null || l.flTop === undefined)) return false;
    let top = getLevelTop(l);
    if (rangeStart !== '' && top < +rangeStart) return false;
    if (rangeEnd !== '' && top > +rangeEnd) return false;
    return true;
  });
  currentLevel = null;
  currentType = 'dl';
  inputValue = '';
  targetPercent = 2;
  finished = false;
  message = '';
  inputError = '';
  pendingRangeStart = rangeStart;
  pendingRangeEnd = rangeEnd;
  if (availableLevels.length > 0) {
    const idx = Math.floor(Math.random() * availableLevels.length);
    currentLevel = availableLevels[idx];
    currentType = getLevelType(currentLevel);
    availableLevels.splice(idx, 1);
  }
}

function getLevelTop(level: any) {
  if (listType === 'dl') return level.dlTop ?? 0;
  if (listType === 'fl') return level.flTop ?? 0;
  return level.dlTop ?? level.flTop ?? 0;
}

function getLevelType(level: any): 'dl' | 'fl' {
  if (listType === 'dl') return 'dl';
  if (listType === 'fl') return 'fl';
  return (level.dlTop !== null && level.dlTop !== undefined) ? 'dl' : 'fl';
}

function validateInput(val: string) {
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

function onInput(e: Event) {
  inputValue = (e.target as HTMLInputElement).value;
  validateInput(inputValue);
}

function doneRoulette() {
  if (!validateInput(inputValue)) return;
  const num = Number(inputValue);
  if (num >= 100) {
    finished = true;
    currentLevel = null;
    message = '🎉 Congratulations! You have completed the Roulette!';
    return;
  }
  if (availableLevels.length === 0) {
    finished = true;
    message = '🎉 Congratulations! You have completed the Roulette!';
    currentLevel = null;
    return;
  }
  const idx = Math.floor(Math.random() * availableLevels.length);
  currentLevel = availableLevels[idx];
  currentType = getLevelType(currentLevel);
  availableLevels.splice(idx, 1);
  targetPercent = num + 1;
  inputValue = '';
  inputError = '';
}

function handleListTypeChange(type: 'all' | 'dl' | 'fl') {
  listType = type;
  resetRoulette();
}

function applyRange() {
  rangeStart = pendingRangeStart;
  rangeEnd = pendingRangeEnd;
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
      <CardContent class="w-full flex flex-col items-center p-4 sm:p-8">
        {#if currentLevel}
          <LevelCard level={currentLevel} type={currentType} />
        {/if}
        {#if !currentLevel && !finished}
          <div class="h-[120px] sm:h-[220px] flex items-center justify-center dark:text-zinc-400 text-zinc-500 text-base sm:text-xl mb-4">Loading...</div>
        {/if}
        {#if finished}
          <div class="text-yellow-400 text-lg sm:text-2xl font-bold my-4 sm:my-8 text-center">{message}</div>
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
        <div class="dark:text-zinc-300 text-zinc-700 text-sm sm:text-base mb-1 text-center">Demon List range: <b>#{allLevels.length ? Math.min(...allLevels.map(getLevelTop)) : 1} to #{allLevels.length ? Math.max(...allLevels.map(getLevelTop)) : 0}</b></div>
        <div class="flex items-center gap-2 mb-2 w-full justify-center">
          <Input class="w-24 sm:w-24 text-left text-sm sm:text-base dark:bg-black bg-white dark:text-white text-black" placeholder="From" type="number" min="1" bind:value={pendingRangeStart} />
          <span class="dark:text-zinc-400 text-zinc-500 text-lg">-</span>
          <Input class="w-24 sm:w-24 text-left text-sm sm:text-base dark:bg-black bg-white dark:text-white text-black" placeholder="To" type="number" min="1" bind:value={pendingRangeEnd} />
        </div>
        <Button variant="secondary" class="w-full py-2 text-sm sm:text-base font-medium dark:bg-black bg-white dark:text-white text-black" on:click={applyRange} disabled={pendingRangeStart === rangeStart && pendingRangeEnd === rangeEnd}>Apply</Button>
        <div class="flex gap-2 mb-2 w-full justify-center flex-wrap">
          <Button variant={listType === 'all' ? 'default' : 'secondary'} class={listType === 'all' ? 'dark:bg-white bg-black dark:text-black text-white ' : 'dark:bg-black bg-white dark:text-white text-black '} on:click={() => handleListTypeChange('all')}>All</Button>
          <Button variant={listType === 'dl' ? 'default' : 'secondary'} class={listType === 'dl' ? 'dark:bg-white bg-black dark:text-black text-white ' : 'dark:bg-black bg-white dark:text-white text-black '} on:click={() => handleListTypeChange('dl')}>Demon List</Button>
          <Button variant={listType === 'fl' ? 'default' : 'secondary'} class={listType === 'fl' ? 'dark:bg-white bg-black dark:text-black text-white ' : 'dark:bg-black bg-white dark:text-white text-black '} on:click={() => handleListTypeChange('fl')}>Featured List</Button>
        </div>
        <Button class="w-full py-2 sm:py-3 text-base sm:text-lg font-medium mb-2 dark:bg-white bg-black dark:text-black text-white" on:click={doneRoulette} disabled={finished || targetPercent > 100 || !validateInput(inputValue)}>Start</Button>
        <Button variant="secondary" class="w-full py-2 text-sm sm:text-base font-medium dark:bg-black bg-white dark:text-white text-black" on:click={resetRoulette}>Reset</Button>
      </CardContent>
    </Card>
  </div>
</div>

<h1 class="text-lg font-medium text-center text-zinc-800">Created by vradient</h1>
