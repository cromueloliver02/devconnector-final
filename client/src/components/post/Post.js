import React, { Fragment, useEffect } from 'react';
import Moment from 'react-moment';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { getPost } from '../../_actions/post';
import CommentForm from '../post/CommentForm';
import CommentItem from '../post/CommentItem';
import Spinner from '../layout/Spinner';
import PropTypes from 'prop-types';

const Post = ({ auth, post: { post, loading }, match, getPost }) => {
	useEffect(() => {
		getPost(match.params.postId);
	}, [getPost, match.params.postId]);

	if (loading || post === null) {
		return <Spinner />;
	}

	const { _id, user, name, avatar, text, date } = post;

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
				</div>
			</div>

			<CommentForm postId={_id} />

			<div className='post bg-white p-1 my-1'>
				{post.comments.map(comment => (
					<CommentItem key={comment._id} comment={comment} />
				))}
			</div>
		</Fragment>
	);
};

Post.propTypes = {
	getPost: PropTypes.func.isRequired,
	post: PropTypes.object.isRequired,
	auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
	post: state.post,
	auth: state.auth
});

export default connect(mapStateToProps, { getPost })(Post);
