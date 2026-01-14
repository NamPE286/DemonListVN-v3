<script lang="ts">
import { onMount } from 'svelte';
import { Input } from '$lib/components/ui/input';
import { Button } from '$lib/components/ui/button';
import { Card, CardContent } from '$lib/components/ui/card';
import { Label } from '$lib/components/ui/label';

interface Level {
  readonly id?: number;
  readonly name?: string;
  readonly dlTop?: number | null;
  readonly flTop?: number | null;
  readonly plTop?: number | null;
  readonly isPlatformer?: boolean;
  readonly videoID?: string;
  readonly creator?: string;
  readonly [key: string]: unknown;
}

// Game state
let currentLevel: Level | null = null;
let currentType: 'dl' | 'fl' = 'dl';
let listType: 'all' | 'dl' | 'fl' = 'all';
let loading = false;
let inputValue = '';
let showResult = false;
let isCorrect = false;
let score = 0;
let streak = 0;
let bestStreak = 0;
let totalGuesses = 0;
let message = '';

// Range filter state
let rangeStart: number | '' = '';
let rangeEnd: number | '' = '';
let pendingRangeStart: number | '' = '';
let pendingRangeEnd: number | '' = '';

// Cache for max values
let maxDlTop = 0;
let maxFlTop = 0;
let isMaxValuesLoaded = false;

const MAX_RETRY_ATTEMPTS = 50;
const CACHE_BUSTER_PARAM = '_';

/**
 * Extracts level data from various API response formats.
 */
function extractLevelFromRandomResponse(json: unknown): Level | null {
  if (!json) return null;
  
  const jsonObj = json as Record<string, unknown>;
  
  if (jsonObj.data && !Array.isArray(jsonObj.data) && typeof jsonObj.data === 'object') {
    return jsonObj.data as Level;
  }
  
  if (jsonObj.data && Array.isArray(jsonObj.data) && jsonObj.data.length > 0) {
    return jsonObj.data[0] as Level;
  }
  
  if (typeof json === 'object' && !Array.isArray(json)) {
    return json as Level;
  }
  
  return null;
}

/**
 * Safely parses JSON response with fallback error handling.
 */
async function safeJsonParse(response: Response): Promise<unknown> {
  try {
    return await response.json();
  } catch {
    try {
      const text = await response.text();
      return text ? JSON.parse(text) : null;
    } catch {
      return null;
    }
  }
}

/**
 * Fetches max values for range display from API endpoints.
 */
async function fetchMaxValues(): Promise<void> {
  if (isMaxValuesLoaded) return;
  
  try {
    const [dlResponse, flResponse] = await Promise.all([
      fetch('https://api.demonlistvn.com/list/dl?start=0&end=0&sortBy=dlTop&ascending=false'),
      fetch('https://api.demonlistvn.com/list/fl?start=0&end=0&sortBy=flTop&ascending=false'),
    ]);

    const [dlData, flData] = await Promise.all([
      safeJsonParse(dlResponse),
      safeJsonParse(flResponse),
    ]);

    const dlLevels = Array.isArray(dlData) ? dlData : ((dlData as {data?: Level[]})?.data ?? []);
    const flLevels = Array.isArray(flData) ? flData : ((flData as {data?: Level[]})?.data ?? []);

    maxDlTop = dlLevels.length > 0 ? (dlLevels[0].dlTop ?? 1000) : 1000;
    maxFlTop = flLevels.length > 0 ? (flLevels[0].flTop ?? 1000) : 1000;
    
    isMaxValuesLoaded = true;
  } catch (error) {
    console.error('Error fetching max values:', error);
    maxDlTop = 1000;
    maxFlTop = 1000;
    isMaxValuesLoaded = true;
  }
}

/**
 * Determines the list type for random selection based on current settings.
 */
function determineRandomListType(): 'dl' | 'fl' {
  if (listType === 'dl') return 'dl';
  if (listType === 'fl') return 'fl';
  
  const choices: readonly ('dl' | 'fl')[] = ['dl', 'fl'] as const;
  return choices[Math.floor(Math.random() * choices.length)];
}

/**
 * Checks if a level meets the specified range criteria.
 */
function isLevelInRange(level: Level, type: 'dl' | 'fl'): boolean {
  const topValue = type === 'dl' ? level.dlTop : level.flTop;
  
  if (rangeStart !== '' && (typeof topValue !== 'number' || topValue < Number(rangeStart))) {
    return false;
  }
  
  if (rangeEnd !== '' && (typeof topValue !== 'number' || topValue > Number(rangeEnd))) {
    return false;
  }
  
  return true;
}

/**
 * Fetches a random level from the API with retry logic for filtering.
 */
async function fetchRandomLevel(): Promise<void> {
  loading = true;
  showResult = false;
  inputValue = '';
  message = '';
  let attempts = 0;
  
  try {
    while (attempts < MAX_RETRY_ATTEMPTS) {
      attempts++;
      
      const type = determineRandomListType();
      currentType = type;
      
      const url = `https://api.demonlistvn.com/list/${type}/random?${CACHE_BUSTER_PARAM}=${Date.now()}`;
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Random API returned ${response.status}`);
      }
      
      const jsonData = await safeJsonParse(response);
      const level = extractLevelFromRandomResponse(jsonData);

      // Skip platformer levels
      if (level?.isPlatformer) {
        console.log('Skipped platformer level:', level.name);
        continue;
      }

      // Check range criteria
      if (level && !isLevelInRange(level, type)) {
        console.log('Skipped level outside range:', level.name);
        continue;
      }

      if (!level) {
        message = 'No level returned from random API.';
        currentLevel = null;
        return;
      }

      // Valid level found
      currentLevel = level;
      message = '';
      return;
    }
    
    // Exceeded max attempts
    message = 'No suitable levels found. Try adjusting your range.';
    currentLevel = null;
    
  } catch (error) {
    console.error('fetchRandomLevel error:', error);
    message = 'Error loading random level. Try again.';
    currentLevel = null;
  } finally {
    loading = false;
  }
}

/**
 * Normalizes a string for comparison (lowercase, remove special characters).
 */
function normalizeString(str: string): string {
  return str.toLowerCase().replace(/[^a-z0-9]/g, '');
}

/**
 * Checks if the user's guess is correct.
 */
function checkGuess(): void {
  if (!currentLevel?.name || !inputValue.trim()) return;
  
  const normalizedGuess = normalizeString(inputValue);
  const normalizedAnswer = normalizeString(currentLevel.name);
  
  isCorrect = normalizedGuess === normalizedAnswer;
  showResult = true;
  totalGuesses++;
  
  if (isCorrect) {
    score++;
    streak++;
    if (streak > bestStreak) {
      bestStreak = streak;
    }
  } else {
    streak = 0;
  }
}

/**
 * Proceeds to the next level.
 */
function nextLevel(): void {
  void fetchRandomLevel();
}

/**
 * Skips the current level (counts as wrong).
 */
function skipLevel(): void {
  if (!currentLevel) return;
  streak = 0;
  totalGuesses++;
  void fetchRandomLevel();
}

/**
 * Resets the game state.
 */
function resetGame(): void {
  score = 0;
  streak = 0;
  totalGuesses = 0;
  showResult = false;
  inputValue = '';
  message = '';
  void fetchRandomLevel();
}

/**
 * Applies pending range values and resets game.
 */
function applyRange(): void {
  rangeStart = pendingRangeStart;
  rangeEnd = pendingRangeEnd;
  resetGame();
}

/**
 * Handles list type selection changes.
 */
function handleListTypeChange(newType: 'all' | 'dl' | 'fl'): void {
  listType = newType;
  resetGame();
}

/**
 * Gets the maximum range value for display based on current list type.
 */
function getMaxRangeValue(): number {
  switch (listType) {
    case 'dl':
      return maxDlTop;
    case 'fl':
      return maxFlTop;
    case 'all':
    default:
      return Math.max(maxDlTop, maxFlTop);
  }
}

/**
 * Handles Enter key press for submitting guess.
 */
function handleKeydown(event: KeyboardEvent): void {
  if (event.key === 'Enter') {
    if (showResult) {
      nextLevel();
    } else if (inputValue.trim()) {
      checkGuess();
    }
  }
}

onMount(() => {
  void fetchMaxValues().then(() => {
    resetGame();
  });
});
</script>

<div class="flex flex-col items-center min-h-screen dark:text-white text-black pb-10 px-2">
  <h1 class="text-5xl font-bold mt-16 mb-2 text-center">Level Guess</h1>
  <div class="dark:text-zinc-300 text-zinc-700 text-lg text-center mb-8">
    Guess the level name from its thumbnail!<br />
    Test your knowledge of Extreme Demons
  </div>

  <div class="flex flex-col md:flex-row gap-6 md:gap-10 mt-6 items-start w-full max-w-5xl">
    <Card class="rounded-2xl shadow-xl min-w-[0] w-full md:max-w-[520px] flex flex-col items-center dark:bg-black bg-white mb-6 md:mb-0">
      <CardContent class="w-full flex-col items-center p-4 sm:p-8">
        {#if loading}
          <div class="h-[220px] flex items-center justify-center text-base sm:text-xl mb-4 text-zinc-500 dark:text-zinc-400">
            Loading...
          </div>
        {:else if currentLevel}
          <div class="relative flex h-[220px] justify-center mb-4">
            <img
              src={`https://img.youtube.com/vi/${currentLevel.videoID}/0.jpg`}
              alt="Level thumbnail"
              loading="lazy"
              class="h-[200px] w-[500px] object-cover mt-[10px] rounded-lg border border-zinc-200 dark:border-zinc-800"
            />
          </div>
          
          {#if showResult}
            <div class="text-center mb-4">
              {#if isCorrect}
                <div class="text-green-500 text-xl font-bold mb-2">🎉 Correct!</div>
              {:else}
                <div class="text-red-500 text-xl font-bold mb-2">❌ Wrong!</div>
              {/if}
              <div class="text-lg dark:text-white text-black">
                The answer was: <span class="font-bold">{currentLevel.name}</span>
              </div>
              <div class="text-sm dark:text-zinc-400 text-zinc-600 mt-1">
                by {currentLevel.creator} • #{currentLevel[`${currentType === 'fl' ? 'fl' : 'dl'}Top`]}
              </div>
            </div>
          {:else}
            <div class="flex flex-col items-center gap-2 w-full">
              <Label for="guess" class="font-light text-base sm:text-lg dark:text-white text-black">
                What level is this?
              </Label>
              <Input
                id="guess"
                class="w-full max-w-[300px] text-center text-base font-medium sm:text-lg dark:bg-black bg-white placeholder:dark:text-zinc-600 placeholder:text-zinc-400 dark:text-white text-black"
                type="text"
                placeholder="Type level name..."
                bind:value={inputValue}
                on:keydown={handleKeydown}
                autocomplete="off"
              />
            </div>
          {/if}
        {:else}
          <div class="h-[220px] flex items-center justify-center text-base sm:text-xl mb-4 text-zinc-500 dark:text-zinc-400">
            {message || 'No level loaded'}
          </div>
        {/if}
      </CardContent>
    </Card>

    <Card class="rounded-2xl shadow-xl min-w-[0] w-full md:max-w-[350px] flex flex-col items-center dark:bg-black bg-white">
      <CardContent class="w-full flex flex-col items-center p-4 sm:p-8 gap-3 sm:gap-5">
        <!-- Score Display -->
        <div class="w-full text-center mb-2">
          <div class="grid grid-cols-3 gap-2 text-center">
            <div>
              <div class="text-2xl font-bold dark:text-white text-black">{score}</div>
              <div class="text-xs dark:text-zinc-400 text-zinc-600">Score</div>
            </div>
            <div>
              <div class="text-2xl font-bold dark:text-white text-black">{streak}</div>
              <div class="text-xs dark:text-zinc-400 text-zinc-600">Streak</div>
            </div>
            <div>
              <div class="text-2xl font-bold dark:text-white text-black">{bestStreak}</div>
              <div class="text-xs dark:text-zinc-400 text-zinc-600">Best</div>
            </div>
          </div>
          {#if totalGuesses > 0}
            <div class="mt-2 text-sm dark:text-zinc-400 text-zinc-600">
              Accuracy: {Math.round((score / totalGuesses) * 100)}%
            </div>
          {/if}
        </div>

        {#if isMaxValuesLoaded}
          <div class="dark:text-zinc-300 text-zinc-700 text-sm sm:text-base mb-1 text-center">
            Range: <strong>#{1} to #{getMaxRangeValue()}</strong>
          </div>
        {/if}
        
        <div class="flex items-center gap-2 mb-2 w-full justify-center">
          <Input 
            class="w-24 sm:w-24 text-left text-sm sm:text-base dark:bg-black bg-white dark:text-white text-black" 
            placeholder="From" 
            type="number" 
            min="1" 
            bind:value={pendingRangeStart} 
          />
          <span class="dark:text-zinc-400 text-zinc-500 text-lg">-</span>
          <Input 
            class="w-24 sm:w-24 text-left text-sm sm:text-base dark:bg-black bg-white dark:text-white text-black" 
            placeholder="To" 
            type="number" 
            min="1" 
            bind:value={pendingRangeEnd} 
          />
        </div>

        <div class="flex gap-2 mb-2 w-full justify-center flex-wrap">
          <Button 
            variant={listType === 'all' ? 'default' : 'secondary'} 
            class={listType === 'all' ? 'dark:bg-white bg-black dark:text-black text-white' : 'dark:bg-black bg-white dark:text-white text-black'}
            on:click={() => handleListTypeChange('all')}
          >
            All
          </Button>
          <Button 
            variant={listType === 'dl' ? 'default' : 'secondary'} 
            class={listType === 'dl' ? 'dark:bg-white bg-black dark:text-black text-white' : 'dark:bg-black bg-white dark:text-white text-black'}
            on:click={() => handleListTypeChange('dl')}
          >
            Classic
          </Button>
          <Button 
            variant={listType === 'fl' ? 'default' : 'secondary'} 
            class={listType === 'fl' ? 'dark:bg-white bg-black dark:text-black text-white' : 'dark:bg-black bg-white dark:text-white text-black'}
            on:click={() => handleListTypeChange('fl')}
          >
            Featured
          </Button>
        </div>

        <Button 
          variant="secondary" 
          class="w-full py-2 text-sm sm:text-base font-normal dark:bg-black bg-white dark:text-white text-black" 
          on:click={applyRange} 
        >
          Apply
        </Button>

        {#if showResult}
          <Button 
            class="w-full py-2 sm:py-3 text-base sm:text-lg font-normal mb-2 dark:bg-white bg-black dark:text-black text-white" 
            on:click={nextLevel}
          >
            Next Level
          </Button>
        {:else}
          <Button 
            class="w-full py-2 sm:py-3 text-base sm:text-lg font-normal mb-2 dark:bg-white bg-black dark:text-black text-white" 
            on:click={checkGuess} 
            disabled={!currentLevel || !inputValue.trim() || loading}
          >
            Submit Guess
          </Button>
        {/if}

        <div class="flex gap-2 w-full">
          <Button 
            variant="secondary" 
            class="flex-1 py-2 mt-2 text-sm sm:text-base font-normal border dark:bg-black bg-white dark:text-white text-black flex justify-center" 
            on:click={resetGame}
          >
            Reset
          </Button>

          <Button
            variant="secondary"
            class="flex-1 mt-2 py-2 text-sm sm:text-base font-normal border dark:bg-black bg-white dark:text-white text-black flex justify-center"
            on:click={skipLevel}
            disabled={!currentLevel || loading || showResult}
          >
            Skip
          </Button>
        </div>
      </CardContent>
    </Card>
  </div>
</div>

<p class="text-lg font-medium text-center text-zinc-700 mt-4">Guess the level from its thumbnail!</p>
