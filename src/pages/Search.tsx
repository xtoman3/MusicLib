import {Box, TextField} from '@mui/material';
import React, {FC, useEffect, useState} from 'react';

import usePageTitle from '../hooks/usePageTitle';
import {useSpotifyApi} from '../hooks/useSpotifyApi';
import AlbumPreview from '../components/AlbumPreview';
import {AlbumPreviewType} from '../utils/AlbumUtils';
import {useSavedAlbums} from '../hooks/useSavedAlbums';

const Search: FC = () => {
	usePageTitle('Search');
	const spotifyApi = useSpotifyApi();
	const {
		albums: { albums, setAlbums },
		ids: { ids: savedAlbumIds }
	} = useSavedAlbums();

	const [search, setSearch] = useState<string>('');

	const searchAlbums = () => {
		spotifyApi
			?.searchAlbums(search)
			.then(response => {
				setAlbums(response.body.albums?.items as AlbumPreviewType[]);
			})
			.catch(error => alert(error));
	};

	useEffect(() => {
		if (search.length === 0) {
			setAlbums([]);
		} else searchAlbums();
	}, [search]);

	return (
		<>
			<Box
				component="form"
				maxWidth="sm"
				onSubmit={e => e.preventDefault()}
				sx={{ width: '100%' }}
			>
				<TextField
					id="query"
					label="Search albums"
					fullWidth
					variant="standard"
					value={search}
					onChange={e => setSearch(e.target.value)}
				/>
			</Box>
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
				{albums?.map(album => (
					<AlbumPreview
						key={album.id}
						album={album}
						saved={savedAlbumIds.includes(album.id)}
					/>
				))}
			</Box>
		</>
	);
};

export default Search;
