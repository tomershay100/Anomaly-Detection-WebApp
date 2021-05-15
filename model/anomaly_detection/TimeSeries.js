class TimeSeries {
    constructor(DATAJson) {
        this._csvMap = new Map();
        this._featuresList = [];
        this._csvMap = JSON.parse(JSON.stringify(DATAJson));
        this._featuresList = Object.keys(this._csvMap);
        this._columnsSize = this._csvMap[this._featuresList[0]].length;
        this._rowsSize = this._featuresList.length;
    }

    getColumn(key) {
        return typeof this._csvMap[key] !== "undefined" ? this._csvMap[key] : [];
    }

    getColumnSize() {
        return this._columnsSize;
    }

    getRowSize() {
        return this._rowsSize;
    }

    getFeatures() {
        return this._featuresList;
    }
}

module.exports = {TimeSeries};