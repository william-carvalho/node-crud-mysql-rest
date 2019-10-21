const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const Post = require('./routes/posts');
const MySQL = require('./repository/postrepo');
const PORT = process.env.PORT || 3000;

const app = express();

app.use(cors());
app.use(bodyParser());

const healtcheck = (req, res) => {
    res.json({
        status: 'ok'
    });
}

const startApp = (req, res) => {
    console.log(`Server started at port ${PORT}`);
}

(async () => {
    const config = {
        user: 'root',
        pass: 'root',
        host: '127.0.0.1',
        database: 'posts',
    }
    const connection = await MySQL.createConnection(config);
    console.log(connection);

    const mySqlGetPosts = async (req, res) => {
        const posts = await MySQL.search(connection, 'posts', 'posts');
        console.log('getPosts');
        console.log(posts);
        res.json({
            status: 'ok',
            data: posts
        });
    }

    const mySqlGetPostById = async (req, res) => {
        const {
            id
        } = req.params;
        console.log('getPostById');
        const Post = await MySQL.search(connection, 'posts', 'posts', `\`id\` = '${id}'`);
        console.log(Post);
        res.json({
            status: 'ok',
            data: Post
        });
    }

    const mySqlGetPostByKeyword = async (req, res) => {
        const keyword = req.query.kw;
        console.log('mySqlGetPostByKeyword');
        const Post = await MySQL.search(connection, 'posts', 'posts', `\`name\` LIKE '%${keyword}%' OR \`facebook_profile\` LIKE '%${keyword}%'`);
        if (Post.length > 0) {
            res.json({
                status: 'ok',
                data: Post
            });
        } else {
            res.json({
                status: 'not found',
                data: null
            })
        }
    }

    const mySqlDeletePostById = async (req, res) => {
        const id = req.params.id;
        const result = await MySQL.deleteSql(connection, 'posts', 'posts', `\`id\` = '${id}'`);
        if (result) {
            res.json({
                status: 'user has been deleted',
            });
        } else {
            res.json({
                status: 'not found',
                data: null
            })
        }
    }

    const mySqlUpdatePostById = async (req, res) => {
        const data = req.body;
        const result = await MySQL.update(connection, 'posts', 'posts', data);

        if (result) {
            res.json({
                status: 'ok',
                data: result
            });
        } else {
            res.json({
                status: 'not found',
                data: null
            })
        }
    }

    const mySqlCreatePost = async (req, res) => {
        console.log('mySqlCreatePost');
        const data = req.body;
        const response = await MySQL.insert(connection, 'posts', 'posts', data);
        console.log(response);
        res.json({
            status: 'ok',
            data: response
        });
    }
    // Routes
    app.get('/healthcheck', healtcheck);
    app.get('/posts', mySqlGetPosts);
    app.get('/post/:id', mySqlGetPostById);
    app.get('/search', mySqlGetPostByKeyword);
    app.post('/post', mySqlCreatePost);
    app.delete('/post/:id', mySqlDeletePostById);
    app.put('/post/:id', mySqlUpdatePostById);

    // Start Server
    app.listen(PORT, startApp);
})();