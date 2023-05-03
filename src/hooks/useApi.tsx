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
import SpotifyWebApi from 'spotify-web-api-node';

const createSpotifyApi = (accessToken: string) => {
	const spotifyApi = new SpotifyWebApi({
		clientId: import.meta.env.VITE_CLIENT_ID
	});
	spotifyApi.setAccessToken(accessToken);
	return spotifyApi;
};

type SpotifyApiState = [
	SpotifyWebApi | undefined,
	Dispatch<SetStateAction<SpotifyWebApi | undefined>>
];

const ApiContext = createContext<SpotifyApiState>(undefined as never);

export const ApiProvider: FC<PropsWithChildren> = ({ children }) => {
	// const apiState = useState<SpotifyWebApi>();
	const [api, setApi] = useState<SpotifyWebApi>();

	useEffect(() => {
		const accessToken = localStorage.getItem('access_token');
		if (accessToken) {
			const newApi = createSpotifyApi(accessToken);
			setApi(newApi);
		}
	}, []);

	return (
		<ApiContext.Provider value={[api, setApi]}>{children}</ApiContext.Provider>
	);
};

export const useSpotifyApi = () => useContext(ApiContext);
