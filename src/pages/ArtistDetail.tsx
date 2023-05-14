import { useParams } from '@tanstack/react-router';
import { FC, useEffect, useState } from 'react';
import { Box, Grid, Paper, Typography } from '@mui/material';

import usePageTitle from '../hooks/usePageTitle';
import { useSpotifyApi } from '../hooks/useSpotifyApi';
import RatingStrip from '../components/RatingStrip';
import { useSavedArtists } from '../hooks/useSavedArtists';
import getFormattedGenres from '../utils/getFormattedGenres';
import { TrackPreviewType } from '../utils/TrackUtils';
import TrackPreview from '../components/TrackPreview';
import { useSavedTracks } from '../hooks/useSavedTracks';

const ArtistDetail: FC = () => {
	usePageTitle('Artist');
	const spotifyApi = useSpotifyApi();

	const {
		ratings: { ratings }
	} = useSavedArtists();

	const {
		ids: { ids: savedTrackIds }
	} = useSavedTracks();

	const { artistId } = useParams();

	const [artist, setArtist] = useState<SpotifyApi.SingleArtistResponse>();
	const [tracks, setTracks] = useState<TrackPreviewType[]>([]);

	useEffect(() => {
		if (!artistId) return;
		spotifyApi?.getArtist(artistId).then(response => setArtist(response.body));

		spotifyApi
			?.getArtistTopTracks(artistId, 'CZ')
			.then(response => setTracks(response.body.tracks as TrackPreviewType[]));
	}, [spotifyApi]);

	if (!artist) {
		return <Typography variant="h4">Artist not found</Typography>;
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
					src={artist.images[1].url}
					alt={artist.name}
					style={{ maxWidth: '100%' }}
				/>
				<Box sx={{ margin: 2, display: 'flex', flexDirection: 'column' }}>
					<Typography variant="h3">{artist.name}</Typography>
					<Box sx={{ marginTop: 2 }}>
						<Typography variant="body1">
							Followers: {artist.followers.total}
						</Typography>
						<Typography variant="body1">
							{getFormattedGenres(artist.genres)}
						</Typography>
					</Box>
					<RatingStrip
						id={artist.id}
						type="Artist"
						initStars={ratings.get(artist.id) ?? 0}
					/>
				</Box>
			</Box>
			<Typography variant="h4" padding={1}>
				Top tracks:
			</Typography>
			<Grid container spacing={1}>
				{tracks
					?.sort((trackA, trackB) => trackB.track_number - trackA.track_number)
					.map(track => (
						<TrackPreview
							key={track.id}
							track={track}
							// saved={false}
							saved={savedTrackIds.has(track.id)}
							rating={ratings.get(track.id) ?? 0}
							showRating
						/>
					))}
			</Grid>
		</Paper>
	);
};

export default ArtistDetail;
