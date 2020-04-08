# Resource Catalog
**Wiki of Tech Info used as a reference**

### To-Do Tasks
- HTTP Verbs per resource type
    - GET
    - POST
    - PUT 
    - DELETE 
    - PATCH
- Simple views with EJS
    - Home/Directory
    - List page per resource type
        - Articles as links
        - Vocab (eventually)
        - Concepts (eventually)
    - Details page for resource types
        - Individual page showing more details
        - with edit and delete
    - Create page for resource types
- Create database in MongoDB Atlas
- Build data access layer connected to Mongo
    - InsertOne/InsertMany (create)
    - Find (read)
    - Upsert (update/put)
    - UpdateOne/UpdateMany (update/patch)
    - Remove (delete)

### Data Model

ARTICLE
```
{
    "title": STRING,
    "author": STRING, 
    "link": URL as a STRING,
    "desc": STRING,
    "topics": ARRAY of STRINGs,
    "dateAdded": DATE,
}
```
    