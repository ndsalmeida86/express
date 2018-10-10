const Joi = require('joi');
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

const tests = [
    {id: 1, name: 'This'},
    {id: 2, name: 'is'},
    {id: 3, name: 'a'},
    {id: 4, name: 'simple'},
    {id: 5, name: 'test'}
];

app.use(express.json());

app.listen(port, () => console.log(`Listening on port ${port}...`));

app.get('/', (req, res) => {
    res.send('Hello world :)');
});

app.get('/api/test', (req, res) => {
    res.send(tests);
});

app.get('/api/test/:id/:name', (req, res) => {
    res.send({params: req.params, query: req.query});
});

app.get('/api/test/:id', (req, res) => {
    const test = tests.find(x => x.id === parseInt(req.params.id));
    if (!test) return res.status(404).send('ID not found!');

    res.send(test);
});

app.post('/api/test', (req, res) => {
    const { error } = validateTest(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const test = { 
        id: tests.length + 1,
        name: req.body.name 
    };
    tests.push(test);
    res.send(tests);
});

app.put('/api/test/:id', (req, res) => {
    const test = tests.find(x => x.id === parseInt(req.params.id));
    if (!test) return res.status(404).send('ID not found!');

    const { error } = validateTest(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    test.name = req.body.name;
    res.send(test);
});

app.delete('/api/test/:id', (req, res) => {
    const test = tests.find(x => x.id === parseInt(req.params.id));
    if (!test) return res.status(404).send('ID not found!');
    
    const index = tests.indexOf(test);
    tests.splice(index, 1);
    res.send(test);
});

function validateTest(test) {
    const schema = {
        name: Joi.string().min(3).required()
    };

    return Joi.validate(test, schema);
}

