const {SimpleAnomalyDetector} = require('../model/anomaly_detection/SimpleAnomalyDetector');
const {HybridAnomalyDetector} = require('../model/anomaly_detection/HybridAnomalyDetector');

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
const {AnomalyManager} = require("../model/anomaly_manager");
const backend_controller = express();
backend_controller.use(express.json({limit: '50mb'}));
backend_controller.use(express.urlencoded({limit: '50mb'}));
let cwdProc = process.cwd().split('\\');
cwdProc = cwdProc[cwdProc.length - 1].split('/');
if (cwdProc[cwdProc.length - 1] === 'controller')
    process.chdir('../');

backend_controller.get('/', ((req, res) => {
    res.sendFile(process.cwd() + '/view/index.html');
}))

backend_controller.get('/controller/frontend_controller.js', ((req, res) => {
    res.sendFile(process.cwd() + '/controller/frontend_controller.js');
}))

backend_controller.get('/style.css', ((req, res) => {
    res.sendFile(process.cwd() + '/view/style.css');
}))

backend_controller.get('/index.js', ((req, res) => {
    res.sendFile(process.cwd() + '/view/index.js');
}))

backend_controller.get('/favicon.ico', ((req, res) => {
    res.sendFile(process.cwd() + '/view/favicon.ico');
}))

//Train POST
backend_controller.post('/api/model', ((req, res) => {
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
backend_controller.post('/api/anomaly', ((req, res) => {
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


backend_controller.get('/api/model', ((req, res) => {
    if (models.hasOwnProperty(req.query.model_id)) {
        res.send(models[req.query.model_id].toJson());
        res.status(200).end();
    } else {
        res.status(404).end();
    }
}))

backend_controller.delete('/api/model', ((req, res) => {
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

backend_controller.get('/api/anomaly', ((req, res) => {
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

backend_controller.listen(8080);