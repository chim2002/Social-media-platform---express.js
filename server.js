const express = require('express');
const app = express();

const PORT = 3000;

// middleware
app.use(express.json());

// in-memory data store
let posts = [];
app.post('/posts', (req, res) => {
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
app.put('/posts/:id', (req, res) => {
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
app.delete('/posts/:id', (req, res) => {
    const id = parseInt(req.params.id);

    posts = posts.filter(p => p.id !== id);

    res.send('Post deleted');
});


// start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});