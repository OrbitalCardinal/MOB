const { MongoClient } = require("mongodb");


var fs = require('fs');
var token = fs.readFileSync('mongo_token.txt').toString();
const uri = token;
const client = new MongoClient(uri, {useUnifiedTopology: true});

var isDbOn = false;

async function startMongo() {
    await client.connect().then((_) => {
        isDbOn = true;
    })
}

startMongo();


