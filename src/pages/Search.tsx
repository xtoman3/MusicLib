import { Box, MenuItem, Select, TextField } from '@mui/material';
import React, { FC, useEffect, useState } from 'react';

import usePageTitle from '../hooks/usePageTitle';
import { useSpotifyApi } from '../hooks/useSpotifyApi';
import AlbumPreview from '../components/AlbumPreview';
import { AlbumPreviewType } from '../utils/AlbumUtils';
import { useSavedAlbums } from '../hooks/useSavedAlbums';

enum SearchOptions {
	Albums = 'Albums',
	Artists = 'Artists',
	Tracks = 'Tracks'
}

const Search: FC = () => {
	usePageTitle('Search');
	const spotifyApi = useSpotifyApi();
	const {
		albums: { albums, setAlbums },
		ids: { ids: savedAlbumIds },
		ratings: { ratings }
	} = useSavedAlbums();

	const [search, setSearch] = useState<string>('');
	const [searchOption, setSearchOption] = useState<SearchOptions>(
		SearchOptions.Albums
	);

	const searchAlbums = () => {
		spotifyApi
			?.searchAlbums(search)
			.then(response => {
				setAlbums(response.body.albums?.items as AlbumPreviewType[]);
			})
			.catch(error => alert(error));
	};

	const searchArtists = () => {
		spotifyApi
			?.searchArtists(search)
			.then(response => console.log(response))
			.catch(error => alert(error));
	};

	const searchTracks = () => {
		spotifyApi
			?.searchTracks(search)
			.then(response => console.log(response))
			.catch(error => alert(error));
	};

	useEffect(() => {
		if (search.length === 0) {
			setAlbums([]);
			return;
		}

		switch (searchOption) {
			case SearchOptions.Albums:
				searchAlbums();
				break;
			case SearchOptions.Artists:
				setAlbums([]);
				searchArtists();
				break;
			case SearchOptions.Tracks:
				setAlbums([]);
				searchTracks();
				break;
		}
	}, [search, searchOption]);

	return (
		<>
			<Box
				component="form"
				maxWidth="sm"
				onSubmit={e => e.preventDefault()}
				sx={{ width: '100%', display: 'flex', flexDirection: 'row' }}
			>
				<TextField
					id="query"
					label={`Search ${searchOption}`}
					fullWidth
					variant="standard"
					value={search}
					onChange={e => setSearch(e.target.value)}
				/>
				<Select
					labelId="select-label"
					id="select"
					variant="standard"
					value={searchOption}
					onChange={e =>
						setSearchOption(
							SearchOptions[e.target.value as keyof typeof SearchOptions]
						)
					}
					sx={{ marginLeft: 2 }}
				>
					<MenuItem value={SearchOptions.Albums}>Albums</MenuItem>
					<MenuItem value={SearchOptions.Artists}>Artists</MenuItem>
					<MenuItem value={SearchOptions.Tracks}>Tracks</MenuItem>
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
				{albums?.map(album => (
					<AlbumPreview
						key={album.id}
						album={album}
						saved={savedAlbumIds.has(album.id)}
						rating={ratings.get(album.id) ?? 0}
						showRating
					/>
				))}
			</Box>
		</>
	);
};

export default Search;
