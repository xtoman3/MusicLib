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
