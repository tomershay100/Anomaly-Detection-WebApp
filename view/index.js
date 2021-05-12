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
    document.getElementById("chartContainer").style.display = "none";
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
    sendDataToServer({train_data: TrainMap}, {predict_data: TestMap}, ModelType)
    document.getElementById('errorOnSubmit').innerHTML = "files uploaded successfully";
    sleep(3000).then(() => {
        document.getElementById('errorOnSubmit').innerHTML = '';
    });
    document.getElementById("loader").style.display = "inline-block";
}
