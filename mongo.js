const mongoose = require('mongoose')

const password = process.env.MONGODB_PASSWORD

const connectToMongoose = () => {
	const url = `mongodb+srv://niallmurphy:${password}@cluster0.tb7y6.mongodb.net/Phonebook-Database?retryWrites=true&w=majority`
	mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })
}

const getNumbers = () => {
	connectToMongoose()
	PhonebookEntry.find({}).then(result => {
		console.log("Result")
		result.forEach(entry => {
			console.log(entry)
		})
		mongoose.connection.close()
	})
}

const createNumber = (name, number) => {
	connectToMongoose()
	const entry = new PhonebookEntry({
		name, number
	})
	entry.save().then(result => {
		console.log('entry saved!', result)
		mongoose.connection.close();
	})
}

const phonebookSchema = new mongoose.Schema({
	name: String,
	number: String
})

/**
 * Change _id from object to string and get rid of MongoDB versioning
 */
phonebookSchema.set('toJSON', {
	transform: (document, returnedObject) => {
	  returnedObject.id = returnedObject._id.toString()
	  delete returnedObject._id
	  delete returnedObject.__v
	}
 })

const PhonebookEntry = mongoose.model('PhonebookEntry', phonebookSchema)

const Phonebook = {getNumbers, createNumber}

module