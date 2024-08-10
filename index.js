const express = require('express');
const mongoose = require('mongoose');
const app = express();
const port = 3000;

// Middleware to parse JSON bodies
app.use(express.json());

mongoose.connect('mongodb://mongodb:27017/exampledb');


const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log('Connected to MongoDB');
});

const exampleSchema = new mongoose.Schema({
    name: String
});

const Document = mongoose.model('Document', exampleSchema);

// curl "http://localhost:3000/api/examples/search?name=Example%20Name"
app.get('/api/examples/search', async (req, res) => {
    try {
        const name = req.query.name;
        const examples = await Document.find({ name: new RegExp(name, 'i') });
        res.json(examples);
    } catch (err) {
        res.status(500).send(err);
    }
});

app.get('/api/example', (req, res) => {
    res.send('GET request to the example endpoint');
});

app.get('/api/examples', async (req, res) => {
    try {
        const examples = await Document.find();
        res.json(examples);
    } catch (err) {
        res.status(500).send(err);
    }
});

app.get('/api/examples/:id', async (req, res) => {
    try {
        const example = await Document.findById(req.params.id);
        if (example) {
            res.json(example);
        } else {
            res.status(404).send('Example not found');
        }
    } catch (err) {
        res.status(500).send(err);
    }
});

app.post('/api/example', async (req, res) => {
    try {
        const example = new Document(req.body);
        await example.save();
        res.status(201).json(example);
    } catch (err) {
        res.status(500).send(err);
    }
});

app.post('/api/examples', async (req, res) => {
    try {
        const examples = await Document.insertMany(req.body);
        res.status(201).json(examples);
    } catch (err) {
        res.status(500).send(err);
    }
});

app.put('/api/example/:id', async (req, res) => {
    try {
        const example = await Document.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (example) {
            res.json(example);
        } else {
            res.status(404).send('Example not found');
        }
    } catch (err) {
        res.status(500).send(err);
    }
});

app.delete('/api/example/:id', async (req, res) => {
    try {
        const example = await Document.findByIdAndDelete(req.params.id);
        if (example) {
            res.send('Example deleted');
        } else {
            res.status(404).send('Example not found');
        }
    } catch (err) {
        res.status(500).send(err);
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});