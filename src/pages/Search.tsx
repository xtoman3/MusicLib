import { Box, TextField } from '@mui/material';
import React, { FC, useEffect, useState } from 'react';
import { getDoc } from 'firebase/firestore';

import usePageTitle from '../hooks/usePageTitle';
import { useSpotifyApi } from '../hooks/useSpotifyApi';
import AlbumPreview from '../components/AlbumPreview';
import { AlbumPreviewType } from '../utils/AlbumUtils';
import { albumsDocument } from '../firebase';
import { useLoggedInUser } from '../hooks/useLoggedInUser';

const Search: FC = () => {
	usePageTitle('Search');
	const user = useLoggedInUser();
	const spotifyApi = useSpotifyApi();

	const [search, setSearch] = useState<string>('');

	const [albums, setAlbums] = useState<AlbumPreviewType[] | undefined>([]);
	const [savedAlbumIds, setSavedAlbumIds] = useState<string[]>([]);

	const getSavedAlbums = async () => {
		if (!user || !spotifyApi) return;
		const docSnap = await getDoc(albumsDocument(user.uid));
		const albumIds = docSnap.data()?.ids;
		if (albumIds) setSavedAlbumIds(albumIds);
	};

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

	useEffect(() => {
		getSavedAlbums();
	}, []);

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
