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

import Albums from './pages/Albums';
import NotFound from './pages/NotFound';
import theme from './theme';
import ButtonLink from './components/ButtonLink';
import { useLoggedInUser, UserProvider } from './hooks/useLoggedInUser';
import Login from './pages/Login';
import { signOut } from './firebase';
import { SpotifyApiProvider } from './hooks/useSpotifyApi';

const rootRoute = new RootRoute({
	component: () => {
		const user = useLoggedInUser();

		return (
			<ThemeProvider theme={theme}>
				<CssBaseline />

				<AppBar sx={{ position: 'sticky' }}>
					<Container maxWidth="md">
						<Toolbar disableGutters sx={{ gap: 2 }}>
							<ButtonLink to="/">Albums</ButtonLink>
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
					<Outlet />
				</Container>
			</ThemeProvider>
		);
	}
});

const indexRoute = new Route({
	getParentRoute: () => rootRoute,
	path: '/',
	component: Albums
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
