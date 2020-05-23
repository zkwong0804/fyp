let places = [];

export function pointerChecker(number, listLength) {
    if (number !== -1) return number%listLength;
    else return listLength-1;
}

export function getPlaces() {
    return places;
}

export function setPlaces(nPlaces) {
    places = nPlaces;
}