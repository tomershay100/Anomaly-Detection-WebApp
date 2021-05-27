const {SimpleAnomalyDetector} = require('../model/anomalyDetection/SimpleAnomalyDetector');
const {HybridAnomalyDetector} = require('../model/anomalyDetection/HybridAnomalyDetector');

function sleep(time) {
    return new Promise((resolve) => setTimeout(resolve, time));
}

class Model {
    constructor(id, stat) {
        this.id = id;
        this.upload_time = new Date().toISOString();
        this.status = stat;
    }

    toJson() {
        return {
            model_id: this.id, upload_time: this.upload_time, "status": this.status
        };
    }
}

let models = {};
let anomalyManagers = {};
let id = 0;

const express = require('express');
const {AnomalyManager} = require("../model/anomalyManager");
const backendController = express();
backendController.use(express.json({limit: '50mb'}));
backendController.use(express.urlencoded({limit: '50mb'}));
let cwdProc = process.cwd().split('\\');
cwdProc = cwdProc[cwdProc.length - 1].split('/');
if (cwdProc[cwdProc.length - 1] === 'controller')
    process.chdir('../');

backendController.get('/', ((req, res) => {
    res.sendFile(process.cwd() + '/view/index.html');
}))

backendController.get('/controller/frontendController.js', ((req, res) => {
    res.sendFile(process.cwd() + '/controller/frontendController.js');
}))

backendController.get('/style.css', ((req, res) => {
    res.sendFile(process.cwd() + '/view/style.css');
}))

backendController.get('/index.js', ((req, res) => {
    res.sendFile(process.cwd() + '/view/index.js');
}))

backendController.get('/favicon.ico', ((req, res) => {
    res.sendFile(process.cwd() + '/view/favicon.ico');
}))

//Train POST
backendController.post('/api/model', ((req, res) => {
    models[++id] = new Model(id, "pending");
    if (req.query.model_type === 'hybrid')
        anomalyManagers[id] = new AnomalyManager(new HybridAnomalyDetector(0));
    else
        anomalyManagers[id] = new AnomalyManager(new SimpleAnomalyDetector(0));

    anomalyManagers[id].uploadTrain(req.body["train_data"]);
    anomalyManagers[id].learn();
    res.send(models[id].toJson());
}))

//Test POST
backendController.post('/api/anomaly', ((req, res) => {
    if (models.hasOwnProperty(req.query.model_id)) {
        anomalyManagers[req.query.model_id].uploadTest(req.body["predict_data"]);
        anomalyManagers[req.query.model_id].detect();
        models[req.query.model_id].status = "ready";
        sleep(3500).then(() => {
            res.status(200).end();
        });
    } else {
        res.status(404).end();
    }
}))


backendController.get('/api/model', ((req, res) => {
    if (models.hasOwnProperty(req.query.model_id)) {
        res.send(models[req.query.model_id].toJson());
        res.status(200).end();
    } else {
        res.status(404).end();
    }
}))

backendController.delete('/api/model', ((req, res) => {
    res.status(deleteModel(req.query.model_id)).end();
}))

function deleteModel(modelId) {
    if (models.hasOwnProperty(modelId)) {
        delete models[modelId];
        delete anomalyManagers[modelId];
        return 200;
    } else {
        return 404;
    }
}

backendController.get('/api/anomaly', ((req, res) => {
        if (models.hasOwnProperty(req.query.model_id)) {
            if (models[req.query.model_id].status === "ready") {

                res.send({
                    feature: anomalyManagers[req.query.model_id].mostCorrelative(req.query.feature),
                    anomalies: anomalyManagers[req.query.model_id].getAnomalies(req.query.feature)
                }).status(200).end();
            }
        } else {
            res.status(404).end()
        }
    }
))

backendController.listen(8080);