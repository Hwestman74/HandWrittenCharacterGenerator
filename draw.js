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
var h1;
var buttonDiv;
var charInput;
var ctx;
var oldPoint;
var thisPoint;
var newPoint;
var strokeWidth = 10;
var erasorSize = 30;
var pixArrays = [];
var clearOnTouch = false;
var painting = false;
var erasor = false;
var screenWidth;
var screenHeight;
window.addEventListener("keydown", onKeyDown);
window.addEventListener("keyup", onKeyDown);
window.addEventListener('load', initializeApp);
function createCanvasPage() {
    h1 = document.createElement('h1');
    canvas = document.createElement('canvas');
    canvas.id = "canvas";
    ctx = canvas.getContext("2d");
    var el = document.getElementById("characterInput");
    if (el instanceof HTMLInputElement) {
        charInput = el;
    }
    buttonDiv = document.createElement('div');
    buttonDiv.className = "Buttons";
    clearButton = document.createElement('button');
    clearButton.id = "clearButton";
    clearButton.innerHTML = "Clear Canvas";
    pixelizeButton = document.createElement('button');
    pixelizeButton.innerHTML = "Add Sample";
    pixelizeButton.id = "pixelizeButton";
    saveButton = document.createElement('button');
    saveButton.innerHTML = "Download Set";
    saveButton.id = "saveButton";
    charInput = document.createElement('input');
    charInput.id = "characterInput";
    charInput.placeholder = "Enter character name...";
    charInput.type = "text";
    charInput.value = "";
    buttonDiv.appendChild(clearButton);
    buttonDiv.appendChild(pixelizeButton);
    buttonDiv.appendChild(saveButton);
    buttonDiv.appendChild(charInput);
    document.body.appendChild(h1);
    document.body.appendChild(canvas);
    document.body.appendChild(buttonDiv);
}
function initializeApp() {
    screenHeight = window.innerHeight;
    screenWidth = window.innerWidth;
    createCanvasPage();
    // canvas = <HTMLCanvasElement>document.getElementById("canvas");
    // ctx = canvas.getContext("2d");
    // let el = document.getElementById("characterInput");
    // if(el instanceof HTMLInputElement){
    //     charInput = el;
    // }
    // clearButton = <HTMLButtonElement>document.getElementById("clearButton");
    // saveButton = <HTMLButtonElement>document.getElementById("saveButton");
    // pixelizeButton = <HTMLButtonElement>document.getElementById("pixelizeButton");
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
    pixelizeButton.addEventListener('click', addSample);
    charInput.addEventListener('change', onChangeChar);
}
window.addEventListener('resize', resize);
function onChangeChar() {
    pixArrays = [];
    sampleCount = 0;
    pixelizeButton.innerHTML = "Add Sample:   " + sampleCount;
    clearCanvas();
}
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
    if (clearOnTouch) {
        clearCanvas();
        clearOnTouch = false;
    }
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
    canvas.width = 224;
    canvas.height = 224;
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
        var json = JSON.stringify(pixArrays[0]);
        var blob = new Blob([json], { type: "text/plain;charset=utf-8" });
        var url = window.URL || window.webkitURL;
        var link = url.createObjectURL(blob);
        var a = document.createElement("a");
        a.download = charName + ".json";
        a.href = link;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        sampleCount = 0;
        pixArrays = [];
    }
}
function randInt() {
    return Math.floor(Math.random() * Math.floor(1000000));
}
var sampleCount = 0;
function addSample() {
    if (ctx && !clearOnTouch) {
        var w = canvas.width;
        var h = canvas.height;
        var img = new Image();
        img.src = canvas.toDataURL(MIME_TYPE);
        var pixelArray = ctx.getImageData(0, 0, w, h).data;
        var sampleSize = 8;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        var pixelizedArray = [];
        for (var y = 0; y < h; y += sampleSize) {
            for (var x = 0; x < w; x += sampleSize) {
                var c = cellAverage(pixelArray, x, y, w, sampleSize);
                ctx.fillStyle = ("rgba(" + 0 + "," + 0 + "," + 0 + "," + c / 200 + ")");
                ctx.fillRect(x, y, sampleSize, sampleSize);
                pixelizedArray[x + 28 * y] = c;
            }
        }
        pixelizedArray.forEach(function (e) {
            console.log(e);
        });
        pixArrays[sampleCount] = pixelizedArray;
        sampleCount++;
        pixelizeButton.innerHTML = "Add Sample:   " + sampleCount;
        clearOnTouch = true;
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
