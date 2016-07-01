"use strict";

/**
 * EnsureLogin
 * Make sure the user is logged in. Redirect if not.
 */
function ensureLogin() {
    var user = firebase.auth().currentUser();

    if (user === null) {
        window.location.href = "login.html";
    }
}

ensureLogin();