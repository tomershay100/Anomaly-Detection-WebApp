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
// let trainTimesSeries = {};
// let testTimeSeries = {};
let id = 0;

const express = require('express');
const {AnomalyManager} = require("../model/anomaly_manager");
const {TimeSeries} = require("../model/anomaly_detection/TimeSeries");
const backend_controller = express();
backend_controller.use(express.json({limit: '50mb'}));
backend_controller.use(express.urlencoded({limit: '50mb'}));
//if(process.cwd().split('\\')[-1] === 'controller')
//backend_controller.use(express.json({limit: '50mb'}));
//backend_controller.use(express.urlencoded({limit: '50mb'}));
let cwdProc = process.cwd().split('\\');
if(cwdProc[cwdProc.length-1] === 'controller')
    process.chdir('../');

backend_controller.get('/', ((req, res) => {
    res.sendFile(process.cwd() + '/view/index.html');
}))

backend_controller.get('/frontend_controller.js', ((req, res) => {
    res.sendFile(process.cwd() + '/controller/frontend_controller.js');
}))

backend_controller.get('/style.css', ((req, res) => {
    res.sendFile(process.cwd() + '/view/style.css');
}))

backend_controller.get('/index.js', ((req, res) => {
    res.sendFile(process.cwd() + '/view/index.js');
}))

//Train POST
backend_controller.post('/api/model', ((req, res) => {
    if (models.size === 1){
        deleteModel(req.query.model_id);
    }
    models[++id] = new Model(id, "pending");
    anomalyManagers[id] = new AnomalyManager();
    anomalyManagers[id].uploadTrain(req.body["train_data"]);
    res.send(models[id].toJson());
}))

//Test POST
backend_controller.post('/api/anomaly', ((req, res) => {
    if (models.hasOwnProperty(req.query.model_id)){
        anomalyManagers[req.query.model_id].uploadTest(req.body["predict_data"]);
        res.status(200).end();
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
    console.log("delete1")
    res.status(deleteModel(req.query.model_id)).end();
}))

function deleteModel(modelId){
    console.log("delete")
    if (models.hasOwnProperty(modelId)) {
        delete models[modelId];
        anomalyManagers[modelId].deleteTrain();
        anomalyManagers[modelId].deleteTest();
        return 200;
    } else {
        return 404;
    }
}


backend_controller.get('/api/anomaly', ((req, res) => {
    if (models.hasOwnProperty(req.query.model_id)) {
        if (models[req.query.model_id].status === "pending") {
            models[req.query.model_id].status = "ready";
            sleep(3000).then(() => {
                res.send({feature: "airspeed-kt" /*req.query.feature + "1"*/, anomalies: [[2, 3], [50, 300]]});
                res.status(200).end();
            });
        }
        else {
            res.send({feature: "airspeed-kt" /*req.query.feature + "1"*/, anomalies: [[2, 3], [50, 70]]});
            res.status(200).end();
        }
    } else {
        res.status(404).end()
    }
}))

backend_controller.listen(8080);