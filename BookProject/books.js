// Ini
(function initialize() {
	// Initialize local storage
	if (localStorage.getItem("customBooks") === null) {
		var emptyArray = [];
		localStorage.setItem("customBooks", JSON.stringify(emptyArray));
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

	    	displayTable(parsedResponse);
	    }
	};

	xhttp.send();
})();

function displayTable(arrayOfObjects) {

	var table = document.getElementById("myTable");

	for (var jsonEntryIndex in arrayOfObjects) {
		var line = document.createElement("tr");
		table.appendChild(line);

		var titretd = document.createElement("td");
		titretd.appendChild(document.createTextNode(arrayOfObjects[jsonEntryIndex].titre));
		line.appendChild(titretd);

		var auteurtd = document.createElement("td");
		auteurtd.appendChild(document.createTextNode(arrayOfObjects[jsonEntryIndex].auteur));
		line.appendChild(auteurtd);

		var isbntd = document.createElement("td");
		isbntd.appendChild(document.createTextNode(arrayOfObjects[jsonEntryIndex].ISBN));
		line.appendChild(isbntd);
	}
}