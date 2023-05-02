import { useEffect, useState } from 'react';
import SpotifyWebApi from 'spotify-web-api-node';

// const spotifyApi = new SpotifyWebApi({
// 	clientId: import.meta.env.VITE_CLIENT_ID,
// 	clientSecret: import.meta.env.VITE_CLIENT_SECRET
// });

const generateRandomString = (length: number) => {
	let text = '';
	const possible =
		'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

	for (let i = 0; i < length; i++) {
		text += possible.charAt(Math.floor(Math.random() * possible.length));
	}
	return text;
};

const generateCodeChallenge = async (codeVerifier: string | undefined) => {
	const base64encode = (string: ArrayBuffer | Iterable<number>) =>
		btoa(String.fromCharCode.apply(null, new Uint8Array(string)))
			.replace(/\+/g, '-')
			.replace(/\//g, '_')
			.replace(/=+$/, '');

	const encoder = new TextEncoder();
	const data = encoder.encode(codeVerifier);
	const digest = await window.crypto.subtle.digest('SHA-256', data);

	return base64encode(digest);
};

const getToken = async (clientId: string, clientSecret: string) => {
	const response = await fetch(`https://accounts.spotify.com/api/token`, {
		method: 'POST',
		mode: 'cors',
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded',
			'Authorization': `Basic ${btoa(`${clientId}:${clientSecret}`)}`,
			'Access-Control-Allow-Origin': '*'
		},
		body: 'grant_type=client_credentials'
	});
	const data = await response.json();
	return data.access_token;
};

const useSpotifyToken = () => {
	const [token, setToken] = useState<string>();

	// const spotifyApi = useMemo(
	// 	() =>
	// 		new SpotifyWebApi({
	// 			clientId: import.meta.env.VITE_CLIENT_ID,
	// 			clientSecret: import.meta.env.VITE_CLIENT_SECRET,
	// 			redirectUri: 'http://localhost:3000/'
	// 		}),
	// 	[]
	// );
	// const spotifyApi = new SpotifyWebApi({
	// 	clientId: import.meta.env.VITE_CLIENT_ID,
	// 	clientSecret: import.meta.env.VITE_CLIENT_SECRET
	// });

	useEffect(() => {
		const codeVerifier = generateRandomString(128);

		generateCodeChallenge(codeVerifier).then(codeChallenge => {
			const state = generateRandomString(16);
			const scope = 'user-read-private user-read-email';

			localStorage.setItem('code_verifier', codeVerifier);

			const args = new URLSearchParams({
				response_type: 'code',
				client_id: import.meta.env.VITE_CLIENT_ID,
				scope,
				redirect_uri: 'http://localhost:8080/',
				state,
				code_challenge_method: 'S256',
				code_challenge: codeChallenge
			});

			window.location = 'https://accounts.spotify.com/authorize?' + args;
		});
	}, []);

	return token;
};

export default useSpotifyToken;
