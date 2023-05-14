import React, { Dispatch, FC, SetStateAction } from 'react';
import { Box, Button } from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

type Props = {
	page: number;
	pageSize: number;
	savedAlbumsSize: number;
	setPage: Dispatch<SetStateAction<number>>;
};

const PageSelector: FC<Props> = ({
	page,
	pageSize,
	savedAlbumsSize,
	setPage
}) => (
	<Box sx={{ display: 'flex', flexDirection: 'row', width: '100%' }}>
		<Button onClick={() => setPage(prev => prev - 1)} disabled={page <= 0}>
			<ChevronLeftIcon />
		</Button>
		<Box sx={{ flexGrow: 1 }} />
		<Button
			onClick={() => setPage(prev => prev + 1)}
			disabled={(page + 1) * pageSize >= savedAlbumsSize}
		>
			<ChevronRightIcon />
		</Button>
	</Box>
);

export default PageSelector;
