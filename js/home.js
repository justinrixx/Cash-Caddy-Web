"use strict";

function test() {
    alert("test done");
}

/**
 * Make Toast
 * Make a toast allowing the user to delete the transaction they just created
 */
 function makeToast() {
    Materialize.toast('Toast just happened <span color="orange" onclick="test()">Click me</span>', 4000);
 }

/**
 * LoadData
 * Loads the user's data from firebase
 */
function loadData() {

    // https://###.firebaseio.com/categories/uid
    var ref = firebase.database().ref("categories/" + firebase.auth().currentUser.uid);

    // load everything
    ref.on("value", function (snapshot) {

        // the html to append
        var html = "";

        // no categories
        if (snapshot.val() === null) {
            html = '<br /><br /><h5 class="header col s12 light center">You don\'t seem to have any categories at this time.</h5>';

        } else {
            // put the table into the html to append
            html += '<table class="striped centered"><thead><tr><th>Category</th><th>Net</th></tr></thead><tbody>';

            snapshot.forEach(function (categorySnapshot) {

                // value is the category object
                var value = categorySnapshot.val();
                var categoryId = categorySnapshot.key;

                /** Update the date and balance if necessary **/
                var lastRefresh = Date.parseExact(value.lastRefresh, "yyyy-MM-dd");

                // uninitialized date
                var date;

                var update = false;

                // monthly
                if (parseInt(value.refreshCode) === 0) {

                    date = Date.parseExact(value.lastRefresh, "yyyy-MM-dd").addMonths(1);

                    // make sure the date is in a valid range
                    while (Date.today().compareTo(date) > -1) {
                        lastRefresh = lastRefresh.addMonths(1);
                        date = date.addMonths(1);
                        update = true;
                    }
                // weekly
                } else if (parseInt(value.refreshCode) === 1) {

                    date = Date.parseExact(value.lastRefresh, "yyyy-MM-dd").addWeeks(2);

                    // same thing, but go by every two weeks
                    while (Date.today().compareTo(date) > -1) {
                        lastRefresh = lastRefresh.addWeeks(2);
                        date = date.addWeeks(2);
                        update = true;
                    }
                // yearly
                } else {
                    date = Date.parseExact(value.lastRefresh, "yyyy-MM-dd").addYears(1);

                    // same thing, but go by every two weeks
                    while (Date.today().compareTo(date) > -1) {
                        lastRefresh = lastRefresh.addYears(1);
                        date = date.addYears(1);
                        update = true;
                    }
                }

                // update the balance if it needs to be changed
                if (update) {

                    // set the new date
                    ref.child(categoryId + '/lastRefresh').set(lastRefresh.toString('yyyy-MM-dd'));

                    // false -> don't redirect
                    updateBalance(categoryId, false);
                }

                // grab the balance
                var balance = value.balance;

                // append the row
                html += "<tr><td>" + escapeHtml(value.name) + "</td>";
                html += '<td class="';

                // red means negative
                if (balance >= 0) {
                    html += "green-text";
                } else {
                    html += "red-text";
                }
                html += '">';
                html += "$" + (balance / 100.0).toFixed(2) + "</td>";

                html += '<td><a href="view-transactions.html?category=' + categoryId + '">' +
                    '<i class="material-icons right grey-text">list</i></a></td></tr>';
            });

            // close the table
            html += '</tbody></table>';
        }

        $("#data-frame").html(html);
    }, function (errorObject) {
        console.log("The read failed: " + errorObject.code);
    });
}