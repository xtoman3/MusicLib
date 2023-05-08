import { Box, MenuItem, Select } from '@mui/material';
import React, { FC, useEffect, useState } from 'react';

import usePageTitle from '../hooks/usePageTitle';
import { useSpotifyApi } from '../hooks/useSpotifyApi';
import { ArtistPreviewType } from '../utils/ArtistUtils';
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

	enum SortOptions {
		Followers = 'Followers',
		Popularity = 'Popularity',
		Name = 'Name'
	}

	const [sortOption, setSortOption] = useState<SortOptions>(
		SortOptions.Followers
	);

	const getSortFunc = (a: ArtistPreviewType, b: ArtistPreviewType) => {
		switch (sortOption) {
			case SortOptions.Followers:
				return b.followers.total - a.followers.total;
			case SortOptions.Popularity:
				return (b.popularity ?? 0) - (a.popularity ?? 0);
			case SortOptions.Name:
				return a.name.localeCompare(b.name);
		}
	};

	return (
		<>
			<Select
				labelId="select-label"
				id="select"
				variant="standard"
				value={sortOption}
				onChange={e =>
					setSortOption(SortOptions[e.target.value as keyof typeof SortOptions])
				}
				sx={{ marginLeft: 2 }}
			>
				<MenuItem value={SortOptions.Followers}>Followers</MenuItem>
				<MenuItem value={SortOptions.Popularity}>Popularity</MenuItem>
				<MenuItem value={SortOptions.Name}>Name</MenuItem>
			</Select>
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
					.sort(getSortFunc)
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
