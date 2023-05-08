import React, { FC, useState } from 'react';
import { Box, IconButton } from '@mui/material';
import { Star, StarBorder } from '@mui/icons-material';
import { setDoc } from 'firebase/firestore';

import { useLoggedInUser } from '../hooks/useLoggedInUser';
import { albumsDocument, artistsDocument } from '../firebase';

type Props = {
	id: string;
	type: string;
	initStars: number;
};

const RatingStrip: FC<Props> = ({ id, type, initStars }) => {
	const user = useLoggedInUser();
	const [stars, setStars] = useState<number>(initStars);

	const submitRating = (starRating: number) => {
		if (!user) return;
		setStars(starRating);

		if (type === 'Album') {
			setDoc(
				albumsDocument(user.uid),
				{
					ratings: {
						[id]: starRating
					}
				},
				{ merge: true }
			);
		} else if (type === 'Artist') {
			setDoc(
				artistsDocument(user.uid),
				{
					ratings: {
						[id]: starRating
					}
				},
				{ merge: true }
			);
		}
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
