import {setPlaces} from "./modules.js";

$(document).ready(function() {
    $.ajax({
        async: true,
        method: "POST",
        url: "/api/places",
    }).done(function(data) {
        setPlaces(data);
    });
});