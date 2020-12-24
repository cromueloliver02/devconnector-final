import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
import Moment from 'react-moment';
import PropTypes from 'prop-types';

const CommentItem = ({ comment: { name, user, avatar, text, date } }) => {
	return (
		<Fragment>
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
				<button type='button' className='btn btn-danger'>
					<i className='fas fa-times'></i>
				</button>
			</div>
		</Fragment>
	);
};

CommentItem.propTypes = {
	comment: PropTypes.object
};

export default CommentItem;
