import React, { Dispatch, FC, SetStateAction } from 'react';
import { Box, MenuItem, Select, Typography } from '@mui/material';

type Props = {
	pageSize: number;
	setPageSize: Dispatch<SetStateAction<number>>;
	setPage: Dispatch<SetStateAction<number>>;
};

const PageSizeSelector: FC<Props> = ({ pageSize, setPageSize, setPage }) => (
	<Box sx={{ display: 'flex', flexDirection: 'row' }}>
		<Typography sx={{ display: 'flex', alignItems: 'center' }}>
			Page size:
		</Typography>
		<Select
			labelId="select-label"
			id="select"
			variant="standard"
			value={pageSize}
			onChange={e => {
				setPageSize(Number(e.target.value));
				setPage(0);
			}}
			sx={{ marginLeft: 2 }}
		>
			<MenuItem value={10}>10</MenuItem>
			<MenuItem value={20}>20</MenuItem>
		</Select>
	</Box>
);

export default PageSizeSelector;
