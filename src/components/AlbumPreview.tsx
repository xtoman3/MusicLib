import { Box, Card, IconButton, Paper, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import ClearIcon from '@mui/icons-material/Clear';
import React, { FC, useMemo, useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { arrayRemove, arrayUnion, updateDoc } from 'firebase/firestore';

import { useLoggedInUser } from '../hooks/useLoggedInUser';
import { albumsDocument } from '../firebase';
import { AlbumPreviewType } from '../utils/AlbumUtils';

import RatingStrip from './RatingStrip';

type Props = {
	album: AlbumPreviewType;
	rating: number;
	saved: boolean;
};

const AlbumPreview: FC<Props> = ({ album, rating, saved }) => {
	const user = useLoggedInUser();
	const navigate = useNavigate();

	const handleSubmit = async () => {
		if (!user) navigate({ to: '/login' });
		else {
			if (!saved)
				await updateDoc(albumsDocument(user.uid), {
					ids: arrayUnion(album.id)
				});
			else
				await updateDoc(albumsDocument(user.uid), {
					ids: arrayRemove(album.id)
				});
		}
	};

	return (
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
			<Box
				sx={{
					display: 'flex',
					flexDirection: 'row'
				}}
			>
				<Typography
					variant="h6"
					title={album.name}
					sx={{
						overflow: 'hidden',
						whiteSpace: 'nowrap',
						textOverflow: 'ellipsis'
					}}
				>
					{album.name}
				</Typography>
				<Box sx={{ flexGrow: 1 }} />
				<IconButton
					onClick={handleSubmit}
					size="small"
					sx={{
						'marginLeft': 1,
						'backgroundColor': 'primary.main',
						'opacity': 1,
						'boxShadow': '0px 2px 4px rgba(0, 0, 0, 0.25)',
						'&:hover': {
							backgroundColor: 'primary.dark',
							opacity: 1
						}
					}}
				>
					{saved ? <ClearIcon /> : <AddIcon />}
				</IconButton>
			</Box>

			<Typography
				variant="subtitle1"
				title={album.artists[0].name}
				sx={{
					overflow: 'hidden',
					whiteSpace: 'nowrap',
					textOverflow: 'ellipsis'
				}}
			>
				by {album.artists[0].name}
			</Typography>
			<img src={album.images[1].url} alt={album.name} />
			<RatingStrip albumId={album.id} initStars={rating} />
		</Paper>
	);
};

export default AlbumPreview;
