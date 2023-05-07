type ArtistArtist = {
	id: string;
	name: string;
};

type ArtistImage = {
	height: number;
	url: string;
};

export type ArtistPreviewType = {
	id: string;
	name: string;
	artists: ArtistArtist[];
	release_date: string;
	total_tracks: number;
	images: ArtistImage[];
	popularity?: number;
};
