import React, { Fragment, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { createProfile, getCurrentProfile } from '../../_actions/profile';
import PropTypes from 'prop-types';

const EditProfile = ({
	profile: { profile, loading },
	getCurrentProfile,
	createProfile,
	history
}) => {
	const [formData, setFormData] = useState({
		company: '',
		website: '',
		location: '',
		status: '',
		skills: '',
		githubusername: '',
		bio: '',
		twitter: '',
		facebook: '',
		linkedin: '',
		youtube: '',
		instagram: ''
	});

	const [displaySocialInputs, toggleSocialInputs] = useState(false);

	useEffect(() => {
		getCurrentProfile();

		// console.log(profile.company);

		// const profileFields = {};
		// profileFields.status =
		// 	profile !== null && profile.status !== undefined ? profile.status : '';
		// profileFields.company =
		// 	profile !== null && profile.company !== undefined
		// 		? profile.company
		// 		: '';
		// profileFields.website =
		// 	profile !== null && profile.website !== undefined
		// 		? profile.website
		// 		: '';
		// profileFields.location =
		// 	profile !== null && profile.location !== undefined
		// 		? profile.location
		// 		: '';
		// profileFields.skills =
		// 	profile !== null && profile.skills !== undefined
		// 		? profile.skills.join(',')
		// 		: '';

		setFormData({
			// status: profileFields.status,
			// company: profileFields.company,
			// website: profileFields.website,
			// location: profileFields.location,
			// skills: profileFields.skills
			// status: loading || !profile ? '' : profile.status,
			// skills: loading || !profile ? '' : profile.skills.join(','),
			// githubusername: loading || !profile ? '' : profile.githubusername,
			// bio: loading || !profile ? '' : profile.bio
			// twitter: loading || profile ? profile.social.twitter : '',
			// facebook: loading || !profile ? '' : profile.social.facebook,
			// linkedin: loading || !profile ? '' : profile.social.linkedin,
			// youtube: loading || !profile ? '' : profile.social.youtube,
			// instagram: loading || !profile ? '' : profile.social.instagram
		});
		setFormData({
			status:
				profile !== null && profile.status !== undefined
					? profile.status
					: '',
			company:
				profile !== null && profile.company !== undefined
					? profile.company
					: '',
			website:
				profile !== null && profile.website !== undefined
					? profile.website
					: '',
			location:
				profile !== null && profile.location !== undefined
					? profile.location
					: '',
			skills:
				profile !== null && profile.skills !== undefined
					? profile.skills.join(',')
					: '',
			githubusername:
				profile !== null && profile.githubusername !== undefined
					? profile.githubusername
					: '',
			bio: profile !== null && profile.bio !== undefined ? profile.bio : '',
			twitter:
				profile !== null && profile.social !== undefined
					? profile.social.twitter
					: '',
			facebook:
				profile !== null && profile.social !== undefined
					? profile.social.facebook
					: '',
			linkedin:
				profile !== null && profile.social !== undefined
					? profile.social.linkedin
					: '',
			youtube:
				profile !== null && profile.social !== undefined
					? profile.social.youtube
					: '',
			instagram:
				profile !== null && profile.social !== undefined
					? profile.social.instagram
					: ''
		});
		// eslint-disable-next-line
	}, [loading]);

	const {
		company,
		website,
		location,
		status,
		skills,
		githubusername,
		bio,
		twitter,
		facebook,
		linkedin,
		youtube,
		instagram
	} = formData;

	const onChange = e =>
		setFormData({ ...formData, [e.target.name]: e.target.value });

	const onSubmit = e => {
		createProfile(formData, history, true);

		e.preventDefault();
	};

	return (
		<Fragment>
			<h1 className='large text-primary'>Edit Your Profile</h1>
			<p className='lead'>
				<i className='fas fa-user'></i> Let's get some information to make
				your profile stand out
			</p>
			<small>* = required field</small>
			<form className='form' onSubmit={onSubmit}>
				<div className='form-group'>
					<select name='status' value={status} onChange={e => onChange(e)}>
						<option value='0'>* Select Professional Status</option>
						<option value='Developer'>Developer</option>
						<option value='Junior Developer'>Junior Developer</option>
						<option value='Senior Developer'>Senior Developer</option>
						<option value='Manager'>Manager</option>
						<option value='Student or Learning'>
							Student or Learning
						</option>
						<option value='Instructor'>Instructor or Teacher</option>
						<option value='Intern'>Intern</option>
						<option value='Other'>Other</option>
					</select>
					<small className='form-text'>
						Give us an idea of where you are at in your career
					</small>
				</div>
				<div className='form-group'>
					<input
						type='text'
						placeholder='Company'
						name='company'
						value={company}
						onChange={onChange}
					/>
					<small className='form-text'>
						Could be your own company or one you work for
					</small>
				</div>
				<div className='form-group'>
					<input
						type='text'
						placeholder='Website'
						name='website'
						value={website}
						onChange={onChange}
					/>
					<small className='form-text'>
						Could be your own or a company website
					</small>
				</div>
				<div className='form-group'>
					<input
						type='text'
						placeholder='Location'
						name='location'
						value={location}
						onChange={onChange}
					/>
					<small className='form-text'>
						City & state suggested (eg. Boston, MA)
					</small>
				</div>
				<div className='form-group'>
					<input
						type='text'
						placeholder='* Skills'
						name='skills'
						value={skills}
						onChange={onChange}
					/>
					<small className='form-text'>
						Please use comma separated values (eg.
						HTML,CSS,JavaScript,PHP)
					</small>
				</div>
				<div className='form-group'>
					<input
						type='text'
						placeholder='Github Username'
						name='githubusername'
						value={githubusername}
						onChange={onChange}
					/>
					<small className='form-text'>
						If you want your latest repos and a Github link, include your
						username
					</small>
				</div>
				<div className='form-group'>
					<textarea
						placeholder='A short bio of yourself'
						name='bio'
						value={bio}
						onChange={onChange}
					></textarea>
					<small className='form-text'>
						Tell us a little about yourself
					</small>
				</div>

				<div className='my-2'>
					<button
						type='button'
						onClick={() => toggleSocialInputs(!displaySocialInputs)}
						className='btn btn-light'
					>
						{displaySocialInputs ? 'Hide' : 'Add'} Social Network Links
					</button>
					<span>Optional</span>
				</div>

				{displaySocialInputs && (
					<Fragment>
						<div className='form-group social-input'>
							<i className='fab fa-twitter fa-2x'></i>
							<input
								type='text'
								placeholder='Twitter URL'
								name='twitter'
								value={twitter}
								onChange={onChange}
							/>
						</div>

						<div className='form-group social-input'>
							<i className='fab fa-facebook fa-2x'></i>
							<input
								type='text'
								placeholder='Facebook URL'
								name='facebook'
								value={facebook}
								onChange={onChange}
							/>
						</div>

						<div className='form-group social-input'>
							<i className='fab fa-youtube fa-2x'></i>
							<input
								type='text'
								placeholder='YouTube URL'
								name='youtube'
								value={youtube}
								onChange={onChange}
							/>
						</div>

						<div className='form-group social-input'>
							<i className='fab fa-linkedin fa-2x'></i>
							<input
								type='text'
								placeholder='Linkedin URL'
								name='linkedin'
								value={linkedin}
								onChange={onChange}
							/>
						</div>

						<div className='form-group social-input'>
							<i className='fab fa-instagram fa-2x'></i>
							<input
								type='text'
								placeholder='Instagram URL'
								name='instagram'
								value={instagram}
								onChange={onChange}
							/>
						</div>
					</Fragment>
				)}

				<input type='submit' className='btn btn-primary my-1' />
				<Link className='btn btn-light my-1' to='/dashboard'>
					Go Back
				</Link>
			</form>
		</Fragment>
	);
};

EditProfile.propTypes = {
	createProfile: PropTypes.func.isRequired,
	getCurrentProfile: PropTypes.func.isRequired,
	profile: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
	profile: state.profile
});

export default connect(mapStateToProps, { createProfile, getCurrentProfile })(
	withRouter(EditProfile)
);
