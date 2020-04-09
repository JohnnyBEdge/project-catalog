const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;
const assert = require('assert');
 
// Connection URL
const url = process.env.DB_URL;

// Database Name
const dbName = 'wiki';
const colName = 'articles';
 
//Database settings
const settings = { useUnifiedTopology: true };

//Article validator (title and link required, link needs proper formatting)
const invalidArticle = (article) => {
    let result;
    if(!article.title){
        result = "Articles require a title.";
    } else if(!article.link){
        result = "Articles require a link."
    } else if(!validURL(article.link)){
        result = "Link not a valid URL."
    }
    return result;
};

const validURL = (str) => {
    var pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
      '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
      '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
      '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
      '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
      '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
    return pattern.test(str);
  }

const getArticles = () => {
    const iou = new Promise((resolve, reject) => {
        // Use connect method to connect to the server
        MongoClient.connect(url, settings, function(err, client) {
            if(err){
                // assert.equal(null, err);
                reject(err);
            } else {
                console.log("Connected successfully to server to GET artciles");
                const db = client.db(dbName);
                const collection = db.collection(colName);
                collection.find({}).toArray(function(err, docs) {
                    if(err){
                        // assert.equal(null, err);
                        reject(err);
                    } else {
                        console.log("Found the following articles");
                        console.log(docs);
                        resolve(docs)
                        client.close();
                    }
                  });
            };
        });
    }) 
    return iou;
};

const addArticle = (articles) => {
    const iou = new Promise((resolve, reject) => {
        if(!Array.isArray(articles)){
            reject({error:'Need to send an array of articles'})
        } else {
            const invalidArticles = articles.filter((article) => {
                const check = invalidArticle(article)
                if(check){
                    article.invalid = check;
                }
                return article.invalid;
            });
            if(invalidArticles.length > 0){
                reject({
                    error: "Some articles were invalid.",
                    data: invalidArticles
                })
            } else {
                MongoClient.connect(url, settings, async function(err, client){
                    if(err){
                        reject(err);
                    } else {
                        console.log("Connected successfully to server to GET artciles");
                        const db = client.db('wiki');
                        const collection = db.collection('articles');
                        articles.forEach((article) => { 
                            article.dateAdded = new Date(Date.now()).toUTCString();});
                        const results = await collection.insertMany(articles); 
                        resolve(results.ops);
                    }
                })
            };
    }
    });
    return iou;
};


const updateArticle = (id, article) => {
    const iou = new Promise((resolve, reject) => {
        if(article.link){
            const check = invalidArticle(article)
                if(!validURL(article.link)){
                    article.invalid = 'Link not a valid URL';
                    reject(article);
                }
        }
        MongoClient.connect(url, settings, async function(err, client){
            if(err){
                reject(err);
            } else {
                console.log("connect successfully to server to PATCH an article");
                const db = client.db(dbName);
                const collection = db.collection(colName);
                try{
                    const _id = new ObjectID(id);
                    collection.updateOne({_id}, 
                        {$set: {...article}},
                         function(err, data){
                            if(err){
                                reject(err);
                            } else {
                                if(data.result.n > 0){
                                    collection.find({_id}).toArray(
                                        function(err, docs){
                                            if(err){
                                                reject(err);
                                            } else {
                                                resolve(docs[0]);
                                            };
                                        }
                                    );
                                } else {
                                    resolve({error: "Nothing updated"})
                                };
                            };
                        });
                } catch(err){
                    console.log(err);
                    reject({error: "Id has to be in ObjectID format"});
                }
            }
        })
    });
    return iou;
};



const deleteArticle = (id) => {
    const iou = new Promise((resolve, reject) => {
        MongoClient.connect(url, settings, async function(err, client){
            if(err){
                reject(err);
            } else {
                console.log("Connected successfully to server to DELETE an artcile");
                const db = client.db(dbName);
                const collection = db.collection(colName);
                try{
                    const _id = new ObjectID(id);
                    collection.findOneAndDelete({_id: ObjectID(id)}, function(err, data){
                        if(err){
                            reject(err);
                        } else {
                            if(data.lastErrorObject.n > 0){
                                resolve(data.value);
                            } else {
                                resolve({error: "ID doesn't exist."});
                            };  
                        };
                    });
                }catch(err){
                    reject({error: "ID has to be in ObjectId format."});
                }
            }
        })
    });
    return iou;
};

module.exports = {
    getArticles,
    addArticle,
    deleteArticle,
    updateArticle
}