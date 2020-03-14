const express = require('express');
const app = express();

app.use(express.json({limit: '50mb'}));

app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', "*");
    res.header('Access-Control-Allow-Methods','GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/postit')
    .then(()=> console.log('Connected to mongodb...'))
    .catch(err=> console.error('could not connect to mongo db.'));

const postSchema = new mongoose.Schema({
    username: String,
    image: String,
    imageTitle: String,
    ImageDescritpion:String,
    comments:[String],
    likes:Number,
    dislikes:Number
});

const Post = mongoose.model('Post',postSchema);

 function createPost(req){
    const post = new Post({
        username: req.body.username,
        image: req.body.image,
        imageTitle: req.body.imageTitle,
        imageDescritpion:req.body.imageDescritpion,
        comments:[" "],
        likes:req.body.likes,
        dislikes:req.body.dislikes
    });

    return post;
}

const commentSchema = new mongoose.Schema({
    comment: String,
    dateTime: Date,
    userName: String,
    postId: String
});

const Comment = mongoose.model('Comment',commentSchema);

 function createComment(req){
    const comment = new Comment({
        comment: req.comment,
        dateTime: Date.now(),
        userName: req.username,
        postId: req.postId
    });

    return comment;
}

async function getComments(postId){
    const comments = await Comment
    .find({postId:postId});
    return comments;
}

async function getPosts(){
    const posts = await Post
    .find({});
    return posts;
}

async function getPost(id){
    const post = await Post
    .find({_id:id});
    return post;
}

app.post('/', async (req,res)=>{
    try {
        const post = createPost(req);

        const result = await post.save();
        res.send(result);
    } catch (error) {
        res.send("Post failed to save");
    }
});

app.post('/comment', async (req,res)=>{
    try {
        const comment = createComment(req);

        const result = await comment.save();
        res.send(result);
    } catch (error) {
        res.send("Comment failed to save");
    }
});

app.get('/',async (req,res)=>{
    let posts = await getPosts();
    return res.send(posts);
});

app.get('/:id',async (req,res)=>{
    let post = await getPost(req.params.id);
    return res.send(post);
});



const port = process.env.PORT || 9000;

const server = app.listen(port, () => console.log(`listening on port ${port}...`));

module.exports = server;
