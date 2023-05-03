import { FC } from 'react';
import { Button } from '@mui/material';

const SpotifyLogout: FC = () => (
	<Button onClick={() => localStorage.removeItem('access_token')}>Login</Button>
);
