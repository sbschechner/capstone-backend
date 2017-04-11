var mongoose = require("mongoose");

var expenseSchema = mongoose.Schema({
	name: 
	amount:
	assignee:

});

//need to create virtuals and ApiReturn function 

var Expenses = mongoose.model("Expenses", expenseSchema);

module.exports{Expenses}