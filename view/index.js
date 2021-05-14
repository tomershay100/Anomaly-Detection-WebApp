function saveTrainFile(input) {
    let file = input.files[0];
    let reader = new FileReader();
    reader.readAsText(file);
    reader.onload = function () {
        TrainString = reader.result;
        document.getElementById("trainFileName").innerHTML = file.name
    };
    reader.onerror = function () {
        TrainString = 'error';
    };
}

function saveTestFile(input) {
    let file = input.files[0];
    let reader = new FileReader();
    reader.readAsText(file);
    reader.onload = function () {
        TestString = reader.result;
        document.getElementById("testFileName").innerHTML = file.name
    };
    reader.onerror = function () {
        TestString = 'error';
    };
}

function submit() {
    hideGraph();
    if (TrainString === undefined || TestString === undefined) {
        document.getElementById('errorOnSubmit').innerHTML = "please upload both train and test files.";
        return;
    }
    if (TrainString === 'error' || TestString === 'error') {
        document.getElementById('errorOnSubmit').innerHTML = "error while uploading files, please upload again";
        return;
    }
    ModelType = document.getElementById('regression').checked ? "regression" : "hybrid";
    TrainMap = parseCsv(TrainString);
    TestMap = parseCsv(TestString);
    submitPressed({train_data: TrainMap}, {predict_data: TestMap}, ModelType)
    document.getElementById('errorOnSubmit').innerHTML = "files uploaded successfully";
    sleep(3000).then(() => {
        document.getElementById('errorOnSubmit').innerHTML = '';
    });
    showLoader();
}

function addFeature(feature) {
    let featuresList = document.getElementById("featuresList");
    let option = document.createElement("option");
    option.text = feature;
    featuresList.add(option);
}

function FeatureSelection(feature) {
    let featuresList = document.getElementById("featuresList");
    for (let option of featuresList) {
        if(option.text === feature)
            option.selected = true;
    }
}

function selectedFeature(){
    analyzedSelection()
}

function showGraph() {
    document.getElementById("anomaliesGraph").style.display = "inline-block";
}

function hideGraph() {
    document.getElementById("anomaliesGraph").style.display = "none";
}

function showLoader() {
    document.getElementById("loader").style.display = "inline-block";
}

function hideLoader() {
    document.getElementById("loader").style.display = "none";
}

function currentFeature() {
    return document.getElementById("featuresList").value
}

function deleteFeaturesList() {
    let featuresList = document.getElementById("featuresList");
    let size = featuresList.length
    for (let i = 0; i < size; i++) {
        featuresList.remove(0);
    }
}