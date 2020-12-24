import React from 'react';
import spinner from './spinner.gif';

const Spinner = () => {
	return (
		<img
			src={spinner}
			style={{ width: '70px', display: 'block', margin: 'auto' }}
			alt='Loading...'
		/>
	);
};

export default Spinner;
