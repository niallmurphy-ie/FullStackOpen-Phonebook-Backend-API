const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')
app.use(cors())
app.use(express.json())
app.use(express.static('build'))

// New token for Morgan debugging
morgan.token('body', function getRequestBody (req, res) {
  return JSON.stringify(req.body)
})
app.use(morgan(':method :url :status :res[content-length] :response-time ms :body' ))

let persons = [
  {
    "name": "Niall Murphy",
    "number": "01-6521554",
    "id": 3
  },
  {
    "name": "Trang",
    "number": "222222",
    "id": 4
  },
  {
    "name": "Ly",
    "number": "666655",
    "id": 5
  },
  {
    "name": "Thuy",
    "number": "999668",
    "id": 8
  },
  {
    "name": "Nguyen",
    "number": "12333333",
    "id": 13
  },
  {
    "name": "Phi",
    "number": "12232222",
    "id": 14
  }
]

app.get('/api/persons', (request, response) => {
  response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  const person = persons.find(person => person.id === id)
  person ? response.json(person) : response.status(404).end()
})

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  persons = persons.filter(person => person.id !== id)
  response.status(204).end()
})

app.post('/api/persons', (request, response) => {
  const newEntry = request.body;
  if (Object.keys(request.body).length === 0) {
    return response.status(400).json({
      error: 'content missing'
    })
  }
  const errorCheck = isNewEntry(newEntry)
  if (errorCheck.error) return response.status(409).json({ error: errorCheck.error })
  const id = generateID()
  newEntry.id = id
  persons = persons.concat(newEntry)
  response.json(newEntry)
})

app.get('/info', (request, response) => {
  let msg = "";
  msg += `Phonebook has ${persons.length} people<br>`
  msg += new Date().toLocaleTimeString();
  response.send(msg)
})


const isNewEntry = entry => {
  if (persons.some(person => person.name === entry.name)) return { error: "Name already exists " }
  if (entry.name === "" || entry.number === "") return { error: "Name or number missing" }
  return true
}

const generateID = () => {
  // const id = persons.length > 0 ?
  //   Math.max(...persons.map(person => person.id)) :
  //   0
  // return id + 1
  return Math.floor(Math.random() * 10000000)
}


/**
 * Middleware for unknown pages
 * @param {*} request
 * @param {*} response
 */
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)


const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})