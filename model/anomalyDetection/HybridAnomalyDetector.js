const {AnomalyDetectionUtil} = require("./anomalyDetectionUtil");
const {Point} = require("./anomalyDetectionUtil");
const {Circle} = require("./anomalyDetectionUtil");
const {CorrelatedFeatures} = require('./SimpleAnomalyDetector');
const enclosingCircle = require('smallest-enclosing-circle');

class HybridAnomalyDetector {

    constructor(threshold) {
        this._threshold = threshold;
        this._cf = [];
    }

    learnNormal(ts) {
        this.createCf(ts);
        this.createForm(ts);
    }

    createCf(timeSeries) {
        let biggestPearson;
        for (let i = 0; i < timeSeries.getRowSize(); i++) {
            let f1 = timeSeries.getFeatures()[i];
            let f2 = "";
            let correlation = 0;
            biggestPearson = this._threshold;
            for (let j = 0; j < timeSeries.getRowSize(); j++) {
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
                this._cf.push(new CorrelatedFeatures(f1, f2, correlation, 0));
            }
        }
    }

    createForm(ts) {
        for (let i = 0; i < this._cf.length; i++) {
            let arrayJson = [];
            let array = [];
            for (let j = 0; j < ts.getColumnSize(); j++) {
                arrayJson[j] = (new Point(ts.getColumn(this._cf[i]._feature1)[j],
                    ts.getColumn(this._cf[i]._feature2)[j])).toJson();
                array[j] = (new Point(ts.getColumn(this._cf[i]._feature1)[j],
                    ts.getColumn(this._cf[i]._feature2)[j]));

            }
            if (this._cf[i]._correlation < 0.5)
                this._cf[i]._circle = Circle.fromJson(enclosingCircle(arrayJson));
            else
                this._cf[i]._line = AnomalyDetectionUtil.LinearReg(array);
            this._cf[i]._threshold = this.findThreshold(array, this._cf[i]);
        }
    }

    devFromForm(p, s) {
        if (s._correlation < 0.5) {
            let center = new Point(s._circle._x, s._circle._y);
            return AnomalyDetectionUtil.dis2Points(center, p);
        }
        return AnomalyDetectionUtil.Dev(p, s._line);
    }

    findThreshold(array, s) {
        if (s._correlation < 0.5) {
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

    detect(ts) {
        for (let j = 0; j < this._cf.length; j++) {
            for (let i = 0; i < ts.getColumnSize(); i++) {
                let p = new Point(ts.getColumn(this._cf[j]._feature1)[i], ts.getColumn(this._cf[j]._feature2)[i])
                let devAbs = this.devFromForm(p, this._cf[j]);
                if (this._cf[j]._threshold * 1.1 < devAbs) {
                    this._cf[j]._anomaliesTimeStep.push(i);
                }
                this._cf[j]._allPoints.push(p);
            }
        }
    }
}

module.exports = {HybridAnomalyDetector};
