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

app.get('/', ((req, res) => {
    res.sendFile(process.cwd() + '/index.html');
}))

app.get('/index.js', ((req, res) => {
    res.sendFile(process.cwd() + '/index.js');
}))

app.get('/index.css', ((req, res) => {
    res.sendFile(process.cwd() + '/index.css');
}))

app.post('/api/model', ((req, res) => {
    console.log(req.query.model_type);
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

app.get('/api/models', ((req, res) => {
    var arr = [];

    for (var key in models) {
        if (models.hasOwnProperty(key)) {
            arr.push(models[key]);
        }
    }
    res.send(arr);
    console.log("GET /api/models")
}))

app.post('/api/anomaly', ((req, res) => {
    if (models.hasOwnProperty(req.query.model_id)) {
        if(models[req.query.model_id].status === "pending")
            res.redirect("/api/model?model_id=" + req.query.model_id)
            //res.redirect("https://google.com")
        else
            res.send({ anomalies:{ col_name_1: [[1,8]], col_name_2: [[2,3], [12,16]]}, reason: "Any"});
        res.status(200).end()
    } else {
        res.status(404).end()
    }
}))

app.listen(3000);