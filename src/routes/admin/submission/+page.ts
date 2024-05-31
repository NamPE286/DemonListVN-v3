export async function load({ params, fetch }) {
    const query = new URLSearchParams({
        end: '500',
        isChecked: 'false',
    })

    const res: any[] = await (await fetch(`${import.meta.env.VITE_API_URL}/records?${query.toString()}`)).json()

    return {
        data: res
    }
};