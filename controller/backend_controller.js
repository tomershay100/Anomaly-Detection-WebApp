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

models = {};
id = 0;

const express = require('express');
const app = express();
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({limit: '50mb'}));
let cwdProc = process.cwd().split('\\');
if(cwdProc[cwdProc.length-1] === 'controller')
    process.chdir('../');

app.get('/', ((req, res) => {
    res.sendFile(process.cwd() + '/view/index.html');
}))

app.get('/frontend_controller.js', ((req, res) => {
    res.sendFile(process.cwd() + '/controller/frontend_controller.js');
}))

app.get('/style.css', ((req, res) => {
    res.sendFile(process.cwd() + '/view/style.css');
}))

app.get('/index.js', ((req, res) => {
    res.sendFile(process.cwd() + '/view/index.js');
}))

app.post('/api/model', ((req, res) => {
    //console.log(req.query.model_type);
    //console.log(req.body);
    models[++id] = new Model(id,"pending");
    res.send(models[id].toJson());
}))

app.get('/api/model', ((req, res) => {
    if (models.hasOwnProperty(req.query.model_id)) {
        res.send(models[req.query.model_id].toJson());
        res.status(200).end()
    } else {
        res.status(404).end()
    }
}))

app.delete('/api/model', ((req, res) => {
    console.log("delete")
    if (models.hasOwnProperty(req.query.model_id)) {
        delete models[req.query.model_id];
        console.log("delete")
        res.status(200).end()
    } else {
        res.status(404).end()
    }
}))

app.post('/api/anomaly', ((req, res) => {
    if (models.hasOwnProperty(req.query.model_id)) {
        res.status(200).end()
    } else {
        res.status(404).end()
    }
}))

app.get('/api/anomaly', ((req, res) => {
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

app.listen(8080);