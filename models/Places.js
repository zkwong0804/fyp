const {con} = require("../database");

class Places {
    constructor(id, name, lat, lng) {
        this.id = id;
        this.name = name;
        this.lat = lat;
        this.lng = lng;
    }

    getAllPlaces() {
        con.query("SELECT * FROM Places", function(err, result, fields) {
            if (err) console.error(err);
            else {
                console.log(result);
            }
        });
    }

    getPlaceByID(id) {
        const q = `SELECT * FROM Places WHERE id='${id}'`;
        con.query(q, function(err, result, fields) {
            if (err) console.error(err);
            else {
                console.log(result);
            }
        });
    }

    getPlaceByName(name) {
        const q = `SELECT * FROM Places WHERE name='${name}'`;
        con.query(q, function(err, result, fields) {
            if (err) console.error(err);
            else {
                console.log(result);
            }
        });
    }

    print() {
        console.log(`ID: ${this.id}\nName: ${this.name}\nLatitude: ${this.lat}\nLongitude: ${this.lng}`);
    }
}

module.exports = Places;