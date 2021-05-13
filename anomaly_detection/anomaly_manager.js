const {Line} = require("./anomaly_detection_util");
const {TimeSeries} = require("./TimeSeries");
const {SimpleAnomalyDetector} = require('./SimpleAnomalyDetector');

class Anomaly_manager{
    constructor() {
        this._detector = SimpleAnomalyDetector(0)
        this._allDataPoints = []
        this._anomalyDataPoints = []
        this._train = null
        this._test = null
    }

    uploadTrain(trainJson){
        this._train = new TimeSeries(trainJson)
    }

    uploadTest(testJson){
        this._test = new TimeSeries(testJson)
    }

    learn(){
        this._detector.learnNormal(this._tarin);
    }

    detect(){
        this._detector.detect(this._test)
    }

    //TODO ? GetTestCol

    mostCorrelative(column){
        let cf = this._detector._cf;
        for(let corr in cf) {
            if (corr._feature1 === column) {
                return corr._feature2;
            }
        }
        return "no most correlative";
    }

    linearReg(column) {
        let cf = this._detector._cf;
        for (let corr in cf) {
            if (corr._feature1 === column) {
                return corr._line;
            }
        }
        return new Line();
    }

    getAnomaliesPoints(column){
        let results = []
        let currDescription = "";
        let currIndex = "";
        for (const report in this._detector._anomalies){
           // currDescription = report.
        }
    }


}
