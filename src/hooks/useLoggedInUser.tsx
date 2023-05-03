import {
	createContext,
	FC,
	PropsWithChildren,
	useContext,
	useEffect,
	useState
} from 'react';
import { User } from 'firebase/auth';

import { onAuthChanged } from '../firebase';

const UserContext = createContext<User | undefined>(undefined as never);

// Hook providing logged in user information
export const UserProvider: FC<PropsWithChildren> = ({ children }) => {
	// Hold user info in state
	const [user, setUser] = useState<User | undefined>();

	// Setup onAuthChanged once when component is mounted
	useEffect(() => {
		onAuthChanged(u => setUser(u ?? undefined));
	}, []);

	return <UserContext.Provider value={user}>{children}</UserContext.Provider>;
};

export const useLoggedInUser = () => useContext(UserContext);
