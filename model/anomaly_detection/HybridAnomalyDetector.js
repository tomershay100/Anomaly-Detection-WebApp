const {AnomalyDetectionUtil} = require("./anomaly_detection_util");
const {Point} = require("./anomaly_detection_util");
const {Circle} = require("./anomaly_detection_util");
const {TimeSeries} = require('./TimeSeries');
const {CorrelatedFeatures} = require('./SimpleAnomalyDetector');
const enclosingCircle = require('smallest-enclosing-circle');


function HybridAnomalyDetector(threshold) {
    this._threshold = threshold;
    this._cf = [];
}

HybridAnomalyDetector.prototype.learnNormal = function (ts) {
    this.createCf(ts);
    this.createForm(ts);
}

HybridAnomalyDetector.prototype.createCf = function (timeSeries) {
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
            this._cf.push(CorrelatedFeatures.constructor(f1, f2, correlation, 0));
        }
    }
}

HybridAnomalyDetector.prototype.createForm = function (ts) {
    for (let i = 0; i < this._cf.count; i++) {
        let array = Point[ts.getRowSize()];
        for (let j = 0; j < ts.getRowSize(); j++) {
            array[j] = (Point.constructor(ts.getColumn(this._cf[i]._feature1)[j],
                ts.getColumn(this._cf[i]._feature2)[j])).toJson();
        }
        if(this._cf[i]._correlation < 0.5){
            this._cf[i]._circle = Circle.fromJson(enclosingCircle(array));
        }
        else{
            this._cf[i]._line =AnomalyDetectionUtil.LinearReg(array);
        }
        this._cf[i]._threshold = this.findThreshold(array, this._cf[i]);
    }
}

HybridAnomalyDetector.prototype.devFromForm = function (p, s) {
    if(s._correlation < 0.5){
        let center = new Point(s._circle._x, s._circle._y);
        return AnomalyDetectionUtil.dis2Points(center, p);
    }
    return AnomalyDetectionUtil.Dev(p, s._line);
}

HybridAnomalyDetector.prototype.findThreshold = function (array, s) {
    if(s._correlation < 0.5){
        return s._circle._radius;
    }

    let max = 0;
    for (let j = 0; j < array.length - 1; j++) {
        let val = this.devFromForm(array[j], s);
        if (max <= val) {
            max = val;
        }
    }
    return max;
}

HybridAnomalyDetector.prototype.detect = function(ts) {
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
