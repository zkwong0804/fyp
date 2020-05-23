import { pointerChecker } from "./modules.js";
$(document).ready(function() {
    const featureNames = ["1", "2", "1|2"];
    let featurePointer = 0;
    let prevFeatureBtn = $("#prev-feature");
    let curFeatureBtn = $("#features");
    let nextFeatureBtn = $("#next-feature");
    let featureSelect = $("#feature-select");

    prevFeatureBtn.click(function() {
        featurePointer = pointerChecker((featurePointer-1), featureNames.length);
        updateDay(pointerChecker(featurePointer-1, featureNames.length), featurePointer, pointerChecker(featurePointer+1, featureNames.length));
        
    });

    nextFeatureBtn.click(function() {
        featurePointer = pointerChecker(featurePointer+1, featureNames.length);
        updateDay(pointerChecker(featurePointer-1, featureNames.length), featurePointer, pointerChecker(featurePointer+1, featureNames.length));
    });
    

    function updateDay(pre, cur, next) {
        prevFeatureBtn.val(featureNames[pre]);
        nextFeatureBtn.val(featureNames[next]);
        curFeatureBtn.val(featureNames[cur]);
    }
});