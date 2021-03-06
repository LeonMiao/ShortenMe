function initXHR(x, value) {
	console.log(x); 
	if (x == 'convert') {
		document.getElementById("convert").style.display = "block";
		document.getElementById("shortUrl").style.display = "none";
		document.getElementById("accountList").style.display = "none";
		document.getElementById("urlList").style.display = "none";
		document.getElementById("login").style.display = "none";
		document.getElementById("createAccount").style.display = "none";
	}
	else if (x == 'shortUrl') {
		generateShortUrl(value);
		document.getElementById("convert").style.display = "none";
		document.getElementById("shortUrl").style.display = "block";
		document.getElementById("accountList").style.display = "none";
		document.getElementById("urlList").style.display = "none";
		document.getElementById("login").style.display = "none";
		document.getElementById("createAccount").style.display = "none";
	}
	else if (x == 'accountList') {
		//		retrieveActiveListsFromServer('/app/json/lists.json');
		retrieveActiveAccountsFromServer('/app/account/', 'accountList');
		document.getElementById("convert").style.display = "none";
		document.getElementById("shortUrl").style.display = "none";
		document.getElementById("accountList").style.display = "block";
		document.getElementById("urlList").style.display = "none";
		document.getElementById("login").style.display = "none";
		document.getElementById("createAccount").style.display = "none";
	}
	else if (x == 'urlList') {
		retrieveActiveAccountsFromServer('/app/account/' + value, 'urlList');
		document.getElementById("convert").style.display = "none";
		document.getElementById("shortUrl").style.display = "none";
		document.getElementById("accountList").style.display = "none";
		document.getElementById("urlList").style.display = "block";
		document.getElementById("login").style.display = "none";
		document.getElementById("createAccount").style.display = "none";
	}
	else if (x == 'login'){
		document.getElementById("convert").style.display = "none";
		document.getElementById("shortUrl").style.display = "none";
		document.getElementById("accountList").style.display = "none";
		document.getElementById("urlList").style.display = "none";
		document.getElementById("login").style.display = "block";
		document.getElementById("createAccount").style.display = "none";
	}
	else if (x == 'createAccount'){
		document.getElementById("convert").style.display = "none";
		document.getElementById("shortUrl").style.display = "none";
		document.getElementById("accountList").style.display = "none";
		document.getElementById("urlList").style.display = "none";
		document.getElementById("login").style.display = "none";
		document.getElementById("createAccount").style.display = "block";
	}
	else {
		document.getElementById("convert").style.display = "block";
		document.getElementById("shortUrl").style.display = "none";
		document.getElementById("accountList").style.display = "none";
		document.getElementById("urlList").style.display = "none";
		document.getElementById("login").style.display = "none";
		document.getElementById("createAccount").style.display = "none";
	}
}

function retrieveActiveAccountsFromServer(url, operation) {
	var xmlhttp = new XMLHttpRequest();

	xmlhttp.onreadystatechange = function() {
		if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
			var returnValues = JSON.parse(xmlhttp.responseText);
			if (operation == "accountList") {
				populateAccountsView('accountList', returnValues);
			}
			else if (operation == "urlList") {
				populateListItems('urls', returnValues);				
			}
		}
	}
	xmlhttp.open("GET", url, true);
	xmlhttp.send();
}

//DOM based function
function populateAccountsView(elementId, accounts) {
	var element = document.getElementById(elementId);
	var newElement = "<h3 class=\"panel-heading\">Active Accounts</h3>";

	for (var i = 0; i < accounts.length; i++) {
		newElement += "<div class=\"panel panel-default\">";
		// newElement += "<h4 class=\"panel-heading\"><a href=\"javascript:initXHR('urlList'," +  (i+1) + ")\">" + (i + 1) + ". " + accounts[i].userName + "</a></h4>";
		newElement += "<h4 class=\"panel-heading\">Hello, <a href=\"javascript:initXHR('urlList'," +  (i+1) + ")\">" + accounts[i].userName + "</a></h4>";

		// newElement += "<h4 class=\"panel-heading\">Hello, " + accounts[i].userName + "</h4>";
		newElement += "<div class=\"panel-body\">";
		newElement += "<p> First Name: " + accounts[i].fName  + "</p>";
		newElement += "<p> Middle Name: " + accounts[i].mName  + "</p>";
		newElement += "<p> Last Name: " + accounts[i].lName  + "</p>";
		newElement += "<p> Email Address: " + accounts[i].emailAddr  + "</p>";
		newElement += "<p> Phone Number: " + accounts[i].phoneNum  + "</p>";
		newElement += "<p> Account Type: " + accounts[i].userType  + "</p>";
		newElement += "</div>";
		newElement += "<table class=\"table\" style=\"font-size:10pt;\">";
		newElement += "<tbody>";
		newElement += "<tr>";
		newElement += "<td>Member since: <span>" + accounts[i].createDate + "</span></td>";
		// newElement += "<td align=\"right\">Membership due: <span class=\"badge\">" + accounts[i].expireDate + "</span></td>";
		newElement += "</tr>";
		newElement += "</tbody>";
		newElement += "</table>";
		newElement += "</div>";
	}

	element.innerHTML = newElement;
}

// //DOM based function
// function populateListItems2(elementId, list) {
// 	var listItems = list.tasks;
// 	var element = document.getElementById(elementId);
// 	var newElement = "";

// 	for (var i = 0; i < listItems.length; i++) {
// 		newElement += "<tr>";
// 		newElement += "<td>" + listItems[i].description + "</td>";
// 		newElement += "<td><span class=\"badge\">" + listItems[i].shared + "</span></td>";
// 		newElement += "<td>";
// 		newElement += "<div class=\"input-group\">";
// 		newElement += "<span class=\"input-group-addon\" style=\"border-style:none;\">";
// 		newElement += "<input type=\"checkbox\">";
// 		newElement += "</span>";
// 		newElement += "</div>";
// 		newElement += "</td>";
// 		newElement += "</tr>";
// 	}

// 	element.innerHTML = newElement;	
// }

//JQuery based function
function populateListItems(elementId, account) {
	var listItems = account.urls;
	var newElement = "";

	for (var i = 0; i < listItems.length; i++) {
		newElement += "<tr>";
		newElement += "<td>" + listItems[i].shortUrl + "</td>";
		newElement += "<td>" + listItems[i].longUrl + "</td>";
		newElement += "<td>" + listItems[i].expirationDate + "</td>";
		// newElement += "<td><a href="#"><span class="glyphicon glyphicon-trash"></span></a></td>";
		// newElement += "<td><a href="#"><span class="glyphicon glyphicon-list-alt"></span></td>";		
		// newElement += "<td>";
		// newElement += "<div class=\"input-group\">";
		// newElement += "<span class=\"input-group-addon\" style=\"border-style:none;\">";
		// newElement += "<input type=\"checkbox\">";
		// newElement += "</span>";
		// newElement += "</div>";
		// newElement += "</td>";
		newElement += "</tr>";
	}
	$("#" + elementId).append(newElement);
}

function generateShortUrl(longUrl) {
	var newElement = "<div class=\"row\" style=\"margin-top: 50px\">"
  	newElement += "<div class=\"col-md-6 col-md-offset-3\">"
	newElement += "<p>Old Url: www.longexample.com/asdf/dst67894523456687634/sSERTYRERTYIUYTJYTUYTR</p>"
    newElement += "<div class=\"input-group\">"
    newElement += "<input type=\"text\" class=\"form-control\" value=\"www.shortenme.com/rn5f\">"
	newElement += "<span class=\"input-group-btn\">"
	newElement += "<button class=\"btn btn-secondary\" type=\"button\">Copy</button>"
	newElement += "</span"
	newElement += "</div>"
    newElement += "<a class=\"btn btn-primary\" href=\"javascript:initXHR('convert', null)\" role=\"button\">Get Another!</a>"
	newElement += "</div>"
	newElement += "</div>"
	var element = document.getElementById('shortUrl');
	element.innerHTML = newElement;
}