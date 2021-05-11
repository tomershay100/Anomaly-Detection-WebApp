let TrainString;
let TestString;
let ModelType;
let Features;
let TrainMap;
let TestMap;
let ModelId;

function sleep(time) {
    return new Promise((resolve) => setTimeout(resolve, time));
}

function parseCsv(csvStringFile) {
    let map = {};
    let lines = csvStringFile.split('\n');

    for (let i = 0; i < lines.length; i++) {
        lines[i] = lines[i].split('\r')[0];
    }

    let lineIndex = 0;
    let line = lines[lineIndex];
    let featuresList = line.split(',');
    Features = featuresList;
    let columnsSize = featuresList.length;

    let tampMap = {};
    for (let i = 0; i < featuresList.length; i++) {
        let j = 2;
        while (featuresList[i] in tampMap) {
            featuresList[i] = featuresList[i] + j.toString();
            j++;
        }
        tampMap[featuresList[i]] = [];
    }
    for (let feature of featuresList) {
        map[feature] = [];
    }
    let isFirst = true;
    for (const line of lines) {
        if (!isFirst) {
            let arr = [];
            for (const value of line.split(',')) {
                arr.push(parseFloat(value));
            }
            for (let i = 0; i < columnsSize; i++) {
                map[featuresList[i]].push(arr[i]);
            }
            arr = [];
        }
        isFirst = false;
    }
    for (let feature of featuresList) {
        map[feature].pop();
    }
    return map;
}

function sendDataToServer(trainJson, testJson, modelType) {
    let xhttp;
    xhttp = new XMLHttpRequest();

    xhttp.open("POST", "/api/model" + "?model_type=" + modelType, true);
    xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhttp.send(JSON.stringify(trainJson));
    document.getElementById("listOfFiles").innerHTML =
        "loading..";
    xhttp.onload = function () {

//        console.log(/*this.readyState === 4 && */this.status === 200);

        if (this.readyState === 4 && this.status === 200) {
            onLoadTrain(xhttp, testJson);
        }
    };
}

function onLoadTrain(xhttp, testJson) {
    let modelID = JSON.parse(xhttp.response)["model_id"];
    console.log(xhttp.response);

    let xhttp1;
    xhttp1 = new XMLHttpRequest();

    xhttp1.open("POST", "/api/anomaly" + "?model_id=" + modelID, true);
    xhttp1.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhttp1.send(JSON.stringify(testJson));

    xhttp1.onload = function () {
        if (this.readyState === 4 && this.status === 200) {
            onLoadTest(modelID)
        }
    };
}

function onLoadTest(modelID) {
    let xhttp2;
    xhttp2 = new XMLHttpRequest();

    xhttp2.open("GET", "/api/anomaly" + "?model_id=" + modelID, true);
    xhttp2.send();

    xhttp2.onload = function () {
        if (this.readyState === 4 && this.status === 200) {
            onLoadFeedback();
        }
    };
}

function onLoadFeedback() {
    let x = document.getElementById("lstValue");
    let isFirst = true;
    for (const feature of Features) {
        let option = document.createElement("option");
        option.text = feature;
        x.add(option);
    }
    //inline-block
    document.getElementById("chartContainer").style.display = "inline-block"; //.innerHTML = document.getElementById("lstValue").value;
    document.getElementById("loader").style.display = "none";
    document.getElementById("loading").style.display = "none";


    document.getElementById("listOfFiles").innerHTML = "";
    selectFeature();
}

function selectFeature() {
    let feature = document.getElementById("lstValue").value
    let xhttp;
    let corrFeature;
    let anomalies;
    xhttp = new XMLHttpRequest();
    xhttp.open("GET", "/api/anomaly" + "?model_id=" + ModelId + "&?feature=" + feature, true);
    xhttp.send();
    xhttp.onload = function () {
        if (this.readyState === 4 && this.status === 200) {
            anomalies = JSON.parse(xhttp.response)["anomalies"];
            corrFeature = JSON.parse(xhttp.response)["feature"];
            drawGraph(feature, corrFeature, anomalies);
        }
    };


}