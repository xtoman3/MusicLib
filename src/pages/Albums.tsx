import { Paper } from '@mui/material';
import {FC, useState} from 'react';

import usePageTitle from '../hooks/usePageTitle';
import {useSpotifyApi} from "../hooks/useSpotifyApi";
import {AlbumPreviewType} from "../utils/AlbumUtils";
import {useLoggedInUser} from "../hooks/useLoggedInUser";
import {AlbumFirebase, albumsCollection} from "../firebase";
import { getDocs } from 'firebase/firestore';

const Albums: FC = () => {
	usePageTitle('Albums');
	const user = useLoggedInUser();
	const spotifyApi = useSpotifyApi();

	const [albums, setAlbums] = useState<AlbumPreviewType[] | undefined>([]);

	// const getSavedAlbums = async () => {
	// 	const albumQuery = await getDocs(albumsCollection);
	// 	const retrievedAlbums: AlbumFirebase[] = [];
	// 	albumQuery.forEach(doc => retrievedAlbums.push(doc.data()));
	//
	//
	// }

	return (
		<Paper>

		</Paper>
	);
};

export default Albums;
