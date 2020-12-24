import React, { Fragment, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { getCurrentProfile, deleteAccount } from '../../_actions/profile';
import DashboardActions from '../dashboard/DashboardActions';
import Experience from '../dashboard/Experience';
import Education from '../dashboard/Education';
import Spinner from '../layout/Spinner';
import PropTypes from 'prop-types';

const Dashboard = ({
	auth: { user },
	profile: { profile, loading },
	getCurrentProfile,
	deleteAccount
}) => {
	useEffect(() => {
		getCurrentProfile();
		// eslint-disable-next-line
	}, []);

	if (loading && profile === null) {
		return <Spinner />;
	}

	return (
		<Fragment>
			<h1 className='text-primary large'>Dashboard</h1>
			<p className='lead'>
				<i className='fas fa-user'></i> Welcome, {user && user.name}
			</p>
			{profile !== null ? (
				<Fragment>
					<DashboardActions />
					{profile.experience.length > 0 && (
						<Experience experience={profile.experience} />
					)}
					{profile.education.length > 0 && (
						<Education education={profile.education} />
					)}

					<div className='my-2'>
						<button className='btn btn-danger' onClick={deleteAccount}>
							<i className='fas fa-user-minus'></i> Delete My Account
						</button>
					</div>
				</Fragment>
			) : (
				<Fragment>
					<p>You have not yet setup a profile, please add some info</p>
					<Link to='/create-profile' className='btn btn-primary my-1'>
						Create profile
					</Link>
				</Fragment>
			)}
		</Fragment>
	);
};

Dashboard.propTypes = {
	getCurrentProfile: PropTypes.func.isRequired,
	auth: PropTypes.object.isRequired,
	profile: PropTypes.object.isRequired,
	deleteAccount: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
	auth: state.auth,
	profile: state.profile
});

export default connect(mapStateToProps, { getCurrentProfile, deleteAccount })(
	Dashboard
);
