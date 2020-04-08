var express = require('express');
var router = express.Router();
const { 
  getArticles
} = require('../data/articles');



/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Catalog' });
});

router.get('/articles', async function(req, res, next){
  try {
    const articleList =  await getArticles()
    res.render('articles', {title: 'Articles', data: articleList})
  } catch(err){
    reject(err);
  }
});
 
router.get('/videos', function(req, res, next){
  res.render('videos', {title: 'Videos'})
});

router.get('/podcasts', function(req, res, next){
  res.render('podcasts', {title: 'Podcats'})
});

module.exports = router;

