import { Paper, Typography } from '@mui/material';
import React, { FC } from 'react';

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

type Props = {
	album: AlbumPreviewType;
};

const AlbumPreview: FC<Props> = ({ album }) => (
	<Paper
		key={album.id}
		sx={{
			p: 2,
			m: 1,
			maxWidth: 250,
			display: 'flex',
			flexDirection: 'column'
		}}
	>
		<Typography
			variant="h6"
			sx={{
				overflow: 'hidden',
				whiteSpace: 'nowrap',
				textOverflow: 'ellipsis'
			}}
		>
			{album.name}
		</Typography>
		<Typography variant="subtitle1">{album.artists[0].name}</Typography>
		<img src={album.images[1].url} alt={album.name} />
	</Paper>
);

export default AlbumPreview;
