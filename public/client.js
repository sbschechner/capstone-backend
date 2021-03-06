


var store = {
	expenses : []
}

function getAllExpenses(callBack){ 
	$.ajax({
		type: "GET",
		url: "/expenseTracker",
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
		url: "/expenseTracker",
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
		url:"/expenseTracker/" + expenseID,
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
		url: "/expenseTracker/" + expenseID,
		contentType: 'application/json',
		data: JSON.stringify(updatedField),
		success: function(){
			alert("Expense Updated");
		}
	})
}
 
function displayExpenses(data){ //takes the info and puts it into the li format I have -- need to double check with schema names
	$(".text-display").empty();
	$(".text-display").append(
				"<tr>" + "<th id='table-input-header-name'> Name</th>" + 
				"<th id='table-input-header-amount'> Amount </th>" +
				"<th id='table-input-header-person'>Who Paid</th>" + 
				"</tr>"+
				"<tr> </tr>");
	for (index in data.expenses){
		$(".text-display").append(
			"<tr>" + "<td id='table-input-name'>" + data.expenses[index].name + "</td>" +
			"<td id='table-input-amount'> $"+ data.expenses[index].amount +  "</td>" +"<td id='table-input-person'>"
			 + data.expenses[index].assignee + "</td>"+
			"</tr>"
			);
	}
}

function getAndDisplayExpenses(){
	getAllExpenses(displayExpenses);
}


function createTotals(){
	var	expensesList = [];
			
	for (index in store.expenses){
		if (expensesList.includes(store.expenses[index].assignee)){
			var indexLocation = expensesList.indexOf(store.expenses[index].assignee)
			expensesList[indexLocation +1] = store.expenses[index].amount + expensesList[indexLocation+1]
		}	

		if (!(expensesList.includes(store.expenses[index].assignee))){
			expensesList.push(store.expenses[index].assignee);
			expensesList.push(store.expenses[index].amount);
		}

	}
	console.log("printing the totals", expensesList);
	$(".totals-display").empty();
	for (var i = 0; i<expensesList.length; i=i+2){
		$(".totals-display").append(
		"<li>" + expensesList[i] + " : $ " + expensesList[i+1] + "</li>"
			)}
	}

function getAndOrderTotals(){
	getAllExpenses(createTotals);
}

$("#signUpBut").click(function(){
	$(".signIn").toggleClass("hidden");
})

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
		var nameLower = $("#ExpenseName").val().trim();
		var name = nameLower.charAt(0).toUpperCase() + nameLower.slice(1);
		var amount = $("#ExpenseAmount").val().trim();
		var assigneeLower = $("#ExpenseAssignee").val().trim() || "Not Yet Assigned";
		var assignee = assigneeLower.charAt(0).toUpperCase() + assigneeLower.slice(1);
		if (typeof Number.parseFloat(amount)  === "number") {
		  console.log("the if statement works");
		postANewExpense(name, amount, assignee);
		getAndDisplayExpenses();
		getAndOrderTotals();
		}
		else{
			alert("Numbers only please");
		}
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
		var assigneeLower = $("#ExpenseAssignee").val().trim();
		var assignee = assigneeLower.charAt(0).toUpperCase() + assigneeLower.slice(1);
		putANewRequest(arrayNumber, amount, assignee, selected);
		getAndDisplayExpenses();
		getAndOrderTotals();
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
		getAndOrderTotals()
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
		getAndOrderTotals();
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
	getAndOrderTotals();
});
