<script lang="ts">
	import Title from '$lib/components/Title.svelte';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { Button } from '$lib/components/ui/button';
	import { Textarea } from '$lib/components/ui/textarea';
	import * as Alert from '$lib/components/ui/alert';
	import * as Tabs from '$lib/components/ui/tabs/index.js';
	import * as Card from '$lib/components/ui/card/index.js';
	import * as Table from '$lib/components/ui/table/index.js';
	import * as Select from '$lib/components/ui/select/index.js';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import { Switch } from '$lib/components/ui/switch/index.js';
	import { user } from '$lib/client';
	import { toast } from 'svelte-sonner';
	import { onMount } from 'svelte';
	import Crown from 'lucide-svelte/icons/crown';
	import Plus from 'lucide-svelte/icons/plus';
	import Trash2 from 'lucide-svelte/icons/trash-2';
	import Edit from 'lucide-svelte/icons/pencil';
	import RefreshCw from 'lucide-svelte/icons/refresh-cw';

	// State
	let seasons: any[] = [];
	let selectedSeason: any = null;
	let levels: any[] = [];
	let mapPacks: any[] = [];
	let battlePassMapPacks: any[] = [];
	let rewards: any[] = [];
	let missions: any[] = [];
	let generalMapPacks: any[] = [];

	// Dialog states
	let showSeasonDialog = false;
	let showLevelDialog = false;
	let showMapPackDialog = false;
	let showRewardDialog = false;
	let showMissionDialog = false;
	let showGeneralMapPackDialog = false;
	let showLinkMapPackDialog = false;
	let showMissionRewardDialog = false;
	let showMapPackLevelDialog = false;

	// Form states
	let seasonForm = {
		id: null as number | null,
		title: '',
		description: '',
		start: '',
		end: ''
	};

	let levelForm = {
		id: null as number | null,
		levelID: '',
		xp: 1000,
		minProgressXp: 500,
		minProgress: 50
	};

	let mapPackLinkForm = {
		mapPackId: '',
		unlockWeek: 1,
		order: 0
	};

	let rewardForm = {
		id: null as number | null,
		tier: 1,
		isPremium: false,
		itemId: '',
		quantity: 1,
		description: ''
	};

	let missionForm = {
		id: null as number | null,
		title: '',
		description: '',
		condition: '[]',
		xp: 100,
		order: 0
	};

	let generalMapPackForm = {
		id: null as number | null,
		name: '',
		description: '',
		difficulty: 'harder',
		xp: 200
	};

	let missionRewardForm = {
		missionId: null as number | null,
		itemId: '',
		quantity: 1,
		expireAfter: 7
	};

	let mapPackLevelForm = {
		mapPackId: null as number | null,
		levelID: '',
		order: 0
	};

	const difficultyOptions = [
		{ value: 'easier', label: 'Easier' },
		{ value: 'harder', label: 'Harder' },
		{ value: 'medium_demon', label: 'Medium Demon' },
		{ value: 'insane_demon', label: 'Insane Demon' }
	];

	function convertTime(x: string) {
		if (!x) return '';
		const d = new Date(x);
		d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
		return d.toISOString().slice(0, 16);
	}

	// Fetch functions
	async function fetchSeasons() {
		try {
			const res = await fetch(`${import.meta.env.VITE_API_URL}/battlepass`);
			if (res.ok) {
				const season = await res.json();
				seasons = [season];
				if (!selectedSeason) {
					selectedSeason = season;
					await fetchSeasonData();
				}
			}
		} catch (e) {
			console.error('Failed to fetch seasons:', e);
		}
	}

	async function fetchSeasonData() {
		if (!selectedSeason) return;
		await Promise.all([
			fetchLevels(),
			fetchBattlePassMapPacks(),
			fetchRewards(),
			fetchMissions(),
			fetchGeneralMapPacks()
		]);
	}

	async function fetchLevels() {
		if (!selectedSeason) return;
		try {
			const res = await fetch(`${import.meta.env.VITE_API_URL}/battlepass/season/${selectedSeason.id}/levels`);
			if (res.ok) levels = await res.json();
		} catch (e) {
			console.error('Failed to fetch levels:', e);
		}
	}

	async function fetchBattlePassMapPacks() {
		if (!selectedSeason) return;
		try {
			const res = await fetch(`${import.meta.env.VITE_API_URL}/battlepass/season/${selectedSeason.id}/mappacks`, {
				headers: { Authorization: `Bearer ${await $user.token()}` }
			});
			if (res.ok) battlePassMapPacks = await res.json();
		} catch (e) {
			console.error('Failed to fetch battle pass map packs:', e);
		}
	}

	async function fetchRewards() {
		if (!selectedSeason) return;
		try {
			const res = await fetch(`${import.meta.env.VITE_API_URL}/battlepass/season/${selectedSeason.id}/rewards`);
			if (res.ok) rewards = await res.json();
		} catch (e) {
			console.error('Failed to fetch rewards:', e);
		}
	}

	async function fetchMissions() {
		if (!selectedSeason) return;
		try {
			const res = await fetch(`${import.meta.env.VITE_API_URL}/battlepass/season/${selectedSeason.id}/missions`);
			if (res.ok) missions = await res.json();
		} catch (e) {
			console.error('Failed to fetch missions:', e);
		}
	}

	async function fetchGeneralMapPacks() {
		try {
			const res = await fetch(`${import.meta.env.VITE_API_URL}/battlepass/mappacks/general`);
			if (res.ok) generalMapPacks = await res.json();
		} catch (e) {
			console.error('Failed to fetch general map packs:', e);
		}
	}

	// Season CRUD
	async function saveSeason() {
		const isNew = !seasonForm.id;
		const url = isNew 
			? `${import.meta.env.VITE_API_URL}/battlepass/season`
			: `${import.meta.env.VITE_API_URL}/battlepass/season/${seasonForm.id}`;
		
		const body: any = {
			title: seasonForm.title,
			description: seasonForm.description
		};

		if (seasonForm.start) body.start = new Date(seasonForm.start).toISOString();
		if (seasonForm.end) body.end = new Date(seasonForm.end).toISOString();

		toast.promise(
			fetch(url, {
				method: isNew ? 'POST' : 'PATCH',
				body: JSON.stringify(body),
				headers: {
					Authorization: `Bearer ${await $user.token()}`,
					'Content-Type': 'application/json'
				}
			}),
			{
				success: () => {
					showSeasonDialog = false;
					fetchSeasons();
					return isNew ? 'Season created!' : 'Season updated!';
				},
				loading: 'Saving...',
				error: 'Failed to save season'
			}
		);
	}

	async function archiveSeason(id: number) {
		if (!confirm('Archive this season?')) return;

		toast.promise(
			fetch(`${import.meta.env.VITE_API_URL}/battlepass/season/${id}/archive`, {
				method: 'POST',
				headers: { Authorization: `Bearer ${await $user.token()}` }
			}),
			{
				success: () => {
					fetchSeasons();
					return 'Season archived!';
				},
				loading: 'Archiving...',
				error: 'Failed to archive'
			}
		);
	}

	// Level CRUD
	async function saveLevel() {
		if (!selectedSeason) return;

		const isNew = !levelForm.id;
		const url = isNew 
			? `${import.meta.env.VITE_API_URL}/battlepass/season/${selectedSeason.id}/levels`
			: `${import.meta.env.VITE_API_URL}/battlepass/level/${levelForm.id}`;

		toast.promise(
			fetch(url, {
				method: isNew ? 'POST' : 'PATCH',
				body: JSON.stringify({
					levelID: Number(levelForm.levelID),
					xp: levelForm.xp,
					minProgressXp: levelForm.minProgressXp,
					minProgress: levelForm.minProgress
				}),
				headers: {
					Authorization: `Bearer ${await $user.token()}`,
					'Content-Type': 'application/json'
				}
			}),
			{
				success: () => {
					showLevelDialog = false;
					fetchLevels();
					return isNew ? 'Level added!' : 'Level updated!';
				},
				loading: 'Saving...',
				error: 'Failed to save level'
			}
		);
	}

	async function deleteLevel(id: number) {
		if (!confirm('Delete this level?')) return;

		toast.promise(
			fetch(`${import.meta.env.VITE_API_URL}/battlepass/level/${id}`, {
				method: 'DELETE',
				headers: { Authorization: `Bearer ${await $user.token()}` }
			}),
			{
				success: () => {
					fetchLevels();
					return 'Level deleted!';
				},
				loading: 'Deleting...',
				error: 'Failed to delete'
			}
		);
	}

	// Map Pack Link
	async function linkMapPack() {
		if (!selectedSeason) return;

		toast.promise(
			fetch(`${import.meta.env.VITE_API_URL}/battlepass/season/${selectedSeason.id}/mappacks`, {
				method: 'POST',
				body: JSON.stringify({
					mapPackId: Number(mapPackLinkForm.mapPackId),
					unlockWeek: mapPackLinkForm.unlockWeek,
					order: mapPackLinkForm.order
				}),
				headers: {
					Authorization: `Bearer ${await $user.token()}`,
					'Content-Type': 'application/json'
				}
			}),
			{
				success: () => {
					showLinkMapPackDialog = false;
					fetchBattlePassMapPacks();
					return 'Map pack linked!';
				},
				loading: 'Linking...',
				error: 'Failed to link map pack'
			}
		);
	}

	async function unlinkMapPack(id: number) {
		if (!confirm('Unlink this map pack?')) return;

		toast.promise(
			fetch(`${import.meta.env.VITE_API_URL}/battlepass/mappack/${id}`, {
				method: 'DELETE',
				headers: { Authorization: `Bearer ${await $user.token()}` }
			}),
			{
				success: () => {
					fetchBattlePassMapPacks();
					return 'Map pack unlinked!';
				},
				loading: 'Unlinking...',
				error: 'Failed to unlink'
			}
		);
	}

	// Reward CRUD
	async function saveReward() {
		if (!selectedSeason) return;

		toast.promise(
			fetch(`${import.meta.env.VITE_API_URL}/battlepass/season/${selectedSeason.id}/rewards`, {
				method: 'POST',
				body: JSON.stringify({
					tier: rewardForm.tier,
					isPremium: rewardForm.isPremium,
					itemId: Number(rewardForm.itemId),
					quantity: rewardForm.quantity,
					description: rewardForm.description
				}),
				headers: {
					Authorization: `Bearer ${await $user.token()}`,
					'Content-Type': 'application/json'
				}
			}),
			{
				success: () => {
					showRewardDialog = false;
					fetchRewards();
					return 'Reward created!';
				},
				loading: 'Saving...',
				error: 'Failed to save reward'
			}
		);
	}

	async function deleteReward(id: number) {
		if (!confirm('Delete this reward?')) return;

		toast.promise(
			fetch(`${import.meta.env.VITE_API_URL}/battlepass/reward/${id}`, {
				method: 'DELETE',
				headers: { Authorization: `Bearer ${await $user.token()}` }
			}),
			{
				success: () => {
					fetchRewards();
					return 'Reward deleted!';
				},
				loading: 'Deleting...',
				error: 'Failed to delete'
			}
		);
	}

	// Mission CRUD
	async function saveMission() {
		if (!selectedSeason) return;

		const isNew = !missionForm.id;
		const url = isNew 
			? `${import.meta.env.VITE_API_URL}/battlepass/season/${selectedSeason.id}/missions`
			: `${import.meta.env.VITE_API_URL}/battlepass/mission/${missionForm.id}`;

		let condition;
		try {
			condition = JSON.parse(missionForm.condition);
		} catch (e) {
			toast.error('Invalid condition JSON');
			return;
		}

		toast.promise(
			fetch(url, {
				method: isNew ? 'POST' : 'PATCH',
				body: JSON.stringify({
					title: missionForm.title,
					description: missionForm.description,
					condition,
					xp: missionForm.xp,
					order: missionForm.order
				}),
				headers: {
					Authorization: `Bearer ${await $user.token()}`,
					'Content-Type': 'application/json'
				}
			}),
			{
				success: () => {
					showMissionDialog = false;
					fetchMissions();
					return isNew ? 'Mission created!' : 'Mission updated!';
				},
				loading: 'Saving...',
				error: 'Failed to save mission'
			}
		);
	}

	async function deleteMission(id: number) {
		if (!confirm('Delete this mission?')) return;

		toast.promise(
			fetch(`${import.meta.env.VITE_API_URL}/battlepass/mission/${id}`, {
				method: 'DELETE',
				headers: { Authorization: `Bearer ${await $user.token()}` }
			}),
			{
				success: () => {
					fetchMissions();
					return 'Mission deleted!';
				},
				loading: 'Deleting...',
				error: 'Failed to delete'
			}
		);
	}

	// Mission Reward
	async function addMissionReward() {
		if (!missionRewardForm.missionId) return;

		toast.promise(
			fetch(`${import.meta.env.VITE_API_URL}/battlepass/mission/${missionRewardForm.missionId}/reward`, {
				method: 'POST',
				body: JSON.stringify({
					itemId: Number(missionRewardForm.itemId),
					quantity: missionRewardForm.quantity,
					expireAfter: missionRewardForm.expireAfter
				}),
				headers: {
					Authorization: `Bearer ${await $user.token()}`,
					'Content-Type': 'application/json'
				}
			}),
			{
				success: () => {
					showMissionRewardDialog = false;
					fetchMissions();
					return 'Reward added!';
				},
				loading: 'Adding...',
				error: 'Failed to add reward'
			}
		);
	}

	async function deleteMissionReward(missionId: number, rewardId: number) {
		if (!confirm('Delete this reward?')) return;

		toast.promise(
			fetch(`${import.meta.env.VITE_API_URL}/battlepass/mission/${missionId}/reward/${rewardId}`, {
				method: 'DELETE',
				headers: { Authorization: `Bearer ${await $user.token()}` }
			}),
			{
				success: () => {
					fetchMissions();
					return 'Reward deleted!';
				},
				loading: 'Deleting...',
				error: 'Failed to delete'
			}
		);
	}

	// General Map Pack CRUD
	async function saveGeneralMapPack() {
		const isNew = !generalMapPackForm.id;
		const url = isNew 
			? `${import.meta.env.VITE_API_URL}/battlepass/mappacks/general`
			: `${import.meta.env.VITE_API_URL}/battlepass/mappacks/general/${generalMapPackForm.id}`;

		toast.promise(
			fetch(url, {
				method: isNew ? 'POST' : 'PATCH',
				body: JSON.stringify({
					name: generalMapPackForm.name,
					description: generalMapPackForm.description,
					difficulty: generalMapPackForm.difficulty,
					xp: generalMapPackForm.xp
				}),
				headers: {
					Authorization: `Bearer ${await $user.token()}`,
					'Content-Type': 'application/json'
				}
			}),
			{
				success: () => {
					showGeneralMapPackDialog = false;
					fetchGeneralMapPacks();
					return isNew ? 'Map pack created!' : 'Map pack updated!';
				},
				loading: 'Saving...',
				error: 'Failed to save map pack'
			}
		);
	}

	async function deleteGeneralMapPack(id: number) {
		if (!confirm('Delete this map pack?')) return;

		toast.promise(
			fetch(`${import.meta.env.VITE_API_URL}/battlepass/mappacks/general/${id}`, {
				method: 'DELETE',
				headers: { Authorization: `Bearer ${await $user.token()}` }
			}),
			{
				success: () => {
					fetchGeneralMapPacks();
					return 'Map pack deleted!';
				},
				loading: 'Deleting...',
				error: 'Failed to delete'
			}
		);
	}

	// Map Pack Level
	async function addMapPackLevel() {
		if (!mapPackLevelForm.mapPackId) return;

		toast.promise(
			fetch(`${import.meta.env.VITE_API_URL}/battlepass/mappacks/general/${mapPackLevelForm.mapPackId}/level`, {
				method: 'POST',
				body: JSON.stringify({
					levelID: Number(mapPackLevelForm.levelID),
					order: mapPackLevelForm.order
				}),
				headers: {
					Authorization: `Bearer ${await $user.token()}`,
					'Content-Type': 'application/json'
				}
			}),
			{
				success: () => {
					showMapPackLevelDialog = false;
					fetchGeneralMapPacks();
					return 'Level added!';
				},
				loading: 'Adding...',
				error: 'Failed to add level'
			}
		);
	}

	async function deleteMapPackLevel(mapPackId: number, levelId: number) {
		if (!confirm('Remove this level?')) return;

		toast.promise(
			fetch(`${import.meta.env.VITE_API_URL}/battlepass/mappacks/general/${mapPackId}/level/${levelId}`, {
				method: 'DELETE',
				headers: { Authorization: `Bearer ${await $user.token()}` }
			}),
			{
				success: () => {
					fetchGeneralMapPacks();
					return 'Level removed!';
				},
				loading: 'Removing...',
				error: 'Failed to remove'
			}
		);
	}

	// Reset form functions
	function openNewSeason() {
		seasonForm = { id: null, title: '', description: '', start: '', end: '' };
		showSeasonDialog = true;
	}

	function openEditSeason(season: any) {
		seasonForm = {
			id: season.id,
			title: season.title,
			description: season.description,
			start: convertTime(season.start),
			end: convertTime(season.end)
		};
		showSeasonDialog = true;
	}

	function openNewLevel() {
		levelForm = { id: null, levelID: '', xp: 1000, minProgressXp: 500, minProgress: 50 };
		showLevelDialog = true;
	}

	function openEditLevel(level: any) {
		levelForm = {
			id: level.id,
			levelID: level.levelID,
			xp: level.xp,
			minProgressXp: level.minProgressXp,
			minProgress: level.minProgress
		};
		showLevelDialog = true;
	}

	function openNewReward() {
		rewardForm = { id: null, tier: 1, isPremium: false, itemId: '', quantity: 1, description: '' };
		showRewardDialog = true;
	}

	function openNewMission() {
		missionForm = { id: null, title: '', description: '', condition: '[]', xp: 100, order: 0 };
		showMissionDialog = true;
	}

	function openEditMission(mission: any) {
		missionForm = {
			id: mission.id,
			title: mission.title,
			description: mission.description,
			condition: JSON.stringify(mission.condition || [], null, 2),
			xp: mission.xp,
			order: mission.order
		};
		showMissionDialog = true;
	}

	function openNewGeneralMapPack() {
		generalMapPackForm = { id: null, name: '', description: '', difficulty: 'harder', xp: 200 };
		showGeneralMapPackDialog = true;
	}

	function openEditGeneralMapPack(pack: any) {
		generalMapPackForm = {
			id: pack.id,
			name: pack.name,
			description: pack.description,
			difficulty: pack.difficulty,
			xp: pack.xp
		};
		showGeneralMapPackDialog = true;
	}

	function openLinkMapPack() {
		mapPackLinkForm = { mapPackId: '', unlockWeek: 1, order: 0 };
		showLinkMapPackDialog = true;
	}

	function openAddMissionReward(missionId: number) {
		missionRewardForm = { missionId, itemId: '', quantity: 1, expireAfter: 7 };
		showMissionRewardDialog = true;
	}

	function openAddMapPackLevel(mapPackId: number) {
		mapPackLevelForm = { mapPackId, levelID: '', order: 0 };
		showMapPackLevelDialog = true;
	}

	onMount(() => {
		fetchSeasons();
	});
</script>

<Title value="Battle Pass Manager" />

<div class="wrapper">
	<div class="mb-6 flex items-center gap-4">
		<Crown class="h-8 w-8 text-yellow-400" />
		<h1 class="text-2xl font-bold">Battle Pass Manager</h1>
		<Button variant="outline" size="icon" on:click={() => { fetchSeasons(); if (selectedSeason) fetchSeasonData(); }}>
			<RefreshCw class="h-4 w-4" />
		</Button>
	</div>

	<!-- Season Selector -->
	<div class="mb-6 flex items-center gap-4">
		<Label>Active Season:</Label>
		{#if selectedSeason}
			<span class="font-bold">{selectedSeason.title}</span>
			<Button variant="outline" size="sm" on:click={() => openEditSeason(selectedSeason)}>
				<Edit class="mr-1 h-4 w-4" />
				Edit
			</Button>
		{:else}
			<span class="text-muted-foreground">No active season</span>
		{/if}
		<Button size="sm" on:click={openNewSeason}>
			<Plus class="mr-1 h-4 w-4" />
			New Season
		</Button>
	</div>

	{#if selectedSeason}
		<Tabs.Root value="levels">
			<Tabs.List class="mb-4">
				<Tabs.Trigger value="levels">Levels</Tabs.Trigger>
				<Tabs.Trigger value="mappacks">Map Packs</Tabs.Trigger>
				<Tabs.Trigger value="rewards">Tier Rewards</Tabs.Trigger>
				<Tabs.Trigger value="missions">Missions</Tabs.Trigger>
				<Tabs.Trigger value="general">General Map Packs</Tabs.Trigger>
			</Tabs.List>

			<!-- Levels Tab -->
			<Tabs.Content value="levels">
				<Card.Root>
					<Card.Header class="flex flex-row items-center justify-between">
						<Card.Title>Battle Pass Levels</Card.Title>
						<Button size="sm" on:click={openNewLevel}>
							<Plus class="mr-1 h-4 w-4" />
							Add Level
						</Button>
					</Card.Header>
					<Card.Content>
						<Table.Root>
							<Table.Header>
								<Table.Row>
									<Table.Head>ID</Table.Head>
									<Table.Head>Level ID</Table.Head>
									<Table.Head>Level Name</Table.Head>
									<Table.Head>XP</Table.Head>
									<Table.Head>Min Progress</Table.Head>
									<Table.Head>Min Progress XP</Table.Head>
									<Table.Head>Actions</Table.Head>
								</Table.Row>
							</Table.Header>
							<Table.Body>
								{#each levels as level}
									<Table.Row>
										<Table.Cell>{level.id}</Table.Cell>
										<Table.Cell>{level.levelID}</Table.Cell>
										<Table.Cell>{level.levels?.name || '-'}</Table.Cell>
										<Table.Cell class="text-yellow-400">{level.xp}</Table.Cell>
										<Table.Cell>{level.minProgress}%</Table.Cell>
										<Table.Cell class="text-blue-400">{level.minProgressXp}</Table.Cell>
										<Table.Cell>
											<div class="flex gap-2">
												<Button variant="outline" size="icon" on:click={() => openEditLevel(level)}>
													<Edit class="h-4 w-4" />
												</Button>
												<Button variant="destructive" size="icon" on:click={() => deleteLevel(level.id)}>
													<Trash2 class="h-4 w-4" />
												</Button>
											</div>
										</Table.Cell>
									</Table.Row>
								{:else}
									<Table.Row>
										<Table.Cell colspan={7} class="text-center text-muted-foreground">
											No levels added
										</Table.Cell>
									</Table.Row>
								{/each}
							</Table.Body>
						</Table.Root>
					</Card.Content>
				</Card.Root>
			</Tabs.Content>

			<!-- Map Packs Tab -->
			<Tabs.Content value="mappacks">
				<Card.Root>
					<Card.Header class="flex flex-row items-center justify-between">
						<Card.Title>Season Map Packs</Card.Title>
						<Button size="sm" on:click={openLinkMapPack}>
							<Plus class="mr-1 h-4 w-4" />
							Link Map Pack
						</Button>
					</Card.Header>
					<Card.Content>
						<Table.Root>
							<Table.Header>
								<Table.Row>
									<Table.Head>ID</Table.Head>
									<Table.Head>Map Pack</Table.Head>
									<Table.Head>Difficulty</Table.Head>
									<Table.Head>XP</Table.Head>
									<Table.Head>Unlock Week</Table.Head>
									<Table.Head>Order</Table.Head>
									<Table.Head>Actions</Table.Head>
								</Table.Row>
							</Table.Header>
							<Table.Body>
								{#each battlePassMapPacks as pack}
									<Table.Row>
										<Table.Cell>{pack.id}</Table.Cell>
										<Table.Cell>{pack.mapPacks?.name || '-'}</Table.Cell>
										<Table.Cell>{pack.mapPacks?.difficulty || '-'}</Table.Cell>
										<Table.Cell class="text-yellow-400">{pack.mapPacks?.xp || 0}</Table.Cell>
										<Table.Cell>Week {pack.unlockWeek}</Table.Cell>
										<Table.Cell>{pack.order}</Table.Cell>
										<Table.Cell>
											<Button variant="destructive" size="icon" on:click={() => unlinkMapPack(pack.id)}>
												<Trash2 class="h-4 w-4" />
											</Button>
										</Table.Cell>
									</Table.Row>
								{:else}
									<Table.Row>
										<Table.Cell colspan={7} class="text-center text-muted-foreground">
											No map packs linked
										</Table.Cell>
									</Table.Row>
								{/each}
							</Table.Body>
						</Table.Root>
					</Card.Content>
				</Card.Root>
			</Tabs.Content>

			<!-- Tier Rewards Tab -->
			<Tabs.Content value="rewards">
				<Card.Root>
					<Card.Header class="flex flex-row items-center justify-between">
						<Card.Title>Tier Rewards</Card.Title>
						<Button size="sm" on:click={openNewReward}>
							<Plus class="mr-1 h-4 w-4" />
							Add Reward
						</Button>
					</Card.Header>
					<Card.Content>
						<Table.Root>
							<Table.Header>
								<Table.Row>
									<Table.Head>ID</Table.Head>
									<Table.Head>Tier</Table.Head>
									<Table.Head>Type</Table.Head>
									<Table.Head>Item ID</Table.Head>
									<Table.Head>Quantity</Table.Head>
									<Table.Head>Description</Table.Head>
									<Table.Head>Actions</Table.Head>
								</Table.Row>
							</Table.Header>
							<Table.Body>
								{#each rewards.sort((a, b) => a.tier - b.tier) as reward}
									<Table.Row>
										<Table.Cell>{reward.id}</Table.Cell>
										<Table.Cell>{reward.tier}</Table.Cell>
										<Table.Cell>
											{#if reward.isPremium}
												<span class="flex items-center gap-1 text-yellow-400">
													<Crown class="h-4 w-4" />
													Premium
												</span>
											{:else}
												<span class="text-blue-400">Free</span>
											{/if}
										</Table.Cell>
										<Table.Cell>{reward.itemId}</Table.Cell>
										<Table.Cell>{reward.quantity}</Table.Cell>
										<Table.Cell>{reward.description || '-'}</Table.Cell>
										<Table.Cell>
											<Button variant="destructive" size="icon" on:click={() => deleteReward(reward.id)}>
												<Trash2 class="h-4 w-4" />
											</Button>
										</Table.Cell>
									</Table.Row>
								{:else}
									<Table.Row>
										<Table.Cell colspan={7} class="text-center text-muted-foreground">
											No rewards added
										</Table.Cell>
									</Table.Row>
								{/each}
							</Table.Body>
						</Table.Root>
					</Card.Content>
				</Card.Root>
			</Tabs.Content>

			<!-- Missions Tab -->
			<Tabs.Content value="missions">
				<Card.Root>
					<Card.Header class="flex flex-row items-center justify-between">
						<Card.Title>Missions</Card.Title>
						<Button size="sm" on:click={openNewMission}>
							<Plus class="mr-1 h-4 w-4" />
							Add Mission
						</Button>
					</Card.Header>
					<Card.Content>
						<div class="flex flex-col gap-4">
							{#each missions as mission}
								<Card.Root class="border">
									<Card.Content class="p-4">
										<div class="flex items-start justify-between">
											<div class="flex-1">
												<h4 class="font-bold">{mission.title}</h4>
												<p class="text-sm text-muted-foreground">{mission.description}</p>
												<div class="mt-2 flex items-center gap-4 text-sm">
													<span class="text-yellow-400">+{mission.xp} XP</span>
													<span class="text-muted-foreground">Order: {mission.order}</span>
												</div>
												<div class="mt-2">
													<code class="rounded bg-muted px-2 py-1 text-xs">
														{JSON.stringify(mission.condition || [])}
													</code>
												</div>
												{#if mission.battlePassMissionRewards?.length}
													<div class="mt-2 flex gap-2">
														{#each mission.battlePassMissionRewards as reward}
															<div class="flex items-center gap-1 rounded bg-muted px-2 py-1 text-xs">
																<span>Item: {reward.itemId}</span>
																<span>x{reward.quantity}</span>
																<Button 
																	variant="ghost" 
																	size="icon" 
																	class="h-4 w-4"
																	on:click={() => deleteMissionReward(mission.id, reward.id)}
																>
																	<Trash2 class="h-3 w-3" />
																</Button>
															</div>
														{/each}
													</div>
												{/if}
											</div>
											<div class="flex gap-2">
												<Button variant="outline" size="sm" on:click={() => openAddMissionReward(mission.id)}>
													<Plus class="mr-1 h-4 w-4" />
													Reward
												</Button>
												<Button variant="outline" size="icon" on:click={() => openEditMission(mission)}>
													<Edit class="h-4 w-4" />
												</Button>
												<Button variant="destructive" size="icon" on:click={() => deleteMission(mission.id)}>
													<Trash2 class="h-4 w-4" />
												</Button>
											</div>
										</div>
									</Card.Content>
								</Card.Root>
							{:else}
								<p class="py-8 text-center text-muted-foreground">No missions added</p>
							{/each}
						</div>
					</Card.Content>
				</Card.Root>
			</Tabs.Content>

			<!-- General Map Packs Tab -->
			<Tabs.Content value="general">
				<Card.Root>
					<Card.Header class="flex flex-row items-center justify-between">
						<Card.Title>General Map Packs</Card.Title>
						<Button size="sm" on:click={openNewGeneralMapPack}>
							<Plus class="mr-1 h-4 w-4" />
							Create Map Pack
						</Button>
					</Card.Header>
					<Card.Content>
						<div class="flex flex-col gap-4">
							{#each generalMapPacks as pack}
								<Card.Root class="border">
									<Card.Content class="p-4">
										<div class="flex items-start justify-between">
											<div class="flex-1">
												<h4 class="font-bold">{pack.name}</h4>
												<p class="text-sm text-muted-foreground">{pack.description || '-'}</p>
												<div class="mt-2 flex items-center gap-4 text-sm">
													<span class="capitalize">{pack.difficulty}</span>
													<span class="text-yellow-400">+{pack.xp} XP</span>
												</div>
												{#if pack.mapPackLevels?.length}
													<div class="mt-2 flex flex-wrap gap-2">
														{#each pack.mapPackLevels as level}
															<div class="flex items-center gap-1 rounded bg-muted px-2 py-1 text-xs">
																<span>{level.levels?.name || level.levelID}</span>
																<Button 
																	variant="ghost" 
																	size="icon" 
																	class="h-4 w-4"
																	on:click={() => deleteMapPackLevel(pack.id, level.id)}
																>
																	<Trash2 class="h-3 w-3" />
																</Button>
															</div>
														{/each}
													</div>
												{/if}
											</div>
											<div class="flex gap-2">
												<Button variant="outline" size="sm" on:click={() => openAddMapPackLevel(pack.id)}>
													<Plus class="mr-1 h-4 w-4" />
													Level
												</Button>
												<Button variant="outline" size="icon" on:click={() => openEditGeneralMapPack(pack)}>
													<Edit class="h-4 w-4" />
												</Button>
												<Button variant="destructive" size="icon" on:click={() => deleteGeneralMapPack(pack.id)}>
													<Trash2 class="h-4 w-4" />
												</Button>
											</div>
										</div>
									</Card.Content>
								</Card.Root>
							{:else}
								<p class="py-8 text-center text-muted-foreground">No map packs created</p>
							{/each}
						</div>
					</Card.Content>
				</Card.Root>
			</Tabs.Content>
		</Tabs.Root>
	{:else}
		<Alert.Root>
			<Alert.Title>No Active Season</Alert.Title>
			<Alert.Description>Create a new season to get started.</Alert.Description>
		</Alert.Root>
	{/if}
</div>

<!-- Season Dialog -->
<Dialog.Root bind:open={showSeasonDialog}>
	<Dialog.Content class="max-w-lg">
		<Dialog.Header>
			<Dialog.Title>{seasonForm.id ? 'Edit Season' : 'New Season'}</Dialog.Title>
		</Dialog.Header>
		<div class="flex flex-col gap-4">
			<div>
				<Label for="seasonTitle">Title</Label>
				<Input id="seasonTitle" bind:value={seasonForm.title} placeholder="Season 1: Genesis" />
			</div>
			<div>
				<Label for="seasonDesc">Description</Label>
				<Textarea id="seasonDesc" bind:value={seasonForm.description} placeholder="The first battle pass season" />
			</div>
			<div class="grid grid-cols-2 gap-4">
				<div>
					<Label for="seasonStart">Start Date</Label>
					<Input id="seasonStart" type="datetime-local" bind:value={seasonForm.start} />
				</div>
				<div>
					<Label for="seasonEnd">End Date</Label>
					<Input id="seasonEnd" type="datetime-local" bind:value={seasonForm.end} />
				</div>
			</div>
		</div>
		<Dialog.Footer>
			<Button variant="outline" on:click={() => showSeasonDialog = false}>Cancel</Button>
			<Button on:click={saveSeason}>Save</Button>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>

<!-- Level Dialog -->
<Dialog.Root bind:open={showLevelDialog}>
	<Dialog.Content class="max-w-lg">
		<Dialog.Header>
			<Dialog.Title>{levelForm.id ? 'Edit Level' : 'Add Level'}</Dialog.Title>
		</Dialog.Header>
		<div class="flex flex-col gap-4">
			<div>
				<Label for="levelID">Level ID</Label>
				<Input id="levelID" type="number" bind:value={levelForm.levelID} placeholder="12345678" />
			</div>
			<div class="grid grid-cols-2 gap-4">
				<div>
					<Label for="levelXP">Completion XP</Label>
					<Input id="levelXP" type="number" bind:value={levelForm.xp} />
				</div>
				<div>
					<Label for="levelMinXP">Min Progress XP</Label>
					<Input id="levelMinXP" type="number" bind:value={levelForm.minProgressXp} />
				</div>
			</div>
			<div>
				<Label for="levelMinProgress">Min Progress (%)</Label>
				<Input id="levelMinProgress" type="number" bind:value={levelForm.minProgress} min="0" max="100" />
			</div>
		</div>
		<Dialog.Footer>
			<Button variant="outline" on:click={() => showLevelDialog = false}>Cancel</Button>
			<Button on:click={saveLevel}>Save</Button>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>

<!-- Link Map Pack Dialog -->
<Dialog.Root bind:open={showLinkMapPackDialog}>
	<Dialog.Content class="max-w-lg">
		<Dialog.Header>
			<Dialog.Title>Link Map Pack</Dialog.Title>
		</Dialog.Header>
		<div class="flex flex-col gap-4">
			<div>
				<Label for="mapPackId">Map Pack</Label>
				<Select.Root onSelectedChange={(v) => mapPackLinkForm.mapPackId = v?.value || ''}>
					<Select.Trigger>
						<Select.Value placeholder="Select a map pack" />
					</Select.Trigger>
					<Select.Content>
						{#each generalMapPacks as pack}
							<Select.Item value={String(pack.id)}>{pack.name} ({pack.difficulty})</Select.Item>
						{/each}
					</Select.Content>
				</Select.Root>
			</div>
			<div class="grid grid-cols-2 gap-4">
				<div>
					<Label for="unlockWeek">Unlock Week</Label>
					<Input id="unlockWeek" type="number" bind:value={mapPackLinkForm.unlockWeek} min="1" />
				</div>
				<div>
					<Label for="packOrder">Order</Label>
					<Input id="packOrder" type="number" bind:value={mapPackLinkForm.order} min="0" />
				</div>
			</div>
		</div>
		<Dialog.Footer>
			<Button variant="outline" on:click={() => showLinkMapPackDialog = false}>Cancel</Button>
			<Button on:click={linkMapPack}>Link</Button>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>

<!-- Reward Dialog -->
<Dialog.Root bind:open={showRewardDialog}>
	<Dialog.Content class="max-w-lg">
		<Dialog.Header>
			<Dialog.Title>Add Tier Reward</Dialog.Title>
		</Dialog.Header>
		<div class="flex flex-col gap-4">
			<div class="grid grid-cols-2 gap-4">
				<div>
					<Label for="rewardTier">Tier</Label>
					<Input id="rewardTier" type="number" bind:value={rewardForm.tier} min="1" max="100" />
				</div>
				<div class="flex items-center gap-2 pt-6">
					<Switch bind:checked={rewardForm.isPremium} />
					<Label>Premium Reward</Label>
				</div>
			</div>
			<div class="grid grid-cols-2 gap-4">
				<div>
					<Label for="rewardItem">Item ID</Label>
					<Input id="rewardItem" type="number" bind:value={rewardForm.itemId} />
				</div>
				<div>
					<Label for="rewardQty">Quantity</Label>
					<Input id="rewardQty" type="number" bind:value={rewardForm.quantity} min="1" />
				</div>
			</div>
			<div>
				<Label for="rewardDesc">Description</Label>
				<Input id="rewardDesc" bind:value={rewardForm.description} placeholder="Basic Crate" />
			</div>
		</div>
		<Dialog.Footer>
			<Button variant="outline" on:click={() => showRewardDialog = false}>Cancel</Button>
			<Button on:click={saveReward}>Save</Button>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>

<!-- Mission Dialog -->
<Dialog.Root bind:open={showMissionDialog}>
	<Dialog.Content class="max-w-lg">
		<Dialog.Header>
			<Dialog.Title>{missionForm.id ? 'Edit Mission' : 'Add Mission'}</Dialog.Title>
		</Dialog.Header>
		<div class="flex flex-col gap-4">
			<div>
				<Label for="missionTitle">Title</Label>
				<Input id="missionTitle" bind:value={missionForm.title} placeholder="Beat Extreme Level" />
			</div>
			<div>
				<Label for="missionDesc">Description</Label>
				<Textarea id="missionDesc" bind:value={missionForm.description} placeholder="Complete the featured extreme demon" />
			</div>
			<div>
				<Label for="missionCondition">Condition (JSON)</Label>
				<Textarea 
					id="missionCondition" 
					bind:value={missionForm.condition} 
					placeholder={'[{"type": "clear_level", "targetId": 123}]'}
					rows={4}
				/>
				<p class="mt-1 text-xs text-muted-foreground">
					Types: clear_level, clear_mappack, reach_tier, earn_xp, clear_level_count, clear_mappack_count
				</p>
			</div>
			<div class="grid grid-cols-2 gap-4">
				<div>
					<Label for="missionXP">XP Reward</Label>
					<Input id="missionXP" type="number" bind:value={missionForm.xp} />
				</div>
				<div>
					<Label for="missionOrder">Order</Label>
					<Input id="missionOrder" type="number" bind:value={missionForm.order} />
				</div>
			</div>
		</div>
		<Dialog.Footer>
			<Button variant="outline" on:click={() => showMissionDialog = false}>Cancel</Button>
			<Button on:click={saveMission}>Save</Button>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>

<!-- Mission Reward Dialog -->
<Dialog.Root bind:open={showMissionRewardDialog}>
	<Dialog.Content class="max-w-md">
		<Dialog.Header>
			<Dialog.Title>Add Mission Reward</Dialog.Title>
		</Dialog.Header>
		<div class="flex flex-col gap-4">
			<div>
				<Label for="mRewardItem">Item ID</Label>
				<Input id="mRewardItem" type="number" bind:value={missionRewardForm.itemId} />
			</div>
			<div class="grid grid-cols-2 gap-4">
				<div>
					<Label for="mRewardQty">Quantity</Label>
					<Input id="mRewardQty" type="number" bind:value={missionRewardForm.quantity} min="1" />
				</div>
				<div>
					<Label for="mRewardExpire">Expire After (days)</Label>
					<Input id="mRewardExpire" type="number" bind:value={missionRewardForm.expireAfter} />
				</div>
			</div>
		</div>
		<Dialog.Footer>
			<Button variant="outline" on:click={() => showMissionRewardDialog = false}>Cancel</Button>
			<Button on:click={addMissionReward}>Add</Button>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>

<!-- General Map Pack Dialog -->
<Dialog.Root bind:open={showGeneralMapPackDialog}>
	<Dialog.Content class="max-w-lg">
		<Dialog.Header>
			<Dialog.Title>{generalMapPackForm.id ? 'Edit Map Pack' : 'Create Map Pack'}</Dialog.Title>
		</Dialog.Header>
		<div class="flex flex-col gap-4">
			<div>
				<Label for="packName">Name</Label>
				<Input id="packName" bind:value={generalMapPackForm.name} placeholder="Harder Pack 1" />
			</div>
			<div>
				<Label for="packDesc">Description</Label>
				<Textarea id="packDesc" bind:value={generalMapPackForm.description} placeholder="A collection of harder levels" />
			</div>
			<div class="grid grid-cols-2 gap-4">
				<div>
					<Label for="packDifficulty">Difficulty</Label>
					<Select.Root onSelectedChange={(v) => generalMapPackForm.difficulty = v?.value || 'harder'}>
						<Select.Trigger>
							<Select.Value placeholder={generalMapPackForm.difficulty} />
						</Select.Trigger>
						<Select.Content>
							{#each difficultyOptions as opt}
								<Select.Item value={opt.value}>{opt.label}</Select.Item>
							{/each}
						</Select.Content>
					</Select.Root>
				</div>
				<div>
					<Label for="packXP">XP</Label>
					<Input id="packXP" type="number" bind:value={generalMapPackForm.xp} />
				</div>
			</div>
		</div>
		<Dialog.Footer>
			<Button variant="outline" on:click={() => showGeneralMapPackDialog = false}>Cancel</Button>
			<Button on:click={saveGeneralMapPack}>Save</Button>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>

<!-- Map Pack Level Dialog -->
<Dialog.Root bind:open={showMapPackLevelDialog}>
	<Dialog.Content class="max-w-md">
		<Dialog.Header>
			<Dialog.Title>Add Level to Map Pack</Dialog.Title>
		</Dialog.Header>
		<div class="flex flex-col gap-4">
			<div>
				<Label for="mpLevelID">Level ID</Label>
				<Input id="mpLevelID" type="number" bind:value={mapPackLevelForm.levelID} placeholder="12345678" />
			</div>
			<div>
				<Label for="mpLevelOrder">Order</Label>
				<Input id="mpLevelOrder" type="number" bind:value={mapPackLevelForm.order} min="0" />
			</div>
		</div>
		<Dialog.Footer>
			<Button variant="outline" on:click={() => showMapPackLevelDialog = false}>Cancel</Button>
			<Button on:click={addMapPackLevel}>Add</Button>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>

<style lang="scss">
	.wrapper {
		padding-inline: 75px;
		padding-block: 30px;
	}

	@media screen and (max-width: 768px) {
		.wrapper {
			padding-inline: 15px;
		}
	}
</style>
