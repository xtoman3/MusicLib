import React, { FC } from 'react';
import { Props } from 'react-flagkit';
import { arrayRemove, arrayUnion, updateDoc } from 'firebase/firestore';
import { useNavigate } from '@tanstack/react-router';
import { Grid, Paper, Typography } from '@mui/material';

import { useLoggedInUser } from '../hooks/useLoggedInUser';
import { albumsDocument } from '../firebase';
import { TrackPreviewType } from '../utils/TrackUtils';

type Props = {
	track: TrackPreviewType;
	saved: boolean;
	rating?: number;
	showRating?: boolean;
};

const TrackPreview: FC<Props> = ({ track, saved, rating, showRating }) => {
	const user = useLoggedInUser();
	const navigate = useNavigate();

	const handleSubmit = async () => {
		if (!user) navigate({ to: '/login' });
		else {
			if (!saved)
				await updateDoc(albumsDocument(user.uid), {
					ids: arrayUnion(track.id)
				});
			else
				await updateDoc(albumsDocument(user.uid), {
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
					flexDirection: 'row'
				}}
			>
				<Typography>{track.track_number}</Typography>
			</Paper>
		</Grid>
	);
};

export default TrackPreview;
