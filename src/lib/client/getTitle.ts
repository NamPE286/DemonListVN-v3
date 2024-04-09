export function getTitle(list: string, rating: number) {
    if (list == 'dl') {
        if (rating >= 4200)
            return {
                title: 'LGM',
                fullTitle: 'Legendary Grandmaster',
                color: 'darkred'
            };
        if (rating >= 3600)
            return {
                title: 'GM',
                fullTitle: 'Grandmaster',
                color: 'red'
            };
        if (rating >= 3000)
            return {
                title: 'M',
                fullTitle: 'Master',
                color: 'darkorange'
            };
        if (rating >= 2800)
            return {
                title: 'CM',
                fullTitle: 'Candidate Master',
                color: 'purple'
            };
        if (rating >= 2500)
            return {
                title: 'EX',
                fullTitle: 'Expert',
                color: 'blue'
            };
        if (rating >= 2350)
            return {
                title: 'S+',
                fullTitle: 'S+',
                color: 'gold'
            };
        if (rating >= 2200)
            return {
                title: 'S',
                fullTitle: 'S',
                color: 'gold'
            };
        if (rating >= 2000)
            return {
                title: 'S-',
                fullTitle: 'S-',
                color: 'gold'
            };
        if (rating >= 1800)
            return {
                title: 'A+',
                fullTitle: 'A+',
                color: 'green'
            };
        if (rating >= 1600)
            return {
                title: 'A',
                fullTitle: 'A',
                color: 'green'
            };
        if (rating >= 1400)
            return {
                title: 'A-',
                fullTitle: 'A-',
                color: 'green'
            };
        if (rating >= 1200)
            return {
                title: 'B+',
                fullTitle: 'B+',
                color: '#413cde'
            };
        if (rating >= 1000)
            return {
                title: 'B',
                fullTitle: 'B',
                color: '#413cde'
            };
        if (rating >= 800)
            return {
                title: 'B-',
                fullTitle: 'B-',
                color: '#413cde'
            };
        if (rating >= 600)
            return {
                title: 'C+',
                fullTitle: 'C+',
                color: 'gray'
            };
        if (rating > 0)
            return {
                title: 'C',
                fullTitle: 'C',
                color: 'gray'
            };
        return null;
    }
}