import React, { FC, useState } from 'react';
import { Box, Container, IconButton, Typography } from '@mui/material';
import { Star, StarBorder } from '@mui/icons-material';

import { useLoggedInUser } from '../hooks/useLoggedInUser';
import { AlbumPreviewType } from '../utils/AlbumUtils';

type Props = {
	initStars: number;
};

const RatingStrip: FC<Props> = ({ initStars }) => {
	const user = useLoggedInUser();
	const [stars, setStars] = useState<number>(initStars);

	return (
		<Box
			mt={2}
			sx={{
				display: 'flex',
				justifyContent: 'center'
			}}
		>
			{[...Array(5).keys()].map(i => (
				<IconButton
					key={i}
					color="primary"
					component="span"
					onClick={() => setStars(i + 1)}
				>
					{i < stars ? <Star /> : <StarBorder />}
				</IconButton>
			))}
		</Box>
	);
};

export default RatingStrip;
