const { MongoClient } = require("mongodb");

function getToken() {
  var fs = require('fs');
  var token = fs.readFileSync('mongo_token.txt').toString();
  return token;
}

const uri = getToken();
const client = new MongoClient(uri, {useUnifiedTopology: true});

async function get(server_id,  id_num) {
  await client.connect();
  const database = client.db('MOB');
  const collection = database.collection('SP');
  const projection = {"playlists.$": 1, _id: 0};
  const results = await collection.find({$and: [{"_id": server_id},{"playlists.id_num": id_num}]}).project(projection).next();
  if(results == null) {
    await client.close();
    return null;
  } else {
    const name = results["playlists"][0]["name"]; 
    const url = results["playlists"][0]["url"];
    console.log(`Name: ${name}, Url: ${url}`);
    await client.close();
  }
  
}

async function save(server_id, pl_name, pl_url) {
  await client.connect();
  const database = client.db('MOB');
  const collection = database.collection('SP');
  try {
    const fetchResults = await collection.findOne({"_id": server_id});
    // console.log(fetchResults["count"]);
    if(fetchResults == null) {
      await collection.insertOne({"_id": server_id, "count": 1, "playlists": [{"id_num": 1, "name": pl_name, "url": pl_url}]});
    } else {
      const updateCount = await collection.updateOne({"_id": server_id}, {$inc: {count: 1}});
      const updatePlaylsits = await collection.updateOne({"_id": server_id}, {$push: {"playlists": {"id_num": fetchResults["count"] + 1 ,"name":pl_name, "url": pl_url}}});
    }
    // console.log
  } catch(err) {
    if(err.code == 11000) {
      console.log("Duplicated id");
    }
    // console.log(err.code == 11000);
  }
  await client.close()
}

async function remove(server_id, id_num) {
  await client.connect();
  const database = client.db('MOB');
  const collection = database.collection('SP');
  
  const results = await collection.findOne({$and: [{"_id": server_id},{"playlists.id_num": id_num}]});
  if(results == null) {
    await client.close()
    return null ;
  } else {
    await collection.updateOne({_id: server_id}, {$pull: {playlists: {id_num: id_num}}});
    await collection.updateOne({_id: server_id}, {$inc: {count: -1}})
    await collection.updateOne({_id: server_id}, {$inc: {"playlists.$[el].id_num": -1}}, {arrayFilters: [{"el.id_num": {$gt: id_num}}]});
    await client.close()
  }
}

// async function run() {
//   try {
//     const database = client.db('MOB');
//     const movies = database.collection('SP');
//     // Query for a movie that has the title 'Back to the Future'
//     // const query = { title: 'Back to the Future' };
//     const movie = await movies.findOne();
//     console.log(movie);
//   } finally {
//     // Ensures that the client will close when you finish/error
//     await client.close();
//   }
// }
// run().catch(console.dir);

// fetch();

// get("0","1");
// remove("0",3);
save("0","YHLQMDLG", "www.google.com");

