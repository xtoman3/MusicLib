import { Box, Paper, TextField, Typography } from '@mui/material';
import React, { FC, FormEvent, useState } from 'react';

import usePageTitle from '../hooks/usePageTitle';
import { useSpotifyApi } from '../hooks/useSpotifyApi';

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
					<Paper
						key={album.id}
						sx={{
							p: 2,
							m: 1,
							maxWidth: 250,
							display: 'flex',
							flexDirection: 'column'
						}}
					>
						<Typography
							variant="h6"
							sx={{
								overflow: 'hidden',
								whiteSpace: 'nowrap',
								textOverflow: 'ellipsis'
							}}
						>
							{album.name}
						</Typography>
						<Typography variant="subtitle1">{album.artists[0].name}</Typography>
						<img src={album.images[0].url} alt={album.name} />
					</Paper>
				))}
			</Box>
		</>
	);
};

export default Albums;
