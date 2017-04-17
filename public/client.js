
var mockApiData = { //eessentially this is going to be my schema for the expenses
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
		};
	})


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

