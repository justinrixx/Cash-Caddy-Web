"use strict";

/**
* Logs the user out
*/
function logout() {
    firebase.auth().signOut().then(function() {
    	window.location.href = "login.html";
    }, function(error) {
    	console.log("Error logging out");
    });
}

document.getElementById("logout").addEventListener("click", logout);
