async function getRecentDemonListLevel(fetch: any) {
    const query = new URLSearchParams({
        end: '9',
        sortBy: 'created_at',
        ascending: 'false'
    })

    return await ((await fetch(`${import.meta.env.VITE_API_URL}/list/dl?${query.toString()}`)).json())
}

async function getRecentFeaturedListLevel(fetch: any) {
    const query = new URLSearchParams({
        end: '9',
        sortBy: 'created_at',
        ascending: 'false'
    })

    return await ((await fetch(`${import.meta.env.VITE_API_URL}/list/fl?${query.toString()}`)).json())
}


export async function load({ fetch }) {
    return {
        recent: {
            dl: await getRecentDemonListLevel(fetch),
            fl: await getRecentFeaturedListLevel(fetch)
        }
    }
};