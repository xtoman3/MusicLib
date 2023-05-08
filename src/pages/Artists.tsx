import { Box } from '@mui/material';
import React, { FC, useEffect } from 'react';

import usePageTitle from '../hooks/usePageTitle';
import { useSpotifyApi } from '../hooks/useSpotifyApi';
import { ArtistPreviewType } from '../utils/ArtistUtils';
import ArtistPreview from '../components/ArtistPreview';
import { useSavedArtists } from '../hooks/useSavedArtists';

const Artists: FC = () => {
	usePageTitle('Artists');
	const spotifyApi = useSpotifyApi();

	const {
		artists: { artists, setArtists },
		ids: { ids: savedArtistIds },
		ratings: { ratings }
	} = useSavedArtists();

	useEffect(() => {
		if (!spotifyApi || savedArtistIds.size === 0) return;
		spotifyApi
			.getArtists([...savedArtistIds])
			.then(response => {
				setArtists(response.body.artists as unknown as ArtistPreviewType[]);
			})
			.catch(error => alert(error));
	}, [savedArtistIds]);

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
			{artists
				?.filter(artist => savedArtistIds.has(artist.id))
				.sort(
					(a: ArtistPreviewType, b: ArtistPreviewType) =>
						b.followers.total - a.followers.total
				)
				.map(artist => (
					<ArtistPreview
						key={artist.id}
						artist={artist}
						rating={ratings.get(artist.id) ?? 0}
						saved={savedArtistIds.has(artist.id)}
						showRating
					/>
				))}
		</Box>
	);
};

export default Artists;
