import {
	GET_POSTS,
	POST_ERROR,
	UPDATE_LIKES,
	DELETE_POST,
	CREATE_POST
} from '../_actions/types';

const initialState = {
	posts: [],
	post: null,
	loading: false,
	error: null
};

export default (state = initialState, { type, payload }) => {
	switch (type) {
		case GET_POSTS:
			return {
				...state,
				posts: payload,
				loading: false
			};
		case POST_ERROR:
			return {
				...state,
				error: payload,
				loading: false
			};
		case UPDATE_LIKES:
			return {
				...state,
				posts: state.posts.map(post =>
					payload.postId === post._id
						? { ...post, likes: payload.likes }
						: post
				),
				loading: false
			};
		case CREATE_POST:
			return {
				...state,
				posts: [payload, ...state.posts],
				loading: false
			};
		case DELETE_POST:
			return {
				...state,
				posts: state.posts.filter(post => post._id !== payload),
				loading: false
			};
		default:
			return state;
	}
};
