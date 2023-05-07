import { FC, useEffect, useState } from 'react';
import { Box, Typography } from '@mui/material';
import { useParams } from '@tanstack/react-router';

import usePageTitle from '../hooks/usePageTitle';
import { useSpotifyApi } from '../hooks/useSpotifyApi';
import { useSavedAlbums } from '../hooks/useSavedAlbums';

const AlbumDetail: FC = () => {
	usePageTitle('Album');
	const spotifyApi = useSpotifyApi();
	const {
		ids: { ids: savedAlbumIds },
		ratings: { ratings }
	} = useSavedAlbums();

	console.log(useParams());
	const { albumId } = useParams();

	const [album, setAlbum] = useState<SpotifyApi.SingleAlbumResponse>();

	useEffect(() => {
		if (!albumId) return;
		spotifyApi
			?.getAlbum(albumId)
			.then(response => setAlbum(response.body))
			.catch(error => alert(error));
	}, [spotifyApi]);

	if (!album) {
		return <Typography variant="h4">Album not found</Typography>;
	}
	return (
		<Box sx={{ display: 'flex' }}>
			{/* Image */}
			<Box sx={{ marginRight: 2 }}>
				<img src={album.images[0].url} alt={album.name} />
			</Box>

			{/* Album Name and Artist */}
			<Box>
				<Typography variant="h6">{album.name}</Typography>
				<Typography variant="subtitle1">{album.artists[0].name}</Typography>
			</Box>

			{/* Details */}
			<Box sx={{ marginTop: 2 }}>
				<Typography variant="body1">
					Release Date: {album.release_date}
				</Typography>
				<Typography variant="body1">Popularity: {album.popularity}</Typography>
				<Typography variant="body1">
					Total Tracks: {album.total_tracks}
				</Typography>
			</Box>

			{/* Track List */}
			{/* Add your track list component here */}
		</Box>
	);
};

export default AlbumDetail;
