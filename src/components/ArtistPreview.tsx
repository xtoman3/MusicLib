import { Box, IconButton, Paper, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import ClearIcon from '@mui/icons-material/Clear';
import React, { FC } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { arrayRemove, arrayUnion, updateDoc } from 'firebase/firestore';

import { useLoggedInUser } from '../hooks/useLoggedInUser';
import { artistsDocument } from '../firebase';
import { ArtistPreviewType } from '../utils/ArtistUtils';
import getFormattedGenres from '../helpers/getFormattedGenres';

import RatingStrip from './RatingStrip';

type Props = {
	artist: ArtistPreviewType;
	saved: boolean;
	rating?: number;
	showRating?: boolean;
};

const ArtistPreview: FC<Props> = ({ artist, saved, rating, showRating }) => {
	const user = useLoggedInUser();
	const navigate = useNavigate();

	const handleSubmit = async () => {
		if (!user) navigate({ to: '/login' });
		else {
			if (!saved)
				await updateDoc(artistsDocument(user.uid), {
					ids: arrayUnion(artist.id)
				});
			else
				await updateDoc(artistsDocument(user.uid), {
					ids: arrayRemove(artist.id)
				});
		}
	};

	return (
		<Paper
			key={artist.id}
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
					title={artist.name}
					// @ts-ignore
					onClick={() => navigate({ to: `/artist/${artist.id}` })}
					sx={{
						'overflow': 'hidden',
						'whiteSpace': 'nowrap',
						'textOverflow': 'ellipsis',
						'&:hover': {
							cursor: 'pointer',
							color: 'primary.main',
							opacity: 1
						}
					}}
				>
					{artist.name}
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
							cursor: 'pointer',
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
				title="Number of followers"
				sx={{
					overflow: 'hidden',
					whiteSpace: 'pre-wrap',
					display: 'block'
				}}
			>
				followers: {artist.followers.total}
			</Typography>

			<Typography
				variant="subtitle1"
				title={artist.genres[0]}
				sx={{
					overflow: 'hidden',
					whiteSpace: 'pre-wrap',
					display: 'block'
				}}
			>
				{getFormattedGenres(artist.genres)}
			</Typography>
			<img
				src={artist.images[0]?.url ?? 'https://shorturl.at/cnqtP'}
				alt={artist.name}
			/>
			<Typography
				variant="subtitle2"
				title="popularity"
				sx={{
					overflow: 'hidden',
					whiteSpace: 'pre-wrap',
					display: 'block'
				}}
			>
				popularity: {artist.popularity}
			</Typography>
			{showRating && (
				<RatingStrip id={artist.id} type="Artist" initStars={rating ?? 0} />
			)}
		</Paper>
	);
};

export default ArtistPreview;
