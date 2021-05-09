let TrainString;
let TestString;
let ModelType;
let Features;

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
    let columnsSize = featuresList.length;

    let tampMap = {};
    for (let i = 0; i < featuresList.length; i++) {
        let j = 2;
        while(featuresList[i] in tampMap) {
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
        if(!isFirst) {
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
        if (this.readyState === 4 && this.status === 200) {
            let modelID =  JSON.parse(xhttp.response)["model_id"];
            console.log(xhttp.response);

            let xhttp1;
            xhttp1 = new XMLHttpRequest();

            xhttp1.open("POST", "/api/anomaly" + "?model_id=" + modelID, true);
            xhttp1.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
            xhttp1.send(JSON.stringify(testJson));

            xhttp1.onload = function () {
                if (this.readyState === 4 && this.status === 200) {
                    let xhttp2;
                    xhttp2 = new XMLHttpRequest();

                    xhttp2.open("GET", "/api/anomaly" + "?model_id=" + modelID, true);
                    xhttp2.send();

                    xhttp2.onload = function () {
                        if (this.readyState === 4 && this.status === 200) {
                            document.getElementById("listOfFiles").innerHTML =
                                "YAY";
                        }
                    };
                }
            };
        }
    };
}

function syncList() {
    setTimeout(updateList, 0);
}

function updateList() {
    //while (true) {
    //sleep(1000).then(r => {

    //});

    // }
}

var lastAddedIndex = 0;

function addValue(value) {
    //alert("Please select any item from the ListBox");

    //var v = document.form1.txtValue.value;
    //document.getElementById("tomer").innerHTML=v;
    // get the TextBox Value and assign it into the variable
    document.form1.lstValue.options[lastAddedIndex++] = new Option(value, value);
    return true;
}

function deleteValue() {
    var s = 1;
    var Index;
    if (document.form1.lstValue.selectedIndex === -1) {
        alert("Please select any item from the ListBox");
        return true;
    }
    while (s > 0) {
        Index = document.form1.lstValue.selectedIndex;
        if (Index >= 0) {
            document.form1.lstValue.options[Index] = null;
            --lastAddedIndex;
        } else
            document.s = 0;
    }
    return true;
}