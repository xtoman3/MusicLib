import { Box } from '@mui/material';
import React, { FC, useEffect, useState } from 'react';
import { onSnapshot } from 'firebase/firestore';

import usePageTitle from '../hooks/usePageTitle';
import { useSpotifyApi } from '../hooks/useSpotifyApi';
import { AlbumPreviewType } from '../utils/AlbumUtils';
import { useLoggedInUser } from '../hooks/useLoggedInUser';
import { albumsDocument } from '../firebase';
import AlbumPreview from '../components/AlbumPreview';

const Albums: FC = () => {
	usePageTitle('Albums');
	const user = useLoggedInUser();
	const spotifyApi = useSpotifyApi();

	const [albums, setAlbums] = useState<AlbumPreviewType[] | undefined>([]);
	const [savedAlbumIds, setSavedAlbumIds] = useState<string[]>([]);
	const [ratings, setRatings] = useState<Map<string, number>>(
		new Map<string, number>()
	);

	useEffect(() => {
		if (!user) return;
		const unsubscribe = onSnapshot(albumsDocument(user.uid), doc => {
			const data = doc.data();
			setSavedAlbumIds(data?.ids ?? []);
			setRatings(new Map<string, number>(Object.entries(data?.ratings ?? {})));
		});

		return () => {
			unsubscribe();
		};
	}, []);

	useEffect(() => {
		if (!spotifyApi || savedAlbumIds.length === 0) return;
		spotifyApi
			.getAlbums(savedAlbumIds)
			.then(response => {
				setAlbums(response.body.albums as AlbumPreviewType[]);
			})
			.catch(error => alert(error));
	}, [savedAlbumIds]);

	return (
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
					rating={ratings.get(album.id) ?? 0}
					saved={savedAlbumIds.includes(album.id)}
					showRating
				/>
			))}
		</Box>
	);
};

export default Albums;
