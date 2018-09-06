// Init
var apiCounter = 0;
var customCounter = 0;

(function initialize() {
	// Initializations
	let emptyHash = {};

	// Initialize local storage
	if (localStorage.getItem("customBooks") === null) {
		localStorage.setItem("customBooks", JSON.stringify(emptyHash));
	}

	if (localStorage.getItem("apiBooks") === null) {
		localStorage.setItem("apiBooks", JSON.stringify(emptyHash));
	}

	getBooksFromApi(displayTable);
})();

function getBooksFromApi(callbackFunction) {
	var xhttp = new XMLHttpRequest();

	xhttp.open("GET", "https://api.scorelooker.com/books", true);

	xhttp.onload = function() {
	    if (this.readyState == 4 && this.status == 200) {
	    	let parsedResponse = JSON.parse(this.responseText);
	    	let apiBooksHash = JSON.parse(localStorage.getItem('apiBooks'));

	    	if (Object.keys(apiBooksHash).length == 0) {
	    		for (let index in parsedResponse) {
					console.log(parsedResponse[index]);
					apiBooksHash[parsedResponse[index].ISBN] = parsedResponse[index];
				}
    			localStorage.setItem("apiBooks",  JSON.stringify(apiBooksHash)); 
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

		// Update the hash in LocalStorage if needed
		existingCustomBooks[newBook.ISBN] = newBook;
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

	var hashOfObjects = JSON.parse(localStorage.getItem(localStorageKey));

	for (var jsonEntryIndex in hashOfObjects) {
		var line = document.createElement("tr");		

		var titretd = document.createElement("td");
		titretd.appendChild(document.createTextNode(hashOfObjects[jsonEntryIndex].titre));
		line.appendChild(titretd);

		var auteurtd = document.createElement("td");
		auteurtd.appendChild(document.createTextNode(hashOfObjects[jsonEntryIndex].auteur));
		line.appendChild(auteurtd);

		var isbntd = document.createElement("td");
		isbntd.appendChild(document.createTextNode(hashOfObjects[jsonEntryIndex].ISBN));
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

			// Remove the element from the displayed table
			this.parentNode.remove();

			console.log("Index to remove: " + index);
			console.log("LocalStorage key: " + key);

			// Remove the element of the hash and update the local storage
			var existingHashContent = JSON.parse(localStorage.getItem(key));
			delete existingHashContent[index];
			localStorage.setItem(key,  JSON.stringify(existingHashContent));
		});

		parentElement.appendChild(line);
	}
}