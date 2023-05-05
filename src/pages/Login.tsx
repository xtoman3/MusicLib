import { Box, Button, Paper, TextField, Typography } from '@mui/material';
import { FormEvent, useState } from 'react';
import { useNavigate } from '@tanstack/react-router';

import useField from '../hooks/useField';
import usePageTitle from '../hooks/usePageTitle';
import { signIn, signUp } from '../firebase';
import SignInWithGoogleButton from '../components/SignInWithGoogleButton';

const Login = () => {
	usePageTitle('Login');

	const navigate = useNavigate();

	const [isSignUp, setSignUp] = useState(false);

	const email = useField('email', true);
	const password = useField('password', true);

	const [submitError, setSubmitError] = useState<string>();

	return (
		<Paper
			component="form"
			onSubmit={async (e: FormEvent) => {
				e.preventDefault();
				try {
					isSignUp
						? await signUp(email.value, password.value)
						: await signIn(email.value, password.value);
					navigate({ to: '/' });
				} catch (err) {
					setSubmitError(
						(err as { message?: string })?.message ?? 'Unknown error occurred'
					);
				}
			}}
			sx={{
				display: 'flex',
				flexDirection: 'column',
				width: '100%',
				maxWidth: 'sm',
				p: 4,
				gap: 2
			}}
		>
			<Typography variant="h4" component="h2" textAlign="center" mb={3}>
				Sign in
			</Typography>
			<TextField label="email" {...email.props} type="email" />
			<TextField label="password" {...password.props} type="password" />
			<Box
				sx={{
					display: 'flex',
					gap: 2,
					alignItems: 'center',
					alignSelf: 'flex-end',
					mt: 2
				}}
			>
				{submitError && (
					<Typography
						variant="caption"
						textAlign="right"
						sx={{ color: 'error.main' }}
					>
						{submitError}
					</Typography>
				)}
				<Button
					type="submit"
					variant="outlined"
					onClick={() => setSignUp(true)}
				>
					Sign up
				</Button>
				<Button
					type="submit"
					variant="contained"
					onClick={() => setSignUp(false)}
				>
					Sign in
				</Button>
			</Box>
			<SignInWithGoogleButton />
		</Paper>
	);
};

export default Login;
