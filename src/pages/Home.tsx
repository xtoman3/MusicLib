import { Box, Typography } from '@mui/material';
import { useEffect } from 'react';

import usePageTitle from '../hooks/usePageTitle';
import useSpotifyToken from '../hooks/useSpotifyToken';

const Home = () => {
	usePageTitle('Home');

	const token = useSpotifyToken();
	useEffect(() => {

	}, []);

	return (
		<Box
			sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
		>
			<Typography variant="h2" fontWeight="bolder">
				Test
			</Typography>
			<Typography variant="h4" fontWeight="bolder">
				{/*{token ?? 'undefined'}*/}
			</Typography>
			{/*<Typography variant="h4">{client_id}</Typography>*/}
			{/*<Typography variant="h4">{client_secret}</Typography>*/}
		</Box>
	);
};

export default Home;
