export async function load({ params, url, fetch }) {
    const { id } = params
    const event = await (await fetch(`${import.meta.env.VITE_API_URL}/store/product/${id}`)).json()

    return event
};