const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Setup view engine
app.set('view engine', 'ejs');

// Load videos from JSON file
const loadVideos = () => {
    const data = fs.readFileSync(path.join(__dirname, 'data', 'videos.json'));
    return JSON.parse(data);
};

// Routes
app.get('/', (req, res) => {
    res.render('index');
});

app.post('/add-video', (req, res) => {
    const { link } = req.body;
    let videos = loadVideos();
    videos.push({ link });
    fs.writeFileSync(path.join(__dirname, 'data', 'videos.json'), JSON.stringify(videos));
    res.redirect('/');
});

app.get('/queue', (req, res) => {
    let videos = loadVideos();
    res.render('queue', { videos });
});

app.get('/player', (req, res) => {
    let videos = loadVideos();
    res.render('player', { videos });
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on http://0.0.0.0:${PORT}`);
});
