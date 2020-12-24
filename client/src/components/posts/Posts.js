import React, { Fragment, useEffect } from 'react';
import { connect } from 'react-redux';
import { getPosts } from '../../_actions/post';
import Spinner from '../layout/Spinner';
import PostItem from '../posts/PostItem';
import PostForm from '../posts/PostForm';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import PropTypes from 'prop-types';

const Posts = ({ post: { posts, loading }, getPosts }) => {
	useEffect(() => {
		getPosts();
	}, [getPosts]);

	if (loading || posts.length === 0) {
		return <Spinner />;
	}

	return (
		<Fragment>
			<h1 className='large text-primary'>Posts</h1>
			<p className='lead'>
				<i className='fas fa-user'></i> Welcome to the commmunity
			</p>

			<PostForm />

			<div className='posts'>
				<TransitionGroup>
					{posts.map(post => (
						<CSSTransition key={post._id} timeout={500} classNames='item'>
							<PostItem post={post} />
						</CSSTransition>
					))}
				</TransitionGroup>
			</div>
		</Fragment>
	);
};

Posts.propTypes = {
	getPosts: PropTypes.func.isRequired,
	post: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
	post: state.post
});

export default connect(mapStateToProps, { getPosts })(Posts);
