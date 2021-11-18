let classifier;
let detector;
let uploadedImage;
let addressInput;
let width = 350;
let height = 350;
let objectDetected;
let window_screen_attempts = true;
let detection_failed = true;


function preload(){
    classifier = ml5.imageClassifier('MobileNet');
    detector = ml5.objectDetector('cocossd');
}

function setup() {
    let canvas = createCanvas(width,height);
    canvas.parent("image_drop_area");
    handleDragnDrop();
}

function draw(){
    if (uploadedImage){
        uploadedImage.resize(width, height);
        image(uploadedImage,0,0);
    }
    if(objectDetected){
        for(var i = 0; i< objectDetected.length; i++){
            obj = objectDetected[i];
            noFill();
            strokeWeight(4);
            stroke(0,255,0);
            rect(obj.x, obj.y, obj.width, obj.height);
            fill(255);
            stroke(0);
            textSize(15);
            text(obj.label, obj.x + 10, obj.y + 25);

        }
    }
}


function imageClassified(err, results){
    if (results[0].label == "window screen" && window_screen_attempts){
        window_screen_attempts = false;
        classifier.classify(uploadedImage, imageClassified);
    }
    if(err){
        console.error("error")
    }
    document.querySelector("#obj").textContent = results[0].label;
    document.querySelector("#prob").textContent = nf(results[0].confidence * 100, 0, 2) + "%";
    window_screen_attempts = true;
}

function detectionCompleted(err, results){
    if(results[0] == undefined && detection_failed){
        detection_failed = false;
        detector.detect(uploadedImage, detectionCompleted);
    }
    if(err){
        console.log(err)
    }
    objectDetected = results;
    detection_failed = true;
}


function run(){
    classifier.classify(uploadedImage, imageClassified);
    detector.detect(uploadedImage, detectionCompleted);
}

function load(){
    addressInput = document.querySelector('#address');
    address = addressInput.value;
    uploadedImage = loadImage(address);
    document.querySelector("#file_name").textContent = "";
    run();
}



function handleDragnDrop(){    
    imageDropArea = document.querySelector("#image_drop_area");
    imageDropArea.addEventListener('dragover', (event) => {
        event.stopPropagation();
        event.preventDefault();
        event.dataTransfer.dropEffect = 'copy';
    });

    imageDropArea.addEventListener('drop', (event) => {
        event.stopPropagation();
        event.preventDefault();
        const fileList = event.dataTransfer.files;
        document.querySelector("#file_name").textContent = "Image name: " + fileList[0].name;
        readImage(fileList[0]);
    });

     readImage = (file) => {
        const reader = new FileReader();
        reader.addEventListener('load', (event) => {
        imgURL = event.target.result;
        //imageDropArea.style.backgroundImage = `url(${imgURL})`;
        uploadedImage = loadImage(imgURL);
        uploadedImage.resize(width,height);
        run();
        });
        reader.readAsDataURL(file);
    }
    
}