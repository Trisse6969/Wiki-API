const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect('mongodb://localhost:27017/wikiDB');

const articlesSchema = new mongoose.Schema({
    title: String,
    content: String
});

const Article = mongoose.model('Article', articlesSchema);

// const article1 = new Article({
//     title: 'First Article',
//     content: 'This is my first article inserted with mongoose.'
// });

// article1.save();

app.route('/articles')
    .get((req, res) => {
        Article.find((err, results) => {
            if (err) {
                res.send(err);
            } else {
                res.send(results);
            }
        });
    })
    .post((req, res) => {
        const newArticle = new Article({
            title: req.body.title,
            content: req.body.content
        });

        newArticle.save((err) => {
            if (!err) {
                res.send('Successfully added a new article.')
            } else {
                res.send(err);
            }
        });
    })
    .delete((req, res) => {
        Article.deleteMany((err) => {
            if (!err) {
                res.send('Successfully deleted all articles.');
            } else {
                res.send(err);
            }
        })
    });

app.route('/articles/:title')
    .get((req, res) => {
        Article.findOne({title: req.params.title}, (err, result) => {
            if (!err) {
                res.send(result);
            } else {
                res.send('Unable to find article.');
            }
        });
    })
    .put((req, res) => {
        Article.updateOne(
            {title: req.params.title}, 
            {title: req.body.title,
            content: req.body.content}, 
            (err, results) => {
                if (!err) {
                    res.send('Successfully updated article');
                } else {
                    console.log(err);
                }
        })
    })
    .patch((req, res) => {
        Article.updateOne(
            {title: req.params.title},
            {$set: req.body},
            (err, result) => {
                if (!err) {
                    res.send('Successfully updated article.');
                } else {
                    console.log(err);
                }
            }
        )
    })
    .delete((req, res) => {
        Article.deleteOne(
            {title: req.params.title},
            (err, result) => {
                if (!err) {
                    res.send('Successfully deleted article.');
                } else {
                    console.log(err);
                }
            }
        )
    })


app.listen(3000, function() {
    console.log("Server started on port 3000");
});