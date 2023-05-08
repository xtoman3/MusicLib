import React, {
	createContext,
	Dispatch,
	FC,
	PropsWithChildren,
	SetStateAction,
	useContext,
	useEffect,
	useState
} from 'react';
import { onSnapshot, setDoc } from 'firebase/firestore';

import { TrackPreviewType } from '../utils/TrackUtils';
import { tracksDocument } from '../firebase';

import { useLoggedInUser } from './useLoggedInUser';

type SavedTracks = {
	tracks: {
		tracks: TrackPreviewType[];
		setTracks: Dispatch<SetStateAction<TrackPreviewType[]>>;
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

const SavedTracksContext = createContext<SavedTracks>(undefined as never);

export const SavedTracksProvider: FC<PropsWithChildren> = ({ children }) => {
	const user = useLoggedInUser();

	const [tracks, setTracks] = useState<TrackPreviewType[]>([]);
	const [ids, setIds] = useState<Set<string>>(new Set<string>());
	const [ratings, setRatings] = useState<Map<string, number>>(
		new Map<string, number>()
	);

	const savedTracksValue: SavedTracks = {
		tracks: { tracks, setTracks },
		ids: { ids, setIds },
		ratings: { ratings, setRatings }
	};

	useEffect(() => {
		if (!user) return;

		// Initialize document with new user if non-existent
		setDoc(tracksDocument(user.uid), {}, { merge: true });

		const unsubscribe = onSnapshot(tracksDocument(user.uid), doc => {
			const data = doc.data();
			setIds(new Set<string>(data?.ids ?? []));
			setRatings(new Map<string, number>(Object.entries(data?.ratings ?? {})));
		});

		return () => {
			unsubscribe();
		};
	}, [user]);

	return (
		<SavedTracksContext.Provider value={savedTracksValue}>
			{children}
		</SavedTracksContext.Provider>
	);
};

export const useSavedTracks = () => useContext(SavedTracksContext);
