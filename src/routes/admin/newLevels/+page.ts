export async function load({ params, fetch }) {
    const res: any[] = await (await fetch(`${import.meta.env.VITE_API_URL}/levels/new`)).json()

    return {
        data: res
    }
};