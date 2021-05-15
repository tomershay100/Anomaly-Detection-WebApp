let TrainString;
let TestString;
let ModelType;
let Features;
let TrainMap;
let TestMap;
let ModelID;
let currentFeature;
let correlatedFeature;

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


function submitPressed(trainJson, testJson, modelType) {
    if (typeof ModelID !== 'undefined') {
        let httpRequest;
        httpRequest = new XMLHttpRequest();
        httpRequest.open("DELETE", "/api/model" + "?model_id=" + ModelID, true);
        httpRequest.send();
        httpRequest.onload = function () {
                sendDataToServer(trainJson, testJson, modelType);
        };
    } else {
        sendDataToServer(trainJson, testJson, modelType)
    }
}

function sendDataToServer(trainJson, testJson, modelType) {
    let httpRequest;
    httpRequest = new XMLHttpRequest();

    httpRequest.open("POST", "/api/model" + "?model_type=" + modelType, true);
    httpRequest.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    httpRequest.send(JSON.stringify(trainJson));
    httpRequest.onload = function () {
        if (this.readyState === 4 && this.status === 200) {
            ModelID = JSON.parse(httpRequest.response)["model_id"];
            onLoadTrain(testJson);
        }
    };
}

function onLoadTrain(testJson) {
    let httpRequest;
    httpRequest = new XMLHttpRequest();

    httpRequest.open("POST", "/api/anomaly" + "?model_id=" + ModelID, true);
    httpRequest.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    httpRequest.send(JSON.stringify(testJson));

    httpRequest.onload = function () {
        if (this.readyState === 4 && this.status === 200)
            onLoadFeedback();
    };
}

function onLoadFeedback() {
    deleteFeaturesList();
    let isFirst = true;
    for (const feature of Features) {
        addFeature(feature)
        if (isFirst)
            FeatureSelection(feature);
        isFirst = false;
    }
    showGraph();
    hideLoader();
    analyzedSelection();
}

function analyzedSelection() {
    let feature = getCurrentFeature();
    let corrFeature;
    let anomalies;

    let httpRequest;
    httpRequest = new XMLHttpRequest();
    httpRequest.open("GET", "/api/anomaly" + "?model_id=" + ModelID + "&feature=" + feature, true);
    httpRequest.send();

    httpRequest.onload = function () {
        if (this.readyState === 4 && this.status === 200) {
            anomalies = JSON.parse(httpRequest.response)["anomalies"];
            corrFeature = JSON.parse(httpRequest.response)["feature"];
            updateGraphs(feature, corrFeature, anomalies);
        }
    };
}

function updateGraphs(feature, corrFeature, anomalies) {
    let featurePoints = [];
    let featureAnomalies = [];
    let corrFeaturePoints = [];
    let corrFeatureAnomalies = [];
    for (let i = 0; i < TestMap[feature].length; i++) {
        let notAnomaly = true;
        for (const array of anomalies) {
            if (i >= array[0] && i < array[1]) {
                notAnomaly = false;
                featureAnomalies.push({
                    x: i,
                    y: TestMap[feature][i],
                });
                corrFeatureAnomalies.push({
                    x: i,
                    y: TestMap[corrFeature][i],
                });
            }
        }
        if(notAnomaly) {
            featurePoints.push({
                x: i,
                y: TestMap[feature][i],
            });
            corrFeaturePoints.push({
                x: i,
                y: TestMap[corrFeature][i],
            });
        }
    }

    drawCurrentGraph('current', feature, featurePoints, featureAnomalies);
    drawCurrentGraph('correlated', corrFeature, corrFeaturePoints, corrFeatureAnomalies);
}