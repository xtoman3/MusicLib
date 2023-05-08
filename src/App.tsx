import {
	AppBar,
	Box,
	Button,
	Container,
	CssBaseline,
	ThemeProvider,
	Toolbar
} from '@mui/material';
import {
	Outlet,
	RootRoute,
	Route,
	Router,
	RouterProvider
} from '@tanstack/react-router';

import NotFound from './pages/NotFound';
import theme from './theme';
import ButtonLink from './components/ButtonLink';
import { useLoggedInUser, UserProvider } from './hooks/useLoggedInUser';
import Login from './pages/Login';
import { signOut } from './firebase';
import { SpotifyApiProvider } from './hooks/useSpotifyApi';
import Search from './pages/Search';
import Albums from './pages/Albums';
import Artists from './pages/Artists';
import { SavedAlbumsProvider } from './hooks/useSavedAlbums';
import { SavedArtistsProvider } from './hooks/useSavedArtists';
import AlbumDetail from './pages/AlbumDetail';
import Tracks from './pages/Tracks';
import { SavedTracksProvider } from './hooks/useSavedTracks';

const rootRoute = new RootRoute({
	component: () => {
		const user = useLoggedInUser();

		return (
			<ThemeProvider theme={theme}>
				<CssBaseline />

				<AppBar sx={{ position: 'sticky' }}>
					<Container maxWidth="md">
						<Toolbar disableGutters sx={{ gap: 2 }}>
							<ButtonLink to="/">Search</ButtonLink>
							<ButtonLink to="/albums">Albums</ButtonLink>
							<ButtonLink to="/artists">Artists</ButtonLink>
							<ButtonLink to="/tracks">Tracks</ButtonLink>
							<Box sx={{ flexGrow: 1 }} />
							{!user ? (
								<ButtonLink to="/login">Login</ButtonLink>
							) : (
								<Button onClick={signOut}>Logout</Button>
							)}
						</Toolbar>
					</Container>
				</AppBar>

				<Container
					maxWidth="lg"
					component="main"
					sx={{
						display: 'flex',
						flexDirection: 'column',
						justifyContent: 'flex-start',
						alignItems: 'center',
						alignContent: 'flex-start',
						flexGrow: 1,
						gap: 2,
						my: 4
					}}
				>
					<SavedAlbumsProvider>
						<SavedArtistsProvider>
							<SavedTracksProvider>
								<Outlet />
							</SavedTracksProvider>
						</SavedArtistsProvider>
					</SavedAlbumsProvider>
				</Container>
			</ThemeProvider>
		);
	}
});

const indexRoute = new Route({
	getParentRoute: () => rootRoute,
	path: '/',
	component: Search
});

const albumsRoute = new Route({
	getParentRoute: () => rootRoute,
	path: '/albums',
	component: Albums
});

const artistsRoute = new Route({
	getParentRoute: () => rootRoute,
	path: '/artists',
	component: Artists
});

const tracksRoute = new Route({
	getParentRoute: () => rootRoute,
	path: '/tracks',
	component: Tracks
});

const albumDetailRoute = new Route({
	getParentRoute: () => rootRoute,
	path: 'album/$albumId',
	component: AlbumDetail
});

const loginRoute = new Route({
	getParentRoute: () => rootRoute,
	path: '/login',
	component: Login
});

const notFoundRoute = new Route({
	getParentRoute: () => rootRoute,
	path: '*',
	component: NotFound
});

const routeTree = rootRoute.addChildren([
	indexRoute,
	albumsRoute,
	artistsRoute,
	tracksRoute,
	albumDetailRoute,
	loginRoute,
	notFoundRoute
]);

const router = new Router({ routeTree });

declare module '@tanstack/react-router' {
	// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
	interface Register {
		router: typeof router;
	}
}

const App = () => (
	<SpotifyApiProvider>
		<UserProvider>
			<RouterProvider router={router} />
		</UserProvider>
	</SpotifyApiProvider>
);

export default App;
