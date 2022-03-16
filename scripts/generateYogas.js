// Script to generate text for yogas on webpages

function genElements(title, text) {
        var h3tag = document.createElement("h3");
        var h3text = document.createTextNode(title);
        h3tag.appendChild(h3text);

        var ptag = document.createElement("p");
        var ptext = document.createTextNode(text);
        ptag.appendChild(ptext);

        var element = document.getElementById("yogas");
        element.appendChild(h3tag);
        element.appendChild(ptag);
}

function checkYogas(yogaData) {

    if(yogaData.parivartana.length) {
        text = "The following pairs of planets form a Parivartana yoga:";
        genElements("Parivartana", text);

        var element = document.getElementById("yogas");
        yogaData.parivartana.forEach(item => { 
            var psubtag = document.createElement("p");
            var psubtext = document.createTextNode(item[0] + " is in Parivartana with " + item[1]);
            psubtag.appendChild(psubtext);
            element.appendChild(psubtag);
         });

    }
    if(yogaData.bhadra) {
        var text = "Mercury is exalted in your chart and is in Kendra.";
        genElements("Bhadra", text);
    }
    if(yogaData.malavya) {
        var text = "Venus is exalted in your chart and is in Kendra.";
        genElements("Malavya", text);
    }
    if(yogaData.ruchak) {
        var text = "Mars is exalted in your chart and is in Kendra.";
        genElements("Ruchak", text);
    }
    if(yogaData.hans) {
        var text = "Jupiter is exalted in your chart and is in Kendra.";
        genElements("Hans", text);
    }
    if(yogaData.sasa) {
        var text = "Saturn is exalted in your chart and is in Kendra.";
        genElements("Sasa", text);
    }
    if(yogaData.gajakeshari) {
        var text = "Moon and Jupiter are in Kendra from each other.";
        genElements("Gajakeshari", text);
    }
    if(yogaData.neechbhangraj.length) {
        var text = "The following pairs of planets have their debilitations cancelled:";
        genElements("NeechBhangRaj", text);

        var element = document.getElementById("yogas");
        yogaData.neechbhangraj.forEach(item => { 
            var psubtag = document.createElement("p");
            var psubtext = document.createTextNode(item);
            psubtag.appendChild(psubtext);
            element.appendChild(psubtag);
         });
    }
    if(yogaData.shukra) {
        var text = "Venus is in the 12th house";
        genElements("Shukra", text);
    }
}

function genYogas() {
    var currProfile = getProfile().then(profile => {
        checkYogas(profile.yogaData);
    }).catch(err => console.log(err));
}