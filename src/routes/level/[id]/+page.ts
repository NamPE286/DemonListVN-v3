export async function load({ params, url, fetch }) {
    const { id } = params

    if (url.searchParams.get('list') == 'other') {
        let gdbrowserLevel: any = await (await fetch(`https://gdbrowser.com/api/level/${id}`)).json()

        if (!('demonList' in gdbrowserLevel)) {
            return {
                gdbrowser: gdbrowserLevel,
                pointercrate: null
            }
        }

        let pointercrateLevel: any = await (await fetch(`https://pointercrate.com/api/v2/demons/listed?name=${gdbrowserLevel.name}`)).json()

        return {
            gdbrowser: gdbrowserLevel,
            pointercrate: pointercrateLevel[0]
        }
    }

    return {
        level: await (await fetch(`${import.meta.env.VITE_API_URL}/level/${id}`)).json()
    }
};