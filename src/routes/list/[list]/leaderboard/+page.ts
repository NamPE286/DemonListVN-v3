async function getTotalPage(fetch: any, list: string) {
    const prop = (list == 'dl' ? 'overallRank' : `${list}rank`);
    const query = new URLSearchParams({
        start: '0',
        end: '0',
        sortBy: prop,
        ascending: 'false'
    });

    const res = await (
        await fetch(`${import.meta.env.VITE_API_URL}/leaderboard/${list}?${query.toString()}`)
    ).json();

    return res[0].data[prop];
}

async function getLeaderboard(fetch: any, list: string, page: number) {
    const query = new URLSearchParams({
        start: String((page - 1) * 50),
        end: String(page * 50 - 1),
        sortBy: `${list}rank`,
        ascending: 'true'
    });

    const res = await (
        await fetch(`${import.meta.env.VITE_API_URL}/leaderboard/${list}?${query.toString()}`)
    ).json();

    return res
}

export async function load({ params, url, fetch }) {
    const page = parseInt(url.searchParams.get('page') || '1')

    return {
        count: await getTotalPage(fetch, params.list),
        leaderboard: await getLeaderboard(fetch, params.list, page)
    };
};