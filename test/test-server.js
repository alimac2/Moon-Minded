"use strict"

var mocha = require("mocha");
var chai = require("chai");
var chaiHttp = require("chai-http");

var should = chai.should();

chai.use(chaiHttp);

const {app} = require("../server");


/* refactor */
describe("verifications", ()=> {
    it("should render html", ()=> {
    return chai.request(app) /*promise*/
        .get("/") 
        .then((res)=> {
         res.should.have.status(200);
         res.should.be.html
        });
    });
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
    title: "I Love Tomtatoes",
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


    
