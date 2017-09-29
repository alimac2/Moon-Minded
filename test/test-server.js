"use strict"

var mocha = require("mocha"); /*do I need mocha?*/
var chai = require("chai");
var chaiHttp = require("chai-http");
const faker = require('faker');

var should = chai.should();

chai.use(chaiHttp);

const {app} = require("../server");


const {Entry} = require('../models');
const {app, runServer, closeServer} = require('../server');
const {DATABASE_URL} = require('../config');


// used to put randomish documents in db
// so we have data to work with and assert about.
// we use the Faker library to automatically
// generate placeholder values for author, title, content
// and then we insert that data into mongo
function seedEntryData() {
  console.info('seeding entry data');
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

// generate an object represnting a restaurant.
// can be used to generate seed data for db
// or request.body data
function generateEntryData() {
  return {
    title: faker.lorem.sentence(),
    eventType: generateEntryEventType(),
    content: faker.lorem.paragraph(),
    created: faker.date_time.date() /* double check this is correct from faker library */
  }
}


// this function deletes the entire database.
// we'll call it in an `afterEach` block below
// to ensure  ata from one test does not stick
// around for next one
function tearDownDb() {
  console.warn('Deleting database');
  return mongoose.connection.dropDatabase();
}
/*should I add more to this?*/

describe('Entries API resource', function() {

// we need each of these hook functions to return a promise
// otherwise we'd need to call a `done` callback. `runServer`,
// `seedRestaurantData` and `tearDownDb` each return a promise,
// so we return the value returned by these function calls.
before(function() {
  return runServer(); /*or (TEST_DATABASE_URL)*/
});

beforeEach(function() {
  return seedRestaurantData();
});

afterEach(function() {
  return tearDownDb();
});

after(function() {
  return closeServer();
})



describe("GET endpoint", function(){
    it("should return all existing entries", function() {
        let res;
        return chai.request(app)
        .get("/entries") /*type in valid route*/
        .then(function(_res) {
            res = _res;
            res.should.have.status(200);
            res.body.entries.should.have.length.of.at.least(1);
            return Entry.count();
        })
        .then(function(count) {
            res.body.entries.should.have.length.of(count);
        });
    });
})


const updateData = {
    title: "The Moon and the Stars",
    eventType: "milky way"
  };
  
  return Entry
    .findOne()
    .then(function(entry) {
      updateData.id = entry.id;
  
      // make request then inspect it to make sure it reflects
      // data we sent
      return chai.request(app)
        .put(`/entries/${entry.id}`)
        .send(updateData);
    })
    .then(function(res) {
      res.should.have.status(204);
  
      return Entry.findById(updateData.id);
    })
    .then(function(entry) {
      entry.title.should.equal(updateData.title);
      entry.eventType.should.equal(updateData.eventType);
    });

    
    
    let entry;
    
    Entry
      .findOne()
      .then(function(_entry) {
        entry = _entry;
        return chai.request(app).delete(`/entries/${entry.id}`);
      })
      .then(function(res) {
        res.should.have.status(204);
        return Entry.findById(entry.id);
      })
      .then(function(_entry) {
        should.not.exist(_entry);
      });


    
