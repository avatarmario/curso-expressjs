require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
//class 10
const { validateUser } = require('./utils/validation');
const { isValidEmail, isValidName, isUniqueNumericId } = require('./utils/validation');

//class 8
const fs = require('fs');   //file system
const path = require('path');   //path module
const usersFilePath = path.join(__dirname, 'users.json');   //path to the users.json file

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

    if(!userId || isNaN(userId)) {
        return res.status(400).json({ error: 'User ID is required and must be a number' });
    }
    res.send('Show user with ID: ' + userId);
});

// Search route handling, retrieves query parameters from the client and displays search results
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
// Form submission handling, recieves user data from the client
app.post('/form', (req, res) => {
    const name = req.body.nombre || 'Anonimo';
    const email = req.body.email || 'No especificado';

    if(!isValidName(name)) {
        return res.status(400).json({ error: 'Invalid name, must be at least 3 characters long' });
    }
    if(!isValidEmail(email)) {
        return res.status(400).json({ error: 'Invalid email' });
    }

    res.json({
        message: 'Datos recibidos correctamente',
        data: {
            nombre: name,
            email: email
        }
    })
});

//class 8
// read users from the JSON file
app.get('/users', (req, res) => {
    fs.readFile(usersFilePath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to read users file' });
        }
        const users = JSON.parse(data);
        res.json(users);
    });
});

//class 9
//adding a new user to the JSON file
app.post('/users', (req,res) => {
    const newUser = req.body;

    if(!newUser || Object.keys(newUser).length === 0) {
        return res.status(400).json({ error: 'No user data provided' });
    }

    fs.readFile(usersFilePath, 'utf-8', (err, data) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to read users file' });
        }

        const users = JSON.parse(data);

        const validation = validateUser(newUser, users);
        if(!validation.valid) {
            return res.status(400).json({ error: validation.error });
        }

        users.push(newUser);

        fs.writeFile(usersFilePath, JSON.stringify(users, null, 2), (err) => {
            if (err) {
                return res.status(500).json({ error: 'Failed to write users file' });
            }
            res.status(201).json(newUser);
        });
    });
});

//class 10
app.put('/users/:id', (req, res) => {
    const userId = parseInt(req.params.id, 10);
    const updatedUser = req.body;

    if(userId <= 0 || isNaN(userId)) {
        return res.status(400).json({ error: 'Invalid user ID' });
    }

    fs.readFile(usersFilePath, 'utf-8', (err, data) => {
        if(err){
            return res.status(500).json({ error: 'Failed to read users file' });
        }

        //users array from the JSON file
        let users = JSON.parse(data);

        //check if the user exists in the array
        const userExists = users.some(user => user.id === userId);
        if(!userExists) {
            return res.status(404).json({ error: 'User not found' });
        }

        if(!isValidName(updatedUser.name)) {
            return res.status(400).json({ error: 'Invalid user name' });
        }
        if(!isValidEmail(updatedUser.email)) {
            return res.status(400).json({ error: 'Invalid user email' });
        }

        const { id, ...changes } = updatedUser;

        users = users.map(user =>
            user.id === userId ? { ...user, ...changes } : user
        );

        res.json(users.find(user => user.id === userId));
        fs.writeFile(usersFilePath, JSON.stringify(users, null, 2), (err) => {
            if (err) {
                return res.status(500).json({ error: 'Failed to write users file' });
            }
            res.json(updatedUser);
        });
    })
});

//class 12 delete
app.delete('/users/:id', (req, res) => {
    const userId = parseInt(req.params.id, 10);

    if(userId <= 0 || isNaN(userId)) {
        return res.status(400).json({ error: 'Invalid user ID' });
    }


    fs.readFile(usersFilePath, 'utf-8', (err, data) => {
        if(err){
            return res.status(500).json({error: 'Error with accessing data'})
        }

        let users = JSON.parse(data);
        //check if the user exists in the array
        const userExists = users.some(user => user.id === userId);
        if(!userExists) {
            return res.status(404).json({ error: 'User not found' });
        }
        users = users.filter(user => user.id !== userId );
        fs.writeFile(usersFilePath, JSON.stringify(users, null, 2), (err) => {
            if(err) {
                return res.status(500).json({ error: 'Failed to write users file' });
            }
            res.status(204).send();
        })
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

