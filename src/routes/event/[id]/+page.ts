import { redirect } from "@sveltejs/kit";

export async function load({ params, url, fetch }) {
    const { id } = params;
    const event: any =
        await (await fetch(`${import.meta.env.VITE_API_URL}/events/${id}`))
            .json();

    if (event.redirect) {
        throw redirect(307, event.redirect);
    }

    return event;
}
