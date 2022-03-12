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


function draw() {
    var canvas = document.getElementById("birthChart");
    var ctx = canvas.getContext("2d");
    
    // Fill background of chart
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(0, 0, WIDTH, HEIGHT);

    // Create house boundaries (North Indian style)
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

    ctx.font = "24px Helvetica";
    ctx.fillStyle = "black";
    ctx.textAlign = "center";

    // Draw points where each object should be
    [...Array(12)].forEach((_, i) => {

        // Get number of planets in a given house
        numObjs = 7;

        // Determine the position of the first planet in the chart
        startOffset = Math.min(numObjs,5)*OFFSET/3;
        startOffset2nd = (numObjs - 5)*OFFSET/3;
        
        if(i==2 || i==4 || i==8 || i==10) {
            [...Array(numObjs)].forEach((_, j) => {

                if( j > 4 ) {
                    if (i==2 || i==4) {
                        ctx.fillText("Ob", OBJ_POS[i].width + OFFSET, OBJ_POS[i].height - startOffset2nd + (j-5)*OFFSET);
                    }
                    else {
                        ctx.fillText("Ob", OBJ_POS[i].width - OFFSET, OBJ_POS[i].height - startOffset2nd + (j-5)*OFFSET);
                    }
                }
                else {
                    ctx.fillText("Ob", OBJ_POS[i].width, OBJ_POS[i].height - startOffset + j*OFFSET);
                }
            });
        }
        else {
            [...Array(numObjs)].forEach((_, j) => {
                if( j > 4 ) {
                    if (i==1 || i==11) {
                        ctx.fillText("Ob", OBJ_POS[i].width  - startOffset2nd + (j-5)*OFFSET, OBJ_POS[i].height + OFFSET);
                    }
                    else {
                        ctx.fillText("Ob", OBJ_POS[i].width  - startOffset2nd + (j-5)*OFFSET, OBJ_POS[i].height - OFFSET);
                    }
                }
                else {
                    ctx.fillText("Ob", OBJ_POS[i].width - startOffset + j*OFFSET, OBJ_POS[i].height);
                }
            });
        }

    });
    
}


//console.log(OBJ_POS[1].width);