const urlBase = 'http://cop4331-2022-group6.com/LAMPAPI';
const extension = 'php';

let userId = 0;
let firstName = "";
let lastName = "";

function doLogin()
{
	userId = 0;
	firstName = "";
	lastName = "";
	
	let login = document.getElementById("loginName").value;
	let password = document.getElementById("loginPassword").value;
	var hash = md5( password );
	
	document.getElementById("loginResult").innerHTML = "";

	//let tmp = {Login:login,Password:password};
	var tmp = {Login:login,Password:hash};
	let jsonPayload = JSON.stringify( tmp );
	
	let url = urlBase + '/Login.' + extension;

	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				let jsonObject = JSON.parse( xhr.responseText );
				userId = jsonObject.UserID;
		
				if( userId < 1 )
				{		
					document.getElementById("loginResult").innerHTML = "User/Password combination incorrect";
					return;
				}
		
				firstName = jsonObject.firstName;
				lastName = jsonObject.lastName;

				saveCookie();
	
				window.location.href = "main.html";
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("loginResult").innerHTML = err.message;
	}

}

function doRegister()
{
    firstName = document.getElementById("firstName").value;
    lastName = document.getElementById("lastName").value;
    
    let login = document.getElementById("loginName").value;
    let password = document.getElementById("loginPassword").value;
	var hash = md5( password );
    
    document.getElementById("loginResult").innerHTML = "";

    let tmp = {FirstName:firstName,LastName:lastName,Login:login,Password:hash};
	//var tmp = {login:login,password:hash};
    let jsonPayload = JSON.stringify( tmp );
    
    let url = urlBase + '/Register.' + extension;

    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    try
    {
        xhr.onreadystatechange = function() 
        {
            if (this.readyState == 4 && this.status == 200) 
            {
                let jsonObject = JSON.parse( xhr.responseText );
                let error = jsonObject.error;
        
                if( error !== "" )
                {        
                    document.getElementById("loginResult").innerHTML = "Connection Error";
                    return;
                }
    
                window.location.href = "index.html";
            }
        };
        xhr.send(jsonPayload);
    }
    catch(err)
    {
        document.getElementById("loginResult").innerHTML = err.message;
    }

}

function saveCookie()
{
	let minutes = 20;
	let date = new Date();
	date.setTime(date.getTime()+(minutes*60*1000));	
	document.cookie = "firstName=" + firstName + ",lastName=" + lastName + ",userId=" + userId + ";expires=" + date.toGMTString();
}

function readCookie()
{
	userId = -1;
	let data = document.cookie;
	let splits = data.split(",");
	for(var i = 0; i < splits.length; i++) 
	{
		let thisOne = splits[i].trim();
		let tokens = thisOne.split("=");
		if( tokens[0] == "firstName" )
		{
			firstName = tokens[1];
		}
		else if( tokens[0] == "lastName" )
		{
			lastName = tokens[1];
		}
		else if( tokens[0] == "userId" )
		{
			userId = parseInt( tokens[1].trim() );
		}
	}
	
	if( userId < 0 )
	{
		window.location.href = "index.html";
	}
	else
	{
		//document.getElementById("userName").innerHTML = "Logged in as " + firstName + " " + lastName;
	}
}

function doLogout()
{
	userId = 0;
	firstName = "";
	lastName = "";
	document.cookie = "firstName= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
	window.location.href = "index.html";
}

function doSearch()
{
	let srch = document.getElementById("searchText").value;
	readCookie();
	console.log(userId);
	document.getElementById("searchResult").innerHTML = "";

	let tmp = {search:srch,UserID:userId};
	let jsonPayload = JSON.stringify( tmp );


	let url = urlBase + '/SearchContacts.' + extension;
	
	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			//try
			//{
				if (this.readyState == 4 && this.status == 200) 
				{
					document.getElementById("searchResult").innerHTML = "";
					let jsonObject = JSON.parse( xhr.responseText );
					
					const contactsTable = document.getElementById("contactsTable");
					contactsTable.innerHTML =  "";

					for( let i=0; i<jsonObject.results.length; i++ )
					{
						const item = document.createElement("tr");
						const fnameCOL = document.createElement("td");
						const lnameCOL = document.createElement("td");
						const phoneCOL = document.createElement("td");
						const emailCOL = document.createElement("td");
						const editCOL = document.createElement("td");
						const delCOL = document.createElement("td");

						fnameCOL.innerHTML = jsonObject.results[i].FirstName;
						lnameCOL.innerHTML = jsonObject.results[i].LastName;
						phoneCOL.innerHTML = jsonObject.results[i].PhoneNumber;
						emailCOL.innerHTML = jsonObject.results[i].Email;

						item.appendChild(fnameCOL);
						item.appendChild(lnameCOL);
						item.appendChild(phoneCOL);
						item.appendChild(emailCOL);

						const edit = document.createElement("a");
						edit.innerHTML = "Edit";
						edit.classList.add("btn");
						edit.classList.add("btn-primary");
						//edit.classList.add("mt-3");
						edit.setAttribute("name", jsonObject.results[i].ID)

						edit.addEventListener('click', function() {
							var params = new URLSearchParams();
  							params.append("contact", JSON.stringify(jsonObject.results[i]));

							window.location.href = "edit.html?" + params.toString();
						});

						editCOL.appendChild(edit);
						item.appendChild(editCOL);

						const del = document.createElement("a");
						del.innerHTML = "Delete";
						del.classList.add("btn");
						del.classList.add("btn-outline-danger");
						//del.classList.add("mt-3");
						del.setAttribute("name", jsonObject.results[i].ID)

						del.addEventListener('click', function() {
							if (confirm('Are you sure you would like to remove this contact? It can not be undone.'))
							{
								doDelete(jsonObject.results[i].ID);
							}
						});

						delCOL.appendChild(del);
						item.appendChild(delCOL);

						contactsTable.appendChild(item);
					}
				
				}
			//}
			//catch(err)
			//{
			//	document.getElementById("searchResult").innerHTML = err.message;
			//}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("searchResult").innerHTML = err.message;
	}
	
}

function doDelete(id)
{
	let tmp = {ID:id};
	let jsonPayload = JSON.stringify( tmp );

	let url = urlBase + '/Delete.' + extension;
	
	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				doSearch();
				document.getElementById("searchResult").innerHTML = "";
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("searchResult").innerHTML = err.message;
	}
	
}

function addContact()
{
    readCookie();

    firstName = document.getElementById("firstName").value;
    lastName = document.getElementById("lastName").value;
    
    let email = document.getElementById("email").value;
    let phoneNumber = document.getElementById("phone number").value;
    
    document.getElementById("addResult").innerHTML = "";

    let tmp = {FirstName:firstName,LastName:lastName,PhoneNumber:phoneNumber,Email:email,UserID:userId};
    let jsonPayload = JSON.stringify( tmp );
    
    let url = urlBase + '/AddContact.' + extension;

    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    try
    {
        xhr.onreadystatechange = function() 
        {
            if (this.readyState == 4 && this.status == 200) 
            {
                let jsonObject = JSON.parse( xhr.responseText );
                let error = jsonObject.error;
        
                if( error !== "" )
                {        
                    document.getElementById("addResult").innerHTML = "Connection Error";
                    return;
                }
    
                window.location.href = "main.html";
            }
        };
        xhr.send(jsonPayload);
    }
    catch(err)
    {
        document.getElementById("addResult").innerHTML = err.message;
    }

}

function editContact()
{
    readCookie();

    firstName = document.getElementById("firstName").value;
    lastName = document.getElementById("lastName").value;
    
    let email = document.getElementById("email").value;
    let phoneNumber = document.getElementById("phoneNumber").value;
	let id = document.getElementById("contactID").value;
    
    document.getElementById("updateResult").innerHTML = "";

    let tmp = {FirstName:firstName,LastName:lastName,PhoneNumber:phoneNumber,Email:email,UserID:userId,ID:id};
    let jsonPayload = JSON.stringify( tmp );
    
    let url = urlBase + '/UpdateContact.' + extension;

    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    try
    {
        xhr.onreadystatechange = function() 
        {
            if (this.readyState == 4 && this.status == 200) 
            {
                let jsonObject = JSON.parse( xhr.responseText );
                let error = jsonObject.error;
        
                if( error !== "" )
                {        
                    document.getElementById("updateResult").innerHTML = "Connection Error";
                    return;
                }
    
                window.location.href = "main.html";
            }
        };
        xhr.send(jsonPayload);
    }
    catch(err)
    {
        document.getElementById("updateResult").innerHTML = err.message;
    }

}