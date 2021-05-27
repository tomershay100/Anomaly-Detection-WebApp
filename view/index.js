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
        if (option.text === feature)
            option.selected = true;
    }
}

function selectedFeature() {
    analyzedSelection()
}

function showGraph() {
    document.getElementById("currentFeatureGraph").style.display = "inline-block";
    document.getElementById("correlatedFeatureGraph").style.display = "inline-block";

    document.getElementsByClassName("highGraph")[0].style.display = "block";
    document.getElementsByClassName("lowGraph")[0].style.display = "block";
}

function hideGraph() {
    document.getElementById("currentFeatureGraph").style.display = "none";
    document.getElementById("correlatedFeatureGraph").style.display = "none";

    document.getElementsByClassName("lowGraph")[0].style.display = "none";
    document.getElementsByClassName("highGraph")[0].style.display = "none";

}

function showLoader() {
    document.getElementById("loader").style.display = "inline-block";
}

function hideLoader() {
    document.getElementById("loader").style.display = "none";
}

function getCurrentFeature() {
    return document.getElementById("featuresList").value
}

function deleteFeaturesList() {
    let featuresList = document.getElementById("featuresList");
    let size = featuresList.length
    for (let i = 0; i < size; i++) {
        featuresList.remove(0);
    }
}

function getCanvas(graphFeature) {
    return graphFeature === 'current' ? document.getElementById('currentFeatureGraph') : document.getElementById('correlatedFeatureGraph');
}

function getGraph(graphFeature) {
    return graphFeature === 'current' ? currentFeature : correlatedFeature;
}

function setGraph(graphFeature, graph) {
    graphFeature === 'current' ? currentFeature = graph : correlatedFeature = graph;
}

function drawCurrentGraph(graphFeature, feature, featurePoints, featureAnomalies) {
    let title = 'anomalies';
    let graph = getGraph(graphFeature);
    if (typeof graph !== 'undefined') {
        let i;
        for (i = 0; i < featureAnomalies.length && graph.data.datasets[0].data.length; i++)
            graph.data.datasets[0].data[i] = featureAnomalies[i];
        if (featureAnomalies.length > graph.data.datasets[0].data.length)
            for (; i < featureAnomalies.length; i++)
                graph.data.datasets[0].data.push(featureAnomalies[i]);
        else if (featureAnomalies.length < graph.data.datasets[0].data.length)
            while (graph.data.datasets[0].data.length > featureAnomalies.length)
                graph.data.datasets[0].data.pop();
        graph.data.datasets[0].label = title;

        for (i = 0; i < featurePoints.length && graph.data.datasets[1].data.length; i++)
            graph.data.datasets[1].data[i] = featurePoints[i];
        if (featurePoints.length > graph.data.datasets[1].data.length)
            for (; i < featurePoints.length; i++)
                graph.data.datasets[1].data.push(featurePoints[i]);
        else if (featurePoints.length < graph.data.datasets[1].data.length)
            while (graph.data.datasets[1].data.length > featurePoints.length)
                graph.data.datasets[1].data.pop();
        graph.data.datasets[1].label = feature;
        graph.options.plugins.title.text = (graphFeature === 'current' ? 'selected feature' : 'correlated feature') + " - " + feature;
        graph.update();
    } else {
        setGraph(graphFeature, new Chart(getCanvas(graphFeature), {
            type: 'scatter',
            data: {
                datasets: [
                    {
                        label: 'anomalies',
                        data: featureAnomalies,
                        backgroundColor: '#FF1493FF'
                    },
                    {
                        label: feature,
                        data: featurePoints,
                        backgroundColor: 'rgb(4,102,102)'
                    }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: {
                        display: true,
                        text: (graphFeature === 'current' ? 'Selected Feature' : 'Correlated Feature') + " - " + feature,
                        font: {
                            family: 'Roboto Light',
                            size: 20,
                        }
                    }
                },
                scales: {
                    y: {
                        grid: {
                            color: '#3C3F41'
                        }
                    },
                    x: {
                        grid: {
                            color: '#3C3F41'
                        }
                    }
                }
            }
        }));
    }
}