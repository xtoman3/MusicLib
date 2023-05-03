import { FC, useEffect } from 'react';
import { Button } from '@mui/material';
import {useSpotifyApi} from "../hooks/useApi";
import SpotifyWebApi from "spotify-web-api-node";

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
	const base64encode = (string: ArrayBuffer) =>
		btoa(String.fromCharCode.apply(null, Array.from(new Uint8Array(string))))
			.replace(/\+/g, '-')
			.replace(/\//g, '_')
			.replace(/=+$/, '');

	const encoder = new TextEncoder();
	const data = encoder.encode(codeVerifier);
	const digest = await window.crypto.subtle.digest('SHA-256', data);

	return base64encode(digest);
};

const redirectToSpotify = () => {
	const codeVerifier = generateRandomString(128);

	generateCodeChallenge(codeVerifier).then(codeChallenge => {
		const state = generateRandomString(16);
		const scope = 'user-read-private user-read-email';

		localStorage.setItem('code_verifier', codeVerifier);

		const args = new URLSearchParams({
			response_type: 'code',
			client_id: import.meta.env.VITE_CLIENT_ID,
			scope,
			redirect_uri: import.meta.env.VITE_REDIRECT_URI,
			state,
			code_challenge_method: 'S256',
			code_challenge: codeChallenge
		});

		window.location.href = `https://accounts.spotify.com/authorize?${args}`;
	});
};

const retrieveAccessToken = () => {
	const urlParams = new URLSearchParams(window.location.search);
	const code = urlParams.get('code');
	const codeVerifier = localStorage.getItem('code_verifier');

	if (localStorage.getItem('access_token') || !code || !codeVerifier) return;

	const body = new URLSearchParams({
		grant_type: 'authorization_code',
		code,
		redirect_uri: import.meta.env.VITE_REDIRECT_URI,
		client_id: import.meta.env.VITE_CLIENT_ID,
		code_verifier: codeVerifier
	});

	fetch('https://accounts.spotify.com/api/token', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded'
		},
		body
	})
		.then(response => {
			if (!response.ok) {
				throw new Error(`HTTP status ${response.status}`);
			}
			return response.json();
		})
		.then(data => {
			localStorage.setItem('access_token', data.access_token);
		});
};

const SpotifyLogin: FC = () => {
	useEffect(() => {
		retrieveAccessToken();
	}, []);

	return <Button onClick={redirectToSpotify}>Login</Button>;
};

export default SpotifyLogin;
