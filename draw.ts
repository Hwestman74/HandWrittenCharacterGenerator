// BUGS
// Scroll is not prevented on DuckDuckGo, 
// Cannot just dot to get a dot on Firefox
// This is useful for multiplication and
// dots over i.

let clearButton: HTMLButtonElement;
let saveButton: HTMLButtonElement;
let pixelizeButton: HTMLButtonElement;
let MIME_TYPE = "image/png";
let canvas:HTMLCanvasElement;
let charInput: HTMLInputElement;
let ctx:CanvasRenderingContext2D|null;
let oldPoint:number[]|null
let thisPoint:number[]|null;
let newPoint:number[]|null;
const strokeWidth = 10;
const erasorSize = 30;

let painting:boolean = false;
let erasor = false;

let screenWidth:number;
let screenHeight:number;

window.addEventListener("keydown", onKeyDown);
window.addEventListener("keyup", onKeyDown);
window.addEventListener('load', initializeApp);

function initializeApp(){
    // screen.orientation.lock('portrait');
    screenHeight = window.innerHeight;
    screenWidth = window.innerWidth;
    canvas = <HTMLCanvasElement>document.getElementById("canvas");
    ctx = canvas.getContext("2d");
    let el = document.getElementById("characterInput");
    if(el instanceof HTMLInputElement){
        charInput = el;
    }

    clearButton = <HTMLButtonElement>document.getElementById("clearButton");
    saveButton = <HTMLButtonElement>document.getElementById("saveButton");
    pixelizeButton = <HTMLButtonElement>document.getElementById("pixelizeButton");

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
    let pos = getMousePos(e);
    newPoint = [pos.x,pos.y];
    ctx? ctx.lineWidth = strokeWidth : console.log("ctx not found");
    ctx? ctx.lineCap = "round" : console.log("ctx not found");
    ctx?.lineTo(pos.x,pos.y);
    ctx?.stroke();
    ctx?.beginPath();
    ctx?.moveTo(pos.x,pos.y);
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
        ctx?.clearRect(pos.x-erasorSize/2,pos.y-erasorSize/2,erasorSize,erasorSize);
    } else if(painting){
        ctx? ctx.lineWidth = strokeWidth : console.log("ctx not found");
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

function resize (){
    updateSize(canvas);
}

function updateSize (canvas:HTMLCanvasElement) {
    canvas.width = 224;
    canvas.height = 224;
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
        let imgURL = canvas?.toDataURL(MIME_TYPE);
        
        let dlLink = document.createElement('a');
        let fileName = charName +"_"+ randInt().toString() +".png";
        dlLink.download = fileName;
        dlLink.href = imgURL;
        dlLink.dataset.downloadurl = [MIME_TYPE, dlLink.download, dlLink.href].join(':');
        document.body.appendChild(dlLink);
        dlLink.click();
        document.body.removeChild(dlLink);
        clearCanvas();
    }
}

function randInt():number{
    return Math.floor(Math.random() * Math.floor(1000000));
}



function pixelizeImage(){
    if(ctx) {
        let w= canvas.width;
        let h= canvas.height;
        let img = new Image();
     
        img.src = canvas.toDataURL(MIME_TYPE);
        let pixelArray = ctx.getImageData(0,0,w,h).data;
        let sampleSize = 8;
        ctx.clearRect(0,0,canvas.width,canvas.height);
        
        for(let y=0;y<h;y+=sampleSize) {
            for(let x=0;x<w;x+=sampleSize) {
                let c = cellAverage(pixelArray, x,y,w,sampleSize)/150;
                ctx.fillStyle = ("rgba(" + 0 + "," + 0 + ","+ 0 + ","+ c + ")");
                ctx.fillRect(x,y,sampleSize,sampleSize);
            }
        }
    }

    function cellAverage(arr:Int8Array,x1:number,y1:number,w:number,sampleSize:number):number {
        let x2 = x1+sampleSize;
        let y2 = y1+sampleSize;
        let average = 0;
        for(let y=y1;y<y2;y++){
            for(let x=x1;x<x2;x++){
                let p = getPixel(x,y,w);
                average += arr[p];
            }
        }

        average/=sampleSize*sampleSize;
        return average;
    }

    function getPixel(x:number,y:number,w:number) :number {
        return (x + y * w)*4+3;
    } 

}
