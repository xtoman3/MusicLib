import { Box } from '@mui/material';
import React, {
	Dispatch,
	FC,
	SetStateAction,
	useEffect,
	useState
} from 'react';

import usePageTitle from '../hooks/usePageTitle';
import { useSpotifyApi } from '../hooks/useSpotifyApi';
import {
	ArtistPreviewType,
	ComparableArtistAttr,
	compareArtists,
	ArtistSortableAttrs
} from '../utils/ArtistUtils';
import ArtistPreview from '../components/ArtistPreview';
import { useSavedArtists } from '../hooks/useSavedArtists';
import SortSelection from '../components/SortSelection';

const Artists: FC = () => {
	usePageTitle('Artists');
	const spotifyApi = useSpotifyApi();

	const {
		artists: { artists, setArtists },
		ids: { ids: savedArtistIds },
		ratings: { ratings }
	} = useSavedArtists();

	const [sortOption, setSortOption] = useState<ComparableArtistAttr>('name');
	const [ascending, setAscending] = useState<boolean>(true);

	const sortFunc = (a: ArtistPreviewType, b: ArtistPreviewType) =>
		ascending
			? compareArtists(a, b, sortOption)
			: compareArtists(b, a, sortOption);

	useEffect(() => {
		if (!spotifyApi || savedArtistIds.size === 0) return;
		spotifyApi
			.getArtists([...savedArtistIds])
			.then(response => {
				setArtists(response.body.artists as unknown as ArtistPreviewType[]);
			})
			.catch(error => alert(error));
	}, [savedArtistIds]);

	return (
		<>
			<SortSelection
				sortOptions={ArtistSortableAttrs}
				selectedOption={sortOption}
				setSelectedOption={setSortOption as Dispatch<SetStateAction<string>>}
				ascending={ascending}
				setAscending={setAscending}
			/>
			<Box
				sx={{
					display: 'flex',
					flexDirection: 'row',
					flexWrap: 'wrap',
					justifyContent: 'center',
					alignItems: 'flex-start',
					alignContent: 'flex-start'
				}}
			>
				{artists
					?.filter(artist => savedArtistIds.has(artist.id))
					.sort(sortFunc)
					.map(artist => (
						<ArtistPreview
							key={artist.id}
							artist={artist}
							rating={ratings.get(artist.id) ?? 0}
							saved={savedArtistIds.has(artist.id)}
							showRating
						/>
					))}
			</Box>
		</>
	);
};

export default Artists;
