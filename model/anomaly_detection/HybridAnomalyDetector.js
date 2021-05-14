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

class HybridAnomalyDetector {
    createCf(timeSeries) {
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

    createForm(ts) {
        for (let i = 0; i < this._cf.count; i++) {
            let array = Point[ts.getRowSize()];
            for (let j = 0; j < ts.getRowSize(); j++) {
                array[j] = Point.constructor(ts.getColumn(this._cf[i]._feature1)[j],
                    ts.getColumn(this._cf[i]._feature2)[j]);
            }
            //this._cf[i]._threshold = 0;
            this._cf[i]._line = this.createCorrelativeForm(array);
            this._cf[i]._threshold = this.findThreshold(array, this._cf[i]);
        }
    }

    learnNormal(ts) {
        this.createCf(ts);
        this.createForm(ts);
    }

    createCorrelativeForm(array) {
        return AnomalyDetectionUtil.LinearReg(array);
    }

    findThreshold(array, s) {
        let max = 0;
        for (let j = 0; j < array.length - 1; j++) {
            let val = this.devFromForm(array[j], s);
            if (max <= val) {
                max = val;
            }
        }
        return max;
    }

    devFromForm(p, s) {
        return AnomalyDetectionUtil.Dev(p, s._line);
    }
}