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



describe("GET endpoint", function() {
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

it('should return entries with right fields', function() {
  // Strategy: Get back all restaurants, and ensure they have expected keys

  let resRestaurant;
  return chai.request(app)
    .get('/entries')
    .then(function(res) {
      res.should.have.status(200);
      res.should.be.json;
      res.body.restaurants.should.be.a('array');
      res.body.restaurants.should.have.length.of.at.least(1);

      res.body.restaurants.forEach(function(entry) {
        restaurant.should.be.a('object');
        restaurant.should.include.keys(
          'id', 'title', 'eventType', 'content', 'created');
      });
      resEntry = res.body.entries[0]; /* res.body[0] ??*/
      return Entry.findById(resEntry.id);
    })
    .then(function(restaurant) {

      resRestaurant.id.should.equal(restaurant.id);
      resRestaurant.title.should.equal(restaurant.title);
      resRestaurant.eventType.should.equal(restaurant.eventType);
      resRestaurant.content.should.equal(restaurant.content);
      resRestaurant.created.should.contain(restaurant.created);
    });
  });
});


describe('POST endpoint', function() {
  // strategy: make a POST request with data,
  // then prove that the restaurant we get back has
  // right keys, and that `id` is there (which means
  // the data was inserted into db)
  it('should add a new restaurant', function() {

    const newEntry = generateEntryData();

    return chai.request(app)
      .post('/entries') /*should this be different?*/
      .send(newEntry)
      .then(function(res) {
        res.should.have.status(201);
        res.should.be.json;
        res.body.should.be.a('object');
        res.body.should.include.keys(
          'id', 'title', 'eventType', 'content', 'created');
       
        // cause Mongo should have created id on insertion
        res.body.id.should.not.be.null;
        res.body.title.should.equal(newEntry.title);
        res.body.eventType.should.equal(newRestaurant.eventType);
        res.body.content.should.equal(newEntry.content);
        res.body.created.should.equal(newEntry.created);

        return Restaurant.findById(res.body.id);
      })
      .then(function(dream) {
        entry.title.should.equal(newEntry.title);
        entry.eventType.should.equal(newEntry.eventType);
        entry.content.should.equal(newEntry.content);
        entry.created.should.equal(newEntry.created);
      });
  });
});



describe('PUT endpoint', function() {
  // strategy:
  //  1. Get an existing dream from db
  //  2. Make a PUT request to update that dreamt
  //  3. Prove dream returned by request contains data we sent
  //  4. Prove dream in db is correctly updated
  it('should update fields you send over', function() {
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
          .put(`/entries/${entry.id}/json`)
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
    });
  });


  describe('DELETE endpoint', function() {
    // strategy:
    //  1. get a restaurant
    //  2. make a DELETE request for that restaurant's id
    //  3. assert that response has right status code
    //  4. prove that restaurant with the id doesn't exist in db anymore
    it('delete an entry by id', function() {

      let entry;

      return Entry
        .findOne()
        .then(function(_entry) {
          entry = _entry;
          return chai.request(app).delete(`/entires/${restaurant.id}/json`);
        })
        .then(function(res) {
          res.should.have.status(204);
          return Entry.findById(entry.id);
        })
        .then(function(_entry) {
          // when a variable's value is null, chaining `should`
          // doesn't work. so `_restaurant.should.be.null` would raise
          // an error. `should.be.null(_restaurant)` is how we can
          // make assertions about a null value.
          should.not.exist(_entry);
        });
    });
  });