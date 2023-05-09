import { useParams } from 'react-router-dom';
import { FC, useEffect, useState } from 'react';
import { Typography } from '@mui/material';

import usePageTitle from '../hooks/usePageTitle';
import { useSpotifyApi } from '../hooks/useSpotifyApi';
import { ArtistPreviewType } from '../utils/ArtistUtils';

const ArtistDetail: FC = () => {
	usePageTitle('Artist');
	const spotifyApi = useSpotifyApi();

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

	// console.log(artist);

	if (!artist) {
		return <Typography variant="h4">Artist not found</Typography>;
	}

	return <div> {artist.name}</div>;
};

export default ArtistDetail;
