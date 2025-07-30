export function getTitle(list: string, player: any) {
    if (list == "dl") {
        if (player.rating >= 6000) {
            return {
                title: "AGM",
                fullTitle: "Ascended Grandmaster",
                color:
                    "white;background: linear-gradient(to right, #ff00cc, #333399);",
            };
        }
        if (player.rating >= 5500) {
            return {
                title: "LGM",
                fullTitle: "Legendary Grandmaster",
                color: "darkred",
            };
        }
        if (player.rating >= 4500) {
            return {
                title: "GM",
                fullTitle: "Grandmaster",
                color: "red",
            };
        }
        if (player.rating >= 3500) {
            return {
                title: "M",
                fullTitle: "Master",
                color: "hsla(321, 100%, 50%, 1)",
            };
        }
        if (player.rating >= 2200) {
            return {
                title: "CM",
                fullTitle: "Candidate Master",
                color: "purple",
            };
        }
        if (player.rating >= 1500) {
            return {
                title: "EX",
                fullTitle: "Expert",
                color: "blue",
            };
        }
        if (player.rating >= 800) {
            return {
                title: "SP",
                fullTitle: "Specialist",
                color: "darkcyan",
            };
        }
        if (player.rating >= 500) {
            return {
                title: "A",
                fullTitle: "A",
                color: "green",
            };
        }
        if (player.rating >= 250) {
            return {
                title: "B",
                fullTitle: "B",
                color: "#413cde",
            };
        }
        if (player.rating > 0) {
            return {
                title: "C",
                fullTitle: "C",
                color: "gray",
            };
        }
        return null;
    }
}
