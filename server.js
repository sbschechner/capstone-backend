var express = require('express');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var mongoose = require('mongoose')

mongoose.Promise = global.Promise;

//import variable section
var {PORT, DATABASE_URL} = require('./config');
var {Expenses} = require('./models');


var app = express();
app.use(express.static(__dirname + '/public')); //allows the server where to look in public for templates
app.use(morgan('common'));
app.use(bodyParser.json());


//get request
app.get("/expenseTracker", function(request, response){
	console.log("hitting the tracker");
	Expenses
		.find()
		.limit(10)
		.exec()
		.then(function(expenses){
			response.json({expenses: expenses.map(
				(expense) =>
				expense.apiReturn())
				});
			})
		.catch(error =>{
			console.error(error);
			response.status(500).json({message:"error getting that data"});
		});
	});

app.get("/expenseTracker/:id", function(request,response){
	Expenses
		.findById(request.params.id)
		.exec()
		.then(expense => response.json(expense.apiReturn()))
		.catch(error => {
			console.error(500).json({message: "Get Error by Id: Internal Server Error"})
		});
	});

app.post("/expenseTracker", function(request,response){
	console.log("hitting the post right now", request.body);
	//checking the request has the right components for a post request
	var requiredFields = ["name", "amount", "assignee"];
	for (var i=0; i<requiredFields.length; i++){
		var field = requiredFields[i];
		if(!(field in request.body)){
			var message = `you are missing \`${field}\` in body `
			console.log(message);
			return response.status(400).send(message);
		}
	}

	Expenses
		.create({
			name : request.body.name,
			amount: request.body.amount,
			assignee: request.body.assignee,
			})
		.then(expense => response.status(201).json(expense.apiReturn()))
		.catch (error => {
			console.log(error);
			response.status(500).json({message : "post error : internal service error"});
		});

});

// in case someone uses an endpoing that doesn't exist
app.use("*", function(request,response){
	response.status(404).json({message: "Not Found"});
	});


//connect to DB
var server;

function runServer(database_URL = DATABASE_URL, port = PORT ){
	return new Promise((resolve, reject)=>{
		mongoose.connect(database_URL, error =>{
			if (error){
				console.log("Server Connection Not Working")
				return reject(error);
			}
			server = app.listen(port, () => {
				console.log("everything connected");
				resolve();
			})
			.on("error", error => {
				mongoose.disconnect();
				reject(error);
			});
		});
	});
}

function closeServer(){
	return mongoose.disconnect().then(()=> {
		return new Promise((resolve, reject) =>{
			console.log("closing the server");
			server.close(error => {
				if (error){
					return reject(error);
				}
				resolve();
			});
		});
	});
}


//so I can use these runServer and close server functions in testing file
if (require.main === module){
	runServer().catch(error => console.log(error));
};

module.exports = {app,runServer,closeServer};
