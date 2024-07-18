export async function load({ params, url, fetch }) {
    const { uid } = params
    const player = await (await fetch(`${import.meta.env.VITE_API_URL}/player/${uid}`)).json()
    const records = await (await fetch(`${import.meta.env.VITE_API_URL}/player/${uid}/records?sortBy=pt&end=500&isChecked=true&ascending=false`)).json()
    const dlRec = [], flRec = []

    for (const i of records) {
        if (i.data.dlPt != null) {
            dlRec.push(i)
        }

        if (i.data.flPt != null) {
            flRec.push(i)
        }
    }

    return {
        player: player,
        records: {
            dl: dlRec,
            fl: flRec
        }
    }
};