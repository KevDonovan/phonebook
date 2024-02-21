const express = require('express');
const app = express();
const morgan = require('morgan');
const PORT = '3001';

app.use(express.json());
/*app.use(morgan('tiny', (tokens, req, res) => {
  return JSON.stringify(res.body);
}));*/

morgan.token('person', (req, res) => {
  return JSON.stringify(req.body);
})

app.use(morgan((tokens, req, res) => {
  return [
    tokens.method(req, res),
    tokens.url(req, res),
    tokens.status(req, res),
    tokens.res(req, res, 'content-length'), '-',
    tokens['response-time'](req, res), 'ms',
    tokens.person(req, res)
  ].join(' ')
}))

let persons = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

app.get('/api/persons', (req, res) => {
    res.json(persons);
})

app.get('/api/persons/:index', (req, res) => {
    const index = Number(req.params.index) - 1;
    if(persons[index]) res.json(persons[index]);
    else res.status(404).end();
})

app.get('/info', (req, res) =>{
    res.send(
        `<p>Phonebook has info for ${persons.length} people
        </br></br>
        ${Date()}</p>`
    )
})

app.delete('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id);
  persons = persons.filter(person => person.id !== id);

  res.status(204).end()
})

function generateID() {
  return Math.floor(Math.random() * (1000000 - persons.length) + persons.length);
}

app.post('/api/persons', (req, res) => {
  const body = req.body;
  
  if(!body['name']){
    return res.status(400).json({
      error: 'Must enter a name'
    });
  } else if(!body['number']){
    return res.status(400).json({
      error: 'Must enter a number'
    });
  } else if(persons.filter(e => e.name === body['name']).length > 0){
    return res.status(400).json({
      error: 'Name already in phonebook'
    });
  }

  const person = {
    id: generateID(),
    name: body['name'],
    number: body['number']
  }

  persons = persons.concat(person);
  
  //console.log(person);
  res.json(person);
})

app.listen(PORT, () => {
    console.log('listening on 3001');
})