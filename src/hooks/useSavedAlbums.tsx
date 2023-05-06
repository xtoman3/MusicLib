import {
	createContext,
	Dispatch,
	FC,
	PropsWithChildren,
	SetStateAction,
	useContext,
	useEffect,
	useState
} from 'react';
import { onSnapshot } from 'firebase/firestore';

import { AlbumPreviewType } from '../utils/AlbumUtils';
import { albumsDocument } from '../firebase';

import { useLoggedInUser } from './useLoggedInUser';

type SavedAlbums = {
	albums: {
		albums: AlbumPreviewType[];
		setAlbums: Dispatch<SetStateAction<AlbumPreviewType[]>>;
	};
	ids: {
		ids: string[];
		setIds: Dispatch<SetStateAction<string[]>>;
	};
	ratings: {
		ratings: Map<string, number>;
		setRatings: Dispatch<SetStateAction<Map<string, number>>>;
	};
};

const SavedAlbumsContext = createContext<SavedAlbums>(undefined as never);

export const SavedAlbumsProvider: FC<PropsWithChildren> = ({ children }) => {
	const user = useLoggedInUser();

	const [albums, setAlbums] = useState<AlbumPreviewType[]>([]);
	const [ids, setIds] = useState<string[]>([]);
	const [ratings, setRatings] = useState<Map<string, number>>(
		new Map<string, number>()
	);

	const savedAlbumsValue: SavedAlbums = {
		albums: { albums, setAlbums },
		ids: { ids, setIds },
		ratings: { ratings, setRatings }
	};

	useEffect(() => {
		if (!user) return;
		const unsubscribe = onSnapshot(albumsDocument(user.uid), doc => {
			const data = doc.data();
			setIds(data?.ids ?? []);
			setRatings(new Map<string, number>(Object.entries(data?.ratings ?? {})));
		});

		return () => {
			unsubscribe();
		};
	}, [user]);

	return (
		<SavedAlbumsContext.Provider value={savedAlbumsValue}>
			{children}
		</SavedAlbumsContext.Provider>
	);
};

export const useSavedAlbums = () => useContext(SavedAlbumsContext);
