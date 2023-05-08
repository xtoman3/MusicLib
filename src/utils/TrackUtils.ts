type TrackArtist = {
	id: string;
	name: string;
};

export type TrackPreviewType = {
	id: string;
	name: string;
	album: string;
	artists: TrackArtist[];
	popularity: number;
	track_number: number;
	duration: number;
};
