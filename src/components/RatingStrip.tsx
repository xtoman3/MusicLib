import React, { FC, useState } from 'react';
import { Box, IconButton } from '@mui/material';
import { Star, StarBorder } from '@mui/icons-material';
import { setDoc } from 'firebase/firestore';

import { useLoggedInUser } from '../hooks/useLoggedInUser';
import { albumsDocument } from '../firebase';

type Props = {
	albumId: string;
	initStars: number;
};

const RatingStrip: FC<Props> = ({ albumId, initStars }) => {
	const user = useLoggedInUser();
	const [stars, setStars] = useState<number>(initStars);

	const submitRating = (starRating: number) => {
		if (!user) return;
		setStars(starRating);

		setDoc(
			albumsDocument(user.uid),
			{
				ratings: {
					[albumId]: starRating
				}
			},
			{ merge: true }
		);
	};

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
					onClick={() => submitRating(i + 1)}
				>
					{i < stars ? <Star /> : <StarBorder />}
				</IconButton>
			))}
		</Box>
	);
};

export default RatingStrip;
