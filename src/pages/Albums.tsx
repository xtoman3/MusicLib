import { Box, Grid, MenuItem, Select } from '@mui/material';
import React, { FC, useEffect, useState } from 'react';

import usePageTitle from '../hooks/usePageTitle';
import { useSpotifyApi } from '../hooks/useSpotifyApi';
import { AlbumPreviewType } from '../utils/AlbumUtils';
import AlbumPreview from '../components/AlbumPreview';
import { useSavedAlbums } from '../hooks/useSavedAlbums';

enum SortOptions {
	Name = 'Name',
	Release = 'Release',
	Popularity = 'Popularity'
}

const Albums: FC = () => {
	usePageTitle('Albums');
	const spotifyApi = useSpotifyApi();

	const {
		albums: { albums, setAlbums },
		ids: { ids: savedAlbumIds },
		ratings: { ratings }
	} = useSavedAlbums();

	const [sortOption, setSortOption] = useState<SortOptions>(SortOptions.Name);
	const [ascending, setAscending] = useState<boolean>(true);

	const compare = (a: AlbumPreviewType, b: AlbumPreviewType) => {
		switch (sortOption) {
			case SortOptions.Name:
				return a.name.localeCompare(b.name);
			case SortOptions.Release:
				return (
					new Date(a.release_date).getTime() -
					new Date(b.release_date).getTime()
				);
			case SortOptions.Popularity:
				return (b.popularity ?? 0) - (a.popularity ?? 0);
		}
	};

	const sortFunc = (a: AlbumPreviewType, b: AlbumPreviewType) =>
		ascending ? compare(a, b) : compare(b, a);

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
					onChange={e =>
						setSortOption(
							SortOptions[e.target.value as keyof typeof SortOptions]
						)
					}
					sx={{ marginLeft: 2 }}
				>
					<MenuItem value={SortOptions.Name}>Name</MenuItem>
					<MenuItem value={SortOptions.Release}>Release date</MenuItem>
					<MenuItem value={SortOptions.Popularity}>Popularity</MenuItem>
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
