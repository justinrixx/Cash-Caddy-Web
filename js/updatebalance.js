"use strict";

/**
 * UpdateBalance
 * Update the balance for the category desired
 */
function updateBalance(category, redirect) {

    var ref = firebase.database();

    // get the category
    ref.ref("categories/" + firebase.auth().currentUser.uid + "/" + category).once("value", function (snapshot) {

        /* update the balance if necessary */
        var lastRefresh = Date.parseExact(snapshot.val().lastRefresh, "yyyy-MM-dd");

        // uninitialized date
        var date;

        // monthly or weekly?
        if (snapshot.val().refreshCode == 0) {

            date = Date.parseExact(snapshot.val().lastRefresh, "yyyy-MM-dd").addMonths(1);

            // make sure the date is in a valid range
            while (Date.today().compareTo(date) > -1) {
                lastRefresh = lastRefresh.addMonths(1);
                date = date.addMonths(1);
            }
        } else if (snapshot.val().refreshCode == 1) {

            date = Date.parseExact(snapshot.val().lastRefresh, "yyyy-MM-dd").addWeeks(2);

            // same thing, but go by every two weeks
            while (Date.today().compareTo(date) > -1) {
                lastRefresh = lastRefresh.addWeeks(2);
                date = date.addWeeks(2);
            }
        } else {

            date = Date.parseExact(snapshot.val().lastRefresh, "yyyy-MM-dd").addYears(1);

            // same thing, but go by every year
            while (Date.today().compareTo(date) > -1) {
                lastRefresh = lastRefresh.addYears(1);
                date = date.addYears(1);
            }
        }

        var delta = 0;

        // get all the transactions in the category
        ref.ref("transactions/" + firebase.auth().currentUser.uid).orderByChild("date").startAt(snapshot.val().lastRefresh).once("value", function (transactionSnapshot) {
            transactionSnapshot.forEach(function (snap) {
                if (snap.val().category === category) {
                    delta += snap.val().amount;
                }

                // now update the balance
                ref.ref("categories/" + firebase.auth().currentUser.uid + "/" + category + "/balance").set(snapshot.val().amount - delta, function () {
                    // redirect if necessary
                    if (redirect) {
                        window.location.href = "home.html";
                    }
                });
            });
        });
    });
}