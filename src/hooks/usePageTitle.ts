import { useEffect } from 'react';

const usePageTitle = (title: string) => {
	useEffect(() => {
		document.title = `${title} | MusicLib`;
	}, [title]);
};

export default usePageTitle;
