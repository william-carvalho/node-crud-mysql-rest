let posts = require('../schema/posts_v1');

const getPosts = (req, res) => {
    res.json({
        status: 'ok',
        data: posts
    });
}

const getPostById = (req, res) => {
    const id = +req.params.id;
    const post = posts.filter(post => post.id === id);
    post.length > 0 ?
        res.json({
            status: 'ok',
            data: post
        }) :
        res.json({
            status: 'not found',
            data: null
        });
}

const getPostByKeyword = (req, res) => {
    const keyword = req.query.kw;
    const isContain = (text, keyword) => text.toLowerCase().includes(keyword.toLowerCase());
    const post = posts.filter(post => isContain(post.name, keyword) || isContain(post.fb_profile, keyword));
    if (post.length > 0) {
        res.json({
            status: 'ok',
            data: post
        });
    } else {
        res.json({
            status: 'not found',
            data: null
        })
    }
}

const createPost = (req, res) => {
    const newPost = Object.assign({
        id: posts.length + 1
    }, req.body);

    posts.push(newPost);
    res.json({
        status: 'ok',
        data: newPost
    })
}

const deletePostById = (req, res) => {
    const id = req.params.id;
    const result = posts.filter(post => post.id.toString() !== id);
    posts = result;

    res.json({
        status: 'ok',
        data: posts
    })
}

const updatePostById = (req, res) => {
    let updateData = {};

    const updatePost = posts.map(post => post.id.toString() === req.params.id ? {
        ...post,
        ...req.body
    } : post);

    posts = updatePost;

    res.json({
        status: 'ok',
        data: posts[req.params.id - 1]
    });
}

module.exports = {
    createPost,
    getPosts,
    getPostById,
    getPostByKeyword,
    updatePostById,
    deletePostById
}