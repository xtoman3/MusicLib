import { Grid } from '@mui/material';
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
	ComparableAlbumAttr,
	AlbumPreviewType,
	compareAlbums,
	AlbumSortableAttrs
} from '../utils/AlbumUtils';
import AlbumPreview from '../components/AlbumPreview';
import { useSavedAlbums } from '../hooks/useSavedAlbums';
import SortSelection from '../components/SortSelection';

const Albums: FC = () => {
	usePageTitle('Albums');
	const spotifyApi = useSpotifyApi();

	const {
		albums: { albums, setAlbums },
		ids: { ids: savedAlbumIds },
		ratings: { ratings }
	} = useSavedAlbums();

	const [sortOption, setSortOption] = useState<ComparableAlbumAttr>('name');
	const [ascending, setAscending] = useState<boolean>(true);

	const sortFunc = (a: AlbumPreviewType, b: AlbumPreviewType) =>
		ascending
			? compareAlbums(a, b, sortOption)
			: compareAlbums(b, a, sortOption);

	useEffect(() => {
		if (!spotifyApi || savedAlbumIds.size === 0) return;
		spotifyApi
			.getAlbums([...savedAlbumIds])
			.then(response => {
				setAlbums(response.body.albums as AlbumPreviewType[]);
			})
			.catch(error => alert(error));
	}, [savedAlbumIds]);

	return (
		<>
			<SortSelection
				sortOptions={AlbumSortableAttrs}
				selectedOption={sortOption}
				setSelectedOption={setSortOption as Dispatch<SetStateAction<string>>}
				ascending={ascending}
				setAscending={setAscending}
			/>
			<Grid container spacing={1}>
				{albums
					?.filter(album => savedAlbumIds.has(album.id))
					.sort(sortFunc)
					.map(album => (
						<AlbumPreview
							key={album.id}
							album={album}
							saved={savedAlbumIds.has(album.id)}
							rating={ratings.get(album.id) ?? 0}
							showRating
						/>
					))}
			</Grid>
		</>
	);
};

export default Albums;
