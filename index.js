const express = require('express')
const app = express()

app.use(express.json())

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
  console.log(request.body)
	persons = persons.concat(request.body)
	console.log(persons)
	response.json(persons)
})

const PORT = 3001
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`)
 })