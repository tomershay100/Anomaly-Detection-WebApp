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
let timesSeries = {};
let id = 0;

const {TimeSeries} = require('./TimeSeries');
const express = require('express');
const app = express();

app.get('/', ((req, res) => {
    res.sendFile(process.cwd() + '/index.html');
}))


app.post('/api/model', ((req, res) => {
    console.log(req.query.model_type);
    models[++id] = new Model(id, id % 2 === 0 ? "ready" : "pending");
    timesSeries[id] = new TimeSeries({"altitude_gps": [100, 110, 20], "heading_gps": [0.6, 0.59, 0.54] })
    //res.send(models[id].toJson());
    res.send(timesSeries[id]);
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