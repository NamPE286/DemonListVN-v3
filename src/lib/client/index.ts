import supabase from "$lib/client/supabase";
import { writable } from "svelte/store";

interface userType {
    data: any,
    token: () => Promise<string | undefined>,
    loggedIn: boolean
}

let userData: userType = {
    data: undefined,
    token: async () => {
        return (await supabase.auth.getSession()).data.session?.access_token
    },
    loggedIn: false
}

export const user = writable(userData)

async function addNewUser() {
    const { data, error } = await supabase.auth.getUser()

    if (error) {
        throw error
    }

    await fetch(`${import.meta.env.VITE_API_URL}/player`, {
        method: 'PUT',
        body: JSON.stringify({
            name: data.user.user_metadata.full_name
        }),
        headers: {
            "Authorization": `Bearer ${await userData.token()}`,
            "Content-Type": "application/json"
        }
    })
}

async function getUser() {
    const { data, error } = await supabase.auth.getUser()

    if (error) {
        return
    }

    fetch(`${import.meta.env.VITE_API_URL}/player/${data.user.id}`)
        .then(res => res.json())
        .then(res => {
            userData.data = res
            userData.loggedIn = true
            user.set(userData)
        })
        .catch((err) => {
            addNewUser().then(() => {
                fetch(`${import.meta.env.VITE_API_URL}/player/${data.user.id}`)
                    .then(res => res.json())
                    .then(res => {
                        userData.data = res
                        userData.loggedIn = true
                        user.set(userData)
                    })
            })
        })

}

getUser()

export function getTitle(list: string, rating: number) {
    if (list == 'dl') {
        if (rating >= 4200)
            return {
                title: 'LGM',
                fullTitle: 'Legendary Grandmaster',
                color: 'darkred'
            };
        if (rating >= 3600)
            return {
                title: 'GM',
                fullTitle: 'Grandmaster',
                color: 'red'
            };
        if (rating >= 3000)
            return {
                title: 'M',
                fullTitle: 'Master',
                color: 'blue'
            };
        if (rating >= 2800)
            return {
                title: 'CM',
                fullTitle: 'Candidate Master',
                color: 'darkorange'
            };
        if (rating >= 2500)
            return {
                title: 'EX',
                fullTitle: 'Expert',
                color: 'purple'
            };
        if (rating >= 2350)
            return {
                title: 'S+',
                fullTitle: 'S+',
                color: 'gold'
            };
        if (rating >= 2200)
            return {
                title: 'S',
                fullTitle: 'S',
                color: 'gold'
            };
        if (rating >= 2000)
            return {
                title: 'S-',
                fullTitle: 'S-',
                color: 'gold'
            };
        if (rating >= 1800)
            return {
                title: 'A+',
                fullTitle: 'A+',
                color: 'green'
            };
        if (rating >= 1600)
            return {
                title: 'A',
                fullTitle: 'A',
                color: 'green'
            };
        if (rating >= 1400)
            return {
                title: 'A-',
                fullTitle: 'A-',
                color: 'green'
            };
        if (rating >= 1200)
            return {
                title: 'B+',
                fullTitle: 'B+',
                color: '#413cde'
            };
        if (rating >= 1000)
            return {
                title: 'B',
                fullTitle: 'B',
                color: '#413cde'
            };
        if (rating >= 800)
            return {
                title: 'B-',
                fullTitle: 'B-',
                color: '#413cde'
            };
        if (rating >= 600)
            return {
                title: 'C+',
                fullTitle: 'C+',
                color: 'gray'
            };
        if (rating > 0)
            return {
                title: 'C',
                fullTitle: 'C',
                color: 'gray'
            };
        return null;
    }
}