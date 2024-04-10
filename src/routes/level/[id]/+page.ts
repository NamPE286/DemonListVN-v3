export async function load({ params, url, fetch }) {
    const { id } = params

    return {
        level: await (await fetch(`${import.meta.env.VITE_API_URL}/level/${id}`)).json(),
    }
};