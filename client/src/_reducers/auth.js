import {
	REGISTER_SUCCESS,
	REGISTER_FAIL,
	USER_LOADED,
	AUTH_ERROR,
	LOGIN_SUCCESS,
	LOGIN_FAIL,
	LOGOUT,
	SET_LOADING_AUTH,
	ACCOUNT_DELETED
} from '../_actions/types';

const initialState = {
	token: localStorage.getItem('token'),
	isAuthenticated: null,
	user: null,
	loading: false
};

export default (state = initialState, { type, payload }) => {
	switch (type) {
		case USER_LOADED:
			return {
				...state,
				isAuthenticated: true,
				user: payload,
				loading: false
			};
		case LOGIN_SUCCESS:
			localStorage.setItem('token', payload.token);
			return {
				...state,
				...payload,
				isAuthenticated: true,
				loading: false
			};
		case REGISTER_SUCCESS:
		case REGISTER_FAIL:
		case LOGIN_FAIL:
		case AUTH_ERROR:
		case LOGOUT:
		case ACCOUNT_DELETED:
			localStorage.removeItem('token');
			return {
				...state,
				token: null,
				isAuthenticated: false,
				loading: false,
				user: null
			};
		case SET_LOADING_AUTH:
			return {
				...state,
				loading: true
			};
		default:
			return state;
	}
};
