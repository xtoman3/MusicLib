import { IconButton, Paper, Typography } from '@mui/material';
import FavoriteRoundedIcon from '@mui/icons-material/FavoriteRounded';
import FavoriteBorderRoundedIcon from '@mui/icons-material/FavoriteBorderRounded';
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
			maxWidth: 230,
			display: 'flex',
			flexDirection: 'column',
			position: 'relative'
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
		<Typography
			variant="subtitle1"
			sx={{
				overflow: 'hidden',
				whiteSpace: 'nowrap',
				textOverflow: 'ellipsis'
			}}
		>
			by {album.artists[0].name}
		</Typography>
		<img src={album.images[1].url} alt={album.name} />
		<IconButton
			sx={{
				'position': 'absolute',
				'bottom': 12,
				'right': 12,
				'backgroundColor': 'primary.main',
				'opacity': 0.7,
				'boxShadow': '0px 2px 4px rgba(0, 0, 0, 0.25)',
				'&:hover': {
					backgroundColor: 'primary.main',
					opacity: 1
				}
			}}
		>
			<FavoriteBorderRoundedIcon />
		</IconButton>
	</Paper>
);

export default AlbumPreview;
