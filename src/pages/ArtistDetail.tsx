import { useParams } from '@tanstack/react-router';
import { FC, useEffect, useState } from 'react';
import { Box, Paper, Typography } from '@mui/material';

import usePageTitle from '../hooks/usePageTitle';
import { useSpotifyApi } from '../hooks/useSpotifyApi';
import RatingStrip from '../components/RatingStrip';
import { useSavedArtists } from '../hooks/useSavedArtists';

const ArtistDetail: FC = () => {
	usePageTitle('Artist');
	const spotifyApi = useSpotifyApi();

	const {
		ratings: { ratings }
	} = useSavedArtists();

	console.log(useParams());
	const { artistId } = useParams();

	const [artist, setArtist] = useState<SpotifyApi.SingleArtistResponse>();

	useEffect(() => {
		if (!artistId) {
			console.log('2Api is null!');
			return;
		}
		if (!spotifyApi) console.log('Api is null!');
		spotifyApi?.getArtist(artistId).then(response => setArtist(response.body));
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
							Genres: {artist.genres.toString()}
						</Typography>
					</Box>
					<RatingStrip
						id={artist.id}
						type="Artist"
						initStars={ratings.get(artist.id) ?? 0}
					/>
				</Box>
			</Box>
			{/* TODO: list of albums?
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
			</Grid> */}
		</Paper>
	);
};

export default ArtistDetail;
