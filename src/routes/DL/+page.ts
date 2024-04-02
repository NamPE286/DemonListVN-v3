async function getTotalPage(fetch: any ) {
    const query = new URLSearchParams({
        start: '0',
        end: '0',
        sortBy: 'dlTop',
        ascending: 'false'
    });

    const res = await (
        await fetch(`${import.meta.env.VITE_API_URL}/list/DL?${query.toString()}`)
    ).json();

    return res[0].data.dlTop;
}

async function getLevels(fetch: any, page: number) {
    const query = new URLSearchParams({
        start: String((page - 1) * 20),
        end: String(page * 20 - 1),
        sortBy: 'dlTop',
        ascending: 'true'
    });

    const res = await (
        await fetch(`${import.meta.env.VITE_API_URL}/list/DL?${query.toString()}`)
    ).json();

    return res
}

export async function load({url, fetch}) {
    const page = parseInt(url.searchParams.get('page') || '1')

    return {
        count: await getTotalPage(fetch),
        levels: await getLevels(fetch, page)
    };
};