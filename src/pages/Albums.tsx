import { Box, Grid, MenuItem, Select } from '@mui/material';
import React, { FC, useEffect, useState } from 'react';

import usePageTitle from '../hooks/usePageTitle';
import { useSpotifyApi } from '../hooks/useSpotifyApi';
import {
	ComparableAttribute,
	AlbumPreviewType,
	compareAlbums
} from '../utils/AlbumUtils';
import AlbumPreview from '../components/AlbumPreview';
import { useSavedAlbums } from '../hooks/useSavedAlbums';

const Albums: FC = () => {
	usePageTitle('Albums');
	const spotifyApi = useSpotifyApi();

	const {
		albums: { albums, setAlbums },
		ids: { ids: savedAlbumIds },
		ratings: { ratings }
	} = useSavedAlbums();

	const [sortOption, setSortOption] = useState<ComparableAttribute>('name');
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
					<MenuItem value="release_date">Release date</MenuItem>
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
