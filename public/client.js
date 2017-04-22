
var heroku_Url = "https://shrouded-bayou-70080.herokuapp.com"

var store = {
	expenses : []
}

//var local = "http://localhost:8080"

function getAllExpenses(callBack){ 
	$.ajax({
		type: "GET",
		url: heroku_Url + "/expenseTracker",
		//url: local + "/expenseTracker",
		success: function (data){
			console.log("retrieving data"),
			store.expenses = data.expenses;
			console.log(data);
			callBack(data);
		}
	})
}

function postANewExpense(names, amounts, assignees){
	$.ajax({
		type: "POST",
		url: heroku_Url + "/expenseTracker",
		//url: local + "/expenseTracker",
		contentType: 'application/json',
		dataType: "json",
		data: JSON.stringify({name: names, amount: amounts, assignee: assignees}),
		success: function(){
			alert("New Expense Created");
		}
	})
}

function deleteANewExpense(expenseID){
	$.ajax({
		type: "DELETE",
		url: heroku_Url + "/expenseTracker/" + expenseID,
		//url: local + "/expenseTracker/" + expenseID,
		success: function(){
			alert("Expense Deleted");
		}
	})
}

function putANewRequest(arrayNumber, amounts, assignees, expenseID){
	var updatedField = {}
		updatedField.name = store.expenses[arrayNumber].name
		updatedField.id = expenseID
		updatedField.amount = amounts
		updatedField.assignee = assignees
		if (amounts === ""){
		updatedField.amount = store.expenses[arrayNumber].amount;
		}
		if (assignees === ""){
		updatedField.assignee = store.expenses[arrayNumber].assignee;
		}
		console.log(updatedField)
	$.ajax({
		type:"PUT",
		url: heroku_Url + "/expenseTracker/" + expenseID,
		//url: local + "/expenseTracker/" + expenseID,
		contentType: 'application/json',
		data: JSON.stringify(updatedField),
		success: function(){
			alert("Expense Updated");
		}
	})
}
 
function displayExpenses(data){ //takes the info and puts it into the li format I have -- need to double check with schema names
	$(".text-display").empty();
	for (index in data.expenses){
		$(".text-display").append(
			"<li>" + "Expense Name: " + data.expenses[index].name +  
			" .................. Total Amount: $  "+ data.expenses[index].amount + 
			"  ....................     Assigned to:  " + data.expenses[index].assignee +
			"</li>"
			);
	}
}

function getAndDisplayExpenses(){
	getAllExpenses(displayExpenses);
}

/*
function createTotals(){
	var totalsObj = {};
	for (index in store.expenses){
		if (!(store.expenses[index] in totalsObj)){
		totalsObj[store.expenses[index].assignee] = store.expenses[index].amount
		}

		if (store.expenses[index] in totalsObj){
			totalsObj[store.expenses[index].assignee] = totalsObj[store.expenses[index].assignee] + store.expenses[index].amount
		}
	}
	console.log("printing the totals", totalsObj);
	$(".totals-display").empty();
	$(".totals-display").append(Object.entries(totalsObj))
}

function getAndOrderTotals(){
	getAllExpenses(createTotals);
}
*/


$(".create-button").click(function(){
	console.log("running the put modal");
	$(".modal").toggleClass("hidden");
	$(".modal-header").text("Please Input the Following:");
	$("#ExpenseAmount").removeClass("hidden");
	$("#expenseNameText").removeClass("hidden");
	$("#ExpenseName").removeClass("hidden");
	$("#ExpenseAmountText").removeClass("hidden");
	$("#expenseAssigneeText").removeClass("hidden");
	$("#ExpenseAssignee").removeClass("hidden");
	$("#ExpenseName").attr("required", "true");
	$("#ExpenseAmount").attr("required", "true");
	$("#modalSubmit").attr('value', 'Submit New Expense');
	$("#modalSelect").addClass("hidden");
	$("#modalSubmit").click(function(event){
		event.preventDefault(); 
		console.log("form submitted");
		var name = $("#ExpenseName").val().trim();
		var amount = $("#ExpenseAmount").val().trim();
		var assignee = $("#ExpenseAssignee").val().trim() || "Not Yet Assigned";
		postANewExpense(name, amount, assignee);
		getAndDisplayExpenses();
		getAndOrderTotals();
		$("#modalSubmit").off();
		$("#ExpenseName").val("");
		$("#ExpenseAmount").val("");
		$("#ExpenseAssignee").val("");
		$(".modal").addClass("hidden");

	})
	var span = document.getElementsByClassName("close")[0];
	span.onclick = function() {
	   $(".modal").toggleClass("hidden");
	   $("#modalSelect").removeClass("hidden");
	}
	window.onclick = function(event) {
	    if (event.target == modal) {
	        $(".modal").toggleClass("hidden");
	        $("#modalSelect").removeClass("hidden");
	    }
	}
	
});

$(".update-button").click(function(){
	console.log("running the update modal")
	$(".modal").toggleClass("hidden");
	$(".modal-header").text("Please select expense to update and corrected fields");
	$("#modalSubmit").attr('value', 'Update Expenses');
	$("#expenseNameText").addClass("hidden");
	$("#ExpenseName").addClass("hidden");
	$("#ExpenseAmountText").removeClass("hidden");
	$("#ExpenseAmount").removeClass("hidden");
	$("#expenseAssigneeText").removeClass("hidden");
	$("#ExpenseAssignee").removeClass("hidden");
	$("#modalSelect").empty();
	$("#modalSelect").removeClass("hidden");
	$("#modalSubmit").off();
	for (index in store.expenses){	
		$("#modalSelect").append(
			"<option value='"+store.expenses[index].id+"'>"+store.expenses[index].name+"</option>")
	}
	$("#modalSubmit").click(function(event){
		event.preventDefault();
		var e = document.getElementById("modalSelect");
		var selected = e.options[e.selectedIndex].value;
		var arrayNumber = e.options.selectedIndex;
		console.log(selected);
		var amount = $("#ExpenseAmount").val().trim();
		var assignee = $("#ExpenseAssignee").val().trim();
		putANewRequest(arrayNumber, amount, assignee, selected);
		getAndDisplayExpenses();
		$("#modalSubmit").off();
		$(".modal").addClass("hidden");
		$("#ExpenseName").val("");
		$("#ExpenseAmount").val("");
		$("#ExpenseAssignee").val("");
	})
	
	var span = document.getElementsByClassName("close")[0];
	span.onclick = function() {
	   $(".modal").toggleClass("hidden");
	   $("#ExpenseAmount").removeClass("hidden");
	   $("#ExpenseAmountText").removeClass("hidden");
	}
	window.onclick = function(event) {
	    if (event.target == modal) {
	        $(".modal").toggleClass("hidden");
	        $("#ExpenseAmount").removeClass("hidden");
	        $("#ExpenseAmountText").removeClass("hidden");
	    }
	}
})

$(".assign-button").click(function(){
	console.log("running the assign modal")
	$(".modal").toggleClass("hidden");
	$(".modal-header").text("Please enter Expense Name to be assigned");
	$("#ExpenseAmount").addClass("hidden");
	$("#ExpenseAmountText").addClass("hidden");
	$("#modalSubmit").attr('value', 'Assign Expenses');
	$("#expenseNameText").addClass("hidden");
	$("#ExpenseName").addClass("hidden");
	$("#modalSelect").empty();
	$("#modalSelect").removeClass("hidden");
	$("#modalSubmit").off();
	for (index in store.expenses){
		$("#modalSelect").append(
			"<option value='"+store.expenses[index].id+"'>"+store.expenses[index].name+"</option>")
	}
	$("#modalSubmit").click(function(event){
		event.preventDefault();
		var e = document.getElementById("modalSelect");
		var selected = e.options[e.selectedIndex].value;
		var arrayNumber = e.options.selectedIndex;
		console.log(selected);
		var amount = $("#ExpenseAmount").val().trim();
		var assignee = $("#ExpenseAssignee").val().trim();
		putANewRequest(arrayNumber, amount, assignee, selected);
		getAndDisplayExpenses();
		$("#modalSubmit").off();
		$(".modal").addClass("hidden");
		$("#ExpenseName").val("");
		$("#ExpenseAmount").val("");
		$("#ExpenseAssignee").val("");
	})

	var span = document.getElementsByClassName("close")[0];
	span.onclick = function() {
	   $(".modal").toggleClass("hidden");
	   $("#ExpenseAmount").removeClass("hidden");
	   $("#ExpenseAmountText").removeClass("hidden");
	}
	window.onclick = function(event) {
	    if (event.target == modal) {
	        $(".modal").toggleClass("hidden");
	        $("#ExpenseAmount").removeClass("hidden");
	        $("#ExpenseAmountText").removeClass("hidden");
	    }
	}
})

$(".delete-button").click(function(){
	console.log("running the delete modal")
	$(".modal").removeClass("hidden");
	$(".modal-header").text("Which expense would you like to delete?");
	$("#ExpenseAmount").addClass("hidden");
	$("#expenseNameText").addClass("hidden");
	$("#ExpenseName").addClass("hidden");
	$("#ExpenseAmountText").addClass("hidden");
	$("#expenseAssigneeText").addClass("hidden");
	$("#ExpenseAssignee").addClass("hidden");
	$("#modalSubmit").attr('value', 'Delete');
	$("#modalSelect").empty();
	$("#modalSelect").removeClass("hidden");
	$("#modalSubmit").off();
	for (index in store.expenses){
		$("#modalSelect").append(
			"<option value='"+store.expenses[index].id+"'>"+store.expenses[index].name+"</option>")
	}
	$("#modalSubmit").click(function(event){
		event.preventDefault();
		var e = document.getElementById("modalSelect");
		var selected = e.options[e.selectedIndex].value;
		console.log(selected);
		deleteANewExpense(selected);
		getAndDisplayExpenses();
		$("#modalSubmit").off();
		$(".modal").addClass("hidden");

	})

	var span = document.getElementsByClassName("close")[0];
	span.onclick = function() {
	   $(".modal").toggleClass("hidden");
	   $("#ExpenseAmount").removeClass("hidden");
	   $("#ExpenseAmountText").removeClass("hidden");
	}
	window.onclick = function(event) {
	    if (event.target == modal) {
	        $(".modal").toggleClass("hidden");
	        $("#ExpenseAmount").removeClass("hidden");
	        $("#ExpenseAmountText").removeClass("hidden");
	    }
	}
})

$(function(){ //make sure always pulls the initial db
	getAndDisplayExpenses();
	//getAndOrderTotals();
});
