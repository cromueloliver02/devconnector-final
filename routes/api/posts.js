const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const auth = require('../../middlewares/auth');

const User = require('../../models/User');
const Post = require('../../models/Post');

// @access     POST /api/posts
// desc        Create a post
// access      Private
router.post(
	'/',
	[auth, [body('text', 'Text is required').not().isEmpty()]],
	async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}

		try {
			// get user's info
			const user = await User.findById(req.user.id).select('-password');

			const post = new Post({
				user: req.user.id,
				text: req.body.text,
				name: user.name,
				avatar: user.avatar
			});

			await post.save();

			res.json(post);
		} catch (err) {
			console.error(err.message);
			res.status(500).send('Server error');
		}
	}
);

// @access     GET /api/posts
// desc        Get all posts
// access      Private
router.get('/', auth, async (req, res) => {
	try {
		const posts = await Post.find().sort({ date: -1 });

		res.json(posts);
	} catch (err) {
		console.error(err.message);
		res.status(500).send('Server error');
	}
});

// @access     GET /api/posts
// desc        Get post by id
// access      Private
router.get('/:post_id', auth, async (req, res) => {
	try {
		const post = await Post.findById(req.params.post_id);

		if (!post) {
			return res.status(404).json({ msg: 'Post not found' });
		}

		res.json(post);
	} catch (err) {
		console.error(err.message);
		// server error handler
		if ((err.kind = 'ObjectId')) {
			return res.status(404).json({ msg: 'Post not found' });
		}
		res.status(500).send('Server error');
	}
});

// @access     DELETE /api/posts/:post_id
// desc        Delete a post
// access      Private
router.delete(
	'/:post_id',
	auth,
	async ({ user: { id }, params: { post_id } }, res) => {
		try {
			const post = await Post.findById(post_id);

			// check if post exists
			if (!post) {
				return res.status(404).json({ msg: 'Post not found' });
			}

			// check user if it owns post
			if (post.user.toString() !== id) {
				return res.status(401).json({ msg: 'User not authorized' });
			}

			await post.remove();

			res.json({ msg: 'Post removed' });
		} catch (err) {
			console.error(err.message);
			if (err.kind === 'ObjectId') {
				return res.status(404).json({ msg: 'Post not found' });
			}
			res.status(500).send('Server error');
		}
	}
);

// @access     PUT /api/posts/like/:id
// desc        Like a post
// access      Private
router.put('/like/:id', auth, async (req, res) => {
	try {
		// get post to like
		const post = await Post.findById(req.params.id);

		// check if post exists
		if (!post) {
			return res.status(404).json({ msg: 'Post not found' });
		}

		// check if user already liked the post
		const isLiked = post.likes.some(
			like => like.user.toString() === req.user.id
		);
		if (isLiked) {
			return res.status(400).json({ msg: 'Post already liked' });
		}

		// get logged in user's info
		const user = await User.findById(req.user.id).select(['name', 'avatar']);

		// insert like
		post.likes.unshift({
			user: req.user.id,
			name: user.name,
			avatar: user.avatar
		});

		await post.save();

		res.json(post.likes);
	} catch (err) {
		console.error(err.message);
		if (err.kind === 'ObjectId') {
			return res.status(404).json({ msg: 'Post not found' });
		}
		res.status(500).send('Server error');
	}
});

// @access     PUT /api/posts/unlike/:id
// desc        Unlike a post
// access      Private
router.put('/unlike/:id', auth, async (req, res) => {
	try {
		// get post to unlike
		const post = await Post.findById(req.params.id);

		// check if post exists
		if (!post) {
			return res.status(404).json({ msg: 'Post not found' });
		}

		// check if post is not yet liked
		const isLiked = post.likes.some(
			like => like.user.toString() === req.user.id
		);
		if (!isLiked) {
			return res.status(400).json({ msg: 'Post is already unliked' });
		}

		// unlike post/remove like
		post.likes = post.likes.filter(
			like => like.user.toString() !== req.user.id
		);

		await post.save();

		res.json(post.likes);
	} catch (err) {
		console.error(err.message);
		if (err.kind === 'ObjectId') {
			return res.status(404).json({ msg: 'Post not found' });
		}
		res.status(500).send('Server error');
	}
});

// @access     POST /api/posts/comment/:id
// desc        Comment a post
// access      Private
router.post(
	'/comment/:id',
	[auth, [body('text', 'Text is required').not().isEmpty()]],
	async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}

		try {
			const user = await User.findById(req.user.id);
			const post = await Post.findById(req.params.id);

			const comment = {
				user: req.user.id,
				text: req.body.text,
				name: user.name,
				avatar: user.avatar
			};

			post.comments.unshift(comment);

			await post.save();

			res.json(post.comments);
		} catch (err) {
			console.error(err.message);
			if (err.kind === 'ObjectId') {
				return res.status(404).json({ msg: 'Post not found' });
			}
			res.status(500).send('Server error');
		}
	}
);

// @access     DELETE /api/posts/:post_id/comment/:comment_id
// desc        Comment a post
// access      Private
router.delete('/:post_id/comment/:comment_id', auth, async (req, res) => {
	try {
		// get post to delete comment from
		const post = await Post.findById(req.params.post_id);

		// check post if it exists
		if (!post) {
			return res.status(404).json({ msg: 'Post not found' });
		}

		// check comment if it exist in the post
		const comment = post.comments.find(
			comment => comment.id === req.params.comment_id
		);
		if (!comment) {
			return res.status(404).json({ msg: 'Comment not found' });
		}

		// check if user owns the comment
		if (comment.user.toString() !== req.user.id) {
			return res.status(401).json({ msg: 'User not authorized' });
		}

		// remove comment from post
		post.comments = post.comments.filter(
			comment => comment.id !== req.params.comment_id
		);

		// remove comment from db
		await post.save();

		res.json(post.comments);
	} catch (err) {
		console.error(err.message);
		if (err.kind === 'ObjectId') {
			return res.status(404).json({ msg: 'Comment not found' });
		}
		res.status(500).send('Server error');
	}
});

module.exports = router;
