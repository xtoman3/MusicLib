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
};
