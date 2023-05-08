import React, { FC, useEffect } from 'react';
import { Grid, Typography } from '@mui/material';

import usePageTitle from '../hooks/usePageTitle';
import { useSpotifyApi } from '../hooks/useSpotifyApi';
import { useSavedTracks } from '../hooks/useSavedTracks';
import { TrackPreviewType } from '../utils/TrackUtils';

const Tracks: FC = () => {
	usePageTitle('Tracks');
	const spotifyApi = useSpotifyApi();

	const {
		tracks: { tracks, setTracks },
		ids: { ids: savedTrackIds },
		ratings: { ratings }
	} = useSavedTracks();

	useEffect(() => {
		if (!spotifyApi || savedTrackIds.size === 0) return;
		spotifyApi
			.getTracks([...savedTrackIds])
			.then(response => {
				setTracks(response.body.tracks as TrackPreviewType[]);
			})
			.catch(error => alert(error));
	}, [savedTrackIds]);

	return (
		<Grid container spacing={1}>
			{tracks
				?.filter(track => savedTrackIds.has(track.id))
				// .sort(sortFunc)
				.map(track => (
					<Typography>Test</Typography>
				))}
		</Grid>
	);
};

export default Tracks;
