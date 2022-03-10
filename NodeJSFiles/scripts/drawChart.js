// Handles drawing of birth chart
const HEIGHT = 600;
const WIDTH = 1000;

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


}