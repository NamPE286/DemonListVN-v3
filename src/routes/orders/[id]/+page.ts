export async function load({ params, url, fetch }) {
    const { id } = params;
    const data =
        await (await fetch(`${import.meta.env.VITE_API_URL}/order/${id}`))
            .json();

    data.orderTracking.push({
        created_at: data.created_at,
        content: "Order created",
    });

    return data;
}
