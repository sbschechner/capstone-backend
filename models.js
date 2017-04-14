var mongoose = require("mongoose");

var expenseSchema = mongoose.Schema({
	name: {type: String, required: true },
	amount: {type: Number, required: true, default: 0},
	assignee: {
				firstName: {type: String, default: "no"},
				lastName: {type: String, default: "one"}
				},

});

expenseSchema.virtual("assigneeFull").get(function(){
	return `${this.assignee.firstName} ${this.assignee.lastName}`.trim()
	});


expenseSchema.methods.apiReturn = function(){
	return {
		id: this._id,
		name: this.name,
		amount: this.amount,
		assignee:this.assigneeFull
	}
}


var Expenses = mongoose.model("Expenses", expenseSchema);

module.exports = {Expenses}