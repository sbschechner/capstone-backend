var chai = require('chai');
var chaiHttp = require('chai-http');
var mongoose = require('mongoose');
var faker = require('faker');

var should = chai.should() //allows for the should.be syntax

var {app, runServer, closeServer} = require("../server");
var {ExpenseGrouper} = require("../models");
var {TEST_DATABASE_URL} = require("../config");

chai.use(chaiHttp);


//NEED TO CREATE SEEDING TO TEST GET REQUEST

describe("making sure page is up and running", function(){
	it("returns HTML", function(){
		return chai.request(app)
			.get("/")
			.then(function(response){
				response.should.have.status(200);
				response.should.be.HTML;
			});
	});


}) //describe close bracket

