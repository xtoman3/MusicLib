import React, {
	Dispatch,
	FC,
	SetStateAction,
	useEffect,
	useState
} from 'react';
import { Grid } from '@mui/material';

import usePageTitle from '../hooks/usePageTitle';
import { useSpotifyApi } from '../hooks/useSpotifyApi';
import { useSavedTracks } from '../hooks/useSavedTracks';
import {
	ComparableTrackAttrs,
	compareTracks,
	TrackPreviewType,
	TrackSortableAttrs
} from '../utils/TrackUtils';
import TrackPreview from '../components/TrackPreview';
import SortSelection from '../components/SortSelection';

const Tracks: FC = () => {
	usePageTitle('Tracks');
	const spotifyApi = useSpotifyApi();

	const {
		tracks: { tracks, setTracks },
		ids: { ids: savedTrackIds },
		ratings: { ratings }
	} = useSavedTracks();

	const [sortOption, setSortOption] = useState<ComparableTrackAttrs>('name');
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
			<SortSelection
				sortOptions={TrackSortableAttrs}
				selectedOption={sortOption}
				setSelectedOption={setSortOption as Dispatch<SetStateAction<string>>}
				ascending={ascending}
				setAscending={setAscending}
			/>
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
