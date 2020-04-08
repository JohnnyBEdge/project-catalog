const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
 
// Connection URL
const url = process.env.DB_URL;

// Database Name
const dbName = 'wiki';
const colName = 'articles';
 
//Database settings
const settings = { useUnifiedTopology: true };

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
}

module.exports = {
    getArticles
}