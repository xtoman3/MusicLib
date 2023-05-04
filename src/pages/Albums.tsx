import { Box, TextField } from '@mui/material';
import React, {FC, FormEvent, useEffect, useState} from 'react';

import usePageTitle from '../hooks/usePageTitle';
import { useSpotifyApi } from '../hooks/useSpotifyApi';
import AlbumPreview, { AlbumPreviewType } from '../components/AlbumPreviewType';

const Albums: FC = () => {
	usePageTitle('Albums');
	const spotifyApi = useSpotifyApi();

	const [search, setSearch] = useState<string>('');

	const [albums, setAlbums] = useState<AlbumPreviewType[] | undefined>([]);

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
			setAlbums(undefined);
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
					<AlbumPreview key={album.id} album={album} />
				))}
			</Box>
		</>
	);
};

export default Albums;
