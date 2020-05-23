import {pointerChecker} from "./modules.js"
$(document).ready(function() {
    const sourceList = ["google", "bing"];
    const leftArrow = $("#left-arrow");
    const rightArrow = $("#right-arrow");
    let sourceVal = $("#source-val");
    let sourceSelect = $("#source-select");
    let pointer = 0;

    leftArrow.click(function() {
        pointer = pointerChecker(pointer-1, sourceList.length)
        updateSource();
    });

    rightArrow.click(function() {
        pointer = pointerChecker(pointer+1, sourceList.length)
        updateSource();
    });

    function updateSource() {
        const val = sourceList[pointer];
        sourceVal.val(val);
        sourceSelect.val(val.toUpperCase());
    }
});