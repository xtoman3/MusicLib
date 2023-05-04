import GoogleIcon from '@mui/icons-material/Google';
import { Button } from '@mui/material';
import { useNavigate } from '@tanstack/react-router';

import { signInWithGoogle } from '../firebase';

const SignInWithGoogleButton = () => {
	const navigate = useNavigate();

	const signInAndRedirect = () => {
		signInWithGoogle().then(() => navigate({ to: '/' }));
	};

	return (
		<Button onClick={signInAndRedirect}>
			<GoogleIcon sx={{ marginRight: 1 }} />
			<span>Sign in with Google</span>
		</Button>
	);
};

export default SignInWithGoogleButton;
