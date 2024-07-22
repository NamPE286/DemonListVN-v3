export async function load({ params, fetch }) {
    const query = new URLSearchParams({
        end: '500',
        isChecked: 'false',
    })
    interface Result {
        dl: any[],
        fl: any[]
    }

    const res: Result = await (await fetch(`${import.meta.env.VITE_API_URL}/player/${params.uid}/records?${query.toString()}`)).json()
    const data = res.dl.concat(res.fl)

    data.sort((a, b) => {
        if (a.timestamp < b.timestamp) {
            return -1;
        }

        return 1;
    })

    return {
        data: data
    }
};