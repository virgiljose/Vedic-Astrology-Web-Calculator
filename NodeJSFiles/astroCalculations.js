//var astroObjects = require('./astroObjects');
var enums = require('./enums');

// Calculate properties of a given chart (e.g. house rulerships, yogas, etc.)

// Pass in Profile --> calculate data

/***
 * 
 * const signToRuler = {
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
 * 
 */

// Check if array is inside nested array. Used in Parivartana function
// https://stackoverflow.com/questions/41661287/how-to-check-if-an-array-contains-another-array
function isArrayInArray(arr, item){
    var item_as_string = JSON.stringify(item);
  
    var contains = arr.some(function(ele){
      return JSON.stringify(ele) === item_as_string;
    });
    return contains;
}

// Class that contains values for the astrological calculations
class YogaContainer {
    constructor(astroObjectData, houseData) {
        this.parivartana = calcParivartana(astroObjectData, houseData);
        this.bhadra = calcBhadra(astroObjectData);
        this.malavya = calcMalavya(astroObjectData);
        this.ruchak = calcRuchak(astroObjectData);
        this.hans = calcHans(astroObjectData);
        this.sasa = calcSasa(astroObjectData);
        this.gajakeshari = calcGajakeshari(astroObjectData);
        this.neechbhangraj = calcNeechBhangRaj(astroObjectData, houseData);
        this.shukra = calcShukra(astroObjectData);
    }
}

// Checks whether a given object is in Kendra (an angular house; 1,4,7,10)
function inKendra(obj) {
    return (obj.houseNum == 1 || obj.houseNum == 4 ||
        obj.houseNum == 7 || obj.houseNum == 10);
}


// Calculate Parivartana (mutual reception)
// Returns pairs of planets that form Parivartana
function calcParivartana(astroData, houseData) {

    // Contains the list of Parivartana planet pairs
    var results = [];
    var resultsStr = [];

    // Iterate through each of the heavenly bodies
    for(var key of Object.keys(astroData)) {
        
        // Skip Rahu/Ketu and Lagna. Only evaluate the traditional 7 heavenly bodies
        if(astroData[key].objID == 0 || astroData[key].objID == 8 || astroData[key].objID == 9) continue;
        
        // Get the signs that the given heavenly body rules
        var thisrules = enums.rulerToSign[astroData[key].objID];

        // Go to each of the signs that this heavenly body rules
        for(var i of Object.keys(thisrules)) {


            // Same sign. Continue.
            if(astroData[key].sign == enums[i]) { continue; }

            var houseNum = (thisrules[i] - astroData.lagna.sign)%12 + 1;
            if (houseNum < 1) houseNum += 12;
            houseNum = String(houseNum);   

            var houseLookup = houseData[houseNum].astroObjectList;

            for(var j of Object.keys(houseLookup)) {
                
                if(houseLookup[j].objID == 0 || houseLookup[j].objID == 8 || houseLookup[j].objID == 9) continue;

                var thatrules = enums.rulerToSign[houseLookup[j].objID];

                for(var k of Object.keys(thatrules)) {

                    if (thatrules[k] == astroData[key].sign) {

                        var first = Math.min(astroData[key].objID, houseLookup[j].objID);
                        var second = Math.max(astroData[key].objID, houseLookup[j].objID);
                        if (! isArrayInArray(results, [first,second])) {
                            results.push([first,second]);
                            resultsStr.push([enums.astroObjects[astroData[key].objID], 
                                enums.astroObjects[houseLookup[j].objID]]);
                        }
                    }
                }
            }
        }
    }
    return resultsStr;
}

// Mercury exalted or own sign, and in Kendra
// Returns boolean
function calcBhadra(astroData) {
    var mercury = astroData.mercury;
    return ((mercury.ownSign || mercury.exalted) && inKendra(mercury));
}

// Venus exalted or own sign, and in Kendra
// Returns boolean
function calcMalavya(astroData) {
    var venus = astroData.venus;
    return ((venus.ownSign || venus.exalted) && inKendra(venus));
}

// Mars exalted or own sign, and in Kendra
// Returns boolean
function calcRuchak(astroData) {
    var mars = astroData.mars;
    return ((mars.ownSign || mars.exalted) && inKendra(mars));
}

// Jupiter exalted or own sign, and in Kendra
// Returns boolean
function calcHans(astroData) {
    var jupiter = astroData.jupiter;
    return ((jupiter.ownSign || jupiter.exalted) && inKendra(jupiter));
}

// Saturn exalted or own sign, and in Kendra
// Returns boolean
function calcSasa(astroData) {
    var saturn = astroData.saturn;
    return ((saturn.ownSign || saturn.exalted) && inKendra(saturn));
}

// Moon and Jupiter in Kendra from each other
// Returns boolean
function calcGajakeshari(astroData) {
    var moonHouse = astroData.moon.houseNum;
    var jupiterHouse = astroData.jupiter.houseNum;
    var diff = Math.max(moonHouse, jupiterHouse) - Math.min(moonHouse, jupiterHouse);
    return (diff == 0 || diff == 3 || diff == 6 || diff == 9);
}

// Debilitation of a planet gets cancelled
// Note: does not take into account condition of the Navamsha (D-9 chart)
// Returns list of planets whose debilitation is cancelled
function calcNeechBhangRaj(astroData, houseData) {

    var results = [];

    // Check whether a debilitated planet is in same house as exalted planet

    // Iterate through each house
    for(var house of Object.keys(houseData)) {

        // Get the list of planets in that house
        var objList = houseData[house].astroObjectList;

        // Store list of debilitated objects
        var debilitatedObjs = [];

        // Keep track of whether one of the Yoga's conditions are found
        var exaltedInHouse = false;
        var lordExalted = false;

        // Iterate through the list of objects in the house.
        for(var obj of Object.keys(objList)) {
            
            // If object is debilitated, add to list of debilitated objects
            if(objList[obj].debilitated) {
                debilitatedObjs.push(enums.astroObjects[objList[obj].objID]);
            }

            // If object is exalted, record as such
            else if(objList[obj].exalted) {
                exaltedInHouse = true;
            }
        }

        // Check whether the lord of the given house is exalted
        var signRuler = house.signRuler;

        // Find the sign ruler and check whether it's exalted
        for(var obj of Object.keys(astroData)) {
            if(astroData[obj].objID == signRuler && astroData[obj].exalted) {
                exaltedInHouse = true;
                break;
            }
        }

        if(exaltedInHouse || lordExalted) {
            results.push(debilitatedObjs);
        }
    }
    return results.flat();
}

// Venus in 12th house
function calcShukra(astroData) {
    return astroData.venus.houseNum == 12;
}

module.exports = { YogaContainer, calcParivartana, calcBhadra, calcMalavya, 
    calcRuchak, calcHans, calcSasa, calcGajakeshari, calcNeechBhangRaj, 
    calcShukra };