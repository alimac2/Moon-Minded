"use strict"

const mongoose = require("mongoose");
const chai = require("chai");
const chaiHttp = require("chai-http");
const faker = require("faker");

const should = chai.should();

chai.use(chaiHttp);

const {Entry} = require("../models");
const {app, runServer, closeServer} = require("../server");
const {DATABASE_URL} = require("../config");
const {TEST_DATABASE_URL} = require("../config");


// this function deletes the entire database.
// we'll call it in an `afterEach` block below
// to ensure  ata from one test does not stick
// around for next one
function tearDownDb() {
  return new Promise((resolve, reject) => {
    console.warn("Deleting database");
    mongoose.connection.dropDatabase()
      .then(result => resolve(result))
      .catch(err => reject(err))
  });
}


// used to put randomish documents in db
// so we have data to work with and assert about.
// we use the Faker library to automatically
// generate placeholder values for author, title, content
// and then we insert that data into mongo
function seedEntryData() {
  console.info("seeding entry data");
  const seedData = [];

  for (let i=1; i<=10; i++) {
    seedData.push(generateEntryData());
  }
  // this will return a promise
  return Entry.insertMany(seedData);
}

/*make sure this matches actual entries*/
function generateEntryEventType() {
  const type = [
    "moon", "stargazing", "constellations", "meteor shower", "milky way", "planets", "solar eclipse", "lunar eclipse"  ];
  return type[Math.floor(Math.random() * type.length)];
}

// generated an object representing an entry.
// can be used to generate seed data for db
// or request.body data
function generateEntryData() {
  /* console.log("FAKER", typeof faker.date.recent()); */
  return {
    title: faker.lorem.sentence(),
    eventType: generateEntryEventType(),
    content: faker.lorem.paragraph(),
    created: faker.date.recent() /* this returns an object */
  }
}


describe("Entries API resource", function() {

// we need each of these hook functions to return a promise
// otherwise we'd need to call a `done` callback. `runServer`,
// `seedEntryData` and `tearDownDb` each return a promise,
// so we return the value returned by these function calls.
before(function() {
  return runServer(TEST_DATABASE_URL); 
});

beforeEach(function() {
  return seedEntryData();
  console.log(seedEntryData);
});

afterEach(function() {
  return tearDownDb();
});

after(function() {
  return closeServer();
});



describe("GET endpoint", function() {
    it("should return all existing entries", function() {
        let res;
        return chai.request(app)
          .get("/entries") /*type in valid route*/
          .then(function(_res) {
            res = _res;
            res.should.have.status(200);
            res.body.should.have.length.of.at.least(1);
            
            return Entry.count();
          })
          .then(count => {
            res.body.should.have.length(count);
          });
    });


  it("should return entries with right fields", function() {
    // Strategy: Get back all entries, and ensure they have expected keys

    let resEntry;
    return chai.request(app)
      .get("/entries")
      .then(function(res) {
        res.should.have.status(200);
        res.should.be.json;
        res.body.should.be.a("array");
        res.body.should.have.length.of.at.least(1);

        res.body.forEach(function(entry) {
          entry.should.be.a("object");
          entry.should.include.keys(
            "id", "title", "eventType", "content", "created");
        });
        resEntry = res.body[0]; 
        /* console.log("resEntry", resEntry); */
        return Entry.findById(resEntry.id);
      })
      
      .then(function(entry) {
        
        // console.log("ENTRY CREATED", typeof entry.created); 
        // console.log("RESENTRY", typeof resEntry.created); 
        resEntry.id.should.equal(entry.id);
        resEntry.title.should.equal(entry.title);
        resEntry.eventType.should.equal(entry.eventType);
        resEntry.content.should.equal(entry.content);
        resEntry.created.should.equal(entry.created);
      });
    }); 
  }); /* need to figure out what the closing brakets match up to  */


describe("POST endpoint", function() {
  // strategy: make a POST request with data,
  // then prove that the entry we get back has
  // right keys, and that `id` is there (which means
  // the data was inserted into db)
  it("should add a new entry", function() {

    const newEntry = generateEntryData();
    // console.log(newEntry);
    return chai.request(app) /*will return a promise*/
      .post("/entries") /*should this be different? Make sure the endpoints work and that you are receiving everything okay.*/
      .send(newEntry)
      .then(function(res) {
        /* console.log("RESPONSE", res); */
        console.log("RESBODY", typeof res.body.created); /* string */
        console.log("NEWENTRY", typeof newEntry.created); /* object */
        res.should.have.status(201);
        res.should.be.json;
        res.body.should.be.a("object");
        res.body.should.include.keys(
          "id", "title", "eventType", "content", "created");
       
        // cause Mongo should have created id on insertion
        res.body.id.should.not.be.null;
        res.body.title.should.equal(newEntry.title);
        res.body.eventType.should.equal(newEntry.eventType);
        res.body.content.should.equal(newEntry.content);
        res.body.created.should.equal(newEntry.created);

        return Entry.findById(res.body.id);
      })
      .then(function(entry) {
        // console.log("ENTRY", entry);
        conso
        entry.title.should.equal(newEntry.title);
        entry.eventType.should.equal(newEntry.eventType);
        entry.content.should.equal(newEntry.content);
        entry.created.should.equal(newEntry.created);
      });
  });
});



describe("PUT endpoint", function() {
  // strategy:
  //  1. Get an existing entry from db
  //  2. Make a PUT request to update that entry
  //  3. Prove entry returned by request contains data we sent
  //  4. Prove entry in db is correctly updated
  it("should update fields you send over", function() {
    const updateData = {
      title: "The Moon and the Stars",
      eventType: "milky way"
    }; /* come back to this and make sure updateData reflects real data */
  
    return Entry
      .findOne()
      .then(entry => {
        updateData.id = entry.id;
    
        // make request then inspect it to make sure it reflects
        // data we sent
        return chai.request(app)
          .put(`/entries/${entry.id}`)
          .send(updateData);
      })
      .then(res => {
        res.should.have.status(204);
    
        return Entry.findById(updateData.id);
      })
      .then(entry => {
        entry.title.should.equal(updateData.title);
        entry.eventType.should.equal(updateData.eventType); 
      });
    });
  });


  describe("DELETE endpoint", function() {
    // strategy:
    //  1. get an entry
    //  2. make a DELETE request for that entry's id
    //  3. assert that response has right status code
    //  4. prove that entry with the id doesn't exist in db anymore
    it("should delete an entry by id", function() {

      let entry;

      return Entry
        .findOne()
        .then(_entry => {
          entry = _entry;
          return chai.request(app).delete(`/entires/${entry.id}`); /* `/entires/${entry.id}/json` */
        })
        .then(function(res) {
          res.should.have.status(204);
          return Entry.findById(entry.id);
        })
        .then(_entry => {
          // when a variable's value is null, chaining `should`
          // doesn't work. so `_entry.should.be.null` would raise
          // an error. `should.be.null(_entry)` is how we can
          // make assertions about a null value.
          should.not.exist(_entry);
        });
    });
  });
});