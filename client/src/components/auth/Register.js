import React, { Fragment, useState } from 'react';
import { Link, Redirect, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { setAlert } from '../../_actions/alert';
import { register } from '../../_actions/auth';
import PropTypes from 'prop-types';

const Register = ({
	auth: { isAuthenticated, loading },
	setAlert,
	register,
	history
}) => {
	const [formData, setFormData] = useState({
		name: '',
		email: '',
		password: '',
		password2: ''
	});

	const { name, email, password, password2 } = formData;

	const onChange = e => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	const onSubmit = e => {
		if (password !== password2) {
			setAlert('Passwords does not match...', 'danger');
		} else {
			register({ name, email, password }, history);
		}

		e.preventDefault();
	};

	if (isAuthenticated) {
		return <Redirect to='/dashboard' />;
	}

	return (
		<Fragment>
			<h1 className='large text-primary'>Sign Up</h1>
			<p className='lead'>
				<i className='fas fa-user'></i> Create Your Account
			</p>
			<form className='form' onSubmit={onSubmit}>
				<div className='form-group'>
					<input
						type='text'
						placeholder='Name'
						name='name'
						value={name}
						onChange={onChange}
						// required
					/>
				</div>
				<div className='form-group'>
					<input
						type='email'
						placeholder='Email Address'
						name='email'
						value={email}
						onChange={onChange}
						// required
					/>
					<small className='form-text'>
						This site uses Gravatar so if you want a profile image, use a
						Gravatar email
					</small>
				</div>
				<div className='form-group'>
					<input
						type='password'
						placeholder='Password'
						name='password'
						value={password}
						onChange={onChange}
						// minLength='6'
					/>
				</div>
				<div className='form-group'>
					<input
						type='password'
						placeholder='Confirm Password'
						name='password2'
						value={password2}
						onChange={onChange}
						// minLength='6'
					/>
				</div>
				<button type='submit' className='btn btn-primary'>
					{loading ? (
						<Fragment>
							<i className='fas fa-circle-notch fa-spin'></i> loading ...
						</Fragment>
					) : (
						<Fragment>Register</Fragment>
					)}
				</button>
			</form>
			<p className='my-1'>
				Already have an account? <Link to='login'>Sign In</Link>
			</p>
		</Fragment>
	);
};

Register.propTypes = {
	setAlert: PropTypes.func.isRequired,
	register: PropTypes.func.isRequired,
	auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
	auth: state.auth
});

export default connect(mapStateToProps, { setAlert, register })(
	withRouter(Register)
);
