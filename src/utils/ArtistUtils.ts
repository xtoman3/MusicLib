import { ComparisonFunction } from './GeneralUtils';

type ArtistImage = {
	height: number;
	url: string;
};

type ArtistFollowers = {
	total: number;
};

export type ArtistPreviewType = {
	id: string;
	name: string;
	genres: string[];
	followers: ArtistFollowers;
	images: ArtistImage[];
	popularity?: number;
};

export const ArtistSortableAttrs = ['name', 'followers', 'popularity'] as const;
export type ComparableArtistAttr = (typeof ArtistSortableAttrs)[number];

const comparisonFunctions: Record<
	ComparableArtistAttr,
	ComparisonFunction<ArtistPreviewType>
> = {
	name: (a, b) => a.name.localeCompare(b.name),
	followers: (a, b) => b.followers.total - a.followers.total,
	popularity: (a, b) => (b.popularity ?? 0) - (a.popularity ?? 0)
};

export const compareArtists = (
	a: ArtistPreviewType,
	b: ArtistPreviewType,
	attribute: ComparableArtistAttr
) => {
	const comparisonFunction = comparisonFunctions[attribute];
	if (comparisonFunction) {
		return comparisonFunction(a, b);
	}
	throw new Error(`Invalid attribute: ${attribute}`);
};
