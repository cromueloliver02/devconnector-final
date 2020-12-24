const express = require('express');
const axios = require('axios');
const router = express.Router();
const auth = require('../../middlewares/auth');
const { body, validationResult } = require('express-validator');

const Profile = require('../../models/Profile');
const User = require('../../models/User');

// @access     GET /api/profile/me
// desc        Get current user's profile
// access      Private
router.get('/me', auth, async (req, res) => {
	try {
		// get user profile infos
		const profile = await Profile.findOne({
			user: req.user.id
		}).populate('user', ['name', 'avatar']);

		// check if profile exists
		if (!profile) {
			return res
				.status(404)
				.json({ msg: 'There is no profile for this user' });
		}

		res.json(profile);
	} catch (err) {
		console.error(err.message);
		res.status(500).send('Server error');
	}
});

// @access     POST /api/profile
// desc        Create or Update user's profile
// access      Private
router.post(
	'/',
	[
		auth,
		[
			body('status', 'Status is required').not().isEmpty(),
			body('skills', 'Skills is required').not().isEmpty()
		]
	],
	async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}

		// pull all user input
		const {
			company,
			website,
			location,
			bio,
			status,
			githubusername,
			skills,
			youtube,
			facebook,
			twitter,
			instagram,
			linkedin
		} = req.body;

		// create profile object to filter out empty fields
		// before saving to database
		const profileFields = {};
		profileFields.user = req.user.id;
		if (company) profileFields.company = company;
		if (website) profileFields.website = website;
		if (location) profileFields.location = location;
		if (bio) profileFields.bio = bio;
		if (status) profileFields.status = status;
		if (githubusername) profileFields.githubusername = githubusername;
		if (skills) {
			profileFields.skills = skills.split(',').map(skill => skill.trim());
		}
		// create social object
		profileFields.social = {};
		if (youtube) profileFields.social.youtube = youtube;
		if (facebook) profileFields.social.facebook = facebook;
		if (twitter) profileFields.social.twitter = twitter;
		if (instagram) profileFields.social.instagram = instagram;
		if (linkedin) profileFields.social.linkedin = linkedin;

		try {
			// update profile if it already exists
			let profile = await Profile.findOne({ user: req.user.id });
			if (profile) {
				profile = await Profile.findOneAndUpdate(
					{ user: req.user.id },
					{ $set: profileFields },
					{ new: true }
				);

				return res.status(200).json(profile);
			}

			profile = new Profile(profileFields);

			// add profile to database
			await profile.save();

			res.json(profile);
		} catch (err) {
			console.error(err.message);
			res.status(500).send('Server error');
		}
	}
);

// @access     GET /api/profile
// desc        Get all profiles
// access      Public
router.get('/', async (req, res) => {
	try {
		const profiles = await Profile.find().populate('user', [
			'name',
			'avatar'
		]);

		res.json(profiles);
	} catch (err) {
		console.error(err.message);
		res.status(500).send('Server error');
	}
});

// @access     GET /api/profile/user/:user_id
// desc        Get  profile by id
// access      Public
router.get('/user/:user_id', async (req, res) => {
	try {
		const profile = await Profile.findOne({
			user: req.params.user_id
		}).populate('user', ['name', 'avatar']);

		// check if profle exists
		if (!profile) return res.status(404).json({ msg: 'Profile not found' });

		res.json(profile);
	} catch (err) {
		console.error(err.message);
		if (err.kind === 'ObjectId') {
			return res.status(404).json({ msg: 'Profile not found' });
		}
		res.status(500).send('Server error');
	}
});

// @access     DELETE /api/profile
// desc        Delete profile, user and posts
// access      Private
router.delete('/', auth, async (req, res) => {
	try {
		// @todo - delete user posts

		// delete user profile
		await Profile.findOneAndRemove({ user: req.user.id });

		// delete user
		await User.findOneAndRemove({ _id: req.user.id });

		res.json({ msg: 'User deleted' });
	} catch (err) {
		console.error(err.message);
		res.status(500).send('Server error');
	}
});

// @access     PUT /api/profile/experience
// desc        Add profile experience
// access      Private
router.put(
	'/experience',
	[
		auth,
		[
			body('title', 'Title is required').not().isEmpty(),
			body('company', 'Company is required').not().isEmpty(),
			body('from', 'From is required').not().isEmpty()
		]
	],
	async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}

		const {
			title,
			company,
			location,
			from,
			to,
			current,
			description
		} = req.body;

		// create experience object
		const newExp = {
			title,
			company,
			location,
			from,
			to,
			current,
			description
		};
		// const experienceFields = {};
		// if (title) experienceFields.title = title;
		// if (company) experienceFields.company = company;
		// if (location) experienceFields.location = location;
		// if (from) experienceFields.from = from;
		// if (to) experienceFields.title = to;
		// if (current) experienceFields.current = current;
		// if (description) experienceFields.description = description;

		try {
			let profile = await Profile.findOne({ user: req.user.id });

			// add new experience into the
			// experience array as first element
			profile.experience.unshift(newExp);
			// profile.experience.unshift(experienceFields);

			profile = await profile.save();

			res.json(profile);
		} catch (err) {
			console.error(err.message);
			res.status(500).send('Server error');
		}
	}
);

// @access     DELETE /api/profile/experience/:exp_id
// desc        Delete profile experience
// access      Private
router.delete('/experience/:exp_id', auth, async (req, res) => {
	try {
		const profile = await Profile.findOne({ user: req.user.id });

		// delete experience
		profile.experience = profile.experience.filter(
			exp => exp.id !== req.params.exp_id
		);

		// update experience from db
		await Profile.findOneAndUpdate(
			{ user: req.user.id },
			{ $set: profile },
			{ new: true }
		);

		res.json(profile);
	} catch (err) {
		console.error(err.message);
		res.status(500).send('Server error');
	}
});

// @access     PUT /api/profile/education
// desc        Add profile education
// access      Private
router.put(
	'/education',
	[
		auth,
		[
			body('school', 'School is required').not().isEmpty(),
			body('degree', 'Degree is required').not().isEmpty(),
			body('fieldofstudy', 'Field of study is required').not().isEmpty(),
			body('from', 'From is required').not().isEmpty()
		]
	],
	async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}

		const {
			school,
			degree,
			fieldofstudy,
			from,
			to,
			current,
			description
		} = req.body;

		// const education = {
		// 	school,
		// 	degree,
		// 	fieldofstudy,
		// 	from,
		// 	to,
		// 	current,
		// 	description
		// };
		const educationField = {};
		if (school) educationField.school = school;
		if (degree) educationField.degree = degree;
		if (fieldofstudy) educationField.fieldofstudy = fieldofstudy;
		if (from) educationField.from = from;
		if (to) educationField.to = to;
		if (current) educationField.current = current;
		if (description) educationField.description = description;

		try {
			const profile = await Profile.findOne({ user: req.user.id });

			profile.education.unshift(educationField);

			await Profile.findOneAndUpdate(
				{ user: req.user.id },
				{ $set: profile },
				{ new: true }
			);

			res.json(profile);
		} catch (err) {
			console.error(err.message);
			res.status(500).send('Server error');
		}
	}
);

// @access     DELETE /api/profile/education/:edu_id
// desc        Delete profile education
// access      Private
router.delete('/education/:edu_id', auth, async (req, res) => {
	try {
		const profile = await Profile.findOne({ user: req.user.id });

		profile.education = profile.education.filter(
			edu => edu.id !== req.params.edu_id
		);

		await Profile.findOneAndUpdate(
			{ user: req.user.id },
			{ $set: profile },
			{ new: true }
		);

		res.json(profile);
	} catch (err) {
		console.error(err.message);
		res.status(500).send('Server error');
	}
});

// @access     GET /api/profile/github/:username
// desc        Get user repos fom github
// access      Private
router.get('/github/:username', async (req, res) => {
	try {
		const uri = encodeURI(
			`https://api.github.com/users/${req.params.username}/repos?per_page=5&sort=created:asc&client_id=${process.env.GITHUB_CLIENT_ID}&client_secret=${process.env.GITHUB_CLIENT_SECRET}`
		);

		const headers = {
			'user-agent': 'node.js'
		};

		const githubRes = await axios.get(uri, headers);

		res.json(githubRes.data);
	} catch (err) {
		console.error(err.message);
		res.status(404).json({ msg: 'No github profile found' });
	}
});

module.exports = router;
