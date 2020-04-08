const express = require('express');
const router = express.Router();
const { 
    getArticles,
    addArticle
 } = require('../../data/articles');

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

// POST Article Creation
router.post('/', async function(req, res, next){
    try{
        const data = await addArticle(req.body);
        res.send(data);
    } catch(err){
        if(err.msg){
            res.status(400).send(err);
        } else{

        }
        console.log(err);
        res.send(500).send('Internal Sever Issue; check logs');
    };
});


module.exports = router;
