"use strict";

/**
 * Make Toast
 * Make a toast allowing the user to delete the transaction they just created
 */
 function makeToast() {

    /*
    var $toastContent = $('<span>Transaction Created <a href="#!" class="undobutton">UNDO</a></span>');
    $toastContent.click(function() {
        alert('Clicked');
    });
    Materialize.toast($toastContent, 5000);
    */

    // only make the toast if something was created

    var tranasctionId = parseGet('transaction');
    var categoryId = parseGet('category');

    if (tranasctionId == 'Not found' || categoryId == 'Not found') {
        return;
    }

    // construct the path
    var path = 'transactions/' + firebase.auth().currentUser.uid + '/' + categoryId + '/' + tranasctionId;

    // make the toast
    var $toastContent = $('<span>Transaction Created <a href="#!" class="undobutton">UNDO</a></span>');
    $toastContent.click(function() {
        // delete the transaction and update the balance
        firebase.database().ref(path).set(null);
        updateBalance(categoryId, true);
    });
    Materialize.toast($toastContent, 5000);
}

/**
 * LoadData
 * Loads the user's data from firebase
 */
function loadData() {

    // https://###.firebaseio.com/categories/uid
    var ref = firebase.database().ref("categories/" + firebase.auth().currentUser.uid);

    var done = false;

    // load everything
    ref.on("value", function (snapshot) {

        // the html to append
        var html = "";

        // no categories
        if (snapshot.val() === null) {
            html = '<br /><br /><h5 class="header col s12 light center">You don\'t seem to have any categories at this time.</h5>';

        } else {
            // put the table into the html to append
            html += '<div class="row">';

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

                // add the category title
                html += '<div class="col s8 m4">';
                html += '<ul class="collection with-header z-depth-2" id="' + categoryId.slice(1) + '">';
                html += '<li class="collection-header"><h4>' + escapeHtml(value.name) + '</h4></li>';

                var ref2 = firebase.database().ref("transactions/" + firebase.auth().currentUser.uid + "/" + categoryId);
                ref2.orderByChild("date").limitToLast(3).on("value", function (snapshot) {
                    // add transactions if they exist
                    if (snapshot.val() !== null) {
                        snapshot.forEach(function (itemSnapshot) {
                            var item = '';
                            item += '<li class="collection-item">';
                            item += itemSnapshot.val().date + ' $' + (itemSnapshot.val().amount / 100.0).toFixed(2);
                            item += '</li>';
                            $(item).insertAfter('ul#' + itemSnapshot.val().category.slice(1) + ' li.collection-header');
                        });
                    }
                });

                // close the card
                html += '<li class="collection-item ';
                if (balance >= 0) {
                    html += 'green-text';
                } else {
                    html += 'red-text';
                }
                html += '"><b>';
                html += '$' + (balance / 100.0).toFixed(2);
                html += '</b></li>';
                html += '<li class="collection-item"><a href="view-transactions.html?category=' + categoryId + '">View Transactions</a></li></ul></div>';


            });

            // close the div
            html += '</div>';
        }

        $("#data-frame").html(html);

    }, function (errorObject) {
        console.log("The read failed: " + errorObject.code);
    });
}