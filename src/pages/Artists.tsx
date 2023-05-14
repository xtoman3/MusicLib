import { Box, MenuItem, Select } from '@mui/material';
import React, { FC, useEffect, useState } from 'react';

import usePageTitle from '../hooks/usePageTitle';
import { useSpotifyApi } from '../hooks/useSpotifyApi';
import {
	ArtistPreviewType,
	ComparableAttributes,
	compareArtists
} from '../utils/ArtistUtils';
import ArtistPreview from '../components/ArtistPreview';
import { useSavedArtists } from '../hooks/useSavedArtists';

const Artists: FC = () => {
	usePageTitle('Artists');
	const spotifyApi = useSpotifyApi();

	const {
		artists: { artists, setArtists },
		ids: { ids: savedArtistIds },
		ratings: { ratings }
	} = useSavedArtists();

	useEffect(() => {
		if (!spotifyApi || savedArtistIds.size === 0) return;
		spotifyApi
			.getArtists([...savedArtistIds])
			.then(response => {
				setArtists(response.body.artists as unknown as ArtistPreviewType[]);
			})
			.catch(error => alert(error));
	}, [savedArtistIds]);

	const [sortOption, setSortOption] = useState<ComparableAttributes>('name');
	const [ascending, setAscending] = useState<boolean>(true);

	const sortFunc = (a: ArtistPreviewType, b: ArtistPreviewType) =>
		ascending
			? compareArtists(a, b, sortOption)
			: compareArtists(b, a, sortOption);

	return (
		<>
			<Box sx={{ display: 'flex', flexDirection: 'row' }}>
				<Select
					labelId="select-label"
					id="select"
					variant="standard"
					value={sortOption}
					onChange={e => setSortOption(e.target.value as ComparableAttributes)}
					sx={{ marginLeft: 2 }}
				>
					<MenuItem value="name">Followers</MenuItem>
					<MenuItem value="followers">Popularity</MenuItem>
					<MenuItem value="popularity">Name</MenuItem>
				</Select>
				<Select
					labelId="ascending-label"
					id="select-order"
					variant="standard"
					value={ascending ? 'ascending' : 'descending'}
					onChange={e => setAscending(e.target.value === 'ascending')}
					sx={{ marginLeft: 2 }}
				>
					<MenuItem value="ascending">Ascending</MenuItem>
					<MenuItem value="descending">Descending</MenuItem>
				</Select>
			</Box>
			<Box
				sx={{
					display: 'flex',
					flexDirection: 'row',
					flexWrap: 'wrap',
					justifyContent: 'center',
					alignItems: 'flex-start',
					alignContent: 'flex-start'
				}}
			>
				{artists
					?.filter(artist => savedArtistIds.has(artist.id))
					.sort(sortFunc)
					.map(artist => (
						<ArtistPreview
							key={artist.id}
							artist={artist}
							rating={ratings.get(artist.id) ?? 0}
							saved={savedArtistIds.has(artist.id)}
							showRating
						/>
					))}
			</Box>
		</>
	);
};

export default Artists;
