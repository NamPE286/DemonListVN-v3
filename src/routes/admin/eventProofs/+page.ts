export async function load({ params, url, fetch }) {
    const proofs = await (await fetch(`${import.meta.env.VITE_API_URL}/events/proofs?accepted=false`)).json()

    return {
        data: proofs
    }
}