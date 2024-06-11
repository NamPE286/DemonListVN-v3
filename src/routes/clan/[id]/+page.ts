export async function load({ params, url, fetch }) {
    const { id } = params
    const clan = await (await fetch(`${import.meta.env.VITE_API_URL}/clan/${id}`)).json()

    return clan
};