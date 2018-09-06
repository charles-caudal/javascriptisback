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

	getBooksFromApi(displayTable);
})();

function getBooksFromApi(callbackFunction) {
	var xhttp = new XMLHttpRequest();

	xhttp.open("GET", "https://api.scorelooker.com/books", true);

	xhttp.onload = function() {
	    if (this.readyState == 4 && this.status == 200) {
	    	var parsedResponse = JSON.parse(this.responseText);
	    	
	    	if (JSON.parse(localStorage.getItem('apiBooks')).length == 0) {
    			localStorage.setItem("apiBooks",  JSON.stringify(parsedResponse)); 
	    	}

    		callbackFunction();   	
	    }
	};

	

	xhttp.send();
}

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

function displayTable() {
	// Get the parent table
	var table = document.getElementById("myTable");

	// Delete the existing table content
	table.innerHTML = '<tr><th>Titre</th><th>Auteur</th><th>ISBN</th><th>Delete</th></tr>'

	// Get API books from local storage
	// var allApiBooks = JSON.parse(localStorage.getItem('apiBooks'));
	buildTableLine(table, 'apiBooks');

	// Get Custom books from local storage
	// var allCustomBooks = JSON.parse(localStorage.getItem('customBooks'));
	buildTableLine(table, 'customBooks');
}

function buildTableLine(parentElement, localStorageKey) {
	console.log("Filling the table with data from the following LocalStorage key: " + localStorageKey);

	var arrayOfObjects = JSON.parse(localStorage.getItem(localStorageKey));

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

		var closetd = document.createElement("td");
		var txt = document.createTextNode("\u00D7");
		closetd.appendChild(txt);
		closetd.classList.add("close");
		closetd.setAttribute('data-index', jsonEntryIndex);
		closetd.setAttribute('data-storageKey', localStorageKey);
	
		line.appendChild(closetd);

		// Event listening for the 4th td
		closetd.addEventListener("click", function(){
			var index = this.getAttribute('data-index');
			var key = this.getAttribute('data-storageKey');

			console.log("Index to remove: " + index);
			console.log("LocalStorage key: " + key);

			// Remove the element and update the array in the local storage
			var arrayOfObjects = JSON.parse(localStorage.getItem(key));

			arrayOfObjects.splice(index, 1);

			localStorage.setItem(key,  JSON.stringify(arrayOfObjects));

    		// Refresh the entire table to avoid index issues
    		displayTable()
		});

		parentElement.appendChild(line);
	}
}