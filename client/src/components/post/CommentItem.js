import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
import Moment from 'react-moment';
import { connect } from 'react-redux';
import { deleteComment } from '../../_actions/post';
import PropTypes from 'prop-types';

const CommentItem = ({
	auth,
	postId,
	comment: { _id, name, user, avatar, text, date },
	deleteComment
}) => {
	return (
		<Fragment>
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
					{!auth.loading && auth.user._id === user && (
						<button
							type='button'
							className='btn btn-danger'
							onClick={() => deleteComment(postId, _id)}
						>
							<i className='fas fa-times'></i>
						</button>
					)}
				</div>
			</div>
		</Fragment>
	);
};

CommentItem.propTypes = {
	comment: PropTypes.object,
	postId: PropTypes.string.isRequired,
	deleteComment: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
	auth: state.auth
});

export default connect(mapStateToProps, { deleteComment })(CommentItem);
