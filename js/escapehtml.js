/**
 * http://stackoverflow.com/questions/1787322/htmlspecialchars-equivalent-in-javascript
 */
function escapeHtml(text) {
    var map = {
        '&': '&amp;'
        , '<': '&lt;'
        , '>': '&gt;'
        , '"': '&quot;'
        , "'": '&#039;'
    };

    return text.replace(/[&<>"']/g, function (m) {
        return map[m];
    });
}