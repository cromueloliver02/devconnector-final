import React from 'react';
import Moment from 'react-moment';
import PropTypes from 'prop-types';

const ProfileExperience = ({
	experience: { company, title, location, current, to, from, description }
}) => (
	<div>
		<h3 className='text-dark'>{company}</h3>
		<p>
			<Moment format='YYYY/MM/DD'>{from}</Moment> -{' '}
			{current ? ' Present' : <Moment format='YYYY/MM/DD'>{to}</Moment>}
		</p>
		<p>
			<strong>Position: </strong>
			{title}
		</p>
		{location && (
			<p>
				<strong>Location: </strong> {location}
			</p>
		)}
		{description && (
			<p>
				<strong>Description: </strong> {description}
			</p>
		)}
	</div>
);

ProfileExperience.propTypes = {
	experience: PropTypes.object.isRequired
};

export default ProfileExperience;
