const serverURL = process.env.BASE_URL;
const Post = require('../models/post');
const Author = require('../models/user');
const Location = require('../models/location');

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

async function createPost(req, res, next) {
    // TODO: change this to handle multipart form data
    const postCity = req.body.city;
    const postCountry = req.body.country;
    const postLat = req.body.lat;
    const postLng = req.body.lng;

    const [postLocation, created] = await Location.findOrCreate({
        where: { city: postCity, country: postCountry },
        defaults: {
            city: postCity,
            country: postCountry,
            lat: postLat,
            lng: postLng,
        }
    });

    try {
        const newPost = await Post.create({
            title: req.body.title,
            dateFrom: req.body.dateFrom,
            dateTo: req.body.dateTo,
            image: req.body.image,
            text: req.body.text,
            tripDuration: req.body.duration,
            authorId: req.body.userId,
            locationId: postLocation.id
        });
        console.log("Test");
        return res.json({ message: "Successfully created a new post!", title: newPost.title });
    }
    catch(err) {        // TODO: elaborate on this
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}

module.exports = { servePreviews, servePost, createPost };