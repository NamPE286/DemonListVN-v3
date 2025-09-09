export async function load({ params, url, fetch }) {
    const { id } = params
    const data: any = await (await fetch(`${import.meta.env.VITE_API_URL}/card/${id}`)).json()

    return data
};