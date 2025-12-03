import supabase from '$lib/client/supabase';
import { writable } from 'svelte/store';

interface Rating {
	progress: number;
	rating: number;
}

interface userType {
	data: any;
	ratings: Rating[];
	token: () => Promise<string | undefined>;
	loggedIn: boolean;
	checked: boolean;
	syncRole: () => Promise<void>;
	refresh: () => Promise<void>;
}

async function addNewUser() {
	const { data, error } = await supabase.auth.getUser();

	if (error) {
		throw error;
	}

	await fetch(`${import.meta.env.VITE_API_URL}/players`, {
		method: 'POST',
		headers: {
			Authorization: `Bearer ${await userData.token()}`,
			'Content-Type': 'application/json'
		}
	});
}

let userData: userType = {
	data: undefined,
	ratings: [],
	token: async () => {
		return (await supabase.auth.getSession()).data.session?.access_token;
	},
	loggedIn: false,
	checked: false,
	syncRole: async () => {
		await fetch(`${import.meta.env.VITE_API_URL}/players/syncRole`, {
			method: 'PATCH',
			headers: {
				Authorization: 'Bearer ' + (await userData.token())
			}
		});
	},
	refresh: async () => {
		const { data, error } = await supabase.auth.getUser();

		if (error) {
			userData.checked = true;
			user.set(userData);
			return;
		}

		const tmp = Promise.all([
			fetch(`${import.meta.env.VITE_API_URL}/players/${data.user.id}?cached=true`)
				.then((res) => res.json())
				.then((res) => {
					userData.data = res;
				}),
			fetch(`${import.meta.env.VITE_API_URL}/players/${data.user.id}/records?ratingOnly=true`)
				.then((res) => res.json())
				.then((res: any) => {
					userData.ratings = res;
				})
		])
			.then(() => {
				userData.loggedIn = true;
				userData.checked = true;
				user.set(userData);
			})
			.catch((err) => {
				addNewUser().then(() => {
					Promise.all([
						fetch(`${import.meta.env.VITE_API_URL}/players/${data.user.id}?cached=true`)
							.then((res) => res.json())
							.then((res) => {
								userData.data = res;
							}),
						fetch(`${import.meta.env.VITE_API_URL}/players/${data.user.id}/records?ratingOnly=true`)
							.then((res) => res.json())
							.then((res: any) => {
								userData.ratings = res;
							})
					]).then(() => {
						userData.loggedIn = true;
						userData.checked = true;
						user.set(userData);
					});
				});
			});

		await tmp;
	}
};

export const user = writable(userData);

userData.refresh();
userData.syncRole();
