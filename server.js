const express = require('express');
const app = express();

const PORT = 3000;

// middleware
app.use(express.json());

// in-memory data store
let posts = [];

app.post('/posts', authenticateToken, (req, res) => {
    const { content } = req.body;

    const newPost = {
        id: posts.length + 1,
        content: content
    };

    posts.push(newPost);

    res.status(201).json(newPost);
});

//get all posts
app.get('/posts', (req, res) => {
    res.json(posts);
});

// update a post
app.put('/posts/:id', authenticateToken, (req, res) => {
    const id = parseInt(req.params.id);
    const { content } = req.body;

    const post = posts.find(p => p.id === id);

    if (!post) {
        return res.status(404).send('Post not found');
    }

    post.content = content;

    res.json(post);
});

// delete a post
app.delete('/posts/:id', authenticateToken, (req, res) => {
    const id = parseInt(req.params.id);

    posts = posts.filter(p => p.id !== id);

    res.send('Post deleted');
});


// start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

//add fake user
const jwt = require('jsonwebtoken');

const SECRET_KEY = "mysecretkey";

// fake user
const user = {
    id: 1,
    username: "admin",
    password: "1234"
};

app.post('/login', (req, res) => {
    const { username, password } = req.body;

    if (username === user.username && password === user.password) {
        const token = jwt.sign(
            { id: user.id, username: user.username },
            SECRET_KEY,
            { expiresIn: '1h' }
        );

        return res.json({ token });
    }

    res.status(401).send('Invalid credentials');
});

//auth middleware
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];

    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.sendStatus(401);

    jwt.verify(token, SECRET_KEY, (err, userData) => {
        if (err) return res.sendStatus(403);

        req.user = userData;
        next();
    });
}