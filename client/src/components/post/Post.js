import React, { Fragment, useEffect } from 'react';
import Moment from 'react-moment';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import {
	getPost,
	addLikeBySinglePost,
	removeLikeBySinglePost
} from '../../_actions/post';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import CommentForm from '../post/CommentForm';
import CommentItem from '../post/CommentItem';
import Spinner from '../layout/Spinner';
import PropTypes from 'prop-types';

const Post = ({
	post: { post, loading },
	auth,
	match,
	getPost,
	addLikeBySinglePost,
	removeLikeBySinglePost
}) => {
	useEffect(() => {
		getPost(match.params.postId);
	}, [getPost, match.params.postId]);

	if (loading || post === null) {
		return <Spinner />;
	}

	const { _id, user, name, avatar, likes, text, date } = post;

	const isLiked =
		auth.user !== null
			? likes.some(like => like.user === auth.user._id)
			: false;

	return (
		<Fragment>
			<Link to='/posts' className='btn'>
				Back To Posts
			</Link>
			<div className='post bg-white p-1 my-1'>
				<div>
					<Link to={`/profile/${user}`}>
						<img className='round-img' src={avatar} alt={name} />
						<h4>{name}</h4>
					</Link>
				</div>
				<div>
					<p className='my-1'>{text}</p>
					<p className='post-date'>
						<Moment format='MM/DD/YYYY'>{date}</Moment>
					</p>
					<button
						type='button'
						className='btn btn-light'
						onClick={() => addLikeBySinglePost(_id)}
					>
						<i
							className={`fas fa-thumbs-up ${isLiked && 'text-primary'}`}
						></i>
						{likes.length > 0 && <span> {likes.length}</span>}
					</button>
					<button
						type='button'
						className='btn btn-light'
						onClick={() => removeLikeBySinglePost(_id)}
					>
						<i className='fas fa-thumbs-down'></i>
					</button>
				</div>
			</div>

			<CommentForm postId={_id} />

			<div className='comment'>
				<TransitionGroup>
					{post.comments.map(comment => (
						<CSSTransition
							key={comment._id}
							timeout={500}
							classNames='item'
						>
							<CommentItem comment={comment} postId={_id} />
						</CSSTransition>
					))}
				</TransitionGroup>
			</div>
		</Fragment>
	);
};

Post.propTypes = {
	getPost: PropTypes.func.isRequired,
	post: PropTypes.object.isRequired,
	addLikeBySinglePost: PropTypes.func.isRequired,
	removeLikeBySinglePost: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
	post: state.post,
	auth: state.auth
});

export default connect(mapStateToProps, {
	getPost,
	addLikeBySinglePost,
	removeLikeBySinglePost
})(Post);
