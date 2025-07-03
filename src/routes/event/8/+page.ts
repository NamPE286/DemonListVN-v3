export async function load({ params, url, fetch }) {
    const event = await (await fetch(`${import.meta.env.VITE_API_URL}/event/8`)).json()

    return event
};