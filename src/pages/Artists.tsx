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
import PageSizeSelector from '../components/PageSizeSelector';
import PageSelector from '../components/PageSelector';

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

	const [pageSize, setPageSize] = useState<number>(20);
	const [page, setPage] = useState<number>(0);

	const sortFunc = (a: ArtistPreviewType, b: ArtistPreviewType) =>
		ascending
			? compareArtists(a, b, sortOption)
			: compareArtists(b, a, sortOption);

	useEffect(() => {
		if (!spotifyApi || savedArtistIds.size === 0) return;
		spotifyApi
			.getArtists(
				[...savedArtistIds].slice(page * pageSize, (page + 1) * pageSize)
			)
			.then(response => {
				setArtists(response.body.artists as unknown as ArtistPreviewType[]);
			})
			.catch(error => alert(error));
	}, [savedArtistIds, pageSize, page]);

	return (
		<>
			<Box sx={{ display: 'flex', flexDirection: 'row', width: '100%' }}>
				<SortSelection
					sortOptions={ArtistSortableAttrs}
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
				savedAlbumsSize={savedArtistIds.size}
				setPage={setPage}
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
