"use strict";

/**
 * If the get parameter is set, that means we're editing.
 * If not, then we're creating a new transaction.
 */
var id = parseGet("id");
var edit = (id !== "Not found");
var category = null;

/**
 * LoadPage
 * Loads data from FireBase, then builds the page
 */
function loadPage() {

    var ref = firebase.database().ref("categories/" + firebase.auth().currentUser.uid);

    // load everything
    ref.once("value", function (snapshot) {

            // the html to append
            var html = "";

            // no categories
            if (snapshot.val() === null) {
                html = '<br /><br /><h5 class="header col s12 light center">You don\'t seem to have any categories at this time.</h5><br /><br /><h6 class="header col s12 light center">Head to the Edit Categories page to get started</h6>';

            } else {

                // header
                html += '<div class="section"><h3 class="header col s12 light center">';
                if (edit) {
                    html += "Edit a Transaction";
                } else {
                    html += "Add a Transaction";
                }
                html += '</h3>';

                // put the form in
                html += '<form><div class="row"><div class="input-field col s6"><select id="category" name="category">';

                // select
                snapshot.forEach(function (categorySnapshot) {
                    // put in an option for each category the user owns
                    html += '<option value="' + categorySnapshot.key + '">' + escapeHtml(categorySnapshot.val().name) + '</option>';
                });

                // close the select
                html += '</select><label for="category">Category</label></div>';

                // amount
                html += '<div class="input-field col s6"><input id="amount" name="amount" type="number" min="0.01" step="0.01"';
                html += '><labelfor="amount">Amount</label></div></div>';

                // date
                html += '<div class="row"><div class="col s6"><label for="transaction_date">Transaction Date</label><input id="transaction_date" name="transaction_date" type="date" class="datepicker"></div>';

                // comments
                html += '<div class="input-field col s6"><textarea id="comments" name="comments" class="materialize-textarea"></textarea><label for="comments">Comments (Optional)</label></div></div>';

                // submit button
                html += '<div class="row"><button class="btn waves-effect waves-light" type="button" id="submit">Submit<i class="material-icons right">send</i></button>';

                // delete button
                if (edit) {
                    html += ' <button class="btn waves-effect waves-light" type="button" id="delete">Delete<i class="material-icons right">delete</i></button>';
                }

                // close the form
                html += '</div></form></div>';
            }

            $("#data-frame").html(html);

            // if edit, set the data
            if (edit) {

                // change the title
                document.title = "Edit a Transaction";

                var tRef = firebase.database().ref("transactions/" + firebase.auth().currentUser.uid + "/" + id);
                tRef.once("value", function (snapshot) {

                        $("#amount").val((snapshot.val().amount / 100.0).toFixed(2));
                        $("#transaction_date").val(snapshot.val().date);
                        $("#comments").html(snapshot.val().comment);

                        // save this in order to update the balance later
                        category = snapshot.val().category;

                    }
                    , function (errorObject) {
                        console.log("Reading the transaction failed: " + errorObject.code);
                    });

                // set listener
                $("#delete").on("click", deleteTransaction);

            } else {
                // set the calendar to today for convenience
                document.getElementById("transaction_date").valueAsDate = new Date();
            }

            // initialize the select
            $('#category').material_select();
            // set listeners
            $("#submit").on("click", submit);

        }
        , function (errorObject) {
            console.log("The read failed: " + errorObject.code);
        });
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
    obj['category'] = $("#category").val();
    obj['amount'] = Math.floor($("#amount").val() * 100);
    obj['date'] = $("#transaction_date").val();
    obj['comment'] = $("#comments").val();


    if (edit) {
        firebase.database().ref("transactions/" + firebase.auth().currentUser.uid + "/" + id).set(obj, function () {
            if ($("#category").val() === category) {
                updateBalance(category, true);
            } else {
                // update the category it was before, and the one it is now
                updateBalance(category, false);
                updateBalance($("#category").val(), true);
            }
        });
    } else {
        firebase.database().ref("transactions/" + firebase.auth().currentUser.uid).push(obj, function () {
            updateBalance($("#category").val(), true);
        });
    }
}

/**
 * DeleteTransaction
 * Deletes the transaction denoted by id from the database
 */
function deleteTransaction() {
    rootRef.child("transactions/" + firebase.auth().currentUser.uid + "/" + id).set(null);
    updateBalance(category, true);
}

/**
 * FilledOut
 * Determines whether or not all the data is filled out and valid
 */
function filledOut() {
    var amount = $("#amount").val();
    var date = $("#transaction_date").val();
    var returnValue = true;

    if (amount === null || amount === "" || amount < 0.0) {
        Materialize.toast("Please enter a valid amount", 4000);
        returnValue = false;
    }

    if (date === null || date === "") {
        Materialize.toast("Please enter a valid transaction date", 4000);
        returnValue = false;
    }

    return returnValue;
}