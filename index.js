const express = require('express')
const morgan = require('morgan')
const bodyParser = require('body-parser')
const cors = require('cors')
const Person = require('./models/person')

const app = express()
app.use(express.static('build'))

morgan.token('data', (req) => {
    return JSON.stringify(req.body)
})
app.use(morgan(':method :url :data :status :res[content-length] - :response-time ms'))
app.use(bodyParser.json())
app.use(cors())

app.get('/info', (req, res) => {
  Person.find({}).then(persons => {
    res.send(`<div>Puhelinluettelossa on ${persons.length} henkilön tiedot.</div><div>${Date()}</div>`)
  })
})

app.get('/api/persons', (req, res) => {
  Person.find({}).then(persons => {
        res.json(persons.map(Person.format))
    })
})

app.get('/api/persons/:id', (request, response) => {
  Person
    .findById(request.params.id)
    .then(person => {
      if (person) {
        response.json(Person.format(person))
      } else {
        response.status(404).end()
      }
    })
    .catch(error => {
      console.log(error)
      response.status(400).send({ error: 'malformatted id' })
    })
})

app.delete("/api/persons/:id", (request, response) => {
  Person.findByIdAndRemove(request.params.id)
    .then(result => {
      response.status(204).end();
    })
    .catch(error => {
      console.log(error)
      response.status(400).json({error: 'Person not found'})
    });
});

app.post('/api/persons', (request, response) => {
  const body = request.body

  if (body.name === undefined || body.number === undefined) {
    return response.status(400).json({error: 'name or number missing'})
  }

  const person = new Person({
    name: body.name,
    number: body.number
  })

  person
    .save()
    .then(savedPerson => {
      response.json(Person.format(savedPerson))
    })
    .catch(error => {
      console.log(error);
    });
})

app.put("/api/persons/:id", (request, response) => {
  const body = request.body;
  const person = {
    name: body.name,
    number: body.number
  };

  Person.findByIdAndUpdate(request.params.id, person, { new: true })
    .then(updatedperson => {
      response.json(Person.format(updatedperson));
    })
    .catch(error => {
      console.log(error);
      response.status(400).send({ error: "malformatted id" });
    });
});

const error = (request, response) => {
  response.status(404).send({error: 'unknown endpoint'})
}

app.use(error)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})