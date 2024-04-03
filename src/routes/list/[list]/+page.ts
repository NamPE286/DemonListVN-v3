async function getTotalPage(fetch: any, list: string ) {
    const query = new URLSearchParams({
        start: '0',
        end: '0',
        sortBy: 'dlTop',
        ascending: 'false'
    });

    const res = await (
        await fetch(`${import.meta.env.VITE_API_URL}/list/${list}?/${query.toString()}`)
    ).json();

    return res[0].data.dlTop;
}

async function getLevels(fetch: any, list: string, page: number) {
    const query = new URLSearchParams({
        start: String((page - 1) * 20),
        end: String(page * 20 - 1),
        sortBy: `${list}Top`,
        ascending: 'true'
    });

    const res = await (
        await fetch(`${import.meta.env.VITE_API_URL}/list/${list}?/${query.toString()}`)
    ).json();

    return res
}

export async function load({params, url, fetch}) {
    const page = parseInt(url.searchParams.get('page') || '1')

    return {
        count: await getTotalPage(fetch, params.list),
        levels: await getLevels(fetch, params.list, page),
        list: params.list
    };
};