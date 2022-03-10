// Handles the planetary objects
// Only handles location of objects - does NOT handle conditions (e.g. 
// planeetary dignities, yogas, etc)

// Import swisseph  allows for ephemeris calculaions
// Credit: https://github.com/mivion/swisseph
var swisseph = require('swisseph');
swisseph.swe_set_ephe_path(__dirname + '/../ephe');

// Integer representations of categorical data (e.g. signs, nakshatras, etc.)
var enums = require('./enums');

// Handles HTTP requests. Used to find time zone using Google Time Zone API
var axios = require('axios');


// Calculate the ruler of a given sign
const calculateSignRuler = sign => enums.signToRuler[sign];

// Given the degrees of an object, calculate the sign of the object
// Input: degrees (int)
// Output: sign (encoded as an int)
function calculateSign(degrees) {
    var degrees_adj = adjustDegrees(degrees);
    return Math.floor(degrees_adj/30) + 1;
}

// Given the degrees of an object, calculate the sign of the object
// Input: degrees (int)
// Output: sign (encoded as an int)
function calculateNakshatra(degrees) {
    var degrees_adj = adjustDegrees(degrees);
    return Math.floor(degrees_adj/(360/27)) + 1;
}

// Adjust degrees that are not between 0 and 360
function adjustDegrees(degrees) {
    var degrees_adj = degrees;    
    while(degrees_adj < 0) degrees_adj += 360;
    while(degrees_adj >= 360) degrees_adj -= 360;
    return degrees_adj;
}

// Base class for any astrological object
class AstroObject {
    constructor(degrees) {
        this.objID = -1;
        // Degrees of the Astrological object (out of 366)
        this.degrees = degrees;
        // Sign of the astrological object
        this.sign = calculateSign(degrees);
        // Number of degrees into the sign
        this.degreesInSign = this.degrees - (this.sign - 1)*30;
        // Sign ruler of the astrological object
        this.signRuler = calculateSignRuler(this.sign);
        // Nakshatra of the astrological object
        this.nakshatra = calculateNakshatra(degrees);
    }
}

class Lagna extends AstroObject {
    constructor(degrees) {
        super(degrees);
        this.objID = enums.OBJ_ID_LAGNA;
    }
};

// Abstract base class for a celestial body (sun/moon + planets)
// OtherObject includes house data
// MUST have defined lagna first (so that houses can be determined)
class OtherObject extends AstroObject {
    constructor(degrees, lagna) {
        super(degrees);

        this.house = undefined;

        this.houseNum = (this.sign - lagna.sign)%12 + 1;
        if(this.houseNum < 1) this.houseNum += 12;


        this.ownSign = false;
        this.exalted = false;
        this.debilitated = false;
    }
}

class LunarNode extends OtherObject {};
class Rahu extends LunarNode {
    constructor(degrees, lagna) {
        super(degrees, lagna);
        this.objID = enums.OBJ_ID_RAHU;
        if (this.sign == enums.SIGN_ID_AQUARIUS) {
            this.ownSign = true; 
        }
        if (this.sign == enums.SIGN_ID_GEMINI) { this.exalted = true; }
        if (this.sign == enums.SIGN_ID_SAGITTARIUS) { this.debilitated = true; }
    }
};
class Ketu extends LunarNode {
    constructor(degrees, lagna) {
        super(degrees, lagna);
        this.objID = enums.OBJ_ID_KETU;
        if (this.sign == enums.SIGN_ID_SCORPIO) {
            this.ownSign = true; 
        }
        if (this.sign == enums.SIGN_ID_SAGITTARIUS) { this.exalted = true; }
        if (this.sign == enums.SIGN_ID_GEMINI) { this.debilitated = true; }
    }
};


class Luminary extends OtherObject {};
class Sun extends Luminary {
    constructor(degrees, lagna) {
        super(degrees, lagna);
        this.objID = enums.OBJ_ID_SUN;
        if (this.sign == enums.SIGN_ID_LEO) { this.ownSign = true; }
        if (this.sign == enums.SIGN_ID_ARIES) { this.exalted = true; }
        if (this.sign == enums.SIGN_ID_LIBRA) { this.debilitated = true; }
    }
};
class Moon extends Luminary {
    constructor(degrees, lagna) {
        super(degrees, lagna);
        this.objID = enums.OBJ_ID_MOON;
        if (this.sign == enums.SIGN_ID_CANCER) { this.ownSign = true; }
        if (this.sign == enums.SIGN_ID_TAURUS) { this.exalted = true; }
        if (this.sign == enums.SIGN_ID_SCORPIO) { this.debilitated = true; }
    }
};

// Planets include retrograde data
class Planet extends OtherObject {
    constructor(degrees, lagna, speed) {
        super(degrees, lagna);
        this.retrograde = (speed < 0);
    }
}
class Mercury extends Planet {
    constructor(degrees, lagna, rx) {
        super(degrees, lagna, rx);
        this.objID = enums.OBJ_ID_MERCURY;
        if (this.sign == enums.SIGN_ID_GEMINI || this.sign == enums.SIGN_ID_VIRGO) { 
            this.ownSign = true; 
        }
        // Note: Mercury both rules Virgo and is exalted in Virgo
        if (this.sign == enums.SIGN_ID_VIRGO) { this.exalted = true; }
        if (this.sign == 11) { this.debilitated = true; }
    }
};
class Venus extends Planet {
    constructor(degrees, lagna, rx) {
        super(degrees, lagna, rx);
        this.objID = enums.OBJ_ID_VENUS;
        if (this.sign == enums.SIGN_ID_TAURUS || this.sign == enums.SIGN_ID_LIBRA) {
            this.ownSign = true; 
        }
        if (this.sign == enums.SIGN_ID_PISCES) { this.exalted = true; }
        if (this.sign == enums.SIGN_ID_VIRGO) { this.debilitated = true; }
    }
};
class Mars extends Planet {
    constructor(degrees, lagna, rx) {
        super(degrees, lagna, rx);
        this.objID = enums.OBJ_ID_MARS;
        if (this.sign == enums.SIGN_ID_ARIES || this.sign == enums.SIGN_ID_SCORPIO) { 
            this.ownSign = true; 
        }
        if (this.sign == enums.SIGN_ID_CAPRICORN) { this.exalted = true; }
        if (this.sign == enums.SIGN_ID_CANCER) { this.debilitated = true; }
    }
};
class Jupiter extends Planet {
    constructor(degrees, lagna, rx) {
        super(degrees, lagna, rx);
        this.objID = enums.OBJ_ID_JUPITER;
        if (this.sign == enums.SIGN_ID_SAGITTARIUS || this.sign == enums.SIGN_ID_PISCES) { 
            this.ownSign = true; 
        }
        if (this.sign == enums.SIGN_ID_CANCER) { this.exalted = true; }
        if (this.sign == enums.SIGN_ID_CAPRICORN) { this.debilitated = true; }
    }
};
class Saturn extends Planet {
    constructor(degrees, lagna, rx) {
        super(degrees, lagna, rx);
        this.objID = enums.OBJ_ID_SATURN;
        if (this.sign == enums.SIGN_ID_CAPRICORN || this.sign == enums.SIGN_ID_AQUARIUS) { 
            this.ownSign = true; 
        }
        if (this.sign == enums.SIGN_ID_LIBRA) { this.exalted = true; }
        if (this.sign == enums.SIGN_ID_ARIES) { this.debilitated = true; }
    }
};

// Class that contains the astro object classes
class AstroObjectContainer {
    constructor(lagna, sun, moon, mercury, venus, mars, jupiter, saturn, rahu, ketu) {
        this.lagna = lagna;
        this.sun = sun;
        this.moon = moon;
        this.mercury = mercury;
        this.venus = venus;
        this.mars = mars;
        this.jupiter = jupiter;
        this.saturn = saturn;
        this.rahu = rahu;
        this.ketu = ketu;
    }
}

// Class that contains information about a given house
class House {
    constructor(houseNum, astroObjContainer) {        
        
        // Get the sign of the house
        this.sign = (astroObjContainer.lagna.sign + houseNum - 1)%12;
        if (this.sign == 0) this.sign = 12;

        // Get the ruler of the house
        this.signRuler = calculateSignRuler(this.sign);

        // Get list of objects which reside in house
        this.astroObjectList = [];

        for(var key of Object.keys(astroObjContainer)) {
            if(astroObjContainer[key]['houseNum'] == houseNum) { 
                this.astroObjectList.push(astroObjContainer[key]);
                astroObjContainer[key]['house'] = this;
            }
        }
    }
}

// Class that contains the houses
class HouseContainer {
    constructor(astroObjContainer) {
        this['1'] = new House(1, astroObjContainer);
        this['2'] = new House(2, astroObjContainer);
        this['3'] = new House(3, astroObjContainer);
        this['4'] = new House(4, astroObjContainer);
        this['5'] = new House(5, astroObjContainer);
        this['6'] = new House(6, astroObjContainer);
        this['7'] = new House(7, astroObjContainer);
        this['8'] = new House(8, astroObjContainer);
        this['9'] = new House(9, astroObjContainer);
        this['10'] = new House(10, astroObjContainer);
        this['11'] = new House(11, astroObjContainer);
        this['12'] = new House(12, astroObjContainer);
    }
}

// When a user creates or edits their profile, create new astro data
function createAstroData(dob, tob, lat, lon) {
    // Use the swisseph API to retrieve astrological data

    // TODO: Convert local time to UT based on location of birth
    
    swisseph.swe_set_sid_mode(swisseph.SE_SIDM_LAHIRI,0,0);
    // Calculate the Julian day (using universal time):
    var jul_day_UT = swisseph.swe_julday(dob.year, dob.month, dob.day, tob.hour, swisseph.SE_GREG_CAL);

    // Calculate the ascendant:
    var asc_houses = swisseph.swe_houses(jul_day_UT, lat, lon, 'W');

    // Create a Lagna object:
    var asc = new Lagna(asc_houses.ascendant);

    var ephflags = swisseph.SEFLG_SPEED | swisseph.SEFLG_SIDEREAL;
    
    // Create luminary (Sun and Moon) objects
    var sun_pos = swisseph.swe_calc_ut(jul_day_UT, swisseph.SE_SUN, ephflags);
    var sun = new Sun(sun_pos.longitude, asc);
    var moon_pos = swisseph.swe_calc_ut(jul_day_UT, swisseph.SE_MOON, ephflags);
    var moon = new Moon(moon_pos.longitude, asc);
    
    // Calculate Rahu and Ketu
    var rahu_pos = swisseph.swe_calc_ut(jul_day_UT, swisseph.SE_TRUE_NODE, ephflags);
    var rahu = new Rahu(rahu_pos.longitude, asc);
    var ketu = new Ketu((rahu_pos.longitude + 180)%360, asc);

    // Create planet (Mercury - Saturn) objects
    var mercury_pos = swisseph.swe_calc_ut(jul_day_UT, swisseph.SE_MERCURY, ephflags);
    var mercury = new Mercury(mercury_pos.longitude, asc, mercury_pos.longitudeSpeed);
    var venus_pos = swisseph.swe_calc_ut(jul_day_UT, swisseph.SE_VENUS, ephflags);
    var venus = new Venus(venus_pos.longitude, asc, venus_pos.longitudeSpeed);
    var mars_pos = swisseph.swe_calc_ut(jul_day_UT, swisseph.SE_MARS, ephflags);
    var mars = new Mars(mars_pos.longitude, asc, mars_pos.longitudeSpeed);
    var jupiter_pos = swisseph.swe_calc_ut(jul_day_UT, swisseph.SE_JUPITER, ephflags);
    var jupiter = new Jupiter(jupiter_pos.longitude, asc, jupiter_pos.longitudeSpeed);
    var saturn_pos = swisseph.swe_calc_ut(jul_day_UT, swisseph.SE_SATURN, ephflags);
    var saturn = new Saturn(saturn_pos.longitude, asc, saturn_pos.longitudeSpeed);

    var astroObjContainer = new AstroObjectContainer(asc, sun, moon, mercury,
        venus, mars, jupiter, saturn, rahu, ketu);
    
    var hContainer = new HouseContainer(astroObjContainer);

    return { astroObjContainer, hContainer };
}

module.exports = { calculateSignRuler, calculateSign, calculateNakshatra,
    adjustDegrees, AstroObject, Lagna, OtherObject, LunarNode, Rahu, Ketu, 
    Luminary, Sun, Moon, Planet, Mercury, Venus, Mars, Jupiter, Saturn,
    AstroObjectContainer, House, HouseContainer, createAstroData
};