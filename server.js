"use strict"

const bodyParser = require("body-parser");
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const {DATABASE_URL, PORT} = require("./config");
const {Entry} = require("./models");

const app = express();

/* application level middleware */
app.use(bodyParser.json());
app.use(express.static("public"));
app.use(cors());

mongoose.Promise = global.Promise;


app.get("/entries", (req, res) => {
    Entry
      .find()
      .then(entries => {
        res.json(entries.map(entry => entry.apiRepr()));
      })
      .catch(err => {
        console.error(err);
        res.status(500).json({error: "Internal server error"});
      });
});


app.get("/entries/:id", (req, res) => {
    Entry
      .findById(req.params.id)
      .then(entry => res.json(entry.apiRepr()))
      .catch(err => {
        console.error(err);
        res.status(500).json({error: "Internal server error"});
      });
});


app.post("/entries", (req, res) => {
    
    const requiredFields = ["title", "eventType", "content", "created"];
    for (let i=0; i<requiredFields.length; i++) {
       const field = requiredFields[i];
       if (!(field in req.body)) {
         const message = `Missing \`${field}\` in request body`
         console.error(message);
         return res.status(400).send(message);
       }
    }
    
      Entry
        .create({
          title: req.body.title,
          eventType: req.body.eventType,
          content: req.body.content,
          created: req.body.created,
        })
        .then(
          entry => res.status(201).json(entry.apiRepr()))
        .catch(err => {
          console.error(err);
          res.status(500).json({message: "Internal server error"});
        });
});
     

app.put("/entries/:id", (req, res) => {
        // ensure that the id in the request path and the one in request body match
        // console.log(req.body.id);
        // console.log(req.params.id);
    
        if (!(req.params.id && req.body.id && req.params.id === req.body.id)) {
        const message = (
            `Request path id (${req.params.id}) and request body id ` +
            `(${req.body.id}) must match`);
          console.error(message);
          res.status(400).json({error: message});
          // console.log(req.body.id);
          // console.log(req.params.id);
          
    }
      
    // we only support a subset of fields being updateable.
    // if the user sent over any of the updatableFields, we udpate those values
    // in document
    const toUpdate = {};
    const updateableFields = ["title", "eventType", "content", "created"];
      
    updateableFields.forEach(field => {
        if (field in req.body) {
            toUpdate[field] = req.body[field];
        }
    });

    Entry
    // all key/value pairs in toUpdate will be updated -- that's what `$set` does
    .findByIdAndUpdate(req.params.id, {$set: toUpdate}, {new: true})
    .then(updatedEntry => res.status(204).end())
    .catch(err => res.status(500).json({message: "Internal server error"}));
});


app.delete("/entries/:id", (req, res) => {
    Entry
    .findByIdAndRemove(req.params.id)
    .then(() => {
      res.status(204).json({message: "success"});
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({error: "Internal server error"});
    });
});


/* catch-all endpoint if client makes request to non-existent endpoint */
app.use("*", function(req, res) {
    res.status(404).json({message: "Not Found"});
});


let server;
/* this function connects to our database, then starts the server */
function runServer(databaseUrl=DATABASE_URL, port=PORT) {

  return new Promise((resolve, reject) => {
    mongoose.connect(databaseUrl, err => {
      if (err) {
        return reject(err);
      }
      server = app.listen(port, () => {
        console.log(`Your app is listening on port ${port}`);
        resolve();
      })
      .on("error", err => {
        mongoose.disconnect();
        reject(err);
      });
    });
  });
}


// this function closes the server, and returns a promise. we'll
// use it in our integration tests later.
function closeServer() {
  return mongoose.disconnect().then(() => {
     return new Promise((resolve, reject) => {
       console.log("Closing server");
       server.close(err => {
           if (err) {
               return reject(err);
           }
           resolve();
       });
     });
  });
}


// if server.js is called directly (aka, with `node server.js`), this block
// runs. but we also export the runServer command so other code (for instance, test code) can start the server as needed.
if (require.main === module) {
  runServer().catch(err => console.error(err));
};

module.exports = {app, runServer, closeServer};