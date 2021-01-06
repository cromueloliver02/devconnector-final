import React, { Fragment, useState } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { login } from '../../_actions/auth';
import PropTypes from 'prop-types';

const Login = ({ auth: { isAuthenticated, loading }, login }) => {
	const [formData, setFormData] = useState({
		email: '',
		password: ''
	});

	const { email, password } = formData;

	const onChange = e => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	const onSubmit = e => {
		login(email, password);

		setFormData({
			email: '',
			password: ''
		});

		e.preventDefault();
	};

	if (isAuthenticated) {
		return <Redirect to='/dashboard' />;
	}

	return (
		<Fragment>
			<h1 className='large text-primary'>Sign Up</h1>
			<p className='lead'>
				<i className='fas fa-user'></i> Sign Into Your Account
			</p>
			<form className='form' onSubmit={onSubmit}>
				<div className='form-group'>
					<input
						type='email'
						placeholder='Email Address'
						name='email'
						value={email}
						onChange={onChange}
					/>
				</div>
				<div className='form-group'>
					<input
						type='password'
						placeholder='Password'
						name='password'
						value={password}
						onChange={onChange}
						minLength='6'
					/>
				</div>
				<button
					type='submit'
					className='btn btn-primary'
					disabled={loading}
				>
					{loading ? (
						<Fragment>
							<i className='fas fa-circle-notch fa-spin'></i> loading ...
						</Fragment>
					) : (
						<Fragment>Login</Fragment>
					)}
				</button>
			</form>
			<p className='my-1'>
				Don't have an account? <Link to='register'>Sign Up</Link>
			</p>
		</Fragment>
	);
};

Login.propTypes = {
	login: PropTypes.func.isRequired,
	auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
	auth: state.auth
});

export default connect(mapStateToProps, { login })(Login);
