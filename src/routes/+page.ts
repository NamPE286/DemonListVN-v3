async function getRecentDemonListLevel() {
    const query = new URLSearchParams({
        
    })

    return await ((await fetch(`${import.meta.env.API_URL}/list/dl?${query.toString()}`)).json())
}

export async function load({params, url, fetch}) {
    
};