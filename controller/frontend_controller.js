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
    xhttp.onload = function () {
        if (this.readyState === 4 && this.status === 200) {
            onLoadTrain(xhttp, testJson);
        }
    };
}

function onLoadTrain(xhttp, testJson) {
    let modelID = JSON.parse(xhttp.response)["model_id"];
    ModelId = modelID;
    let xhttp1;
    xhttp1 = new XMLHttpRequest();

    xhttp1.open("POST", "/api/anomaly" + "?model_id=" + modelID, true);
    xhttp1.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhttp1.send(JSON.stringify(testJson));

    xhttp1.onload = function () {
        if (this.readyState === 4 && this.status === 200) {

            onLoadTest(modelID);
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
        if (isFirst) {
            option.selected = true;
            isFirst = false;
        }
        x.add(option);
    }
    //inline-block
    document.getElementById("chartContainer").style.display = "inline-block"; //.innerHTML = document.getElementById("lstValue").value;
    document.getElementById("loader").style.display = "none";
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

function drawGraph(feature, corrFeature, anomalies) {
    let maxX = 0;
    let minX = 0;
    let isFirst = true;
    let maxY = 0;
    let minY = 0;
    let data = [];
    let dataSeries = {
        type: "line", markerSize: 5, showLine: false,
        dataPoints: []
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
        if (maxX < x || isFirst) {
            maxX = x;
        }
        if (minX > x || isFirst)
            minX = x;
        if (maxY < y || isFirst) {
            maxY = y;
        }
        if (minY > y || isFirst)
            minY = y;
        isFirst = false
    }

    dataSeries.dataPoints = dataPoints;
    data.push(dataSeries);

    let chart = new CanvasJS.Chart("chartContainer",
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