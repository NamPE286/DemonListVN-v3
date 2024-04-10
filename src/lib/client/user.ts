import supabase from "$lib/client/supabase";
import { writable } from "svelte/store";

interface userType {
    data: any,
    token: () => Promise<string | undefined>,
    loggedIn: boolean
    checked: boolean
}

let userData: userType = {
    data: undefined,
    token: async () => {
        return (await supabase.auth.getSession()).data.session?.access_token
    },
    loggedIn: false,
    checked: false
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
        userData.checked = true
        user.set(userData)
        return
    }

    fetch(`${import.meta.env.VITE_API_URL}/player/${data.user.id}?cached=true`)
        .then(res => res.json())
        .then(res => {
            userData.data = res
            userData.loggedIn = true
            userData.checked = true
            user.set(userData)
        })
        .catch((err) => {
            addNewUser().then(() => {
                fetch(`${import.meta.env.VITE_API_URL}/player/${data.user.id}?cached=true`)
                    .then(res => res.json())
                    .then(res => {
                        userData.data = res
                        userData.loggedIn = true
                        userData.checked = true
                        user.set(userData)
                    })
            })
        })
}

getUser()