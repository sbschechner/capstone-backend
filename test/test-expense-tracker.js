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
		assignee: faker.name.findName()
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

	describe("testing the post endpoint",function(){
		it("should add an expense", function(){
			var newExpense = generateSeedData();
				return chai.request(app)
					.post("/expenseTracker")
					.send(newExpense)
					.then(function(response){
						response.should.have.status(201);
						response.should.be.json;
						response.should.be.a('object');
						response.body.should.include.key(
							"name", "amount", "assignee");
						response.body.id.should.not.be.null;
						response.body.name.should.equal(newExpense.name);
						response.body.amount.should.equal(newExpense.amount);
						return Expenses.findById(response.body.id)
					})
					.then(function(expense){
						expense.name.should.equal(newExpense.name);
						expense.amount.should.equal(newExpense.amount);
					});
			});
		});

	describe("testing the delete request", function(){

		it("should remove the expense by the id", function(){
			var expense;
			return Expenses
				.findOne()
				.exec()
				.then(function(_expense){
					expense = _expense;
					return chai.request(app).delete(`/expenseTracker/${expense.id}`);
				})
				.then(function(response){
					response.should.have.status(204);
					return Expenses.findById(expense.id).exec()
				})
				.then(function(_expense){
					should.not.exist(_expense);
				});
		});
	});

	describe("testing the put request", function(){
		it("should update the fields", function(){
			var updateData = {
				name : "updated Name",
				amount : 190,
			};
			return Expenses
				.findOne()
				.exec()
				.then(function(expense){
					updateData.id = expense.id
					console.log("updating " + expense.id)
					return chai.request(app)
						.put(`/expenseTracker/${expense.id}`)
						.send(updateData);

				})
				.then(function(response){
					response.should.have.status(201);
					console.log(response.body);
					return Expenses.findById(response.body.id).exec();
				})
				.then(function(expense){
					expense.name.should.equal(updateData.name);
					expense.amount.should.equal(updateData.amount);
				});
		})
	})

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
