let TrainString;
let TestString;
let ModelType;
let Features;
let TrainMap;
let TestMap;
let ModelID;

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
    if ((typeof ModelID).toString() !== 'undefined') {
        let httpRequest;
        httpRequest = new XMLHttpRequest();
        httpRequest.open("DELETE", "/api/model" + "?model_id=" + ModelID, true);
        httpRequest.send();
        httpRequest.onload = function () {
            if (this.readyState === 4 && this.status === 200)
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
            onLoadTest();
    };
}

function onLoadTest() {
    let httpRequest;
    httpRequest = new XMLHttpRequest();

    httpRequest.open("GET", "/api/anomaly" + "?model_id=" + ModelID, true);
    httpRequest.send();

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
    let feature = currentFeature();
    let corrFeature;
    let anomalies;

    let httpRequest;
    httpRequest = new XMLHttpRequest();
    httpRequest.open("GET", "/api/anomaly" + "?model_id=" + ModelID + "&?feature=" + feature, true);
    httpRequest.send();

    httpRequest.onload = function () {
        if (this.readyState === 4 && this.status === 200) {
            anomalies = JSON.parse(httpRequest.response)["anomalies"];
            corrFeature = JSON.parse(httpRequest.response)["feature"];
            drawGraph(feature, corrFeature, anomalies);
        }
    };
}

function drawGraph(feature, corrFeature, anomalies) {
    let maxX = 0;
    let minX = 0;
    let isFirst = true;
    let maxY = 0;
    let minY = 0;
    let data = [];
    let dataSeries = {
        type: "line", markerSize: 5, showLine: false, dataPoints: []
    };
    let dataPoints = [];
    for (let i = 0; i < TestMap[feature].length; i++) {
        let isAnomaly = false;
        for (const array of anomalies) {
            if (i >= array[0] && i < array[1]) {
                isAnomaly = true;
                break;
            }
        }

        let y = TestMap[corrFeature][i];
        let x = TestMap[feature][i];

        dataPoints.push({
            x: x,
            y: y,
            markerColor: isAnomaly ? "#ff4da6" : "#0ff",
        });
        if (maxX < x || isFirst)
            maxX = x;
        if (minX > x || isFirst)
            minX = x;
        if (maxY < y || isFirst)
            maxY = y;
        if (minY > y || isFirst)
            minY = y;
        isFirst = false
    }

    dataSeries.dataPoints = dataPoints;
    data.push(dataSeries);

    let chart = new CanvasJS.Chart("anomaliesGraph",
        {
            zoomEnabled: true,
            theme: "dark2",
            title: {
                text: "Anomalies Graph"
            },
            axisX: {
                title: feature,
                viewportMinimum: minX,
                viewportMaximum: maxX
            },
            axisY: {
                title: corrFeature,
                viewportMinimum: minY,
                viewportMaximum: maxY
            },
            data: data,
            options: {
                responsive: true,
                maintainAspectRatio: false,
            }
        });
    chart.render();
}