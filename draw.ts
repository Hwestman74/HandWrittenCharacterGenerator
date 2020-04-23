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
    canvas = <HTMLCanvasElement>document.getElementById("canvas");
    ctx = canvas.getContext("2d");
    
    let el = document.getElementById("CharacterInput");
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

    canvas.addEventListener('touchstart', sPosition);
    canvas.addEventListener('touchend', finishPosition);
    canvas.addEventListener('touchmove', touchdraw);

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


function sPosition(e:TouchEvent) {
    painting = true;
    oldPoint = null;
    thisPoint = null;
    document.body.style.cursor = "crosshair";
    newPoint = [e.touches[0].clientX,e.touches[0].clientY];
}

function startPosition(e:MouseEvent) {
    painting = true;
    oldPoint = null;
    thisPoint = null;
    document.body.style.cursor = "crosshair";
    newPoint = [e.clientX,e.clientY];
}

function finishPosition() {
    painting = false;
    ctx?.beginPath();
    oldPoint = null;
    thisPoint = null;
    newPoint = null;
}

function touchdraw(e:TouchEvent){
    if (erasor){
        ctx?.clearRect(e.touches[0].clientX-15,e.touches[0].clientY-15,30,30);
    } else if(painting){
        ctx? ctx.lineWidth = 3 : console.log("ctx not found");
        ctx? ctx.lineCap = "round" : console.log("ctx not found");

        oldPoint = thisPoint;
        thisPoint = newPoint;
        newPoint = [e.touches[0].clientX,e.touches[0].clientY];

        if(oldPoint!=null && thisPoint!=null && newPoint!=null){
            ctx?.moveTo(oldPoint[0],oldPoint[1]);
            ctx?.quadraticCurveTo(thisPoint[0],thisPoint[1],newPoint[0],newPoint[1]);
            ctx?.stroke();
            ctx?.beginPath();
        } else {
            ctx?.lineTo(e.touches[0].clientX,e.touches[0].clientY);
            ctx?.stroke();
            ctx?.beginPath();
            ctx?.moveTo(newPoint[0],newPoint[1]);
        }
    }
    else {
        return;
    }
}

function draw(e:MouseEvent) {
    if (erasor){
        ctx?.clearRect(e.clientX-15,e.clientY-15,30,30);
    } else if(painting){
        ctx? ctx.lineWidth = 3 : console.log("ctx not found");
        ctx? ctx.lineCap = "round" : console.log("ctx not found");

        oldPoint = thisPoint;
        thisPoint = newPoint;
        newPoint = [e.clientX,e.clientY];

        if(oldPoint!=null && thisPoint!=null && newPoint!=null){
            ctx?.moveTo(oldPoint[0],oldPoint[1]);
            ctx?.quadraticCurveTo(thisPoint[0],thisPoint[1],newPoint[0],newPoint[1]);
            ctx?.stroke();
            ctx?.beginPath();
        } else {
            ctx?.lineTo(e.clientX,e.clientY);
            ctx?.stroke();
            ctx?.beginPath();
            ctx?.moveTo(newPoint[0],newPoint[1]);
        }
    }
    else {
        return;
    }
}

function updateSize (canvas:HTMLCanvasElement) {
    // canvas.height = 0.5*window.innerHeight;
    // canvas.width = 0.9*window.innerWidth;
    canvas.height = 84;
    canvas.width = 84;
    
}

function clearCanvas() {
    ctx?.clearRect(0,0,canvas.width,canvas.height);
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

window.addEventListener('resize', () => {
    updateSize(canvas);   
})
