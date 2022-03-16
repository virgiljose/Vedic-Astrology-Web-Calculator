// Handles drawing of birth chart
const HEIGHT = 800;
const WIDTH = 800;

const FONT_SIZE = 24;
const OFFSET = FONT_SIZE*5/3;

// Default positions of objects for a given house
const OBJ_POS = [
    { width: WIDTH/2, height: HEIGHT/4 },
    { width: WIDTH/4, height: HEIGHT/16 },
    { width: WIDTH/16, height: HEIGHT/4 },
    { width: WIDTH/4, height: HEIGHT/2 },

    { width: WIDTH/16, height: 3*HEIGHT/4 },
    { width: WIDTH/4, height: 15*HEIGHT/16 },
    { width: WIDTH/2, height: 3*HEIGHT/4 },
    { width: 3*WIDTH/4, height: 15*HEIGHT/16 },

    { width: 15*WIDTH/16, height: 3*HEIGHT/4 },
    { width: 3*WIDTH/4, height: HEIGHT/2 },
    { width: 15*WIDTH/16, height: HEIGHT/4 },
    { width: 3*WIDTH/4, height: HEIGHT/16 }
];

const SIGN_POS = [
    { width: WIDTH/2, height: HEIGHT/2 - OFFSET },
    { width: WIDTH/4, height: HEIGHT/4 - OFFSET },
    { width: WIDTH/4 - OFFSET, height: HEIGHT/4 },
    { width: WIDTH/2 - OFFSET, height: HEIGHT/2 },
    { width: WIDTH/4 - OFFSET, height: 3*HEIGHT/4 },
    { width: WIDTH/4, height: 3*HEIGHT/4 + OFFSET },
    { width: WIDTH/2, height: HEIGHT/2 + OFFSET },
    { width: 3*WIDTH/4, height: 3*HEIGHT/4 + OFFSET },
    { width: 3*WIDTH/4 + OFFSET, height: 3*HEIGHT/4 },
    { width: WIDTH/2 + OFFSET, height: HEIGHT/2 },
    { width: 3*WIDTH/4 + OFFSET, height: HEIGHT/4 },
    { width: 3*WIDTH/4, height: HEIGHT/4 - OFFSET }
]

async function getProfile() {
    try {
        let res = await fetch('http://localhost:8080/currProfile');
        let data = await res.json();
        return data;
    } catch (error) {
        console.log(error);
    }
}

// Create house boundaries (North Indian style)
function drawLines(ctx) {
    ctx.lineWidth = 1;
    ctx.moveTo(0, 0);
    ctx.lineTo(WIDTH, HEIGHT);
    ctx.moveTo(0, HEIGHT);
    ctx.lineTo(WIDTH, 0);
    ctx.moveTo(0, 0);
    ctx.lineTo(WIDTH, HEIGHT);
    ctx.moveTo(WIDTH/2, 0);
    ctx.lineTo(0, HEIGHT/2);
    ctx.moveTo(0, HEIGHT/2);
    ctx.lineTo(WIDTH/2, HEIGHT);
    ctx.moveTo(WIDTH/2, HEIGHT);
    ctx.lineTo(WIDTH, HEIGHT/2);
    ctx.moveTo(WIDTH, HEIGHT/2);
    ctx.lineTo(WIDTH/2, 0);
    ctx.stroke();

    ctx.lineWidth = 4;
    ctx.moveTo(0, 0);
    ctx.lineTo(0, HEIGHT);
    ctx.lineTo(WIDTH, HEIGHT);
    ctx.lineTo(WIDTH, 0);
    ctx.lineTo(0, 0);
    ctx.stroke();
}

function drawObjs(profile, ctx) {
    // Label objects
    ctx.font = "24px Helvetica";
    ctx.fillStyle = "black";
    ctx.textAlign = "center";

    [...Array(12)].forEach((_, i) => {

        // Get number of planets in a given house
        var astroObjs = profile.houseData[String(i+1)].astroObjectList;
        var numObjs = astroObjs.length;

        //if(numObjs) { console.log(profile.houseData[String(i+1)].astroObjectList[0].objSymbol) };

        // Determine the position of the first planet in the chart
        startOffset = Math.min(numObjs,5)*OFFSET/3;
        startOffset2nd = (numObjs - 5)*OFFSET/3;
        
        if(i==2 || i==4 || i==8 || i==10) {
            [...Array(numObjs)].forEach((_, j) => {

                if( j > 4 ) {
                    if (i==2 || i==4) {
                        ctx.fillText(astroObjs[j].objSymbol, OBJ_POS[i].width + OFFSET, OBJ_POS[i].height - startOffset2nd + (j-5)*OFFSET);
                    }
                    else {
                        ctx.fillText(astroObjs[j].objSymbol, OBJ_POS[i].width - OFFSET, OBJ_POS[i].height - startOffset2nd + (j-5)*OFFSET);
                    }
                }
                else {
                    ctx.fillText(astroObjs[j].objSymbol, OBJ_POS[i].width, OBJ_POS[i].height - startOffset + j*OFFSET);
                }
            });
        }
        else {
            [...Array(numObjs)].forEach((_, j) => {
                if( j > 4 ) {
                    if (i==1 || i==11) {
                        ctx.fillText(astroObjs[j].objSymbol, OBJ_POS[i].width  - startOffset2nd + (j-5)*OFFSET, OBJ_POS[i].height + OFFSET);
                    }
                    else {
                        ctx.fillText(astroObjs[j].objSymbol, OBJ_POS[i].width  - startOffset2nd + (j-5)*OFFSET, OBJ_POS[i].height - OFFSET);
                    }
                }
                else {
                    ctx.fillText(astroObjs[j].objSymbol, OBJ_POS[i].width - startOffset + j*OFFSET, OBJ_POS[i].height);
                }
            });
        }
    });
}

function drawSigns(profile,ctx) {

    // Label objects
    ctx.font = "24px Helvetica";
    ctx.fillStyle = "red";
    ctx.textAlign = "center";

    [...Array(12)].forEach((_, i) => {
        ctx.fillText(profile.houseData[String(i+1)].sign, SIGN_POS[i].width, SIGN_POS[i].height);
    });
}

function draw() {
    var canvas = document.getElementById("birthChart");
    var ctx = canvas.getContext("2d");
    
    // Fill background of chart
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(0, 0, WIDTH, HEIGHT);

    drawLines(ctx);

    var currProfile = getProfile().then(profile => {
            drawObjs(profile, ctx);
            drawSigns(profile, ctx);
        }).catch(err => console.log(err));
}