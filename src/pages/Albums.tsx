import { Box } from '@mui/material';
import React, { FC, useEffect } from 'react';

import usePageTitle from '../hooks/usePageTitle';
import { useSpotifyApi } from '../hooks/useSpotifyApi';
import { AlbumPreviewType } from '../utils/AlbumUtils';
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
			{albums
				?.filter(album => savedAlbumIds.has(album.id))
				.map(album => (
					<AlbumPreview
						key={album.id}
						album={album}
						rating={ratings.get(album.id) ?? 0}
						saved={savedAlbumIds.has(album.id)}
						showRating
					/>
				))}
		</Box>
	);
};

export default Albums;
