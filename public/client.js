

/*var mockApiData = { //eessentially this is going to be my schema for the expenses
=======
var mockApiData = { //eessentially this is going to be my schema for the expenses
>>>>>>> 18c1d54508c156a0b58a5b31e4c3a4ccf3f5fcd0
	"groupExpenses" : [
		{	
			"id": "1111111",
			"name" : "Lunch",
			"expenseAmount" : "$500",
			"assignee" : null
		},
		{
			"id": "222222",
			"name" : "Dinner",
			"expenseAmount" : "$200",
			"assignee" : "Rachel"
		},
		{	
			"id": "3333333",
			"name" : "Bar",
			"expenseAmount" : "$900",
			"assignee" : "Benjy"
		},
		{
			"id": "444444",
			"name" : "Cabs",
			"expenseAmount" : "$50",
			"assignee" : null
		},
	]
};


//since other buttons will requie a modal, I am going to connect only the update all button which should connect to the DB

/*function getAllExpenses(callBack){ //will make this an AJAX call when actually set up API
	setTimeout(function(){
		callBack(mockApiData)
	}, 100);
} */

var heroku_Url = "https://shrouded-bayou-70080.herokuapp.com"


function getAllExpenses(callBack){ 
	$.ajax({
		method: "GET",
		url: heroku_Url + "/expenseTracker",
		success: function (data){
			callBack(data);
		}
	})
}


//MODAL ACTIVITIES:
//from the put button
//function putModal() {
	var modal = document.getElementById('addExpense-modal');
	var btn = document.getElementById("createBtn");
	var span = document.getElementsByClassName("close")[0];

	btn.onclick = function() { //
	    modal.style.display = "block";
	}

	span.onclick = function() {
	    modal.style.display = "none";
	}

	window.onclick = function(event) {
	    if (event.target == modal) {
	        modal.style.display = "none";
	    }
	}
//}
 
function displayExpenses(data){ //takes the info and puts it into the li format I have -- need to double check with schema names
	$(".text-display").empty();
	for (index in data.groupExpenses){
		$(".text-display").append(
			"<li>" + "Expense Name: " + data.groupExpenses[index].name +  
			", Total Amount: "+ data.groupExpenses[index].expenseAmount + 
			",  Assigned to: " + data.groupExpenses[index].assignee +
			"</li>"
			);
	}
}

function getAndDisplayExpenses(){
	getAllExpenses(displayExpenses);
}

$(".update-overall-button").click(function(){ //adding the functionality of the update overall button
	console.log("adding items");
	getAndDisplayExpenses();
});

$(".create-button").click(function(){
	console.log("running the put modal");
	//putModal();
})
