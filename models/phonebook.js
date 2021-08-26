/* eslint-disable no-underscore-dangle */
/* eslint-disable no-param-reassign */
const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
require('dotenv').config();

const url = process.env.MONGODB_URI;

mongoose.connect(url, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
	useFindAndModify: false,
	useCreateIndex: true,
})
	.then(() => {
		console.log('connected to MongoDB');
	})
	.catch((error) => {
		console.log('error connecting to MongoDB:', error.message);
	});

const phonebookSchema = new mongoose.Schema({
	name: {
		type: String, required: true, unique: true, minLength: 3,
	},
	number: {
		type: String, required: true, unique: true, minLength: 8,
	},
});
phonebookSchema.plugin(uniqueValidator);

/**
 * Change _id from object to string and get rid of MongoDB versioning
 */
phonebookSchema.set('toJSON', {
	transform: (document, returnedObject) => {
		returnedObject.id = returnedObject._id.toString();
		delete returnedObject._id;
		delete returnedObject.__v;
	},
});

module.exports = mongoose.model('PhonebookEntry', phonebookSchema);
