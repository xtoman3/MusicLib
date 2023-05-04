import { Box, Typography } from '@mui/material';
import { FC } from 'react';

import usePageTitle from '../hooks/usePageTitle';
import { useSpotifyApi } from '../hooks/useSpotifyApi';

const Albums: FC = () => {
	usePageTitle('Albums');
	const spotifyApi = useSpotifyApi();

	return (
		<Box
			sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
		>
			<Typography variant="h2" fontWeight="bolder">
				Test
			</Typography>
			<Typography variant="h6" fontWeight="bolder">
				{spotifyApi?.getAccessToken()}
			</Typography>
		</Box>
	);
};

export default Albums;
