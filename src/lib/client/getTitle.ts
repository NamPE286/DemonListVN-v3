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
		if (player.matchCount < 5) {
			return {
				fullTitle: `Need ${5 - player.matchCount} more contest to be ranked`
			};
		}

		if (player.elo >= 3500) {
			return {
				fullTitle: 'Global Elite',
				title: 'GE',
				color: 'darkred'
			};
		}

		if (player.elo >= 3000) {
			return {
				fullTitle: 'Elite',
				title: 'E',
				color: 'red'
			};
		}

		if (player.elo >= 2500) {
			return {
				fullTitle: 'Challenger First Class',
				title: 'CFE',
				color: 'hsla(321, 100%, 50%, 1)'
			};
		}

		if (player.elo >= 2000) {
			return {
				fullTitle: 'Challenger',
				title: 'CH',
				color: 'purple'
			};
		}

		if (player.elo >= 1500) {
			return {
				fullTitle: 'Diamond',
				title: 'DM',
				color: 'darkcyan'
			};
		}

		if (player.elo >= 1000) {
			return {
				fullTitle: 'Gold',
				title: 'AU',
				color: '#c9b22c'
			};
		}

		if (player.elo >= 500) {
			return {
				fullTitle: 'Silver',
				title: 'AG',
				color: 'gray'
			};
		}

		if (player.elo >= 200) {
			return {
				fullTitle: 'Iron',
				title: 'FE',
				color: 'gray'
			};
		}

		return {
			fullTitle: 'P',
			title: 'Plastic',
			color: 'P'
		};
	}
}
