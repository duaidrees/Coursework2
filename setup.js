import { MongoClient, ServerApiVersion } from 'mongodb'
import items from './items.js'

const client = new MongoClient(
  'mongodb://DuaIdrees:Dua555@ac-xdky38q-shard-00-00.hejgkrc.mongodb.net:27017,ac-xdky38q-shard-00-01.hejgkrc.mongodb.net:27017,ac-xdky38q-shard-00-02.hejgkrc.mongodb.net:27017/?ssl=true&replicaSet=atlas-qmf3ys-shard-0&authSource=admin&retryWrites=true&w=majority',
  { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1, }
)
await client.connect()
const db = client.db('Coursework-1-Indvidual')

// setup data in mongo db
try {
  await db.dropCollection('items')
  await db.dropCollection('orders')
}
catch { }

await db.collection('items').insertMany(items)
console.log(items);
process.exit();
