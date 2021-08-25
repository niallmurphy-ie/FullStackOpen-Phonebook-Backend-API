require('dotenv').config()

const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')

const PhonebookEntry = require('./models/phonebook')

app.use(cors())
app.use(express.json())
app.use(express.static('build'))

// New token for Morgan debugging
morgan.token('body', function getRequestBody(req, res) {
  return JSON.stringify(req.body)
})
app.use(morgan(':method :url :status :res[content-length] :response-time ms :body'))

/**
 * Get all records
 */
app.get('/api/persons', async (request, response) => {
  const persons = await PhonebookEntry.find({})
  response.json(persons)
})

/**
 * Get an individual record
 */
 app.get('/api/persons/:id', (request, response, next) => {
  const _id = request.params.id
  PhonebookEntry.findById({ _id })
    .then(person => {
      person ? response.json(person) : response.status(404).end()
    })
    .catch(error => next(error))
})
/**
 * Create a new record
 */
app.post('/api/persons', async (request, response, next) => {
  const newEntry = request.body;
  if (Object.keys(newEntry).length === 0) {
    return response.status(400).json({
      error: 'content missing'
    })
  }
  // Check that entry will be valid
  const errorCheck = await isError(newEntry)
  if (errorCheck) return response.status(409).json({ error: errorCheck.error })
  // Mongoose
  const entry = new PhonebookEntry(newEntry)
  entry.save().then(result => {
    response.json(result)
  })
    .catch(error => next(error))
})

/**
 * Delete an individual record
 */
app.delete('/api/persons/:id', (request, response, next) => {
  const _id = request.params.id
  PhonebookEntry.findByIdAndDelete({ _id })
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

/**
 * Update a record
 */
app.put('/api/persons/:id', async (request, response, next) => {
  const entry = request.body
  const _id = request.params.id
  if (Object.keys(entry).length === 0) next(error)

  PhonebookEntry.findByIdAndUpdate(_id, entry, { new: true })
    .then(updatedRecord => {
      response.status(200).json(updatedRecord)
    })
    .catch(error => next(error))
})

const isError = entry => {
  const errors = PhonebookEntry.find({}).then(persons => {
    if (persons.some(person => person.name === entry.name)) return { error: "Name already exists " }
    if (entry.name === "" || entry.number === "") return { error: "Name or number missing" }
    return false
  })
  return errors
}

app.get('/info', async (request, response) => {
  let msg = '';
  const persons = await PhonebookEntry.find({})
  msg += `Phonebook has ${persons.length} people<br>`
  msg += new Date().toLocaleTimeString();
  response.send(msg)
})


/**
 * Middleware for unknown pages
 * @param {*} request
 * @param {*} response
 */
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}
app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
  console.log(error.message)
  if (error.message === "CastError") {
    return response.status(400).json({ error: error.message })
  }
  next(error)
}
app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})