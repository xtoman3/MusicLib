import { Box, Typography } from '@mui/material';
import { FC, useEffect } from 'react';

import usePageTitle from '../hooks/usePageTitle';
import { useSpotifyApi } from '../hooks/useApi';

const Home: FC = () => {
	usePageTitle('Home');
	const [spotifyApi] = useSpotifyApi();

	useEffect(() => {
		if (spotifyApi) {
			spotifyApi.getMe().then(data => {
				// setMeData(data.body);
				console.log(data);
			});
		}
	}, []);

	return (
		<Box
			sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
		>
			<Typography variant="h2" fontWeight="bolder">
				Test
			</Typography>
			<Typography variant="h4" fontWeight="bolder">
				{/*{meData}*/}
			</Typography>
		</Box>
	);
};

export default Home;
