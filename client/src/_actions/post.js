import axios from 'axios';
import { setAlert } from './alert';
import {
	GET_POSTS,
	GET_POST,
	POST_ERROR,
	UPDATE_LIKES,
	DELETE_POST,
	CREATE_POST,
	ADD_COMMENT,
	SET_LOADING_POST
} from './types';

export const getPosts = () => async dispatch => {
	dispatch({
		type: SET_LOADING_POST
	});

	try {
		const res = await axios.get('/api/posts');

		dispatch({
			type: GET_POSTS,
			payload: res.data
		});
	} catch (err) {
		console.error(err.message);
		dispatch({
			type: POST_ERROR,
			payload: { msg: err.response.statusText, status: err.response.status }
		});
	}
};

export const getPost = postId => async dispatch => {
	dispatch({
		type: SET_LOADING_POST
	});

	try {
		const res = await axios.get(`/api/posts/${postId}`);

		dispatch({
			type: GET_POST,
			payload: res.data
		});
	} catch (err) {}
};

export const addLike = postId => async dispatch => {
	try {
		const res = await axios.put(`/api/posts/like/${postId}`);

		dispatch({
			type: UPDATE_LIKES,
			payload: { postId, likes: res.data }
		});
	} catch (err) {
		console.error(err.message);
		dispatch({
			type: POST_ERROR,
			payload: { msg: err.response.statusText, status: err.response.status }
		});
	}
};

export const removeLike = postId => async dispatch => {
	try {
		const res = await axios.put(`/api/posts/unlike/${postId}`);

		dispatch({
			type: UPDATE_LIKES,
			payload: { postId, likes: res.data }
		});
	} catch (err) {
		console.error(err.message);
		dispatch({
			type: POST_ERROR,
			payload: { msg: err.response.statusText, status: err.response.status }
		});
	}
};

export const createPost = formData => async dispatch => {
	const config = {
		headers: {
			'Content-Type': 'application/json'
		}
	};

	try {
		const res = await axios.post('/api/posts', formData, config);

		dispatch({
			type: CREATE_POST,
			payload: res.data
		});

		dispatch(setAlert('Post successfully published', 'success'));
	} catch (err) {
		console.error(err.message);
		dispatch({
			type: POST_ERROR,
			payload: { msg: err.response.statusText, status: err.response.status }
		});
	}
};

export const deletePost = postId => async dispatch => {
	try {
		await axios.delete(`/api/posts/${postId}`);

		dispatch({
			type: DELETE_POST,
			payload: postId
		});

		dispatch(setAlert('Post successfully deleted', 'success'));
	} catch (err) {
		console.error(err.message);
		dispatch({
			type: POST_ERROR,
			payload: { msg: err.response.statusText, status: err.response.status }
		});
	}
};

export const addComment = (postId, text) => async dispatch => {
	const config = {
		headers: {
			'Content-Type': 'application/json'
		}
	};

	try {
		const res = await axios.post(
			`/api/posts/comment/${postId}`,
			text,
			config
		);

		dispatch({
			type: ADD_COMMENT,
			payload: res.data
		});
	} catch (err) {
		console.error(err.message);
		console.error(err.response.data.msg);
		dispatch({
			type: POST_ERROR,
			payload: { msg: err.response.statusText, status: err.response.status }
		});
	}
};
