export async function load({ params, url, fetch }) {
    const { id } = params

    return {
        level: await (await fetch(`${import.meta.env.VITE_API_URL}/level/${id}`)).json(),
        levelAPI: await (await fetch(`https://gdbrowser.com/api/level/${id}`)).json(),
        records: await (await fetch(`${import.meta.env.VITE_API_URL}/level/${id}/records?end=500`)).json(),
    }
};