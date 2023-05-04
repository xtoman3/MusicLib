import {
	createContext,
	FC,
	PropsWithChildren,
	useContext,
	useEffect,
	useMemo,
	useState
} from 'react';
import SpotifyWebApi from 'spotify-web-api-node';

const getToken = async (clientId: string, clientSecret: string) => {
	const response = await fetch(`https://accounts.spotify.com/api/token`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded',
			'Authorization': `Basic ${btoa(`${clientId}:${clientSecret}`)}`
		},
		body: 'grant_type=client_credentials'
	});
	const data = await response.json();
	return data.access_token;
};

const createSpotifyApi = (accessToken: string) => {
	const spotifyApi = new SpotifyWebApi({
		clientId: import.meta.env.VITE_CLIENT_ID
	});
	spotifyApi.setAccessToken(accessToken);
	return spotifyApi;
};

const SpotifyApiContext = createContext<SpotifyWebApi | undefined>(
	undefined as never
);

export const SpotifyApiProvider: FC<PropsWithChildren> = ({ children }) => {
	const [token, setToken] = useState<string | undefined>();

	useEffect(() => {
		const token = getToken(
			import.meta.env.VITE_CLIENT_ID,
			import.meta.env.VITE_CLIENT_SECRET
		);
		token.then(value => setToken(value));
	}, []);

	const spotifyApi = useMemo(() => {
		if (token) return createSpotifyApi(token);
	}, [token]);

	return (
		<SpotifyApiContext.Provider value={spotifyApi}>
			{children}
		</SpotifyApiContext.Provider>
	);
};

export const useSpotifyApi = () => useContext(SpotifyApiContext);
