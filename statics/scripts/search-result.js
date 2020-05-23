import {getPlaces} from "./modules.js";

$(document).ready(function() {
    let originField = $("#origin-field");
    let destinationField = $("#destination-field");
    let originSearchResult = $("#origin-search-result");
    let destinationSearchResult = $("#destination-search-result");
    let originVal = $("#origin-val");
    let destinationVal = $("#destination-val");

    originField.keyup(function() {
        findSearchResult(originField.val(), originSearchResult, "origin");
    });

    destinationField.keyup(function() {
        findSearchResult(destinationField.val(), destinationSearchResult, "destination");
    });

    originField.focusin(function() {
        findSearchResult(originField.val(), originSearchResult, "origin");
    });

    destinationField.focusin(function() {
        findSearchResult(destinationField.val(), destinationSearchResult, "destination");
    });

    // originField.focusout(function() {
    //     console.log(`focus out`)
    //     originSearchResult.empty();
    // });

    // destinationField.focusout(function() {
    //     destinationSearchResult.empty();
    // });

    function findSearchResult(search, searchResult, searchField) {
        searchResult.empty();
        if (search !== "") {
            for (let e of getPlaces()) {
                if (e.name.toLowerCase().includes(search.toLowerCase())) {
                    searchResult.append(`<p class="search-result-list" value="${e.id}" field="${searchField}" name="${e.name}">${e.name}</p>`);
                }
            }
        }

        $(".search-result-list").click(function() {
            const field = this.getAttribute("field");
            const value = this.getAttribute("value");
            const name = this.getAttribute("name");

            if(field === "origin") {
                originVal.val(value);
                originField.val(name);
                originSearchResult.empty();
            } else if (field === "destination") {
                destinationVal.val(value);
                destinationField.val(name);
                destinationSearchResult.empty();
            } else {
                alert("Fail to insert value into origin-val or destination-val");
                alert(field);
                alert(value);
            }
        });
    }
});