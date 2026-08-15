require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const PORT = process.env.PORT || 3000;
console.log('PORT: ' + PORT);

app.get('/', (req, res) => {
    res.send(`
        <h1>Express.js Course</h1>
        <p>This is a node.js course using Express.js V2</p>
        <p>Running on port: ${PORT}</p>

        `);
});

// ':' indicates a route parameter 
app.get('/users/:id', (req, res) => {
    const userId = req.params.id;
    res.send('Show user with ID: ' + userId);
});

// Search route handling
app.get('/search', (req, res) => {
    const terms = req.query.termino || 'Not specified';
    const category = req.query.categoria || 'Todas';

    res.send(`
        <div>
            <h2>Search results for query: ${terms} in category: ${category}</h2>
            <p> Término: ${terms} </p>
            <p> Categoría: ${category} </p>
        </div>
    `);
});

// Class 6
// Form submission handling
app.post('/form', (req, res) => {
    const name = req.body.nombre || 'Anonimo';
    const email = req.body.email || 'No especificado';

    res.json({
        message: 'Datos recibidos correctamente',
        data: {
            nombre: name,
            email: email
        }
    })
});

// API data submission handling
app.post('/api/data', (req, res) => {
    const data = req.body;

    if(!data || Object.keys(data).length === 0) {
        return res.status(400).json({ error: 'No data provided' });
    }

    res.status(201).json({
        message: 'Data received successfully',
        data
    })
});

app.listen(PORT, () => {
    console.log('Server: http://localhost:' + PORT);
})