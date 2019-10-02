const express = require('express')
const { MongoClient, ObjectID } = require('mongodb')
const assert = require('assert')
const app = express()
app.use(express.json())


const mongodb_url = "mongodb://localhost:27017";
const dataBase = "synonyme-attribut";
MongoClient.connect(
  mongodb_url,
  { useNewUrlParser: true, useUnifiedTopology: true },
  (err, client) => {
    assert.equal(err, null, "data base connexion failed");
    const db = client.db(dataBase);


    app.post("/addatribut", (req, res) => {
        let newAttribut = req.body
        db.collection("attribut").insertOne(newAttribut, (err, data) => {
            if (err) res.send("cant not add new Attribut")
            else res.send("newAttribut added")
        })
    })
    app.get("/attribut", (req, res) => {
        db.collection("attribut").find().toArray((err, data) => {
            if (err) res.send('cant not get attribut')
            else res.send(data)
        })
    })
    app.get("/attribut/:id", (req, res) => {
        db.collection('attribut').findOne({ _id: ObjectID(req.params.id) }).then(data => res.send(data))
            .catch(err => res.send("cant not get attribut"))
    })
    app.delete('/deleteC/:id', (req, res) => {
        let ContactRemoved = ObjectID(req.params.id)
        db.collection('attribut').findOneAndDelete({ _id: ContactRemoved }, (err, data) => {
            if (err) res.send('cant delete the attribut')
            else res.send("attribut was deleted")
        })
    })
    app.put("/modifyAttribut/:id", (req, res) => {
        let id = ObjectID(req.params.id)
        let ModifiedAttribut = req.body
        db.collection("attribut").findOneAndUpdate({ _id: id }, { $set: { ...ModifiedAttribut } }, (err, data) => {
            if (err) res.send('cant modify attribut')
            else res.send('attribut was modified')
        })
    })
 
  }
);

app.listen(4000, err => {
  if (err) console.log("server is not running");
  else console.log("server is running on port 4000");
});
