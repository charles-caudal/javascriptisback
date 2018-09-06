// Auto-called function
(function initialize() {
	// Initializations
	let emptyHash = {};

	// Initialize local storage
	if (localStorage.getItem("allBooks") === null) {
		localStorage.setItem("allBooks", JSON.stringify(emptyHash));
	}

	getBooksFromApi(displayTable);
})();

function getBooksFromApi(callbackFunction) {
	var xhttp = new XMLHttpRequest();

	xhttp.open("GET", "https://api.scorelooker.com/books", true);

	xhttp.onload = function() {
	    if (this.readyState == 4 && this.status == 200) {
	    	let parsedResponse = JSON.parse(this.responseText);
	    	let booksHash = JSON.parse(localStorage.getItem('allBooks'));

	    	if (Object.keys(booksHash).length == 0) {
	    		for (let index in parsedResponse) {
	    			if (!(parsedResponse[index].ISBN in booksHash)) {
						booksHash[parsedResponse[index].ISBN] = parsedResponse[index];
					}
				}
    			localStorage.setItem("allBooks",  JSON.stringify(booksHash)); 
	    	}
    		callbackFunction();   	
	    }
	};	

	xhttp.send();
}

function addBook() {
	// Get existing books from local storage
	let existingBooks = JSON.parse(localStorage.getItem('allBooks'));

	// Get the value of the text fields
	let titleValue = document.getElementById("titleEntry").value;
	let authorValue = document.getElementById("authorEntry").value;
	let isbnValue = document.getElementById("isbnEntry").value;

	if (titleValue !== "" && authorValue !== "" && isbnValue !== "") {
		// Build the new book
		let newBook = { "titre" : titleValue, "auteur" : authorValue, "ISBN": isbnValue};

		// Update the hash in LocalStorage if needed
		if (!(newBook.ISBN in existingBooks)) {
			existingBooks[newBook.ISBN] = newBook;
			localStorage.setItem("allBooks",  JSON.stringify(existingBooks));

			//Display the message about a book being added to the list
			showHiddenDiv(hiddenDivAdd);
		}
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
	let table = document.getElementById("myTable");

	// Delete the existing table content
	table.innerHTML = '<tr><th>Titre</th><th>Auteur</th><th>ISBN</th><th>Delete</th></tr>'

	// Get all the books from local storage
	buildTableLine(table, 'allBooks');
}

function buildTableLine(parentElement, localStorageKey) {
	console.log("Filling the table with data from the LocalStorage");

	let hashOfObjects = JSON.parse(localStorage.getItem(localStorageKey));

	for (let objectIndexKey in hashOfObjects) {
		let line = document.createElement("tr");		

		let titretd = document.createElement("td");
		titretd.appendChild(document.createTextNode(hashOfObjects[objectIndexKey].titre));
		line.appendChild(titretd);

		let auteurtd = document.createElement("td");
		auteurtd.appendChild(document.createTextNode(hashOfObjects[objectIndexKey].auteur));
		line.appendChild(auteurtd);

		let isbntd = document.createElement("td");
		isbntd.appendChild(document.createTextNode(hashOfObjects[objectIndexKey].ISBN));
		line.appendChild(isbntd);

		let closetd = document.createElement("td");
		let txt = document.createTextNode("\u00D7");
		closetd.appendChild(txt);
		closetd.classList.add("close");
		closetd.setAttribute('data-index', objectIndexKey);
		closetd.setAttribute('data-storageKey', localStorageKey);
	
		line.appendChild(closetd);

		// Event listening for the 4th td
		closetd.addEventListener("click", function(){
			let index = this.getAttribute('data-index');
			let key = this.getAttribute('data-storageKey');

			// Remove the element from the displayed table
			this.parentNode.remove();

			console.log("Index to remove: " + index);
			console.log("LocalStorage key: " + key);

			// Remove the element of the hash and update the local storage
			let existingHashContent = JSON.parse(localStorage.getItem(key));
			delete existingHashContent[index];
			localStorage.setItem(key,  JSON.stringify(existingHashContent));
			
			//Display the message about a book being removed from the list
			showHiddenDiv(hiddenDivRemove);
		});

		parentElement.appendChild(line);
	}
}

//hidden Div variables
var hiddenDivAdd = document.getElementById("hiddenDivAdd");
var hiddenDivRemove = document.getElementById("hiddenDivRemove");

//this function shows the hidden message for 2 seconds, then hides it again
function showHiddenDiv(hiddenDiv){
	hiddenDiv.style.display = "";
	setTimeout(function(){
		hiddenDiv.style.display = "none";
	},2000)
}