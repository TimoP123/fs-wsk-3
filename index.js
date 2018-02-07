const express = require('express')
const morgan = require('morgan')
const bodyParser = require('body-parser')
const cors = require('cors')

const app = express()
morgan.token('data', (req) => {
    return JSON.stringify(req.body)
})
app.use(morgan(':method :url :data :status :res[content-length] - :response-time ms'))
app.use(bodyParser.json())
app.use(cors())

let persons = [
  {
    "name": "Arto Hellas",
    "number": "040-123456",
    "id": 1
  },
  {
    "name": "Martti Tienari",
    "number": "040-123456",
    "id": 2
  },
  {
    "name": "Arto Järvinen",
    "number": "040-123456",
    "id": 3
  },
  {
    "name": "Lea Kutvonen",
    "number": "040-123456",
    "id": 4
  }
]



app.get('/info', (req, res) => {
  res.send(`<div>Puhelinluettelossa on ${persons.length} henkilön tiedot.</div><div>${Date()}</div>`)
})

app.get('/api/persons', (req, res) => {
  res.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  const person = persons.find(note => note.id === id)

  if ( person ) {
    response.json(person)
  } else {
    response.status(404).end()
  }
})

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  persons = persons.filter(person => person.id !== id)

  response.status(204).end()
})

app.post('/api/persons', (request, response) => {

  if (request.body.name === undefined) {
    return response.status(400).json({error: 'name missing'})
  }

  if (request.body.number === undefined) {
    return response.status(400).json({error: 'number missing'})
  }

  const person = request.body

  if (persons.find(person => person.name === request.body.name) === undefined) {
    person.id = Math.floor(Math.random() * 9999 + 9999)
    console.log(person)
    persons.push(person)
    response.json(person)
  } else {
    return response.status(400).json({error: 'name is already on our server'})
  }
})

const error = (request, response) => {
  response.status(404).send({error: 'unknown endpoint'})
}

app.use(error)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})