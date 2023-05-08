import React, { FC } from 'react';
import { arrayRemove, arrayUnion, updateDoc } from 'firebase/firestore';
import { useNavigate } from '@tanstack/react-router';
import { Box, Grid, IconButton, Paper, Typography } from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';
import AddIcon from '@mui/icons-material/Add';

import { useLoggedInUser } from '../hooks/useLoggedInUser';
import { tracksDocument } from '../firebase';
import { TrackPreviewType } from '../utils/TrackUtils';

import RatingStrip from './RatingStrip';

type Props = {
	track: TrackPreviewType;
	saved: boolean;
	rating?: number;
	showRating?: boolean;
};

const formatDuration = (duration_ms: number): string => {
	const totalSeconds = Math.floor(duration_ms / 1000);
	const minutes = Math.floor(totalSeconds / 60);
	const seconds = totalSeconds % 60;

	return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};

const TrackPreview: FC<Props> = ({ track, saved, rating, showRating }) => {
	const user = useLoggedInUser();
	const navigate = useNavigate();

	const handleSubmit = async () => {
		if (!user) navigate({ to: '/login' });
		else {
			if (!saved)
				await updateDoc(tracksDocument(user.uid), {
					ids: arrayUnion(track.id)
				});
			else
				await updateDoc(tracksDocument(user.uid), {
					ids: arrayRemove(track.id)
				});
		}
	};

	return (
		<Grid item key={track.id} xs={12}>
			<Paper
				sx={{
					p: 2,
					display: 'flex',
					flexDirection: 'row',
					alignItems: 'center'
				}}
			>
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
				<Box ml={1}>
					<RatingStrip
						id={track.id}
						type="Track"
						initStars={rating ?? 0}
						size="small"
					/>
				</Box>
				<Typography variant="h6" sx={{ marginX: 2, width: '30%' }}>
					{track.name}
				</Typography>
				<Typography variant="body1" sx={{ marginX: 2, width: '20%' }}>
					{track.album?.name ?? 'Unknown'}
				</Typography>
				<Typography variant="body1" sx={{ marginX: 2, width: '20%' }}>
					{track.artists[0].name}
				</Typography>
				<Box sx={{ flexGrow: 1 }} />
				<Typography variant="body2" sx={{ marginX: 2 }}>
					{formatDuration(track.duration_ms)}
				</Typography>
			</Paper>
		</Grid>
	);
};

export default TrackPreview;
