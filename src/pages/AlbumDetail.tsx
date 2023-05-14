import React, { FC, useEffect, useState } from 'react';
import { Box, Grid, Paper, Typography } from '@mui/material';
import { useNavigate, useParams } from '@tanstack/react-router';

import usePageTitle from '../hooks/usePageTitle';
import { useSpotifyApi } from '../hooks/useSpotifyApi';
import { useSavedAlbums } from '../hooks/useSavedAlbums';
import RatingStrip from '../components/RatingStrip';
import TrackPreview from '../components/TrackPreview';
import { TrackPreviewType } from '../utils/TrackUtils';
import { useSavedTracks } from '../hooks/useSavedTracks';

const AlbumDetail: FC = () => {
	usePageTitle('Album');
	const spotifyApi = useSpotifyApi();
	const {
		ratings: { ratings }
	} = useSavedAlbums();
	const navigate = useNavigate();

	const {
		ids: { ids: savedTrackIds }
	} = useSavedTracks();

	const { albumId } = useParams();

	const [album, setAlbum] = useState<SpotifyApi.SingleAlbumResponse>();
	const [tracks, setTracks] = useState<TrackPreviewType[]>([]);

	useEffect(() => {
		if (!albumId) return;
		spotifyApi
			?.getAlbum(albumId)
			.then(response => setAlbum(response.body))
			.catch(error => alert(error));

		spotifyApi
			?.getAlbumTracks(albumId)
			.then(response => setTracks(response.body.items as TrackPreviewType[]));
	}, [spotifyApi]);

	if (!album) {
		return <Typography variant="h4">Album not found</Typography>;
	}
	return (
		<Paper
			sx={{
				display: 'flex',
				flexDirection: 'column',
				width: '100%',
				maxWidth: 'lg'
			}}
		>
			<Box
				sx={{
					padding: 4,
					display: 'flex',
					flexDirection: 'row',
					flexWrap: 'wrap',
					justifyContent: 'center',
					alignItems: 'flex-start',
					alignContent: 'flex-start'
				}}
			>
				<img
					src={album.images[1].url}
					alt={album.name}
					style={{ maxWidth: '100%' }}
				/>
				<Box sx={{ margin: 2, display: 'flex', flexDirection: 'column' }}>
					<Typography variant="h3">{album.name}</Typography>
					<Typography
						variant="h5"
						// @ts-ignore
						onClick={() => navigate({ to: `/artist/${album.artists[0].id}` })}
						sx={{
							'&:hover': {
								cursor: 'pointer',
								color: 'primary.main',
								opacity: 1
							}
						}}
					>
						by {album.artists[0].name}
					</Typography>
					<Box sx={{ marginTop: 2 }}>
						<Typography variant="body1">
							Release Date: {album.release_date}
						</Typography>
						<Typography variant="body1">
							Popularity: {album.popularity}
						</Typography>
						<Typography variant="body1">
							Total Tracks: {album.total_tracks}
						</Typography>
					</Box>
					<RatingStrip
						id={album.id}
						type="Album"
						initStars={ratings.get(album.id) ?? 0}
					/>
				</Box>
			</Box>

			<Grid container spacing={1}>
				{tracks
					?.sort((trackA, trackB) => trackB.track_number - trackA.track_number)
					.map(track => {
						track.album = album;
						return track;
					})
					.map(track => (
						<TrackPreview
							key={track.id}
							track={track}
							saved={savedTrackIds.has(track.id)}
							rating={ratings.get(track.id) ?? 0}
							showRating
						/>
					))}
			</Grid>
		</Paper>
	);
};

export default AlbumDetail;
