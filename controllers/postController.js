const serverURL = process.env.BASE_URL;
const Post = require('../models/post');
const Author = require('../models/user');

async function servePreviews(req, res) {
    const blogPosts = await Post.findAll({
        include: [
            {
                model: Author,
                as: 'author',
                attributes: [ 'name', 'image' ]
            },
            'location']
    });

    if (blogPosts) {
        // TODO: Use path.join() instead
        blogPosts.forEach(blogPost => {
            blogPost.author.image = serverURL + blogPost.author.image;
            blogPost.image = serverURL + blogPost.image;
        });
    }
        
    return res.status(200).json(blogPosts);
}

async function servePost(req, res) {
    const id = req.params.id;
    const postDoc = await Post.findOne({
        where: { id: id },
        include: [
            {
                model: Author,
                as: 'author',
                attributes: [ 'name', 'image' ]
            },
            'location']
    });

    postDoc.author.image = serverURL + postDoc.author.image;
    postDoc.image = serverURL + postDoc.image;

    // TODO: Solve this problem in a more elegant way.
    postDoc.text = postDoc.text.replaceAll("\\n", "\n");

    return res.status(200).json(postDoc);
}

module.exports = { servePreviews, servePost };