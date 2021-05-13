class TimeSeries {
    constructor(DATAJson) {
        this._csvMap = new Map();
        this._featuresList = [];
        this._columnsSize = 0;
        for (let value in DATAJson) {
            this._csvMap[value] = DATAJson[value];
            this._featuresList.push(value)
            if (this._columnsSize === 0) {
                for (var f in this._csvMap[value]) {
                    this._columnsSize++;
                }
            }

        }
        this._rowsSize = this._csvMap.size;
    }

    getColumn(key) {
        return this._csvMap.has(key) ? this._csvMap[key] : [];
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