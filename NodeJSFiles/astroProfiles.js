var astroObjects = require('./astroObjects');

/** 
 * Astrological Profile
 * 
 * A profile is created when a user submits their astrological information
 * using the form on the landing page.
 * 
 * Contains user information:
 * Name (str), DOB (object), TOB - time of birth (object), location 
 * (object, coordinates), and AstroData (object containing AstroObjects)
 * 
*/
class Profile {
    /**
     * Constructor parameters: Name (string), DOB (formatted HTML string), 
     * TOB (formatted HTML string), and location (tuple of coordinates)
    */
    constructor(name, dob, tob, location={latitude: 0, longitude: 0}) {
        // Name
        this.name = name;
        // Date of birth
        this.dob = parseDate(dob);
        // Time of birth
        this.tob = parseTime(tob);
        // Location of birth
        this.location = location;

        // Initialize astro configuration (call function from astroObjects.js)
        // Store astrological information here

        var astroData = astroObjects.createAstroData(this.dob, this.tob, this.location.latitude, this.location.latitude);
        this.astroObjectData = astroData['astroObjContainer'];
        this.houseData = astroData['hContainer'];
    }

    name(name) {
        this.name = name;
    }

    dob(dob) {
        // Set DOB
        this.dob = dob;
        // Adjust astro object configuration
        this.setAstroData();
    }

    tob(tob) {
        // Set TOB
        this.tob = tob;
        // Adjust astro object configuration
        this.setAstroData();
    }

    location(loc) {
        // Set TOB
        this.location = loc;
        // Adjust astro object configuration
        this.setAstroData();
    }

    get astroData() { return this.astroData; }

    setAstroData() {
        var astroData = astroObjects.createAstroData(this.dob, this.tob, this.location.latitude, this.location.latitude);
        this.astroObjectData = astroData['astroObjContainer'];
        this.houseData = astroData['hContainer'];
    }
}

// Convert a HTML date string into an object with separated values for time
// Input: string of format DD-MM-YYYY
// Output: object of format {day: day, month: month, year: year}
function parseDate(date) {
    // Split date where "-" occurs
    var separated = date.split("-");

    // Return the date as an object
    return { year: Number(separated[0]), 
        month: Number(separated[1]),
        day: Number(separated[2]) 
    }
}

// Convert a HTML time string into an object with separated values for time
// Input: string of format HH:MM (24-hour time)
// Output: object of format {hour: hour, minute: minute}
function parseTime(time) {
    // Split date where "-" occurs
    var separated = time.split(":");

    // Return the date as an object
    return { hour: Number(separated[0]), 
        minute: Number(separated[1]),
    }
}

// Testing
// console.log(signs[calculateSign(-15)]);
// console.log(nakshatras.length);
// test = new Profile("Jane Lee", "02-02-2002", "19:19", 'Russia');
// console.log(test);

module.exports = { Profile };

// var test = {latitude: ***REMOVED***, longitude: ***REMOVED***};
// var t = new Profile('VF',
//     ***REMOVED***,
//     ***REMOVED***, 
//     test
// );
// console.log(t);