import axios from 'axios';
import { setAlert } from './alert';
import setAuthToken from '../utils/setAuthToken';
import {
	REGISTER_SUCCESS,
	REGISTER_FAIL,
	USER_LOADED,
	AUTH_ERROR,
	LOGIN_SUCCESS,
	LOGIN_FAIL,
	LOGOUT,
	CLEAR_PROFILE
} from './types';

export const loadUser = () => async dispatch => {
	if (localStorage.token) {
		setAuthToken(localStorage.token);
	}

	try {
		const res = await axios.get('api/auth');

		dispatch({
			type: USER_LOADED,
			payload: res.data
		});
	} catch (err) {
		console.error(err.message);
		dispatch({
			type: AUTH_ERROR
		});
	}
};

export const register = ({ name, email, password }) => async dispatch => {
	const config = {
		headers: {
			'Content-Type': 'application/json'
		}
	};

	const body = {
		name,
		email,
		password
	};

	try {
		const res = await axios.post('/api/users', body, config);

		dispatch({
			type: REGISTER_SUCCESS,
			payload: res.data
		});

		// load user after login
		dispatch(loadUser());
	} catch (err) {
		const errors = err.response.data.errors;

		if (errors) {
			errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
		}

		// console.log(err.response.data);

		dispatch({
			type: REGISTER_FAIL
		});
	}
};

// login user
export const login = (email, password) => async dispatch => {
	const config = {
		headers: {
			'Content-Type': 'application/json'
		}
	};

	const body = {
		email,
		password
	};

	try {
		const res = await axios.post('api/auth', body, config);

		dispatch({
			type: LOGIN_SUCCESS,
			payload: res.data
		});

		// load user after login
		dispatch(loadUser());
	} catch (err) {
		const errors = err.response.data.errors;

		if (errors) {
			errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
		}

		// console.error(err.response.data);

		dispatch({
			type: LOGIN_FAIL
		});
	}
};

// logout user
export const logout = () => dispatch => {
	dispatch({ type: LOGOUT });
	dispatch({ type: CLEAR_PROFILE });
};
