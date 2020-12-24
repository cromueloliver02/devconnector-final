import React, { useState } from 'react';
import { setAlert } from '../../_actions/alert';
import { connect } from 'react-redux';
import { addComment } from '../../_actions/post';
import PropTypes from 'prop-types';

const CommentForm = ({ postId, addComment, setAlert }) => {
	const [text, setText] = useState('');

	const onSubmit = e => {
		if (text === '') {
			setAlert('Please enter a comment', 'danger');
		} else {
			addComment(postId, { text });
			setText('');
		}

		e.preventDefault();
	};

	return (
		<div className='post-form'>
			<div className='bg-primary p'>
				<h3>Leave A Comment</h3>
			</div>
			<form className='form my-1' onSubmit={onSubmit}>
				<textarea
					cols='30'
					rows='5'
					placeholder='Comment on this post'
					name='comment'
					value={text}
					onChange={e => setText(e.target.value)}
				></textarea>
				<input type='submit' className='btn btn-dark my-1' value='Submit' />
			</form>
		</div>
	);
};

CommentForm.propTypes = {
	addComment: PropTypes.func.isRequired,
	setAlert: PropTypes.func.isRequired,
	postId: PropTypes.string.isRequired
};

export default connect(null, { addComment, setAlert })(CommentForm);
