const { MongoClient } = require('mongodb');
const express = require('express')
const app = express()
const cors = require('cors');
const port = process.env.PORT || 5000;
require('dotenv').config()
const ObjectId = require('mongodb').ObjectId;
// middlewiree
app.use(cors());
app.use(express.json());
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.k7re9.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
// console.log(uri);
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
  try {
    await client.connect();
    console.log("connected to database");
    const database = client.db('online_Booking');
    const dataCollection = database.collection('services');
    const orderCollection = database.collection('orders');
    // get services api
    app.get('/services', async (req, res) => {
      const cursor = dataCollection.find({});
      const products = await cursor.toArray();

      res.send(products);
    });
    // single api
    app.get('/detail/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const service = await dataCollection.findOne(query);
      res.json(service);

    });
    //post add products api
    app.post('/services', async (req, res) => {

      const service = req.body;
      console.log('hit the post api', service);
      const result = await dataCollection.insertOne(service);
      console.log(result);
      res.json(result);
    });
    //Add orders Api
    app.post('/orders', async (req, res) => {
      const order = req.body;
      const result = await orderCollection.insertOne(order);
      // console.log(order);
      res.send(result);
    });

    //get orders api for manage order
    app.get('/orders', async (req, res) => {
      const cursor = orderCollection.find({});
      const orders = await cursor.toArray();

      res.send(orders);
    });
    //myorder load
    app.get('/orders/:email', async (req, res) => {
      const email = req.params.email;
      console.log(email);
      const query = { email: email };
      const cursor = orderCollection.find(query);
      const orders = await cursor.toArray();
      // console.log(orders);
      res.json(orders);

    });
    //delete order
    app.delete('/orders/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const service = await orderCollection.deleteOne(query);
      res.json(service);

    });
// update
app.put('/orders/:id',(req,res)=>
{
  const id=req.params.id;
  

  const filter= { _id: ObjectId(id) };
  orderCollection.updateOne(filter,{
    $set:{status:"Approve"},
  })
    .then(result=>{
      res.send(result);
    })
  })

  }
  finally {

    // await client.close();
  }
}
run().catch(console.dir);
app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})