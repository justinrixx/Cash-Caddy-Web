"use strict";

// set onClick listeners
function setClickListeners() {
    $("#btn-sign-in").on('click', signIn);
}

/**
 * Sign the user in
 */
function signIn() {

    // get the values to check
    var email = $("#email").val();
    var passw = $("#password").val();

    // check if the user is already logged in
    if (firebase.auth().currentUser && (email === null || email === "")) {
        window.location.href = "home.html";
        return;
    }

    // check for a valid email
    if (email === null || email === "") {
        Materialize.toast('Please enter a valid email address', 4000);
        return false;
    }
    if (passw === null || passw === "") {
        Materialize.toast('Please enter a valid password', 4000);
        return false;
    }

    // log the user in
    firebase.auth().signInWithEmailAndPassword(email, passw).then(function(user) {
        // move on
        window.location.href = "home.html";
    }).catch(function(error) {
        // Handle Errors here.
        Materialize.toast('There was a problem logging you on.');
    });
}