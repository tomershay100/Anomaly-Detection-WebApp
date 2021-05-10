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

app.get('/', ((req, res) => {
    process.chdir('../');
    res.sendFile(process.cwd() + '/view/index.html');
}))

app.get('/frontend_controller.js', ((req, res) => {
    res.sendFile(process.cwd() + '/controller/frontend_controller.js');
}))

app.get('/index.css', ((req, res) => {
    res.sendFile(process.cwd() + '/view/index.css');
}))

app.post('/api/model', ((req, res) => {
    //console.log(req.query.model_type);
    //console.log(req.body);
    models[++id] = new Model(id, id % 2 === 0 ? "ready" : "pending");
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
    if (models.hasOwnProperty(req.query.model_id)) {
        delete models[req.query.model_id];// [].delete();
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
        sleep(3000).then(() => {
            res.send({feature: req.query.feature + "1", anomalies: [[2, 3], [50, 70]]});
            res.status(200).end();
        });
    } else {
        res.status(404).end()
    }
}))

app.listen(8080);