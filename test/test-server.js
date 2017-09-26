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






    
