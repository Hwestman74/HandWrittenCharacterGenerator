var clearButton;
var saveButton;
var canvas;
var charInput;
var ctx;
var oldPoint;
var thisPoint;
var newPoint;
var painting = false;
var erasor = false;
window.addEventListener("keydown", onKeyDown);
window.addEventListener("keyup", onKeyDown);
window.addEventListener('load', function () {
    screen.orientation.lock('portrait');
    canvas = document.getElementById("canvas");
    ctx = canvas.getContext("2d");
    var el = document.getElementById("characterInput");
    if (el instanceof HTMLInputElement) {
        charInput = el;
    }
    clearButton = document.getElementById("clearButton");
    saveButton = document.getElementById("saveButton");
    //Resizing
    updateSize(canvas);
    //Eventlisteners
    canvas.addEventListener('mousedown', startPosition);
    canvas.addEventListener('mouseup', finishPosition);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('touchstart', sPosition);
    canvas.addEventListener('touchend', finishPosition);
    canvas.addEventListener('touchmove', touchdraw);
    canvas.addEventListener('mouseleave', finishPosition);
    clearButton.addEventListener('click', clearCanvas);
    saveButton.addEventListener('click', saveImage);
});
function onKeyDown(e) {
    erasor = e.shiftKey;
    painting = e.ctrlKey;
    if (erasor) {
        document.body.style.cursor = "pointer";
    }
    else if (painting) {
        document.body.style.cursor = "crosshair";
    }
    else {
        document.body.style.cursor = "default";
        finishPosition();
    }
}
function sPosition(e) {
    painting = true;
    oldPoint = null;
    thisPoint = null;
    document.body.style.cursor = "crosshair";
    newPoint = [e.touches[0].clientX, e.touches[0].clientY];
}
function startPosition(e) {
    painting = true;
    oldPoint = null;
    thisPoint = null;
    document.body.style.cursor = "crosshair";
    newPoint = [e.clientX, e.clientY];
}
function finishPosition() {
    painting = false;
    ctx === null || ctx === void 0 ? void 0 : ctx.beginPath();
    oldPoint = null;
    thisPoint = null;
    newPoint = null;
}
function touchdraw(e) {
    if (e != null) {
        console.log(e.touches[0].clientX);
    }
    if (erasor) {
        ctx === null || ctx === void 0 ? void 0 : ctx.clearRect(e.touches[0].clientX - 15, e.touches[0].clientY - 15, 30, 30);
    }
    else if (painting) {
        ctx ? ctx.lineWidth = 6 : console.log("ctx not found");
        ctx ? ctx.lineCap = "round" : console.log("ctx not found");
        oldPoint = thisPoint;
        thisPoint = newPoint;
        newPoint = [e.touches[0].clientX, e.touches[0].clientY];
        if (oldPoint != null && thisPoint != null && newPoint != null) {
            ctx === null || ctx === void 0 ? void 0 : ctx.moveTo(oldPoint[0], oldPoint[1]);
            ctx === null || ctx === void 0 ? void 0 : ctx.quadraticCurveTo(thisPoint[0], thisPoint[1], newPoint[0], newPoint[1]);
            ctx === null || ctx === void 0 ? void 0 : ctx.stroke();
            ctx === null || ctx === void 0 ? void 0 : ctx.beginPath();
        }
        else {
            ctx === null || ctx === void 0 ? void 0 : ctx.lineTo(e.touches[0].clientX, e.touches[0].clientY);
            ctx === null || ctx === void 0 ? void 0 : ctx.stroke();
            ctx === null || ctx === void 0 ? void 0 : ctx.beginPath();
            ctx === null || ctx === void 0 ? void 0 : ctx.moveTo(newPoint[0], newPoint[1]);
        }
    }
    else {
        return;
    }
}
function draw(e) {
    if (erasor) {
        ctx === null || ctx === void 0 ? void 0 : ctx.clearRect(e.clientX - 15, e.clientY - 15, 30, 30);
    }
    else if (painting) {
        ctx ? ctx.lineWidth = 6 : console.log("ctx not found");
        ctx ? ctx.lineCap = "round" : console.log("ctx not found");
        oldPoint = thisPoint;
        thisPoint = newPoint;
        newPoint = [e.clientX, e.clientY];
        if (oldPoint != null && thisPoint != null && newPoint != null) {
            ctx === null || ctx === void 0 ? void 0 : ctx.moveTo(oldPoint[0], oldPoint[1]);
            ctx === null || ctx === void 0 ? void 0 : ctx.quadraticCurveTo(thisPoint[0], thisPoint[1], newPoint[0], newPoint[1]);
            ctx === null || ctx === void 0 ? void 0 : ctx.stroke();
            ctx === null || ctx === void 0 ? void 0 : ctx.beginPath();
        }
        else {
            ctx === null || ctx === void 0 ? void 0 : ctx.lineTo(e.clientX, e.clientY);
            ctx === null || ctx === void 0 ? void 0 : ctx.stroke();
            ctx === null || ctx === void 0 ? void 0 : ctx.beginPath();
            ctx === null || ctx === void 0 ? void 0 : ctx.moveTo(newPoint[0], newPoint[1]);
        }
    }
    else {
        return;
    }
}
function updateSize(canvas) {
    canvas.height = 0.5 * window.innerHeight;
    canvas.width = 0.99 * window.innerWidth;
    // canvas.height = 84;
    // canvas.width = 84;
}
function clearCanvas() {
    ctx === null || ctx === void 0 ? void 0 : ctx.clearRect(0, 0, canvas.width, canvas.height);
}
function saveImage() {
    var charName = charInput === null || charInput === void 0 ? void 0 : charInput.value;
    if (charName == "") {
        window.alert("Invalid character name!");
    }
    else {
        var MIME_TYPE = "image/png";
        var imgURL = canvas === null || canvas === void 0 ? void 0 : canvas.toDataURL(MIME_TYPE);
        var dlLink = document.createElement('a');
        var max = 1000000;
        var randInt = Math.floor(Math.random() * Math.floor(max));
        var fileName = charName + "_" + randInt.toString() + ".png";
        dlLink.download = fileName;
        dlLink.href = imgURL;
        dlLink.dataset.downloadurl = [MIME_TYPE, dlLink.download, dlLink.href].join(':');
        document.body.appendChild(dlLink);
        dlLink.click();
        document.body.removeChild(dlLink);
        clearCanvas();
    }
}
