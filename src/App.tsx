import {
	AppBar, Box,
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

import Home from './pages/Home';
import NotFound from './pages/NotFound';
import theme from './theme';
import ButtonLink from './components/ButtonLink';

const rootRoute = new RootRoute({
	component: () => (
		<ThemeProvider theme={theme}>
			<CssBaseline />

			<AppBar sx={{ position: 'sticky' }}>
				<Container maxWidth="md">
					<Toolbar disableGutters sx={{ gap: 2 }}>
						<ButtonLink to="/">Home</ButtonLink>
						<Box sx={{ flexGrow: 1 }} />
					</Toolbar>
				</Container>
			</AppBar>

			<Container
				maxWidth="sm"
				component="main"
				sx={{
					display: 'flex',
					flexDirection: 'column',
					justifyContent: 'center',
					alignItems: 'center',
					flexGrow: 1,
					gap: 2,
					my: 4
				}}
			>
				<Outlet />
			</Container>
		</ThemeProvider>
	)
});

const indexRoute = new Route({
	getParentRoute: () => rootRoute,
	path: '/',
	component: Home
});

const notFoundRoute = new Route({
	getParentRoute: () => rootRoute,
	path: '*',
	component: NotFound
});

const routeTree = rootRoute.addChildren([indexRoute, notFoundRoute]);

const router = new Router({ routeTree });

declare module '@tanstack/react-router' {
	// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
	interface Register {
		router: typeof router;
	}
}

const App = () => <RouterProvider router={router} />;

export default App;
