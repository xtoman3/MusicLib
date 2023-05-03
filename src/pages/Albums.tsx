import { Box, Typography } from '@mui/material';
import { FC } from 'react';

import usePageTitle from '../hooks/usePageTitle';

const Albums: FC = () => {
	usePageTitle('Albums');

	return (
		<Box
			sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
		>
			<Typography variant="h2" fontWeight="bolder">
				Test
			</Typography>
		</Box>
	);
};

export default Albums;
