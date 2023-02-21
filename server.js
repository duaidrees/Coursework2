import express from 'express'
import { MongoClient, ServerApiVersion } from 'mongodb'

const app = express()
const port = 3000

const client = new MongoClient(
  'mongodb://DuaIdrees:Dua555@ac-xdky38q-shard-00-00.hejgkrc.mongodb.net:27017,ac-xdky38q-shard-00-01.hejgkrc.mongodb.net:27017,ac-xdky38q-shard-00-02.hejgkrc.mongodb.net:27017/?ssl=true&replicaSet=atlas-qmf3ys-shard-0&authSource=admin&retryWrites=true&w=majority',
  { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1, }
)
await client.connect()
const db = client.db('Coursework-1-Indvidual')

// logger middleware
app.use((req, res, next) => {
  res.on('finish', () => {
    console.log(`[${req.method}] ${req.url} : ${res.statusCode}`);
  })
  next();
})

// static middleware
app.use(express.static('static'));

// body parser
app.use(express.json());

// api routes
app.get('/items', async (req, res) => {
  const { q = '' } = req.query

  const items = await db.collection('items').find().toArray();

  return res.json(
    items.filter(item => 
      item.subject.toLowerCase().includes(q.toLowerCase().trim())
    )
  )
})

app.get('/orders', async (_, res) => {
  const orders = await db.collection('orders').find().toArray()
  return res.json(orders)
})

app.post('/orders', async (req, res) => {
  const { name, phone, items } = req.body
  console.log(name, phone, items)

  if(name && phone && items) {
    await db.collection('orders').insertOne({ name, phone, items })
    return res.sendStatus(201)
  } else {
    return res.sendStatus(400)
  }
})

app.put('/items', async (req, res) => {
  const { id } = req.body
  console.log(id);
  if (!id) {
    return res.sendStatus(400)
  }
  await db
    .collection('items')
    .updateOne(
      { id },
      { $inc: { spaces: -1 } },
    )

  return res.sendStatus(200)
})

app.listen(port, () => {
  console.log(` app listening on port ${port}`)
})
