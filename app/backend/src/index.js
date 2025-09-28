const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

let movies = [];
let ratings = [];

app.get('/movies', (req, res) => res.json(movies));
app.post('/movies', (req, res) => {
  const movie = { id: movies.length + 1, ...req.body };
  movies.push(movie);
  res.status(201).json(movie);
});

app.get('/ratings', (req, res) => res.json(ratings));
app.post('/ratings', (req, res) => {
  const rating = { id: ratings.length + 1, ...req.body };
  ratings.push(rating);
  res.status(201).json(rating);
});

// Serve frontend build
app.use(express.static(path.join(__dirname, '../../frontend/build')));
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../../frontend/build', 'index.html'));
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
