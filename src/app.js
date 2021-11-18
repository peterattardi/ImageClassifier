let classifier;
let imageDropArea;
let uploadedImage;
let addressInput;


function modelLoaded() {
  console.log('Model Loaded!');
}

function setup() {
    noCanvas();
    classifier = ml5.imageClassifier('MobileNet', modelLoaded)
    handleDragnDrop()
}

function run(){

    classifier.classify(uploadedImage, (err, results) => {
        if(err){
            console.error("error")
        }
        document.querySelector("#obj").textContent = results[0].label;
        document.querySelector("#prob").textContent = nf(results[0].confidence * 100, 0, 2) + "%";

    })
}

function load(){
    addressInput = document.querySelector('#address');
    address = addressInput.value;
    imageDropArea = document.querySelector('#image_drop_area')
    imageDropArea.style.backgroundImage = `url(${address})`;
    imageDropArea.style.backgroundSize= "cover";
    imageDropArea.style.backgroundRepeat = "no-repeat";
    imageDropArea.style.backgroundPosition =  "center center";
    uploadedImage = loadImage(address);
    if(uploadedImage){
        enableBtn()
    }
    document.querySelector("#file_name").textContent = "";
    run();

}

function enableBtn(){
    document.getElementById("classify").disabled = false;
}


function handleDragnDrop(){    
    imageDropArea = document.querySelector('#image_drop_area')
    imageDropArea.style.backgroundSize= "cover";
    imageDropArea.style.backgroundRepeat = "no-repeat";
    imageDropArea.style.backgroundPosition =  "center center";

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
        imageDropArea.style.backgroundImage = `url(${imgURL})`;
        uploadedImage = new Image;
        uploadedImage.src = imgURL
        if(uploadedImage){
            enableBtn()
        } 
        });
        reader.readAsDataURL(file);
    }
    
}