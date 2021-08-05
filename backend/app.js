const express = require("express");
const mongoProvider = require('../mongo_provider');

const app = express();

app.use((request, response, next) => {
    response.setHeader('Access-Control-Allow-Origin', "*");
    response.setHeader('Access-Control-Allow-Headers', "Origin, X-Requested-With, Content-Type, Accept");
    response.setHeader('Access-Control-Allow-Methods', "GET, POST, PATCH, DELETE, OPTIONS");
    next();
});

// Get methods
app.get("/api/show", async (request, response, next) => {
    // Getting playlists json object with server id
    var results = await mongoProvider.fetch(request.query.server_id);
    console.log(results);
    response.json(results);
});


app.use("/api/random", (request, response, next) => {
    const test = {
        "nombre": "Random"
    }
    response.json(test);
});

// post methods
app.use("/api/save", (request, response, next) => {
    const test = {
        "nombre": "Save"
    }
    response.json(test);
});

// Delete method
app.use("/api/delete", (request, response, next) => {
    const test = {
        "nombre": "Delete"
    }
    response.json(test);
});

module.exports = app;