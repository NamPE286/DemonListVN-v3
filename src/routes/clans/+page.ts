export async function load({ params, url, fetch }) {
    const clan = await (await fetch(`${import.meta.env.VITE_API_URL}/clans`)).json()

    return {
        data: clan
    }
};