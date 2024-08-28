export async function load({ params, fetch }) {
    const res: any[] = await (await fetch(`${import.meta.env.VITE_API_URL}/player/${params.uid}/submissions?end=500`)).json()

    return {
        data: res
    }
};