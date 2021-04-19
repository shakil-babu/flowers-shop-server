
const express = require('express')
const app = express()
const port = 5500;
const MongoClient = require('mongodb').MongoClient;
var cors = require('cors');
require('dotenv').config()
app.use(cors());

// for body parser
app.use(express.urlencoded({extended:true}))
app.use(express.json())

// mongoObjectId
const ObjectId = require('mongodb').ObjectId;


// driver code
const uri = `mongodb+srv://flowerVision:${process.env.DB_PASSWORD}@cluster0.pcuuc.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const collection = client.db(`${process.env.DB_NAME}`).collection(`${process.env.DB_COLLECTION}`);
  const orderCollection = client.db(`${process.env.DB_NAME}`).collection(`${process.env.DB_ORDERCOLLECTION}`);
  console.log(err);

// insert data
app.post('/addFlowers', (req, res) => {
  const flower = req.body ;
  console.log(flower);
  collection.insertOne(flower)
  .then(result => {
      res.send(result.insertedCount > 0)
      console.log(result);
  })
})


// read data
app.get('/flowersInfo', (req, res) => {
  collection.find({})
  .toArray((error, documents) => {
      res.send(documents)
  })
})


// delete data
app.delete('/deleteInfo/:id', (req, res) => {
  collection.deleteOne({_id:ObjectId(req.params.id)})
  .then(result => {
    res.send(result.deletedCount > 0);
  })
})



// insert data for ordres
app.post('/addOrder', (req, res) => {
  const order = req.body ;
  console.log(order);
  orderCollection.insertOne(order)
  .then(result => {
      res.send(result.insertedCount > 0)
      console.log(result);
  })
})


// read data for orders
app.get('/ordersInfo', (req, res) => {
  orderCollection.find({email:req.query.email})
  .toArray((error, documents) => {
      res.send(documents)
  })
})


// for root directory
app.get('/', (req, res) => {
  res.send('Some links to all other resources available in the API.')
})


});




app.listen(process.env.PORT|| port)
