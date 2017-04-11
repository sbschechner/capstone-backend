var express = require('express');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var mongoose = require('mongoose')

mongoose.Promise = global.Promise;

//import variable section
var {PORT, DATABASE_URL} = require('./config');
var {Expenses} = require('./models');



var app = express();
app.use(express.static('public'));
app.use(morgan('common'));
app.use(bodyParser.json);


//get request
app.get("/expenseTracker", function(request, response){
	//MANIUPLATION OF THE MONGO DB TO RETURN GET
})



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

module.exports = {app, runServer, closeServer};
