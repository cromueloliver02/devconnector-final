const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const { body, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const auth = require('../../middlewares/auth');

const User = require('../../models/User');

// @route      GET /api/auth
// @desc			Get auth user
// @access     Private
router.get('/', auth, async (req, res) => {
	try {
		// get user from db
		const user = await User.findById(req.user.id).select('-password');

		res.json(user);
	} catch (err) {
		console.error(err.message);
		res.status(500).send('Server error');
	}
});

// @access     POST /api/auth
// desc        Authenticate user and get token
// access      Public
router.post(
	'/',
	[
		body('email', 'Please enter a valid email').isEmail(),
		body('password', 'Password is required').not().isEmpty()
	],
	async (req, res) => {
		// validate user inputs
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}

		try {
			// get all user inputs
			const { email, password } = req.body;

			// check if email exists
			let user = await User.findOne({ email });
			if (!user) {
				return res
					.status(400)
					.json({ errors: [{ msg: 'Invalid credentials' }] });
			}

			// verify password
			const isMatch = await bcrypt.compare(password, user.password);
			if (!isMatch) {
				return res
					.status(400)
					.json({ errors: [{ msg: 'Invalid credentials' }] });
			}

			// respond token
			const payload = {
				user: {
					id: user.id
				}
			};
			jwt.sign(
				payload,
				process.env.JWT_SECRET,
				{
					expiresIn: 3600
				},
				(err, token) => {
					if (err) throw err;
					res.status(200).json({ token });
				}
			);
		} catch (err) {T
			console.log(err.message);
			res.status(500).send('Server error');
		}
	}
);

module.exports = router;
