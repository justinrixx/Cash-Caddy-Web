"use strict";

/**
 * If the get parameter is set, that means we're editing.
 * If not, then we're creating a new category.
 */
var category = parseGet("category");
var edit = (category !== "Not found");

/**
 * LoadPage
 * Loads data from FireBase, then builds the page
 */
function loadPage() {
    if (edit) {

        // get the category from the database
        firebase.database().ref("categories/" + firebase.auth().currentUser.uid + "/" + category).on("value", function (snapshot) {

            $("#category_name").val(snapshot.val().name);
            $("#amount").val((snapshot.val().amount / 100.0).toFixed(2));
            $("#next_refresh").val(snapshot.val().lastRefresh);

        });

        // set the header and title
        $("#heading").val("Edit a Caterory");
        document.title = "Edit Category";

        // add the delete button
        $("#buttons").append('<button class="btn waves-effect waves-light" type="button" id="delete">Delete<i class="material-icons right">delete</i></button>');
        $("#delete").on("click", deleteCategory);
    }

    // add a click listener to the submit button
    $("#submit").on("click", submit);
}

/**
 * Submit
 * Submits the transaction to be updated in the database
 */
function submit() {

    // check that everything is filled out
    if (!filledOut()) {
        return;
    }

    // construct the object
    var obj = {};
    obj['amount'] = Math.floor($("#amount").val() * 100);
    obj['balance'] = obj['amount'];
    obj['lastRefresh'] = $("#next_refresh").val();
    obj['refreshCode'] = $("#refresh_code").val();
    obj['name'] = $("#category_name").val();

    if (edit) {
        firebase.database().ref("categories/" + firebase.auth().currentUser.uid + "/" + category).set(obj, function () {
            window.location.href = "edit-categories.html";
        });
    } else {
        firebase.database().ref("categories/" + firebase.auth().currentUser.uid).push(obj, function () {
            window.location.href = "edit-categories.html";
        });
    }
}

/**
 * DeleteCategory
 * Deletes the category denoted by id from the database
 */
function deleteCategory() {
    firebase.database().ref("categories/" + firebase.auth().currentUser.uid + "/" + category).set(null, function () {
        window.location.href = "edit-categories.html";
    });
}

/**
 * FilledOut
 * Determines whether or not all the data is filled out and valid
 */
function filledOut() {
    var amount = $("#amount").val();
    var date = $("#lastRefresh").val();
    var name = $("#category_name").val();
    var returnValue = true;

    if (amount === null || amount === "" || amount < 0.0) {
        Materialize.toast("Please enter a valid amount", 4000);
        returnValue = false;
    }

    if (date === null || date === "") {
        Materialize.toast("Please enter a valid date", 4000);
        returnValue = false;
    }

    if (name === null || name === "") {
        Materialize.toast("Please enter a name for this category");
        returnValue = false;
    }

    return returnValue;
}