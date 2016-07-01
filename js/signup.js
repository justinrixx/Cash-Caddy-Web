"use strict";

// set onClick listeners
function setClickListeners() {
    $("#btn-sign-up").on('click', createUser);
}

/**
 * Create a user.
 * @return
 */
function createUser() {

    // get the values to check
    var email = $("#email").val();
    var pass1 = $("#password").val();
    var pass2 = $("#password2").val();

    if (email === null || email === "") {
        Materialize.toast('Please enter a valid email address', 4000);
        return false;
    }
    if (pass1 === null || pass1 === "" || pass2 === null || pass2 === "") {
        Materialize.toast('Enter a password in both password boxes', 4000);
        return false;
    }
    if (pass1 !== pass2) {
        Materialize.toast('Passwords do not match', 4000);
        return false;
    }

    // create the user in firebase
    firebase.auth().createUserWithEmailAndPassword(email, pass1).then(function(user) {
        // move on
        window.location.href = "index.html";
    }).catch(function(error) {
        // Handle Error
        Materialize.toast(error.message, 4000);
    });
}