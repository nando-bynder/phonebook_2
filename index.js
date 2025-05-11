const express = require('express')
const app = express()
var morgan = require('morgan')
const cors = require('cors')

app.use(cors())
app.use(express.static('dist'))
morgan.token('body', function(req, res) {
  return JSON.stringify(req.body)
  });

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body')
)

app.use(express.json())

let persons = 
[
    { 
      "id": "1",
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": "2",
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": "3",
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": "4",
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

app.get('/', (request, response) => {
  response.send('<h1>Hello World</h1>')
})


app.get('/api/persons', (request, response) =>{
  response.json(persons)
})

app.get('/info', (request, response) => {
  const personsCount = persons.length > 0 ? persons.length : 0 
  const date = Date.now()
  const formattedDate = new Intl.DateTimeFormat('en-US', { 
    day: 'numeric', 
    month: 'long', 
    year: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric'
  }).format(date)

  response.send(`<p>There are ${personsCount} entries in the phonebook. </p>
    <p>${formattedDate}</p>`)
})

app.get('/api/persons/:id', (request, response)=>{
  const id = request.params.id
  const person = persons.find(person=>person.id ===id)
  if (person) {
    response.json(person)
  } else {
    response.status(404).end()
  }
})

app.delete('/api/delete/:id', (request, response)=> {
  const id = request.params.id
  const person = persons.filter(person => person.id !== id)
  response.status(204).end()

})

app.post('/api/persons', (request, response) => {
  const person = request.body

  if (!person.name) {
    return response.status(400).json({ error: "Users must have a name" })
  }
  
  if (!person.number) {
    return response.status(400).json({ error: "Users must have a number" })
  }
  
  // Check for duplicate names
  const exists = persons.some(p => p.name === person.name)
  if (exists) {
    return response.status(400).json({ error: "Name must be unique." })
  }

  const maxId = persons.length >   0 ? Math.max(...persons.map(n => Number(n.id))) : 0


  person.id = String(maxId + 1)

  persons.concat(person)

  console.log(exists)

  response.json(person)



})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
}
)




