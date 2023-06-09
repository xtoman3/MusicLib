import { initializeApp } from 'firebase/app';
import {
	getAuth,
	createUserWithEmailAndPassword,
	signInWithEmailAndPassword,
	signOut as authSignOut,
	onAuthStateChanged,
	User,
	GoogleAuthProvider,
	signInWithPopup
} from 'firebase/auth';
import {
	collection,
	CollectionReference,
	doc,
	DocumentReference,
	getFirestore
} from 'firebase/firestore';

// Initialize Firebase
initializeApp({
	apiKey: 'AIzaSyDfJJZAVycT-RDdf3pCxfTYpICV_SPjDBY',
	authDomain: 'musiclab-4f1ca.firebaseapp.com',
	projectId: 'musiclab-4f1ca',
	storageBucket: 'musiclab-4f1ca.appspot.com',
	messagingSenderId: '948245125555',
	appId: '1:948245125555:web:eeb0f04e0712e092f493c6'
});

// Authentication
const auth = getAuth();

const provider = new GoogleAuthProvider();

// Sign up handler
export const signUp = (email: string, password: string) =>
	createUserWithEmailAndPassword(auth, email, password);

// Sign in handler
export const signIn = (email: string, password: string) =>
	signInWithEmailAndPassword(auth, email, password);

export const signInWithGoogle = () => signInWithPopup(auth, provider);

// Sign out handler
export const signOut = () => authSignOut(auth);

// Subscribe to auth state changes
export const onAuthChanged = (callback: (u: User | null) => void) =>
	onAuthStateChanged(auth, callback);

// Firestore
const db = getFirestore();

export type SavedAlbums = {
	ids: string[];
	ratings: Map<string, number>;
};

export type SavedArtist = {
	ids: string[];
	ratings: Map<string, number>;
};

export type SavedTrack = {
	ids: string[];
	ratings: Map<string, number>;
};

export const albumsCollection = collection(
	db,
	'albums'
) as CollectionReference<SavedAlbums>;

export const ArtistCollection = collection(
	db,
	'artists'
) as CollectionReference<SavedArtist>;

export const TrackCollection = collection(
	db,
	'tracks'
) as CollectionReference<SavedArtist>;

export const albumsDocument = (id: string) =>
	doc(db, 'albums', id) as DocumentReference<SavedAlbums>;

export const artistsDocument = (id: string) =>
	doc(db, 'artists', id) as DocumentReference<SavedArtist>;

export const tracksDocument = (id: string) =>
	doc(db, 'tracks', id) as DocumentReference<SavedTrack>;
