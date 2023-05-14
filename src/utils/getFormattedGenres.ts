const getFormattedGenres = (genres: string[]): string => {
	let result: string;
	switch (genres.length) {
		case 0:
			return 'No genres';
		case 1:
			result = 'genre: ';
			break;
		default:
			result = 'genres: ';
			break;
	}
	for (let i = 0; i < genres.length; i++) {
		result += `${genres[i]}, `;
	}
	return result.slice(0, result.length - 2);
};

export default getFormattedGenres;
