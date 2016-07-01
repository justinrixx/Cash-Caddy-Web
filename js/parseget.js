"use strict";

/**
 * http://stackoverflow.com/questions/5448545/how-to-retrieve-get-parameters-from-javascript
 */
function parseGet(val) {
    var result = "Not found"
        , tmp = [];
    var items = location.search.substr(1).split("&");
    for (var index = 0; index < items.length; index++) {
        tmp = items[index].split("=");
        if (tmp[0] === val) result = decodeURIComponent(tmp[1]);
    }
    return result;
}