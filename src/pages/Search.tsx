import { Box, Grid, MenuItem, Select, TextField } from '@mui/material';
import React, { FC, useEffect, useState } from 'react';

import usePageTitle from '../hooks/usePageTitle';
import { useSpotifyApi } from '../hooks/useSpotifyApi';
import AlbumPreview from '../components/AlbumPreview';
import ArtistPreview from '../components/ArtistPreview';
import { AlbumPreviewType } from '../utils/AlbumUtils';
import { useSavedAlbums } from '../hooks/useSavedAlbums';
import { ArtistPreviewType } from '../utils/ArtistUtils';
import { useSavedArtists } from '../hooks/useSavedArtists';
import { useSavedTracks } from '../hooks/useSavedTracks';
import { TrackPreviewType } from '../utils/TrackUtils';
import TrackPreview from '../components/TrackPreview';

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

	const {
		artists: { artists, setArtists },
		ids: { ids: savedArtistIds },
		ratings: { ratings: ArtistRatings }
	} = useSavedArtists();

	const {
		tracks: { tracks, setTracks },
		ids: { ids: savedTrackIds },
		ratings: { ratings: TrackRatings }
	} = useSavedTracks();

	const [search, setSearch] = useState<string>('');
	const [searchOption, setSearchOption] = useState<SearchOptions>(
		SearchOptions.Albums
	);

	const searchAlbums = () => {
		spotifyApi?.searchAlbums(search).then(response => {
			setAlbums(response.body.albums?.items as AlbumPreviewType[]);
		});
	};

	const searchArtists = () => {
		spotifyApi?.searchArtists(search).then(response => {
			setArtists(response.body.artists?.items as ArtistPreviewType[]);
		});
	};

	const searchTracks = () => {
		spotifyApi?.searchTracks(search).then(response => {
			setTracks(response.body.tracks?.items as TrackPreviewType[]);
		});
	};

	useEffect(() => {
		if (search.length === 0) {
			setAlbums([]);
			setArtists([]);
			setTracks([]);
			return;
		}

		switch (searchOption) {
			case SearchOptions.Albums:
				searchAlbums();
				break;
			case SearchOptions.Artists:
				searchArtists();
				break;
			case SearchOptions.Tracks:
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
			<Grid container spacing={1}>
				{searchOption === SearchOptions.Albums &&
					albums?.map(album => (
						<AlbumPreview
							key={album.id}
							album={album}
							saved={savedAlbumIds.has(album.id)}
							rating={ratings.get(album.id) ?? 0}
							showRating
						/>
					))}
				{searchOption === SearchOptions.Artists &&
					artists?.map(artist => (
						<ArtistPreview
							key={artist.id}
							artist={artist}
							saved={savedArtistIds.has(artist.id)}
							rating={ArtistRatings.get(artist.id) ?? 0}
							showRating
						/>
					))}
				{searchOption === SearchOptions.Tracks &&
					tracks?.map(track => (
						<TrackPreview
							key={track.id}
							track={track}
							saved={savedTrackIds.has(track.id)}
							rating={TrackRatings.get(track.id) ?? 0}
							showRating
						/>
					))}
			</Grid>
		</>
	);
};

export default Search;
