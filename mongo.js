const mongoose = require('mongoose')

const url = 'mongodb://fswskdb_user:x@ds229388.mlab.com:29388/fswskdb'

mongoose.connect(url)

const Person = mongoose.model('Person', {
  name: String,
  number: String
})

if (process.argv.length == 4) {
    const person = new Person({
    name: process.argv[2],
    number: process.argv[3]
    })

console.log(`Lisätään henkilö ${person.name} ja numero ${person.number} luetteloon.`)

person
  .save()
  .then(response => {
    console.log('Henkilö tallennettiin luetteloon!')
    mongoose.connection.close()
  })
} else {
    Person.find({}).then(result => {
        result.forEach(person => {
            console.log(person);
        })
    mongoose.connection.close()
    })
}
