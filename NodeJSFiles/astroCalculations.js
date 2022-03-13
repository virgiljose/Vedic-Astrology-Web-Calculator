var astroObjects = require('./astroObjects');
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


// Calculate Parivartana (mutual reception)
function calcParivartana(astroData, houseData) {

    // Planet in each other's house rulerships

    // Iterate through each of the heavenly bodies
    for(var key of Object.keys(astroData)) {
        
        // Only the traditional 7 heavenly bodies
        if(astroData[key].objID == 0 || astroData[key].objID == 8 || astroData[key].objID == 9) continue;
        
        // Get the signs that the given heavenly body rules
        var thisrules = enums.rulerToSign[astroData[key].objID];

        // Go to each of the signs that this heavenly body rules
        for(var i of Object.keys(thisrules)) {

            var houseNum = (thisrules[i] - astroData.lagna.sign)%12 + 1;
            if (houseNum < 1) houseNum += 12;
            houseNum = String(houseNum);   

            var houseLookup = houseData[houseNum].astroObjectList;

            for(var j of Object.keys(houseLookup)) {
                
                if(houseLookup[j].objID == 0 || houseLookup[j].objID == 8 || houseLookup[j].objID == 9) continue;

                var thatrules = enums.rulerToSign[houseLookup[j].objID];

                for(var k of Object.keys(thatrules)) {

                    if (thatrules[k] == astroData[key].sign) {
                        console.log(enums.astroObjects[astroData[key].objID] + " in PV with " + 
                        enums.astroObjects[houseLookup[j].objID]);
                    }
                }
            }
            
        }
    }
}

module.exports = { calcParivartana };

// Testing functionality
// var test = {latitude: ***REMOVED***, longitude: ***REMOVED***};
// var astroObjectData = astroObjects.createAstroData(
//     ***REMOVED***,
//     ***REMOVED***, 
//     test.latitude,
//     test.longitude
// );
//console.log(astroObjectData);
// calcParivartana(astroObjectData['astroObjContainer'], astroObjectData['hContainer']);
//console.log(astroObjectData['hContainer']);