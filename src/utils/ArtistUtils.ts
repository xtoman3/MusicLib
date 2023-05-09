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
