var chai = require('chai');
var chaiHttp = require('chai-http');
var mongoose = require('mongoose');
var faker = require('faker');

var should = chai.should() //allows for the should.be syntax

var {app} = require("../server");

chai.use(chaiHttp);

describe("making sure page is up and running", function(){
	it("returns HTML", function(){
		return chai.request(app)
			.get("/")
			.then(function(response){
				response.should.have.status(200);
			});
	});


}) //describe close bracket

