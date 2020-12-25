import {
	GET_POSTS,
	GET_POST,
	POST_ERROR,
	UPDATE_LIKES,
	UPDATE_LIKES_BY_SINGLE_POST,
	DELETE_POST,
	CREATE_POST,
	ADD_COMMENT,
	DELETE_COMMENT,
	SET_LOADING_POST
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
		case GET_POST:
			return {
				...state,
				post: payload,
				loading: false
			};
		case POST_ERROR:
			return {
				...state,
				error: payload,
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
		case UPDATE_LIKES_BY_SINGLE_POST:
			return {
				...state,
				post: { ...state.post, likes: payload },
				loading: false
			};
		case ADD_COMMENT:
			return {
				...state,
				post: { ...state.post, comments: payload },
				loading: false
			};
		case DELETE_COMMENT:
			return {
				...state,
				post: {
					...state.post,
					comments: state.post.comments.filter(
						comment => comment._id !== payload
					)
				},
				loading: false
			};
		case SET_LOADING_POST:
			return {
				...state,
				loading: true
			};
		default:
			return state;
	}
};
