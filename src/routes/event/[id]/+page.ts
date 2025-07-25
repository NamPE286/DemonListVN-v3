import { redirect } from "@sveltejs/kit";

export async function load({ params, url, fetch }) {
    const { id } = params;
    const event =
        await (await fetch(`${import.meta.env.VITE_API_URL}/event/${id}`))
            .json();

    if (event.redirect) {
        throw redirect(307, event.redirect);
    }

    return event;
}
