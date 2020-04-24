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
    canvas.addEventListener('touchstart', startPosition);
    canvas.addEventListener('touchend', finishPosition);
    canvas.addEventListener('touchmove', draw);
    canvas.addEventListener('mouseleave', finishPosition);
    clearButton.addEventListener('click', clearCanvas);
    saveButton.addEventListener('click', saveImage);
});
window.addEventListener('resize', resize);
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
function startPosition(e) {
    painting = true;
    oldPoint = null;
    thisPoint = null;
    document.body.style.cursor = "crosshair";
    var rect = canvas.getBoundingClientRect();
    if (e instanceof MouseEvent) {
        newPoint = [e.clientX - rect.left, e.clientY - rect.top];
    }
    else if (e instanceof TouchEvent) {
        newPoint = [e.touches[0].clientX - rect.left, e.touches[0].clientY - rect.top];
    }
}
function finishPosition() {
    painting = false;
    ctx === null || ctx === void 0 ? void 0 : ctx.beginPath();
    oldPoint = null;
    thisPoint = null;
    newPoint = null;
}
function draw(e) {
    var pos = getMousePos(e);
    if (erasor) {
        ctx === null || ctx === void 0 ? void 0 : ctx.clearRect(pos.x - 15, pos.y - 15, 30, 30);
    }
    else if (painting) {
        ctx ? ctx.lineWidth = 6 : console.log("ctx not found");
        ctx ? ctx.lineCap = "round" : console.log("ctx not found");
        ctx === null || ctx === void 0 ? void 0 : ctx.lineTo(pos.x, pos.y);
        ctx === null || ctx === void 0 ? void 0 : ctx.stroke();
        ctx === null || ctx === void 0 ? void 0 : ctx.beginPath();
        ctx === null || ctx === void 0 ? void 0 : ctx.moveTo(pos.x, pos.y);
    }
    else {
        return;
    }
}
function resize() {
    updateSize(canvas);
}
function updateSize(canvas) {
    canvas.height = 0.5 * window.innerHeight;
    canvas.width = window.innerWidth;
}
function clearCanvas() {
    ctx === null || ctx === void 0 ? void 0 : ctx.clearRect(0, 0, canvas.width, canvas.height);
}
function getMousePos(e) {
    var rect = canvas.getBoundingClientRect();
    if (e instanceof MouseEvent) {
        return {
            x: (e.clientX - rect.left) / (rect.right - rect.left) * canvas.width,
            y: (e.clientY - rect.top) / (rect.bottom - rect.top) * canvas.height
        };
    }
    else if (e instanceof TouchEvent) {
        return {
            x: (e.touches[0].clientX - rect.left) / (rect.right - rect.left) * canvas.width,
            y: (e.touches[0].clientY - rect.top) / (rect.bottom - rect.top) * canvas.height
        };
    }
    return {
        x: 0,
        y: 0
    };
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
