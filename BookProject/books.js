// Ini
(function initialize() {
	// Initializations
	var emptyArray = [];

	// Initialize local storage
	if (localStorage.getItem("customBooks") === null) {
		localStorage.setItem("customBooks", JSON.stringify(emptyArray));
	}

	if (localStorage.getItem("apiBooks") === null) {
		localStorage.setItem("apiBooks", JSON.stringify(emptyArray));
	}

	// Initial Display
	// displayTable(JSON.parse(localStorage.getItem("customBooks")));
})();

(function autoLoadBooksFromApi() {
	var xhttp = new XMLHttpRequest();

	xhttp.open("GET", "https://api.scorelooker.com/books", true);

	xhttp.onload = function() {
	    if (this.readyState == 4 && this.status == 200) {
	    	var parsedResponse = JSON.parse(this.responseText);

	    	localStorage.setItem("apiBooks",  JSON.stringify(parsedResponse));

	    	displayTable();
	    }
	};

	xhttp.send();
})();

function addBook() {
	// Get existing books from local storage
	var existingCustomBooks = JSON.parse(localStorage.getItem('customBooks'));

	// Get the value of the text fields
	var titleValue = document.getElementById("titleEntry").value;
	var authorValue = document.getElementById("authorEntry").value;
	var isbnValue = document.getElementById("isbnEntry").value;

	if (titleValue !== "" && authorValue !== "" && isbnValue !== "") {
		// Build the new book
		var newBook = { "titre" : titleValue, "auteur" : authorValue, "ISBN": isbnValue};

		// Update the list in memory if needed
		existingCustomBooks.push(newBook);
		localStorage.setItem("customBooks",  JSON.stringify(existingCustomBooks));
	}

	// Reset of the fields
	document.getElementById("titleEntry").value = "";
	document.getElementById("authorEntry").value = "";
	document.getElementById("isbnEntry").value = "";

	// Refresh display
	displayTable();
}

function displayTable(arrayOfObjects) {
	// Get the parent table
	var table = document.getElementById("myTable");

	// Delete the existing table content
	table.innerHTML = '<tr><th>Titre</th><th>Auteur</th><th>ISBN</th></tr>'

	// Get API books from local storage
	var allApiBooks = JSON.parse(localStorage.getItem('apiBooks'));
	buildTableLine(table, allApiBooks);

	// Get Custom books from local storage
	var allCustomBooks = JSON.parse(localStorage.getItem('customBooks'));
	buildTableLine(table, allCustomBooks);
}

function buildTableLine(parentElement, arrayOfObjects) {

	for (var jsonEntryIndex in arrayOfObjects) {
		var line = document.createElement("tr");		

		var titretd = document.createElement("td");
		titretd.appendChild(document.createTextNode(arrayOfObjects[jsonEntryIndex].titre));
		line.appendChild(titretd);

		var auteurtd = document.createElement("td");
		auteurtd.appendChild(document.createTextNode(arrayOfObjects[jsonEntryIndex].auteur));
		line.appendChild(auteurtd);

		var isbntd = document.createElement("td");
		isbntd.appendChild(document.createTextNode(arrayOfObjects[jsonEntryIndex].ISBN));
		line.appendChild(isbntd);

		parentElement.appendChild(line);
	}
}