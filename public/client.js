
//var heroku_Url = "https://shrouded-bayou-70080.herokuapp.com"

var store = {
	expenses : []
}

var local = "http://localhost:8080"

function getAllExpenses(callBack){ 
	$.ajax({
		type: "GET",
		//url: heroku_Url + "/expenseTracker",
		url: local + "/expenseTracker",
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
		//url: heroku_Url + "/expenseTracker",
		url: local + "/expenseTracker",
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
		//url: heroku_Url + "/expenseTracker",
		url: local + "/expenseTracker/" + expenseID,
		success: function(){
			alert("Expense Deleted");
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
function getAndOrderTotals(){
	getAllExpenses(createTotals);

function createTotals(){
	var totals = {
	alreadyMarked : null, 
	}
	for (index in store.expenses){
		if (store.expenses[index].name in totals)
			totals.store.expenses[index].name = totals.store.expenses[index]./// NEED TO WORK THROUGH
		if(!(store.expenses[index.name]))
	}


	$(".totals-display").append
}
*/

//can have a function called get totals wihch is get and display above but passes a total function instead of display

$(".update-overall-button").click(function(){ //adding the functionality of the update overall button
	console.log("adding items");
	getAndDisplayExpenses();
});


//MODAL ACTIVITIES:
//how do i change the value of submit text to say update instead of submit? use the attr feature
//how do i get the text from the form?! for the post request....when hit submit, these values get passed to that post function
//prob will need validation in terms of type of string for the create / post response


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
	$(".modal-header").text("Please enter updated fields");
	$("#modalSubmit").attr('value', 'Update Expenses');
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
	var optionMarkup = "";
	$("#modalSelect").empty();
	$("#modalSelect").removeClass("hidden");
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

