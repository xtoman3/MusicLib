import React, {
	Dispatch,
	FC,
	SetStateAction,
	useEffect,
	useState
} from 'react';
import { Box, Grid } from '@mui/material';

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
import PageSizeSelector from '../components/PageSizeSelector';
import PageSelector from '../components/PageSelector';

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

	const [pageSize, setPageSize] = useState<number>(20);
	const [page, setPage] = useState<number>(0);

	const sortFunc = (a: TrackPreviewType, b: TrackPreviewType) =>
		ascending
			? compareTracks(a, b, sortOption)
			: compareTracks(b, a, sortOption);

	useEffect(() => {
		if (!spotifyApi || savedTrackIds.size === 0) return;
		spotifyApi
			.getTracks(
				[...savedTrackIds].slice(page * pageSize, (page + 1) * pageSize)
			)
			.then(response => {
				setTracks(response.body.tracks as TrackPreviewType[]);
			})
			.catch(error => alert(error));
	}, [savedTrackIds, pageSize, page]);

	return (
		<>
			<Box sx={{ display: 'flex', flexDirection: 'row', width: '100%' }}>
				<SortSelection
					sortOptions={TrackSortableAttrs}
					selectedOption={sortOption}
					setSelectedOption={setSortOption as Dispatch<SetStateAction<string>>}
					ascending={ascending}
					setAscending={setAscending}
				/>
				<Box sx={{ flexGrow: 1 }} />
				<PageSizeSelector
					pageSize={pageSize}
					setPageSize={setPageSize}
					setPage={setPage}
				/>
			</Box>
			<PageSelector
				page={page}
				pageSize={pageSize}
				savedAlbumsSize={savedTrackIds.size}
				setPage={setPage}
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
