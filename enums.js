/** This file stores integer/enum representations of categories (e.g. signs, 
 *  nakshatras, planets, etc.)
*/

// Allows us to define Enums
class Enum {
    constructor(...keys) {
        keys.forEach((key, i) => {
            this[key] = i;
        });
        Object.freeze(this);
    }
  
    *[Symbol.iterator]() {
      for (let key of Object.keys(this)) yield key;
    }
}

// Enum for Astrological Signs
const signsEnum = new Enum( 'null',
    'Aries', 'Taurus', 'Gemini', 'Cancer',
    'Leo', 'Virgo', 'Libra', 'Scorpio',
    'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
);
// Array to convert integer representation to string
const signs = [...signsEnum];
// Integer representation of signs
const   SIGN_ID_ARIES = 1,          SIGN_ID_TAURUS = 2,     
        SIGN_ID_GEMINI = 3,         SIGN_ID_CANCER = 4,
        SIGN_ID_LEO = 5,            SIGN_ID_VIRGO = 6,
        SIGN_ID_LIBRA = 7,          SIGN_ID_SCORPIO = 8,
        SIGN_ID_SAGITTARIUS = 9,    SIGN_ID_CAPRICORN = 10,
        SIGN_ID_AQUARIUS = 11,      SIGN_ID_PISCES = 12;

// Enum for Nakshatras
const nakshatrasEnum = new Enum( 'null',
    'Ashvini', 'Bharani', 'Krittika', 'Rohini', 'Mrigashirsha', 'Ardra',
    'Punarvasu', 'Pushya', 'Ashlesha', 'Magha', 'Purva Phalguni', 
    'Uttara Phalguni', 'Hasta', 'Chitra', 'Svati', 'Vishakha', 'Anuradha',
    'Jyeshtha', 'Mula', 'Purva Ashadha', 'Uttara Ashada', 'Sravana', 
    'Dhanistha', 'Shatabhista', 'Purva Bhadrapada', 'Uttara Bhadrapada',
    'Revati'
);
// Array to convert integer representation to string
const nakshatras = [...nakshatrasEnum];

// Enum for Astro Objects
const astroObjectsEnum = new Enum(
    'Lagna', 'Sun', 'Moon', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn',
    'Rahu', 'Ketu'
);
// Array to convert integer representation to string
const astroObjects = [...astroObjectsEnum];
// Integer reprpesentation for Astro Objects
const   OBJ_ID_LAGNA = 0,   OBJ_ID_SUN = 1,     OBJ_ID_MOON = 2, 
        OBJ_ID_MERCURY = 3, OBJ_ID_VENUS = 4,   OBJ_ID_MARS = 5,
        OBJ_ID_JUPITER = 6, OBJ_ID_SATURN = 7,  OBJ_ID_RAHU = 8, 
        OBJ_ID_KETU = 9;

const signToRuler = {
        1: OBJ_ID_MARS,     2: OBJ_ID_VENUS,    3: OBJ_ID_MERCURY,  
        4: OBJ_ID_MOON,     5: OBJ_ID_SUN,      6: OBJ_ID_MERCURY,  
        7: OBJ_ID_VENUS,    8: OBJ_ID_MARS,     9: OBJ_ID_JUPITER,  
        10: OBJ_ID_SATURN,  11: OBJ_ID_SATURN,  12: OBJ_ID_JUPITER
};

const rulerToSign = {
    1: {SIGN_ID_LEO},
    2: {SIGN_ID_CANCER},
    3: {SIGN_ID_GEMINI, SIGN_ID_VIRGO},
    4: {SIGN_ID_TAURUS, SIGN_ID_LIBRA},
    5: {SIGN_ID_ARIES, SIGN_ID_SCORPIO},
    6: {SIGN_ID_SAGITTARIUS, SIGN_ID_PISCES},
    7: {SIGN_ID_CAPRICORN, SIGN_ID_AQUARIUS}
};

module.exports = { Enum, signsEnum, signs, nakshatrasEnum, nakshatras,
    astroObjectsEnum, astroObjects, signToRuler, rulerToSign,
    
    SIGN_ID_ARIES, SIGN_ID_TAURUS, SIGN_ID_GEMINI, SIGN_ID_CANCER,
    SIGN_ID_LEO, SIGN_ID_VIRGO, SIGN_ID_LIBRA, SIGN_ID_SCORPIO,
    SIGN_ID_SAGITTARIUS, SIGN_ID_CAPRICORN, SIGN_ID_AQUARIUS, SIGN_ID_PISCES,

    OBJ_ID_LAGNA, OBJ_ID_SUN, OBJ_ID_MOON, OBJ_ID_MERCURY, OBJ_ID_VENUS,
    OBJ_ID_MARS, OBJ_ID_JUPITER, OBJ_ID_SATURN, OBJ_ID_RAHU, OBJ_ID_KETU
 };