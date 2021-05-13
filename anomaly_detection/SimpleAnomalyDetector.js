const {TimeSeries} = require('./TimeSeries');

class CorrelatedFeatures {
    constructor(feature1, feature2, correlation, threshold/*, circle*/) {
        this._feature1 = feature1;
        this._feature2 = feature2;
        this._correlation = correlation;
        // this._circle = circle;
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

class SimpleAnomalyDetector {
    constructor(threshold) {
        this._threshold = threshold;
        this._cf = [];
    }

    createCf(timeSeries) {
        let biggestPearson;
        for (let i = 0; i < timeSeries.getColumnSize(); i++) {
            let f1 = timeSeries.getFeatures();
            let f2 = "";
            let Correlation;
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
                    Correlation = biggestPearson;
                }
            }
            if (f2 !== "") {
                // let allPoints = [];
                //TODO _threshold same ?
                this._cf.add(CorrelatedFeatures.constructor(f1, f2, Correlation, this._threshold));
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
            let line = createCorrelativeForm(array);
            this._cf[i] = correlatedFeatures.constructor(this._cf[i]._feature1, this._cf[i]._feature2, this._cf[i]._correlation, 0, line);
            let th = findThreshold(array, this._cf[i]);
            this._cf[i] = correlatedFeatures.constructor(this._cf[i]._feature1, this._cf[i]._feature2, this._cf[i]._correlation, th, line);
        }
    }
}