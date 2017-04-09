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
				response.should
			})
	});


}) //describe close bracket



 //hit up the root url for your client, you get a 200 status code and HTML