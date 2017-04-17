var chai = require('chai');
var chaiHttp = require('chai-http');
var mongoose = require('mongoose');
var faker = require('faker');

var should = chai.should() //allows for the should.be syntax

var {app, runServer, closeServer} = require("../server");
var {Expenses} = require("../models");
var {TEST_DATABASE_URL} = require("../config");

chai.use(chaiHttp);


//NEED TO CREATE SEEDING TO TEST GET REQUEST

function seedExpenses() {
	console.log("seeding the expenses");
	var seedData = [];
	for (var i=0; i<10; i++){
		seedData.push(generateSeedData());
	}
	return Expenses.insertMany(seedData);
}

function generateName(){
	var names = ["bar tab", "lunch moooo", "hospital bill"]
	return names[Math.floor(Math.random()*names.length)];
}

function generateAmount(){
	var amounts =[5, 9, 100, 9000]
	return amounts[Math.floor(Math.random()*amounts.length)];
}

function generateSeedData(){
	return {
		name: generateName(),
		amount: generateAmount(),
		assignee: {
					first: faker.name.firstName(),
					last: faker.name.lastName(),
					}
	}
}

//need to create tear down requests to keep tests independent from each other

function tearDown() {
	console.log("delete the db")
	return mongoose.connection.dropDatabase();
}

describe("Expense Tracker API and Endpoints Tests", function() {
	before(function(){
		return runServer(TEST_DATABASE_URL);
	});

	beforeEach(function(){
		return seedExpenses();
	});

	afterEach(function(){
		return tearDown();
	});

	after(function(){
		return closeServer();
	});

	//GET TESTing STRATEGEY
	//ensure that the get request has the right number of values and then check the actual keys of the returned object

	describe("testing the Get endpoint", function(){

		it("should return all the expenses", function(){
			var response;
				return chai.request(app)
				.get('/expenseTracker')
				.then(function(_response){
					response = _response;
					response.should.have.status(200);
					response.body.expenses.should.have.length.of.at.least(1);
					return Expenses.count();
				})
				.then(function(count){
					response.body.expenses.should.have.length.of(count);
				});
		});

		it("should return the right aspects of each expense", function(){
			var responseExpense;
			return chai.request(app)
				.get("/expenseTracker")
				.then(function(response){
					response.should.have.status(200);
					response.should.be.json;
					response.body.expenses.should.be.a('array');
					response.body.expenses.should.have.length.of.at.least(1);
					response.body.expenses.forEach(function(expense){
						expense.should.be.a('object');
						expense.should.include.keys(
							"name", "amount", "assignee");
						});
					responseExpense = response.body.expenses[1];
					return Expenses.findById(responseExpense.id);
				})
				.then(function(expense){
					responseExpense.id.should.equal(expense.id);
					responseExpense.name.should.equal(expense.name);
					//responseExpense.assignee.should.equal(expense.assignee);
				});
			});
		});


//the next describe for my next test ....the Post would be here,

}); //describe close with independent tests


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



//need to do run / close server at before and after each to make sure test are independet
