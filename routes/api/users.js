const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const gravatar = require('gravatar');
const { body, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');

const User = require('../../models/User');

// @access     POST /api/users
// desc        Register user
// access      Public
router.post(
	'/',
	[
		body('name', 'Please enter your name').not().isEmpty(),
		body('email', 'Please enter a valid email').isEmail(),
		body('password', 'Please enter a six character password').isLength({
			min: 6
		})
	],
	async (req, res) => {
		// validate user inputs
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}

		try {
			// get all user inputs
			const { name, email, password } = req.body;

			// check if email already exists
			let user = await User.findOne({ email });
			if (user) {
				return res
					.status(400)
					.json({ errors: [{ msg: 'Email already exists' }] });
			}

			// get email's gravatar
			const avatar = gravatar.url(email, {
				s: '200', // size
				r: 'pg', // rating
				d: 'mm' // default
			});

			// create user object
			user = new User({ name, email, avatar, password });

			// hash the password
			const salt = await bcrypt.genSalt(10);
			user.password = await bcrypt.hash(password, salt);

			// save user to database
			await user.save();

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
		} catch (err) {
			console.log(err.message);
			res.status(500).send('Server error');
		}
	}
);

module.exports = router;
