"use strict";

/**
 * LoadData
 * Loads the user's categories from firebase
 */
function loadData() {

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
            html += '<table class="striped centered"><thead><tr><th>Category</th><th>Amount</th><th>Refreshes</th></tr></thead><tbody>';

            snapshot.forEach(function (categorySnapshot) {

                // value is the category object
                var value = categorySnapshot.val();
                var categoryName = categorySnapshot.key;

                // append the row
                html += "<tr><td>" + escapeHtml(value.name) + "</td>";
                html += "<td>$" + (value.amount / 100.0).toFixed(2) + "</td>";
                html += "<td>";
                if (value.refreshCode == 0) {
                    html += "Monthly";
                } else if (value.refreshCode == 1) {
                    html += "Every 2 Weeks";
                } else {
                    html += "Yearly";
                }
                html += "</td>";

                html += '<td><a href="edit-category.html?category=' + categoryName + '">' +
                    '<i class="material-icons right grey-text">edit</i></a></td></tr>';
            });

            // close the table
            html += '</tbody></table>';
        }

        $("#data-frame").html(html);
    }, function (errorObject) {
        console.log("The read failed: " + errorObject.code);
    });
}