$(document).ready(function() {
    let tollBtn = $("#toll-select");
    let tollVal = $("#toll-val");
    let tollText = $("#toll-text");
    let tollSelect = $("#toll-select");

    tollBtn.click(function() {
        if (tollVal.val() === "false") {
            tollVal.val("true");
            updateTollClass("toll-false", "toll-true", "pushed-up", "pushed-down");
        } else {
            tollVal.val("false");
            updateTollClass("toll-true", "toll-false", "pushed-down", "pushed-up");
        }
    });

    function updateTollClass(rmVal, addVal, rmSel, addSel) {
        tollText.removeClass(rmVal);
        tollText.addClass(addVal);
        tollSelect.removeClass(rmSel);
        tollSelect.addClass(addSel);
    }
});