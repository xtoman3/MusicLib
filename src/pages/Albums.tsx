import { Box, Button, Grid, MenuItem, Select, Typography } from '@mui/material';
import React, {
	Dispatch,
	FC,
	SetStateAction,
	useEffect,
	useState
} from 'react';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

import usePageTitle from '../hooks/usePageTitle';
import { useSpotifyApi } from '../hooks/useSpotifyApi';
import {
	ComparableAlbumAttr,
	AlbumPreviewType,
	compareAlbums,
	AlbumSortableAttrs
} from '../utils/AlbumUtils';
import AlbumPreview from '../components/AlbumPreview';
import { useSavedAlbums } from '../hooks/useSavedAlbums';
import SortSelection from '../components/SortSelection';

const Albums: FC = () => {
	usePageTitle('Albums');
	const spotifyApi = useSpotifyApi();

	const {
		albums: { albums, setAlbums },
		ids: { ids: savedAlbumIds },
		ratings: { ratings }
	} = useSavedAlbums();

	const [sortOption, setSortOption] = useState<ComparableAlbumAttr>('name');
	const [ascending, setAscending] = useState<boolean>(true);

	const [pageSize, setPageSize] = useState<number>(20);
	const [page, setPage] = useState<number>(0);

	const sortFunc = (a: AlbumPreviewType, b: AlbumPreviewType) =>
		ascending
			? compareAlbums(a, b, sortOption)
			: compareAlbums(b, a, sortOption);

	useEffect(() => {
		if (!spotifyApi || savedAlbumIds.size === 0) return;
		spotifyApi
			.getAlbums(
				[...savedAlbumIds].slice(page * pageSize, (page + 1) * pageSize)
			)
			.then(response => {
				setAlbums(response.body.albums as AlbumPreviewType[]);
			})
			.catch(error => alert(error));
	}, [savedAlbumIds, pageSize, page]);

	return (
		<>
			<Box sx={{ display: 'flex', flexDirection: 'row', width: '100%' }}>
				<SortSelection
					sortOptions={AlbumSortableAttrs}
					selectedOption={sortOption}
					setSelectedOption={setSortOption as Dispatch<SetStateAction<string>>}
					ascending={ascending}
					setAscending={setAscending}
				/>
				<Box sx={{ flexGrow: 1 }} />
				<Box sx={{ display: 'flex', flexDirection: 'row' }}>
					<Typography sx={{ display: 'flex', alignItems: 'center' }}>
						Page size:
					</Typography>
					<Select
						labelId="select-label"
						id="select"
						variant="standard"
						value={pageSize}
						onChange={e => {
							setPageSize(Number(e.target.value));
							setPage(0);
						}}
						sx={{ marginLeft: 2 }}
					>
						<MenuItem value={10}>10</MenuItem>
						<MenuItem value={20}>20</MenuItem>
					</Select>
				</Box>
			</Box>
			<Box sx={{ display: 'flex', flexDirection: 'row', width: '100%' }}>
				<Button onClick={() => setPage(prev => prev - 1)} disabled={page <= 0}>
					<ChevronLeftIcon />
				</Button>
				<Box sx={{ flexGrow: 1 }} />
				<Button
					onClick={() => setPage(prev => prev + 1)}
					disabled={page * pageSize >= savedAlbumIds.size}
				>
					<ChevronRightIcon />
				</Button>
			</Box>
			<Grid container spacing={1}>
				{albums
					?.filter(album => savedAlbumIds.has(album.id))
					.sort(sortFunc)
					.map(album => (
						<AlbumPreview
							key={album.id}
							album={album}
							saved={savedAlbumIds.has(album.id)}
							rating={ratings.get(album.id) ?? 0}
							showRating
						/>
					))}
			</Grid>
		</>
	);
};

export default Albums;
