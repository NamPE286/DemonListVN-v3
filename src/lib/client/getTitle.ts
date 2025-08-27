export function getTitle(list: string, player: any) {
	if (list == 'dl') {
		if (player.rating >= 6000) {
			return {
				title: 'AGM',
				fullTitle: 'Ascended Grandmaster',
				color: 'white;background: linear-gradient(to right, #ff00cc, #333399);'
			};
		}
		if (player.rating >= 5000) {
			return {
				title: 'LGM',
				fullTitle: 'Legendary Grandmaster',
				color: 'darkred'
			};
		}
		if (player.rating >= 4000) {
			return {
				title: 'GM',
				fullTitle: 'Grandmaster',
				color: 'red'
			};
		}
		if (player.rating >= 3000) {
			return {
				title: 'M',
				fullTitle: 'Master',
				color: 'hsla(321, 100%, 50%, 1)'
			};
		}
		if (player.rating >= 2500) {
			return {
				title: 'CM',
				fullTitle: 'Candidate Master',
				color: 'purple'
			};
		}
		if (player.rating >= 2000) {
			return {
				title: 'EX',
				fullTitle: 'Expert',
				color: 'blue'
			};
		}
		if (player.rating >= 1500) {
			return {
				title: 'SP',
				fullTitle: 'Specialist',
				color: 'darkcyan'
			};
		}
		if (player.rating >= 1000) {
			return {
				title: 'A',
				fullTitle: 'A',
				color: 'green'
			};
		}
		if (player.rating >= 500) {
			return {
				title: 'B',
				fullTitle: 'B',
				color: '#413cde'
			};
		}
		if (player.rating > 0) {
			return {
				title: 'C',
				fullTitle: 'C',
				color: 'gray'
			};
		}
		return null;
	}

	if (list == 'elo') {
		if (player.matchCount < 10) {
			return {
				fullTitle: `Need ${10 - player.matchCount} more contest to be ranked`
			};
		}

		if (player.elo >= 3500) {
			return {
				title: 'Global Elite',
				fullTitle: 'GE',
				color: 'darkred'
			};
		}

		if (player.elo >= 3000) {
			return {
				title: 'Elite',
				fullTitle: 'E',
				color: 'red'
			};
		}

		if (player.elo >= 2500) {
			return {
				title: 'Challenger First Class',
				fullTitle: 'CFE',
				color: 'hsla(321, 100%, 50%, 1)'
			};
		}

		if (player.elo >= 2000) {
			return {
				title: 'Challenger',
				fullTitle: 'CH',
				color: 'purple'
			};
		}

		if (player.elo >= 1500) {
			return {
				title: 'Diamond',
				fullTitle: 'DM',
				color: 'darkcyan'
			};
		}

		if (player.elo >= 1000) {
			return {
				title: 'Gold',
				fullTitle: 'AU',
				color: 'darkyellow'
			};
		}

		if (player.elo >= 500) {
			return {
				title: 'Silver',
				fullTitle: 'AG',
				color: 'gray'
			};
		}

		if (player.elo >= 200) {
			return {
				title: 'Iron',
				fullTitle: 'FE',
				color: 'gray'
			};
		}

		return {
			title: 'P',
			fullTitle: 'Plastic',
			color: 'P'
		};
	}
}
