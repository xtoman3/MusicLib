import { Box, TextField } from '@mui/material';
import React, { FC, FormEvent, useState } from 'react';

import usePageTitle from '../hooks/usePageTitle';
import { useSpotifyApi } from '../hooks/useSpotifyApi';
import AlbumPreview from '../components/AlbumPreview';

const Albums: FC = () => {
	usePageTitle('Albums');
	const spotifyApi = useSpotifyApi();

	const [search, setSearch] = useState<string>('');

	const [albums, setAlbums] = useState<any[] | undefined>([]);

	const searchAlbums = (e: FormEvent) => {
		e.preventDefault();
		spotifyApi
			?.searchAlbums(search)
			.then(response => {
				console.log(response);
				setAlbums(response.body.albums?.items);
			})
			.catch(error => console.log(error));
	};

	return (
		<>
			<Box
				component="form"
				maxWidth="sm"
				onSubmit={searchAlbums}
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
