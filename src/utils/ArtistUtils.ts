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
	artists: ArtistArtist[]; // to remove
	followers: number; // added
	genres: string[]; // added
	release_date: string; // to remove
	total_tracks: number; // to remove
	images: ArtistImage[];
	popularity?: number;
};
