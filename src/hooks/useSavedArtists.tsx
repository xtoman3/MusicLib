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

import { ArtistPreviewType } from '../utils/ArtistUtils';
import { artistsDocument } from '../firebase';

import { useLoggedInUser } from './useLoggedInUser';

type SavedArtists = {
	artists: {
		artists: ArtistPreviewType[];
		setArtists: Dispatch<SetStateAction<ArtistPreviewType[]>>;
	};
	ids: {
		ids: Set<string>;
		setIds: Dispatch<SetStateAction<Set<string>>>;
	};
	ratings: {
		ratings: Map<string, number>;
		setRatings: Dispatch<SetStateAction<Map<string, number>>>;
	};
};

const SavedArtistsContext = createContext<SavedArtists>(undefined as never);

export const SavedArtistsProvider: FC<PropsWithChildren> = ({ children }) => {
	const user = useLoggedInUser();

	const [artists, setArtists] = useState<ArtistPreviewType[]>([]);
	const [ids, setIds] = useState<Set<string>>(new Set<string>());
	const [ratings, setRatings] = useState<Map<string, number>>(
		new Map<string, number>()
	);

	const savedArtistsValue: SavedArtists = {
		artists: { artists, setArtists },
		ids: { ids, setIds },
		ratings: { ratings, setRatings }
	};

	useEffect(() => {
		if (!user) return;
		const unsubscribe = onSnapshot(artistsDocument(user.uid), doc => {
			const data = doc.data();
			setIds(new Set<string>(data?.ids ?? []));
			setRatings(new Map<string, number>(Object.entries(data?.ratings ?? {})));
		});

		return () => {
			unsubscribe();
		};
	}, [user]);

	return (
		<SavedArtistsContext.Provider value={savedArtistsValue}>
			{children}
		</SavedArtistsContext.Provider>
	);
};

export const useSavedArtists = () => useContext(SavedArtistsContext);
