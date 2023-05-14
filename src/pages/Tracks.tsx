import React, { FC, useEffect, useState } from 'react';
import { Box, Grid, MenuItem, Select } from '@mui/material';

import usePageTitle from '../hooks/usePageTitle';
import { useSpotifyApi } from '../hooks/useSpotifyApi';
import { useSavedTracks } from '../hooks/useSavedTracks';
import {
	ComparableAttribute,
	compareTracks,
	TrackPreviewType
} from '../utils/TrackUtils';
import TrackPreview from '../components/TrackPreview';
import { ComparisonFunction } from '../utils/GeneralUtils';

const Tracks: FC = () => {
	usePageTitle('Tracks');
	const spotifyApi = useSpotifyApi();

	const {
		tracks: { tracks, setTracks },
		ids: { ids: savedTrackIds },
		ratings: { ratings }
	} = useSavedTracks();

	const [sortOption, setSortOption] = useState<ComparableAttribute>('name');
	const [ascending, setAscending] = useState<boolean>(true);

	const sortFunc = (a: TrackPreviewType, b: TrackPreviewType) =>
		ascending
			? compareTracks(a, b, sortOption)
			: compareTracks(b, a, sortOption);

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
		<>
			<Box sx={{ display: 'flex', flexDirection: 'row' }}>
				<Select
					labelId="select-label"
					id="select"
					variant="standard"
					value={sortOption}
					onChange={e => setSortOption(e.target.value as ComparableAttribute)}
					sx={{ marginLeft: 2 }}
				>
					<MenuItem value="name">Name</MenuItem>
					<MenuItem value="duration">Duration</MenuItem>
					<MenuItem value="popularity">Popularity</MenuItem>
				</Select>
				<Select
					labelId="ascending-label"
					id="select-order"
					variant="standard"
					value={ascending ? 'ascending' : 'descending'}
					onChange={e => setAscending(e.target.value === 'ascending')}
					sx={{ marginLeft: 2 }}
				>
					<MenuItem value="ascending">Ascending</MenuItem>
					<MenuItem value="descending">Descending</MenuItem>
				</Select>
			</Box>
			<Grid container spacing={1}>
				{tracks
					?.filter(track => savedTrackIds.has(track.id))
					.sort(sortFunc)
					.map(track => (
						<TrackPreview
							key={track.id}
							track={track}
							saved={savedTrackIds.has(track.id)}
							rating={ratings.get(track.id) ?? 0}
							showRating
						/>
					))}
			</Grid>
		</>
	);
};

export default Tracks;
