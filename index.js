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
  const id = request.params.id
  PhonebookEntry.findById({ id })
    .then(person => {
      person ? response.json(person) : response.status(404).end()
    })
    .catch(error => next(error))
})
/**
 * Create a new record
 */
app.post('/api/persons', (request, response, next) => {
  const entry = new PhonebookEntry(response.body)
  entry.save().then(createdPerson => {
    response.json(createdPerson)
  })
    .catch(error => {
      next(error)
    })
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
  if (error.name === "CastError") {
    return response.status(400).json({ error: error.message })
  }
  if (error.name === "ValidationError") {
    return response.status(400).json({ error: error.message})
  }
  next(error)
}
app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})