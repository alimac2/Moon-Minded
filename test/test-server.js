"use strict"

var mocha = require("mocha");
var chai = require("chai");
var chaiHttp = require("chai-http");

var should = chai.should();

chai.use(chaiHttp);

const {app} = require("../server");



describe("verifications", ()=> {
    it("should render html", ()=> {
    return chai.request(app) /*promise*/
        .get("/") 
        .then((res)=> {
         res.should.have.status(200);
         res.should.be.html
        });
    })
});

    
