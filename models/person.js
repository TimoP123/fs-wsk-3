const mongoose = require('mongoose')
const Schema = mongoose.Schema

const url = 'mongodb://fswskdb_user:x@ds229388.mlab.com:29388/fswskdb'

mongoose.connect(url)
mongoose.Promise = global.Promise;

const personSchema = new Schema({
  name: String,
  number: String,
  id: Number
})

personSchema.statics.format = function (person) {
  return {
    name: person.name,
    number: person.number,
    id: person._id
  }
}

const Person = mongoose.model('Person', personSchema)

module.exports = Person