import { ComparisonFunction } from './GeneralUtils';

type AlbumArtist = {
	id: string;
	name: string;
};

type AlbumImage = {
	height: number;
	url: string;
};

export type AlbumPreviewType = {
	id: string;
	name: string;
	artists: AlbumArtist[];
	release_date: string;
	total_tracks: number;
	images: AlbumImage[];
	popularity?: number;
};

const attributes = ['name', 'release_date', 'popularity'] as const;
export type ComparableAttributes = (typeof attributes)[number];

const comparisonFunctions: Record<
	ComparableAttributes,
	ComparisonFunction<AlbumPreviewType>
> = {
	name: (a, b) => a.name.localeCompare(b.name),
	release_date: (a, b) =>
		new Date(a.release_date).getTime() - new Date(b.release_date).getTime(),
	popularity: (a, b) => (b.popularity ?? 0) - (a.popularity ?? 0)
};

export const compareAlbums = (
	a: AlbumPreviewType,
	b: AlbumPreviewType,
	attribute: ComparableAttributes
) => {
	const comparisonFunction = comparisonFunctions[attribute];
	if (comparisonFunction) {
		return comparisonFunction(a, b);
	}
	throw new Error(`Invalid attribute: ${attribute}`);
};
