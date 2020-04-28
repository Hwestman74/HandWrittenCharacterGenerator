"use strict";
// BUGS
// Scroll is not prevented on DuckDuckGo, 
// Cannot just dot to get a dot on Firefox
// This is useful for multiplication and
// dots over i.
var clearButton;
var saveButton;
var pixelizeButton;
var MIME_TYPE = "image/png";
var canvas;
var charInput;
var ctx;
var oldPoint;
var thisPoint;
var newPoint;
var strokeWidth = 10;
var erasorSize = 30;
var painting = false;
var erasor = false;
var screenWidth;
var screenHeight;
window.addEventListener("keydown", onKeyDown);
window.addEventListener("keyup", onKeyDown);
window.addEventListener('load', initializeApp);
function initializeApp() {
    // screen.orientation.lock('portrait');
    screenHeight = window.innerHeight;
    screenWidth = window.innerWidth;
    canvas = document.getElementById("canvas");
    ctx = canvas.getContext("2d");
    var el = document.getElementById("characterInput");
    if (el instanceof HTMLInputElement) {
        charInput = el;
    }
    clearButton = document.getElementById("clearButton");
    saveButton = document.getElementById("saveButton");
    pixelizeButton = document.getElementById("pixelizeButton");
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
    pixelizeButton.addEventListener('click', pixelizeImage);
}
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
    var pos = getMousePos(e);
    newPoint = [pos.x, pos.y];
    ctx ? ctx.lineWidth = strokeWidth : console.log("ctx not found");
    ctx ? ctx.lineCap = "round" : console.log("ctx not found");
    ctx === null || ctx === void 0 ? void 0 : ctx.lineTo(pos.x, pos.y);
    ctx === null || ctx === void 0 ? void 0 : ctx.stroke();
    ctx === null || ctx === void 0 ? void 0 : ctx.beginPath();
    ctx === null || ctx === void 0 ? void 0 : ctx.moveTo(pos.x, pos.y);
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
        ctx === null || ctx === void 0 ? void 0 : ctx.clearRect(pos.x - erasorSize / 2, pos.y - erasorSize / 2, erasorSize, erasorSize);
    }
    else if (painting) {
        ctx ? ctx.lineWidth = strokeWidth : console.log("ctx not found");
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
    canvas.width = 280;
    canvas.height = 280;
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
        var imgURL = canvas === null || canvas === void 0 ? void 0 : canvas.toDataURL(MIME_TYPE);
        var dlLink = document.createElement('a');
        var fileName = charName + "_" + randInt().toString() + ".png";
        dlLink.download = fileName;
        dlLink.href = imgURL;
        dlLink.dataset.downloadurl = [MIME_TYPE, dlLink.download, dlLink.href].join(':');
        document.body.appendChild(dlLink);
        dlLink.click();
        document.body.removeChild(dlLink);
        clearCanvas();
    }
}
function randInt() {
    return Math.floor(Math.random() * Math.floor(1000000));
}
function pixelizeImage() {
    if (ctx) {
        var w = canvas.width;
        var h = canvas.height;
        var img = new Image();
        img.src = canvas.toDataURL(MIME_TYPE);
        var pixelArray = ctx.getImageData(0, 0, w, h).data;
        var sampleSize = 10;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (var y = 0; y < h; y += sampleSize) {
            for (var x = 0; x < w; x += sampleSize) {
                var c = cellAverage(pixelArray, x, y, w, sampleSize) / 150;
                ctx.fillStyle = ("rgba(" + 0 + "," + 0 + "," + 0 + "," + c + ")");
                ctx.fillRect(x, y, sampleSize, sampleSize);
            }
        }
    }
    function cellAverage(arr, x1, y1, w, sampleSize) {
        var x2 = x1 + sampleSize;
        var y2 = y1 + sampleSize;
        var average = 0;
        for (var y = y1; y < y2; y++) {
            for (var x = x1; x < x2; x++) {
                var p = getPixel(x, y, w);
                average += arr[p];
            }
        }
        average /= sampleSize * sampleSize;
        return average;
    }
    function getPixel(x, y, w) {
        return (x + y * w) * 4 + 3;
    }
}
