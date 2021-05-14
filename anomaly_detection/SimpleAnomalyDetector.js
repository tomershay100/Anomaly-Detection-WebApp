const {AnomalyDetectionUtil} = require("./anomaly_detection_util");
const {Point} = require("./anomaly_detection_util");
const {TimeSeries} = require('./TimeSeries');

class CorrelatedFeatures {
    constructor(feature1, feature2, correlation, threshold) {
        this._feature1 = feature1;
        this._feature2 = feature2;
        this._correlation = correlation;
        this._line = null;
        this._circle = null;
        this._threshold = threshold;
        this._allPoints = [];
        this._anomalies = [];
        this._anomaliesTimeStep = [];
    }
}

class AnomalyReport {
    constructor(description, timeStep) {
        this._description = description;
        this._timeStep = description;
    }
}

function SimpleAnomalyDetector(threshold) {
    this._threshold = threshold;
    this._cf = [];
}

SimpleAnomalyDetector.prototype.createCf = function (timeSeries) {
    let biggestPearson;
    for (let i = 0; i < timeSeries.getColumnSize(); i++) {
        let f1 = timeSeries.getFeatures();
        let f2 = "";
        let correlation;
        biggestPearson = this._threshold;
        for (let j = 0; j < timeSeries.getColumnSize(); j++) {
            if (i === j) {
                continue;
            }
            let absPearson = AnomalyDetectionUtil.Pearson(timeSeries.getColumn(f1),
                timeSeries.getColumn(timeSeries.getFeatures()[j]));
            absPearson = absPearson > 0 ? absPearson : -absPearson;
            if (absPearson >= biggestPearson) {
                biggestPearson = absPearson;
                f2 = timeSeries.getFeatures()[j];
                correlation = biggestPearson;
            }
        }
        if (f2 !== "") {
            // let allPoints = [];
            //TODO _threshold same ?
            this._cf.push(CorrelatedFeatures.constructor(f1, f2, correlation, this._threshold));
        }
    }
}

SimpleAnomalyDetector.prototype.createForm = function (ts) {
    for (let i = 0; i < this._cf.count; i++) {
        let array = Point[ts.getRowSize()];
        for (let j = 0; j < ts.getRowSize(); j++) {
            array[j] = Point.constructor(ts.getColumn(this._cf[i]._feature1)[j],
                ts.getColumn(this._cf[i]._feature2)[j]);
        }
        let line = this.createCorrelativeForm(array);
        this._cf[i] = CorrelatedFeatures.constructor(this._cf[i]._feature1, this._cf[i]._feature2, this._cf[i]._correlation, 0);
        this._cf[i]._line = line;
        let th = this.findThreshold(array, this._cf[i]);
        this._cf[i] = CorrelatedFeatures.constructor(this._cf[i]._feature1, this._cf[i]._feature2, this._cf[i]._correlation, th);
        this._cf[i]._line = line;
    }
}

SimpleAnomalyDetector.prototype.devFromForm = function (p, s) {
    return AnomalyDetectionUtil.Dev(p, s._line);
}

SimpleAnomalyDetector.prototype.createCorrelativeForm = function (array) {
    return AnomalyDetectionUtil.LinearReg(array);
}

SimpleAnomalyDetector.prototype.findThreshold = function (array, s) {
    let max = 0;
    for (let j = 0; j < array.length - 1; j++) {
        let val = this.devFromForm(array[j], s);
        if (max <= val) {
            max = val;
        }
    }
    return max;
}

SimpleAnomalyDetector.prototype.detect = function (ts) {
    for (let j = 0; j < this._cf.count; j++) {
        for (let i = 0; i < ts.getRowSize(); i++) {
            let p = Point.constructor(ts.getColumn(this._cf[j]._feature1)[i], ts.getColumn(this._cf[j]._feature2)[i])
            let devAbs = this.devFromForm(p, this._cf[j]);
            if (this._cf[j]._threshold * 1.1 < devAbs) {
                this._cf[j].this._anomalies.push(p);
                this._cf[j].this._anomaliesTimeStep.push(i);
            }
            this._cf[j].this._allPoints.push(p);
        }
    }
}