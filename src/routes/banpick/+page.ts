export async function load({ params, url, fetch }) {
    const uidA = url.searchParams.get("a");
    const uidB = url.searchParams.get("b");
    const levelIDs: number[] = JSON.parse(url.searchParams.get("levels")!);
    const levels = [];

    const players =
        await (await fetch(`${import.meta.env.VITE_API_URL}/players`, {
            method: "POST",
            body: JSON.stringify({
                batch: [uidA, uidB],
            }),
            headers: {
                "Content-Type": "application/json",
            },
        }))
            .json();

    for (const i of levelIDs) {
        levels.push(
            await (await fetch(`https://gdbrowser.com/api/level/${i}`)).json(),
        );
    }

    return {
        players: players,
        levels: levels
    }
}
