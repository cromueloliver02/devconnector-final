const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
	// check if req's token exists
	const token = req.header('x-auth-token');
	if (!token) {
		return res.status(401).json({ msg: 'No token, authorization denied' });
	}

	try {
		// verify token
		const decoded = jwt.verify(token, process.env.JWT_SECRET);

		// save user into req.user
		req.user = decoded.user;

		next();
	} catch (err) {
		res.status(401).json({ msg: 'Invalid token' });
	}
};
