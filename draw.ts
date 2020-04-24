let clearButton: HTMLButtonElement;
let saveButton: HTMLButtonElement;
let canvas:HTMLCanvasElement;
let charInput: HTMLInputElement|null;
let ctx:CanvasRenderingContext2D|null;
let oldPoint:number[]|null
let thisPoint:number[]|null;
let newPoint:number[]|null;

let painting = false;
let erasor = false;

window.addEventListener("keydown", onKeyDown);
window.addEventListener("keyup", onKeyDown);
window.addEventListener('load', () => {
    screen.orientation.lock('portrait');
    canvas = <HTMLCanvasElement>document.getElementById("canvas");
    ctx = canvas.getContext("2d");
    let el = document.getElementById("characterInput");
    if(el instanceof HTMLInputElement){
        charInput = el;
    }

    clearButton = <HTMLButtonElement>document.getElementById("clearButton");
    saveButton = <HTMLButtonElement>document.getElementById("saveButton");

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

function onKeyDown(e:KeyboardEvent) {
    erasor = e.shiftKey;
    painting = e.ctrlKey;
    if(erasor){
        document.body.style.cursor = "pointer";
    } else if(painting){
        document.body.style.cursor = "crosshair";
    } else {
        document.body.style.cursor = "default";
        finishPosition();
    }
}

function startPosition(e:MouseEvent|TouchEvent) {
    painting = true;
    oldPoint = null;
    thisPoint = null;
    document.body.style.cursor = "crosshair";
    let rect = canvas.getBoundingClientRect();

    if(e instanceof MouseEvent) {
        newPoint = [e.clientX - rect.left,e.clientY - rect.top];
    } else  if(e instanceof TouchEvent) {
        newPoint = [e.touches[0].clientX - rect.left,e.touches[0].clientY - rect.top];
    }
}

function finishPosition() {
    painting = false;
    ctx?.beginPath();
    oldPoint = null;
    thisPoint = null;
    newPoint = null;
}

function draw(e:MouseEvent|TouchEvent) {
    let pos = getMousePos(e);

    if (erasor){
        ctx?.clearRect(pos.x-15,pos.y-15,30,30);
    } else if(painting){
        ctx? ctx.lineWidth = 6 : console.log("ctx not found");
        ctx? ctx.lineCap = "round" : console.log("ctx not found");

        ctx?.lineTo(pos.x,pos.y);
        ctx?.stroke();
        ctx?.beginPath();
        ctx?.moveTo(pos.x,pos.y);
    }
    else {
        return;
    }
}

function updateSize (canvas:HTMLCanvasElement) {
    canvas.height =0.5* window.innerHeight;
    canvas.width = window.innerWidth;
}

function clearCanvas() {
    ctx?.clearRect(0,0,canvas.width,canvas.height);
}

function getMousePos(e:MouseEvent|TouchEvent) {
    var rect = canvas.getBoundingClientRect();
    if(e instanceof MouseEvent){
        return {
            x: (e.clientX - rect.left) / (rect.right - rect.left) * canvas.width,
            y: (e.clientY - rect.top) / (rect.bottom - rect.top) * canvas.height
        };
    }
    else if(e instanceof TouchEvent) {
        return {
            x: (e.touches[0].clientX - rect.left) / (rect.right - rect.left) * canvas.width,
            y: (e.touches[0].clientY - rect.top) / (rect.bottom - rect.top) * canvas.height
        };
    }
    return {
        x:0,
        y:0
    }
}

function saveImage() {
    let charName = charInput?.value;
    if(charName==""){
        window.alert("Invalid character name!")
    } else {
        var MIME_TYPE = "image/png";
        var imgURL = canvas?.toDataURL(MIME_TYPE);
        var dlLink = document.createElement('a');
        let max = 1000000;
        let randInt = Math.floor(Math.random() * Math.floor(max));
        let fileName = charName +"_"+ randInt.toString() +".png";
        dlLink.download = fileName;
        dlLink.href = imgURL;
        dlLink.dataset.downloadurl = [MIME_TYPE, dlLink.download, dlLink.href].join(':');
        document.body.appendChild(dlLink);
        dlLink.click();
        document.body.removeChild(dlLink);
        clearCanvas();
    }
}
