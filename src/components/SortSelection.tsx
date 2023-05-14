import React, { Dispatch, FC, SetStateAction } from 'react';
import { Box, MenuItem, Select, Typography } from '@mui/material';

type Props = {
	sortOptions: readonly string[];
	selectedOption: string;
	setSelectedOption: Dispatch<SetStateAction<string>>;
	ascending: boolean;
	setAscending: Dispatch<SetStateAction<boolean>>;
};

const convertToLabel = (paramName: string): string => {
	const words = paramName.split('_');
	const capitalizedWords = words.map(
		word => word.charAt(0).toUpperCase() + word.slice(1)
	);

	return capitalizedWords.join(' ');
};

const SortSelection: FC<Props> = ({
	sortOptions,
	selectedOption,
	setSelectedOption,
	ascending,
	setAscending
}) => (
	<Box sx={{ display: 'flex', flexDirection: 'row' }}>
		<Typography sx={{ display: 'flex', alignItems: 'center' }}>
			Order by:
		</Typography>
		<Select
			labelId="select-label"
			id="select"
			variant="standard"
			value={selectedOption}
			onChange={e => setSelectedOption(e.target.value)}
			sx={{ marginLeft: 2 }}
		>
			{sortOptions.map(option => (
				<MenuItem key={option} value={option}>
					{convertToLabel(option)}
				</MenuItem>
			))}
		</Select>
		<Select
			labelId="ascending-label"
			id="select-order"
			variant="standard"
			value={ascending ? 'ascending' : 'descending'}
			onChange={e => setAscending(e.target.value === 'ascending')}
			sx={{ marginLeft: 2 }}
		>
			<MenuItem value="ascending">Ascending</MenuItem>
			<MenuItem value="descending">Descending</MenuItem>
		</Select>
	</Box>
);

export default SortSelection;
