const express = require('express');
const router = express.Router();
const { getArticles } = require('../../data/articles');

/* GET users listing. */
router.get('/', async function(req, res, next) {
    try{
        const data = await getArticles();
        res.send(data);
    } catch(err){
        console.log(err);
        res.send(500, 'Internal Server Issue, check logs');
    }
});

module.exports = router;
