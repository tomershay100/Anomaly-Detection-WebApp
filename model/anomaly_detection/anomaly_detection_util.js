class Line {
    constructor(a, b) {
        if (typeof a !== "undefined") {
            this._a = a;
        } else {
            this._a = 0;
        }
        if (typeof b !== "undefined") {
            this._b = b;
        } else {
            this._b = 0;
        }
    }

    F(x) {
        return this._a * x + this._b;
    }
}

class Point {
    constructor(x, y) {
        this._x = x;
        this._y = y;
    }

    toJson() {
        return {x: this._x, y: this._y};
    }
}

class Circle {
    constructor(x, y, r) {
        this._x = x;
        this._y = y;
        this._radius = r;
    }

    static fromJson(json) {
        let map = JSON.parse(JSON.stringify(json));
        return new Circle(map["x"], map["y"], map["r"]);
    }
}

class AnomalyDetectionUtil {
    static Avg(x) {
        let sum = 0;
        for (let i = 0; i < x.length; i++) {
            sum += x[i];
        }
        return sum / x.length;
    }

    static Var(x) {
        let av = AnomalyDetectionUtil.Avg(x);
        let sum = 0;
        x.forEach(element => sum += element * element);
        return sum / x.length - av * av;
    }

    static Cov(x, y) {
        let size = Math.min(y.length, x.length);
        let sum = 0;
        for (let i = 0; i < size; i++) {
            sum += x[i] * y[i];
        }
        sum /= size;
        return (sum - AnomalyDetectionUtil.Avg(x) * AnomalyDetectionUtil.Avg(y));
    }

    static Pearson(x, y) {
        let r = AnomalyDetectionUtil.Cov(x, y) / (Math.sqrt(AnomalyDetectionUtil.Var(x)) * Math.sqrt(AnomalyDetectionUtil.Var(y)));
        return isNaN(r) ? 0 : r;
    }

    static LinearReg(points) {
        let size = points.length;
        let x = [];
        let y = [];

        for (let i = 0; i < size; i++) {
            x[i] = points[i]._x;
            y[i] = points[i]._y;
        }

        let a = AnomalyDetectionUtil.Cov(x, y) / AnomalyDetectionUtil.Var(x);
        let b = AnomalyDetectionUtil.Avg(y) - a * AnomalyDetectionUtil.Avg(x);

        return new Line(a, b);
    }

    static Dev(p, line) {
        let x = p._y - line.F(p._x);
        if (x < 0) {
            x *= -1;
        }
        return x;
    }

    static dis2Points(p1, p2) {
        return Math.sqrt(Math.pow(p1._x - p2._x, 2) + Math.pow(p1._y - p2._y, 2));
    }
}