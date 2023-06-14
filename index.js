const express = require('express')
const { MongoClient} = require('mongodb')
const ObjectId=require('mongodb').ObjectId
const cors = require('cors')
const app = express()
const port = 5000
// middle ware
app.use(cors())
app.use(express.json())
//hajj-website
//QNcQXJd7SLIYRTsE

const uri = 
'mongodb+srv://hajj-website:QNcQXJd7SLIYRTsE@cluster0.p4q3oun.mongodb.net/?retryWrites=true&w=majority'
const client = new MongoClient(uri, 
  { useNewUrlParser: true,
     useUnifiedTopology: true, 
     })

async function run() {
 try {
  await client.connect()
  const database = client.db('hajj-khafela')
  const serviceCollection = database.collection("services")
  console.log('database connected')
  // send services to the database
  app.post('/services', async (req, res) => {
    const service = req.body;
    const result = await serviceCollection.insertOne(service)
    console.log(result)
    res.json(result)
})

 // update data into order collection
 app.put('/services/:id([0-9a-fA-F]{24})', async (req, res) => {
  const id = req.params.id.trim()
  console.log('updating', id)
  const updatedService = req.body;
  const filter = { _id: new ObjectId(id) };
  const options = { upsert: true };
  const updateDoc = {
      $set: {
          name: updatedService.name,
          catagory: updatedService.catagory,
          duration: updatedService.duration,
          cost: updatedService.cost,
          img: updatedService.img, },
  };
  const result = await serviceCollection.updateOne(
    filter, 
    updateDoc,
     options,
     )
  console.log('updating', id)
  res.json(result)
});

     // get all data from services database
     app.get('/services', async (req, res) => {
      const cursor = serviceCollection.find({});
      const service = await cursor.toArray();
      res.send(service);
     })

     // get a single data from services database
     app.get('/services/:id([0-9a-fA-F]{24})', async (req, res) => {
      const id = req.params.id.trim()
      const query = { _id: ObjectId(id) };
      const service = await serviceCollection.findOne(query);
      res.json(service);
  }); 

  // delete a single data from services database
  app.delete('/services/:id([0-9a-fA-F]{24})', async (req, res) => {
    const id = req.params.id.trim()
    const query = { _id: new ObjectId(id) };
    const result = await serviceCollection.deleteOne(query);
    res.json('result');
}); 
} finally {
}
  }
  run().catch(console.dir)

app.get('/', (req, res) => {
  res.send('Running my code hellow world')
})

app.listen(port, () => {
  console.log(`Al Helal Hajj Khafela is run on port ${port}`)
})