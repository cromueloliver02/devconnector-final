const mongoose = require('mongoose');
const config = require('config');

// const dbURI =
// 	process.env.NODE_ENV === 'production'
// 		? config.get('mongoURI')
// 		: config.get('devMongoURI');
const dbURI = config.get('mongoURI');

const connectDB = async () => {
	try {
		await mongoose.connect(dbURI, {
			useNewUrlParser: true,
			useCreateIndex: true,
			useUnifiedTopology: true,
			useFindAndModify: false
		});

		console.log(`MongoDB connected on ${dbURI}...`);
	} catch (err) {
		console.error(err.message);
		process.exit(1);
	}
};

module.exports = connectDB;
