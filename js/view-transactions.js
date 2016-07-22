"use strict";


/**
 * LoadData
 * Loads the user's data from firebase
 */
function loadData() {

    var ref = firebase.database().ref("transactions/" + firebase.auth().currentUser.uid + "/" + parseGet("category"));

    // load everything
    ref.orderByChild("date").on("value", function (snapshot) {

        // the html to append
        var html = "";

        // no categories
        if (snapshot.val() === null) {
            html = '<br /><br /><h5 class="header col s12 light center">You don\'t have any transactions for this category at this time.</h5>';

        } else {
            // put the table into the html to append
            html += '<table class="striped centered"><thead><tr><th>Date</th><th>Amount</th><th>Comments</th></tr></thead><tbody>';

            var transactions = [];
            var i = 0;

            // since I can only filter on one thing (category) I have to
            // sort by date manually
            snapshot.forEach(function (transactionSnapshot) {

                transactions.push(transactionSnapshot.val());
                transactions[i].key = transactionSnapshot.key;
                i++;
            });
            transactions.reverse();

            for (var i = 0; i < transactions.length; i++) {

                // value is the transaction object
                var value = transactions[i];

                // append the row
                html += "<tr><td>" + escapeHtml(value.date) + "</td>";
                html += "<td>$" + (value.amount / 100.0).toFixed(2) + "</td>";
                html += "<td>" + escapeHtml(value.comment) + "</td>";

                html += '<td><a href="edit-transaction.html?id=' + value.key 
                + '&categoryId=' + parseGet("category") + '">' +
                    '<i class="material-icons right grey-text">edit</i></a></td></tr>'; 
            }

            // close the table
            html += '</tbody></table>';
        }

        $("#data-frame").html(html);
    }, function (errorObject) {
        console.log("The read failed: " + errorObject.code);
    });
}