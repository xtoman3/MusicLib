import React, { FC, useState } from 'react';
import { Box, IconButton } from '@mui/material';
import { Star, StarBorder } from '@mui/icons-material';
import { setDoc } from 'firebase/firestore';

import { useLoggedInUser } from '../hooks/useLoggedInUser';
import { albumsDocument, artistsDocument, tracksDocument } from '../firebase';

type Props = {
	id: string;
	type: string;
	initStars: number;
	size?: string;
};

const RatingStrip: FC<Props> = ({ id, type, initStars, size }) => {
	const user = useLoggedInUser();
	const [stars, setStars] = useState<number>(initStars);

	const submitRating = (starRating: number) => {
		if (!user) return;
		setStars(starRating);
		let doc = albumsDocument(user.uid);
		if (type === 'Artist') doc = artistsDocument(user.uid);
		if (type === 'Track') doc = tracksDocument(user.uid);

		setDoc(
			doc,
			{
				ratings: {
					[id]: starRating
				}
			},
			{ merge: true }
		);
	};

	return (
		<Box
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
					{i < stars ? (
						// @ts-ignore
						<Star fontSize={size ?? 'medium'} />
					) : (
						// @ts-ignore
						<StarBorder fontSize={size ?? 'medium'} />
					)}
				</IconButton>
			))}
		</Box>
	);
};

export default RatingStrip;
