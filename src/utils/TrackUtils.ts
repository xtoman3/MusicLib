import { ComparisonFunction } from './GeneralUtils';

type TrackArtist = {
	id: string;
	name: string;
};

type TrackAlbum = {
	id: string;
	name: string;
};

export type TrackPreviewType = {
	id: string;
	name: string;
	album?: TrackAlbum;
	artists: TrackArtist[];
	popularity?: number;
	track_number: number;
	duration_ms: number;
};

const attributes = ['name', 'duration', 'popularity', 'track_number'] as const;
export type ComparableAttribute = (typeof attributes)[number];

const comparisonFunctions: Record<
	ComparableAttribute,
	ComparisonFunction<TrackPreviewType>
> = {
	name: (a, b) => a.name.localeCompare(b.name),
	duration: (a, b) => b.duration_ms - a.duration_ms,
	popularity: (a, b) => (b.popularity ?? 0) - (a.popularity ?? 0),
	track_number: (a, b) => b.track_number - a.track_number
};

export const compareTracks = (
	a: TrackPreviewType,
	b: TrackPreviewType,
	attribute: ComparableAttribute
) => {
	const comparisonFunction = comparisonFunctions[attribute];
	if (comparisonFunction) {
		return comparisonFunction(a, b);
	}
	throw new Error(`Invalid attribute: ${attribute}`);
};
