import { IconButton, Paper, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import ClearIcon from '@mui/icons-material/Clear';
import React, { FC } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { arrayRemove, arrayUnion, updateDoc } from 'firebase/firestore';

import { useLoggedInUser } from '../hooks/useLoggedInUser';
import { albumsDocument } from '../firebase';
import { AlbumPreviewType } from '../utils/AlbumUtils';

type Props = {
	album: AlbumPreviewType;
	saved: boolean;
};

const AlbumPreview: FC<Props> = ({ album, saved }) => {
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
			saved = !saved;
		}
	};

	return (
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
				title={album.name}
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
			<IconButton
				onClick={handleSubmit}
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
				{saved ? <ClearIcon /> : <AddIcon />}
			</IconButton>
		</Paper>
	);
};

export default AlbumPreview;
