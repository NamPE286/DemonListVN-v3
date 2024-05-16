export function getTitle(list: string, player: any) {
    if (list == 'dl') {
        if (player.rating >= 4200)
            return {
                title: 'LGM',
                fullTitle: 'Legendary Grandmaster',
                color: 'darkred'
            };
        if (player.rating >= 3800)
            return {
                title: 'GM',
                fullTitle: 'Grandmaster',
                color: 'red'
            };
        if (player.rating >= 3500)
            return {
                title: 'M',
                fullTitle: 'Master',
                color: 'hsla(321, 100%, 50%, 1)'
            };
        if (player.rating >= 3200)
            return {
                title: 'CM',
                fullTitle: 'Candidate Master',
                color: 'purple'
            };
        if (player.rating >= 2700)
            return {
                title: 'EX',
                fullTitle: 'Expert',
                color: 'blue'
            };
        if (player.rating >= 2000)
            return {
                title: 'SP',
                fullTitle: 'Specialist',
                color: 'darkcyan'
            };
        if (player.rating >= 1600)
            return {
                title: 'A',
                fullTitle: 'A',
                color: 'green'
            };
        if (player.rating >= 1000)
            return {
                title: 'B',
                fullTitle: 'B',
                color: '#413cde'
            };
        if (player.rating > 0)
            return {
                title: 'C',
                fullTitle: 'C',
                color: 'gray'
            };
        return null;
    }
}