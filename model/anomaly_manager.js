const {Line} = require("./anomaly_detection/anomaly_detection_util");
const {TimeSeries} = require("./anomaly_detection/TimeSeries");
const {SimpleAnomalyDetector} = require('./anomaly_detection/SimpleAnomalyDetector');

class Anomaly_manager{
    constructor() {
        this._detector = SimpleAnomalyDetector(0);
        this._allDataPoints = [];
        this._anomalyDataPoints = [];
        this._train = null;
        this._test = null;
    }

    uploadTrain(trainJson){
        this._train = new TimeSeries(trainJson);
    }

    uploadTest(testJson){
        this._test = new TimeSeries(testJson);
    }

    learn(){
        this._detector.learnNormal(this._tarin);
    }

    detect(){
        this._detector.detect(this._test);
    }

    mostCorrelative(column){
        let cf = this._detector._cf;
        for(let corr of cf) {
            if (corr._feature1 === column) {
                return corr._feature2;
            }
        }
        return "no most correlative";
    }

    linearReg(column) {
        let cf = this._detector._cf;
        for (let corr of cf) {
            if (corr._feature1 === column) {
                return corr._line;
            }
        }
        return new Line();
    }

    getAnomalies(column){
        let cf = this._detector._cf;
        for (let c of cf){
            if (c._feature1 === column){
                let prevTimeStep = 0;
                let isFirst = true;
                let anomalies = [];
                let str = [];
                for (let timeStep of c._anomaliesTimeStep){
                    if (isFirst || timeStep-prevTimeStep > 1){
                        if (!isFirst){
                            str.push(prevTimeStep);
                            anomalies.push(str);
                            str = []
                        }
                        str.push(timeStep);
                        isFirst = false;
                    }
                    prevTimeStep = timeStep;
                }
                if (!isFirst){
                    str.push(prevTimeStep);
                    anomalies.push(str);
                }
                return anomalies;
            }
        }
    }

}
