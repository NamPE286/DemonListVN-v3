export async function load({ params, url, fetch }) {
    const { uid } = params
    const player: any = await (await fetch(`${import.meta.env.VITE_API_URL}/player/${uid}`)).json()
    const records: any = await (await fetch(`${import.meta.env.VITE_API_URL}/player/${uid}/records?sortBy=pt&end=500&isChecked=true&ascending=false`)).json()

    return {
        player: player,
        records: records
    }
};