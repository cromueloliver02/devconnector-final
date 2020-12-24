import React, { useState } from 'react';
import { connect } from 'react-redux';
import { createPost } from '../../_actions/post';
import PropTypes from 'prop-types';

const PostForm = ({ createPost }) => {
	const [text, setText] = useState('');

	const onSubmit = e => {
		createPost({ text });

		setText('');

		e.preventDefault();
	};

	return (
		<div className='post-form'>
			<div className='bg-primary p'>
				<h3>Say Something...</h3>
			</div>
			<form className='form my-1' onSubmit={onSubmit}>
				<textarea
					cols='30'
					rows='5'
					placeholder='Create a post'
					name='text'
					value={text}
					onChange={e => setText(e.target.value)}
					required
				></textarea>
				<input type='submit' className='btn btn-dark my-1' value='Submit' />
			</form>
		</div>
	);
};

PostForm.propTypes = {
	createPost: PropTypes.func.isRequired
};

export default connect(null, { createPost })(PostForm);
