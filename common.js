/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.l = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };

/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};

/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};

/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 9);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

var g;

// This works in non-strict mode
g = (function() {
	return this;
})();

try {
	// This works if eval is allowed (see CSP)
	g = g || Function("return this")() || (1,eval)("this");
} catch(e) {
	// This works if the window reference is available
	if(typeof window === "object")
		g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;


/***/ }),
/* 1 */
/***/ (function(module, exports) {

/**
 * Copyright (c) Flyover Games, LLC
 *
 * Isaac Burns isaacburns@gmail.com
 *
 * Permission is hereby granted, free of charge, to any person
 * obtaining a copy of this software and associated
 * documentation files (the "Software"), to deal in the Software
 * without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense,
 * and/or sell copies of the Software, and to permit persons to
 * whom the Software is furnished to do so, subject to the
 * following conditions:
 *
 * The above copyright notice and this permission notice shall
 * be included in all copies or substantial portions of the
 * Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY
 * KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE
 * WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR
 * PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
 * COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
 * OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
 * SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/**
 * A TypeScript API for the Spine JSON animation data format.
 */
exports.EPSILON = 1e-6;
var SpineMap = (function () {
    function SpineMap() {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var _this = this;
        this.keys = [];
        this.map = new Map(args);
        this.map.forEach(function (value, key) {
            _this.keys.push(key);
        });
    }
    SpineMap.prototype.clear = function () {
        this.keys.length = 0;
        this.map.clear();
    };
    SpineMap.prototype.has = function (key) {
        return this.map.has(key);
    };
    SpineMap.prototype.hasByIndex = function (index) {
        return this.has(this.keys[index]);
    };
    SpineMap.prototype.get = function (key) {
        return this.map.get(key);
    };
    SpineMap.prototype.getByIndex = function (index) {
        return this.get(this.keys[index]);
    };
    SpineMap.prototype.set = function (key, value) {
        if (!this.map.has(key)) {
            this.keys.push(key);
        }
        this.map.set(key, value);
        return value;
    };
    SpineMap.prototype.setByIndex = function (index, value) {
        return this.set(this.keys[index], value);
    };
    SpineMap.prototype.delete = function (key) {
        this.keys.splice(this.keys.indexOf(key), 1);
        this.map.delete(key);
    };
    SpineMap.prototype.deleteByIndex = function (index) {
        this.delete(this.keys[index]);
    };
    SpineMap.prototype.forEach = function (callback) {
        var _this = this;
        this.keys.forEach(function (key, index, array) {
            var value = _this.map.get(key);
            if (!value)
                throw new Error();
            callback(value, key, index, _this);
        });
    };
    return SpineMap;
}());
exports.Map = SpineMap;
function loadBool(json, key, def) {
    if (def === void 0) { def = false; }
    var value = json[key];
    switch (typeof (value)) {
        case "string": return (value === "true") ? true : false;
        case "boolean": return value;
        default: return def;
    }
}
exports.loadBool = loadBool;
function saveBool(json, key, value, def) {
    if (def === void 0) { def = false; }
    if ((typeof (def) !== "boolean") || (value !== def)) {
        json[key] = value;
    }
}
exports.saveBool = saveBool;
function loadFloat(json, key, def) {
    if (def === void 0) { def = 0; }
    var value = json[key];
    switch (typeof (value)) {
        case "string": return parseFloat(value);
        case "number": return value;
        default: return def;
    }
}
exports.loadFloat = loadFloat;
function saveFloat(json, key, value, def) {
    if (def === void 0) { def = 0; }
    if ((typeof (def) !== "number") || (value !== def)) {
        json[key] = value;
    }
}
exports.saveFloat = saveFloat;
function loadInt(json, key, def) {
    if (def === void 0) { def = 0; }
    var value = json[key];
    switch (typeof (value)) {
        case "string": return parseInt(value, 10);
        case "number": return 0 | value;
        default: return def;
    }
}
exports.loadInt = loadInt;
function saveInt(json, key, value, def) {
    if (def === void 0) { def = 0; }
    if ((typeof (def) !== "number") || (value !== def)) {
        json[key] = value;
    }
}
exports.saveInt = saveInt;
function loadString(json, key, def) {
    if (def === void 0) { def = ""; }
    var value = json[key];
    switch (typeof (value)) {
        case "string": return value;
        default: return def;
    }
}
exports.loadString = loadString;
function saveString(json, key, value, def) {
    if (def === void 0) { def = ""; }
    if ((typeof (def) !== "string") || (value !== def)) {
        json[key] = value;
    }
}
exports.saveString = saveString;
var Color = (function () {
    function Color() {
        this.r = 1;
        this.g = 1;
        this.b = 1;
        this.a = 1;
    }
    Color.copy = function (color, out) {
        if (out === void 0) { out = new Color(); }
        out.r = color.r;
        out.g = color.g;
        out.b = color.b;
        out.a = color.a;
        return out;
    };
    Color.prototype.copy = function (other) {
        return Color.copy(other, this);
    };
    Color.prototype.load = function (json, def) {
        if (def === void 0) { def = 0xffffffff; }
        var rgba = def;
        if (typeof (json) === "string")
            rgba = parseInt(json, 16);
        if (typeof (json) === "number")
            rgba = 0 | json;
        this.r = ((rgba >> 24) & 0xff) / 0xff;
        this.g = ((rgba >> 16) & 0xff) / 0xff;
        this.b = ((rgba >> 8) & 0xff) / 0xff;
        this.a = (rgba & 0xff) / 0xff;
        return this;
    };
    Color.prototype.toString = function () {
        return "rgba(" + (this.r * 255).toFixed(0) + "," + (this.g * 255).toFixed(0) + "," + (this.b * 255).toFixed(0) + "," + this.a + ")";
    };
    Color.tween = function (a, b, pct, out) {
        if (out === void 0) { out = new Color(); }
        out.r = tween(a.r, b.r, pct);
        out.g = tween(a.g, b.g, pct);
        out.b = tween(a.b, b.b, pct);
        out.a = tween(a.a, b.a, pct);
        return out;
    };
    Color.prototype.tween = function (other, pct, out) {
        if (out === void 0) { out = new Color(); }
        return Color.tween(this, other, pct, out);
    };
    Color.prototype.selfTween = function (other, pct) {
        return Color.tween(this, other, pct, this);
    };
    return Color;
}());
exports.Color = Color;
// from: http://github.com/arian/cubic-bezier
function BezierCurve(x1, y1, x2, y2, epsilon) {
    /*
    function orig_curveX(t) {
      const v = 1 - t;
      return 3 * v * v * t * x1 + 3 * v * t * t * x2 + t * t * t;
    }
  
    function orig_curveY(t) {
      const v = 1 - t;
      return 3 * v * v * t * y1 + 3 * v * t * t * y2 + t * t * t;
    }
  
    function orig_derivativeCurveX(t) {
      const v = 1 - t;
      return 3 * (2 * (t - 1) * t + v * v) * x1 + 3 * (- t * t * t + 2 * v * t) * x2;
    }
    */
    if (epsilon === void 0) { epsilon = exports.EPSILON; }
    /*
  
    B(t) = P0*(1-t)^3 + 3*P1*(1-t)^2*t + 3*P2*(1-t)*t^2 + P3*t^3
    B'(t) = P0 - 3*(P0 - P1)*t + 3*(P0 - 2*P1 + P2)*t^2 - (P0 - 3*P1 + 3*P2 - P3)*t^3
  
    if P0:(0,0) and P3:(1,1)
    B(t) = 3*P1*(1-t)^2*t + 3*P2*(1-t)*t^2 + t^3
    B'(t) = 3*P1*t - 3*(2*P1 - P2)*t^2 + (3*P1 - 3*P2 + 1)*t^3
  
    */
    function curveX(t) {
        var t2 = t * t;
        var t3 = t2 * t;
        var v = 1 - t;
        var v2 = v * v;
        return 3 * x1 * v2 * t + 3 * x2 * v * t2 + t3;
    }
    function curveY(t) {
        var t2 = t * t;
        var t3 = t2 * t;
        var v = 1 - t;
        var v2 = v * v;
        return 3 * y1 * v2 * t + 3 * y2 * v * t2 + t3;
    }
    function derivativeCurveX(t) {
        var t2 = t * t;
        var t3 = t2 * t;
        return 3 * x1 * t - 3 * (2 * x1 - x2) * t2 + (3 * x1 - 3 * x2 + 1) * t3;
    }
    return function (percent) {
        var x = percent;
        var t0, t1, t2, x2, d2, i;
        // First try a few iterations of Newton"s method -- normally very fast.
        for (t2 = x, i = 0; i < 8; ++i) {
            x2 = curveX(t2) - x;
            if (Math.abs(x2) < epsilon)
                return curveY(t2);
            d2 = derivativeCurveX(t2);
            if (Math.abs(d2) < epsilon)
                break;
            t2 = t2 - (x2 / d2);
        }
        t0 = 0, t1 = 1, t2 = x;
        if (t2 < t0)
            return curveY(t0);
        if (t2 > t1)
            return curveY(t1);
        // Fallback to the bisection method for reliability.
        while (t0 < t1) {
            x2 = curveX(t2);
            if (Math.abs(x2 - x) < epsilon)
                return curveY(t2);
            if (x > x2)
                t0 = t2;
            else
                t1 = t2;
            t2 = (t1 - t0) * 0.5 + t0;
        }
        // Failure
        return curveY(t2);
    };
}
exports.BezierCurve = BezierCurve;
// from: spine-libgdx/src/com/esotericsoftware/spine/Animation.java
function StepBezierCurve(cx1, cy1, cx2, cy2) {
    var bezierSegments = 10;
    var subdiv_step = 1 / bezierSegments;
    var subdiv_step2 = subdiv_step * subdiv_step;
    var subdiv_step3 = subdiv_step2 * subdiv_step;
    var pre1 = 3 * subdiv_step;
    var pre2 = 3 * subdiv_step2;
    var pre4 = 6 * subdiv_step2;
    var pre5 = 6 * subdiv_step3;
    var tmp1x = -cx1 * 2 + cx2;
    var tmp1y = -cy1 * 2 + cy2;
    var tmp2x = (cx1 - cx2) * 3 + 1;
    var tmp2y = (cy1 - cy2) * 3 + 1;
    var curves_0 = (cx1 * pre1 + tmp1x * pre2 + tmp2x * subdiv_step3);
    var curves_1 = (cy1 * pre1 + tmp1y * pre2 + tmp2y * subdiv_step3);
    var curves_2 = (tmp1x * pre4 + tmp2x * pre5);
    var curves_3 = (tmp1y * pre4 + tmp2y * pre5);
    var curves_4 = (tmp2x * pre5);
    var curves_5 = (tmp2y * pre5);
    return function (percent) {
        var dfx = curves_0;
        var dfy = curves_1;
        var ddfx = curves_2;
        var ddfy = curves_3;
        var dddfx = curves_4;
        var dddfy = curves_5;
        var x = dfx, y = dfy;
        var i = bezierSegments - 2;
        while (true) {
            if (x >= percent) {
                var lastX = x - dfx;
                var lastY = y - dfy;
                return lastY + (y - lastY) * (percent - lastX) / (x - lastX);
            }
            if (i === 0)
                break;
            i--;
            dfx += ddfx;
            dfy += ddfy;
            ddfx += dddfx;
            ddfy += dddfy;
            x += dfx;
            y += dfy;
        }
        return y + (1 - y) * (percent - x) / (1 - x); // Last point is 1,1.
    };
}
exports.StepBezierCurve = StepBezierCurve;
var Curve = (function () {
    function Curve() {
        this.evaluate = function (t) { return t; };
    }
    Curve.prototype.load = function (json) {
        // default: linear
        this.evaluate = function (t) { return t; };
        if ((typeof (json) === "string") && (json === "stepped")) {
            // stepped
            this.evaluate = function (t) { return 0; };
        }
        else if ((typeof (json) === "object") && (typeof (json.length) === "number") && (json.length === 4)) {
            // bezier
            var x1 = loadFloat(json, 0, 0);
            var y1 = loadFloat(json, 1, 0);
            var x2 = loadFloat(json, 2, 1);
            var y2 = loadFloat(json, 3, 1);
            // curve.evaluate = BezierCurve(x1, y1, x2, y2);
            this.evaluate = StepBezierCurve(x1, y1, x2, y2);
        }
        return this;
    };
    return Curve;
}());
exports.Curve = Curve;
function signum(n) { return (n < 0) ? (-1) : (n > 0) ? (1) : (n); }
exports.signum = signum;
function wrap(num, min, max) {
    if (min < max) {
        if (num < min) {
            return max - ((min - num) % (max - min));
        }
        else {
            return min + ((num - min) % (max - min));
        }
    }
    else if (min === max) {
        return min;
    }
    else {
        return num;
    }
}
exports.wrap = wrap;
function tween(a, b, t) {
    return a + ((b - a) * t);
}
exports.tween = tween;
function wrapAngleRadians(angle) {
    if (angle <= 0) {
        return ((angle - Math.PI) % (2 * Math.PI)) + Math.PI;
    }
    else {
        return ((angle + Math.PI) % (2 * Math.PI)) - Math.PI;
    }
}
exports.wrapAngleRadians = wrapAngleRadians;
function tweenAngleRadians(a, b, t) {
    return wrapAngleRadians(a + (wrapAngleRadians(b - a) * t));
}
exports.tweenAngleRadians = tweenAngleRadians;
var Angle = (function () {
    function Angle(rad) {
        if (rad === void 0) { rad = 0; }
        this._rad = 0;
        this._cos = 1;
        this._sin = 0;
        this.rad = rad;
    }
    Object.defineProperty(Angle.prototype, "rad", {
        get: function () { return this._rad; },
        set: function (value) {
            if (this._rad !== value) {
                this._rad = value;
                this._cos = Math.cos(value);
                this._sin = Math.sin(value);
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Angle.prototype, "deg", {
        get: function () { return this.rad * 180 / Math.PI; },
        set: function (value) { this.rad = value * Math.PI / 180; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Angle.prototype, "cos", {
        get: function () { return this._cos; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Angle.prototype, "sin", {
        get: function () { return this._sin; },
        enumerable: true,
        configurable: true
    });
    Angle.copy = function (angle, out) {
        if (out === void 0) { out = new Angle(); }
        out._rad = angle._rad;
        out._cos = angle._cos;
        out._sin = angle._sin;
        return out;
    };
    Angle.prototype.copy = function (other) {
        return Angle.copy(other, this);
    };
    Angle.equal = function (a, b, epsilon) {
        if (epsilon === void 0) { epsilon = exports.EPSILON; }
        if (Math.abs(wrapAngleRadians(a.rad - b.rad)) > epsilon) {
            return false;
        }
        return true;
    };
    Angle.prototype.equal = function (other, epsilon) {
        if (epsilon === void 0) { epsilon = exports.EPSILON; }
        return Angle.equal(this, other, epsilon);
    };
    Angle.tween = function (a, b, pct, out) {
        if (out === void 0) { out = new Angle(); }
        out.rad = tweenAngleRadians(a.rad, b.rad, pct);
        return out;
    };
    Angle.prototype.tween = function (other, pct, out) {
        if (out === void 0) { out = new Angle(); }
        return Angle.tween(this, other, pct, out);
    };
    Angle.prototype.selfTween = function (other, pct) {
        return Angle.tween(this, other, pct, this);
    };
    return Angle;
}());
exports.Angle = Angle;
var Vector = (function () {
    function Vector(x, y) {
        if (x === void 0) { x = 0; }
        if (y === void 0) { y = 0; }
        this.x = 0;
        this.y = 0;
        this.x = x;
        this.y = y;
    }
    Vector.copy = function (v, out) {
        if (out === void 0) { out = new Vector(); }
        out.x = v.x;
        out.y = v.y;
        return out;
    };
    Vector.prototype.copy = function (other) {
        return Vector.copy(other, this);
    };
    Vector.equal = function (a, b, epsilon) {
        if (epsilon === void 0) { epsilon = exports.EPSILON; }
        if (Math.abs(a.x - b.x) > epsilon) {
            return false;
        }
        if (Math.abs(a.y - b.y) > epsilon) {
            return false;
        }
        return true;
    };
    Vector.prototype.equal = function (other, epsilon) {
        if (epsilon === void 0) { epsilon = exports.EPSILON; }
        return Vector.equal(this, other, epsilon);
    };
    Vector.negate = function (v, out) {
        if (out === void 0) { out = new Vector(); }
        out.x = -v.x;
        out.y = -v.y;
        return out;
    };
    Vector.add = function (a, b, out) {
        if (out === void 0) { out = new Vector(); }
        out.x = a.x + b.x;
        out.y = a.y + b.y;
        return out;
    };
    Vector.prototype.add = function (other, out) {
        if (out === void 0) { out = new Vector(); }
        return Vector.add(this, other, out);
    };
    Vector.prototype.selfAdd = function (other) {
        ///return Vector.add(this, other, this);
        this.x += other.x;
        this.y += other.y;
        return this;
    };
    Vector.subtract = function (a, b, out) {
        if (out === void 0) { out = new Vector(); }
        out.x = a.x - b.x;
        out.y = a.y - b.y;
        return out;
    };
    Vector.prototype.subtract = function (other, out) {
        if (out === void 0) { out = new Vector(); }
        return Vector.subtract(this, other, out);
    };
    Vector.prototype.selfSubtract = function (other) {
        ///return Vector.subtract(this, other, this);
        this.x -= other.x;
        this.y -= other.y;
        return this;
    };
    Vector.scale = function (v, x, y, out) {
        if (y === void 0) { y = x; }
        if (out === void 0) { out = new Vector(); }
        out.x = v.x * x;
        out.y = v.y * y;
        return out;
    };
    Vector.prototype.scale = function (x, y, out) {
        if (y === void 0) { y = x; }
        if (out === void 0) { out = new Vector(); }
        return Vector.scale(this, x, y, out);
    };
    Vector.prototype.selfScale = function (x, y) {
        if (y === void 0) { y = x; }
        return Vector.scale(this, x, y, this);
    };
    Vector.tween = function (a, b, pct, out) {
        if (out === void 0) { out = new Vector(); }
        out.x = tween(a.x, b.x, pct);
        out.y = tween(a.y, b.y, pct);
        return out;
    };
    Vector.prototype.tween = function (other, pct, out) {
        if (out === void 0) { out = new Vector(); }
        return Vector.tween(this, other, pct, out);
    };
    Vector.prototype.selfTween = function (other, pct) {
        return Vector.tween(this, other, pct, this);
    };
    return Vector;
}());
exports.Vector = Vector;
var Matrix = (function () {
    function Matrix() {
        this.a = 1;
        this.b = 0;
        this.c = 0;
        this.d = 1;
    }
    Matrix.copy = function (m, out) {
        if (out === void 0) { out = new Matrix(); }
        out.a = m.a;
        out.b = m.b;
        out.c = m.c;
        out.d = m.d;
        return out;
    };
    Matrix.prototype.copy = function (other) {
        return Matrix.copy(other, this);
    };
    Matrix.equal = function (a, b, epsilon) {
        if (epsilon === void 0) { epsilon = exports.EPSILON; }
        if (Math.abs(a.a - b.a) > epsilon) {
            return false;
        }
        if (Math.abs(a.b - b.b) > epsilon) {
            return false;
        }
        if (Math.abs(a.c - b.c) > epsilon) {
            return false;
        }
        if (Math.abs(a.d - b.d) > epsilon) {
            return false;
        }
        return true;
    };
    Matrix.prototype.equal = function (other, epsilon) {
        if (epsilon === void 0) { epsilon = exports.EPSILON; }
        return Matrix.equal(this, other, epsilon);
    };
    Matrix.determinant = function (m) {
        return m.a * m.d - m.b * m.c;
    };
    Matrix.identity = function (out) {
        if (out === void 0) { out = new Matrix(); }
        out.a = 1;
        out.b = 0;
        out.c = 0;
        out.d = 1;
        return out;
    };
    Matrix.multiply = function (a, b, out) {
        if (out === void 0) { out = new Matrix(); }
        var a_a = a.a, a_b = a.b, a_c = a.c, a_d = a.d;
        var b_a = b.a, b_b = b.b, b_c = b.c, b_d = b.d;
        out.a = a_a * b_a + a_b * b_c;
        out.b = a_a * b_b + a_b * b_d;
        out.c = a_c * b_a + a_d * b_c;
        out.d = a_c * b_b + a_d * b_d;
        return out;
    };
    Matrix.invert = function (m, out) {
        if (out === void 0) { out = new Matrix(); }
        var a = m.a, b = m.b, c = m.c, d = m.d;
        var inv_det = 1 / (a * d - b * c);
        out.a = inv_det * d;
        out.b = -inv_det * b;
        out.c = -inv_det * c;
        out.d = inv_det * a;
        return out;
    };
    Matrix.combine = function (a, b, out) {
        return Matrix.multiply(a, b, out);
    };
    Matrix.extract = function (ab, a, out) {
        return Matrix.multiply(Matrix.invert(a, out), ab, out);
    };
    Matrix.prototype.selfRotate = function (cos, sin) {
        return Matrix.rotate(this, cos, sin, this);
    };
    Matrix.rotate = function (m, cos, sin, out) {
        if (out === void 0) { out = new Matrix(); }
        var a = m.a, b = m.b, c = m.c, d = m.d;
        out.a = a * cos + b * sin;
        out.b = b * cos - a * sin;
        out.c = c * cos + d * sin;
        out.d = d * cos - c * sin;
        return out;
    };
    Matrix.scale = function (m, x, y, out) {
        if (out === void 0) { out = new Matrix(); }
        out.a = m.a * x;
        out.b = m.b * y;
        out.c = m.c * x;
        out.d = m.d * y;
        return out;
    };
    Matrix.transform = function (m, v, out) {
        if (out === void 0) { out = new Vector(); }
        var x = v.x, y = v.y;
        out.x = m.a * x + m.b * y;
        out.y = m.c * x + m.d * y;
        return out;
    };
    Matrix.untransform = function (m, v, out) {
        if (out === void 0) { out = new Vector(); }
        var a = m.a, b = m.b, c = m.c, d = m.d;
        var x = v.x, y = v.y;
        var inv_det = 1 / (a * d - b * c);
        out.x = inv_det * (d * x - b * y);
        out.y = inv_det * (a * y - c * x);
        return out;
    };
    Matrix.tween = function (a, b, pct, out) {
        if (out === void 0) { out = new Matrix(); }
        out.a = tween(a.a, b.a, pct);
        out.b = tween(a.b, b.b, pct);
        out.c = tween(a.c, b.c, pct);
        out.d = tween(a.d, b.d, pct);
        return out;
    };
    Matrix.prototype.tween = function (other, pct, out) {
        if (out === void 0) { out = new Matrix(); }
        return Matrix.tween(this, other, pct, out);
    };
    Matrix.prototype.selfTween = function (other, pct) {
        return Matrix.tween(this, other, pct, this);
    };
    return Matrix;
}());
exports.Matrix = Matrix;
var Affine = (function () {
    function Affine() {
        this.vector = new Vector();
        this.matrix = new Matrix();
    }
    Affine.copy = function (affine, out) {
        if (out === void 0) { out = new Affine(); }
        Vector.copy(affine.vector, out.vector);
        Matrix.copy(affine.matrix, out.matrix);
        return out;
    };
    Affine.prototype.copy = function (other) {
        return Affine.copy(other, this);
    };
    Affine.equal = function (a, b, epsilon) {
        if (epsilon === void 0) { epsilon = exports.EPSILON; }
        if (!a.vector.equal(b.vector, epsilon)) {
            return false;
        }
        if (!a.matrix.equal(b.matrix, epsilon)) {
            return false;
        }
        return true;
    };
    Affine.prototype.equal = function (other, epsilon) {
        if (epsilon === void 0) { epsilon = exports.EPSILON; }
        return Affine.equal(this, other, epsilon);
    };
    Affine.identity = function (out) {
        if (out === void 0) { out = new Affine(); }
        Matrix.identity(out.matrix);
        out.vector.x = 0;
        out.vector.y = 0;
        return out;
    };
    Affine.invert = function (affine, out) {
        if (out === void 0) { out = new Affine(); }
        Matrix.invert(affine.matrix, out.matrix);
        Vector.negate(affine.vector, out.vector);
        Matrix.transform(out.matrix, out.vector, out.vector);
        return out;
    };
    Affine.combine = function (a, b, out) {
        if (out === void 0) { out = new Affine(); }
        Affine.transform(a, b.vector, out.vector);
        Matrix.combine(a.matrix, b.matrix, out.matrix);
        return out;
    };
    Affine.extract = function (ab, a, out) {
        if (out === void 0) { out = new Affine(); }
        Matrix.extract(ab.matrix, a.matrix, out.matrix);
        Affine.untransform(a, ab.vector, out.vector);
        return out;
    };
    Affine.transform = function (affine, v, out) {
        if (out === void 0) { out = new Vector(); }
        Matrix.transform(affine.matrix, v, out);
        Vector.add(affine.vector, out, out);
        return out;
    };
    Affine.untransform = function (affine, v, out) {
        if (out === void 0) { out = new Vector(); }
        Vector.subtract(v, affine.vector, out);
        Matrix.untransform(affine.matrix, out, out);
        return out;
    };
    return Affine;
}());
exports.Affine = Affine;
var Position = (function (_super) {
    __extends(Position, _super);
    function Position() {
        return _super.call(this, 0, 0) || this;
    }
    return Position;
}(Vector));
exports.Position = Position;
var Rotation = (function (_super) {
    __extends(Rotation, _super);
    function Rotation() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.matrix = new Matrix();
        return _this;
    }
    Rotation.prototype.updateMatrix = function (m) {
        if (m === void 0) { m = this.matrix; }
        m.a = this.cos;
        m.b = -this.sin;
        m.c = this.sin;
        m.d = this.cos;
        return m;
    };
    return Rotation;
}(Angle));
exports.Rotation = Rotation;
var Scale = (function (_super) {
    __extends(Scale, _super);
    function Scale() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(Scale.prototype, "x", {
        get: function () { return (Math.abs(this.c) < exports.EPSILON) ? (this.a) : (signum(this.a) * Math.sqrt(this.a * this.a + this.c * this.c)); },
        set: function (value) { this.a = value; this.c = 0; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Scale.prototype, "y", {
        get: function () { return (Math.abs(this.b) < exports.EPSILON) ? (this.d) : (signum(this.d) * Math.sqrt(this.b * this.b + this.d * this.d)); },
        set: function (value) { this.b = 0; this.d = value; },
        enumerable: true,
        configurable: true
    });
    return Scale;
}(Matrix));
exports.Scale = Scale;
var Shear = (function () {
    function Shear() {
        this.x = new Angle();
        this.y = new Angle();
        this.matrix = new Matrix();
    }
    Shear.prototype.updateMatrix = function (m) {
        if (m === void 0) { m = this.matrix; }
        m.a = this.x.cos;
        m.b = -this.y.sin;
        m.c = this.x.sin;
        m.d = this.y.cos;
        return m;
    };
    Shear.copy = function (shear, out) {
        if (out === void 0) { out = new Shear(); }
        out.x.copy(shear.x);
        out.y.copy(shear.y);
        return out;
    };
    Shear.prototype.copy = function (other) {
        return Shear.copy(other, this);
    };
    Shear.equal = function (a, b, epsilon) {
        if (epsilon === void 0) { epsilon = exports.EPSILON; }
        if (!a.x.equal(b.x, epsilon)) {
            return false;
        }
        if (!a.y.equal(b.y, epsilon)) {
            return false;
        }
        return true;
    };
    Shear.prototype.equal = function (other, epsilon) {
        if (epsilon === void 0) { epsilon = exports.EPSILON; }
        return Shear.equal(this, other, epsilon);
    };
    Shear.tween = function (a, b, pct, out) {
        if (out === void 0) { out = new Shear(); }
        Angle.tween(a.x, b.x, pct, out.x);
        Angle.tween(a.y, b.y, pct, out.y);
        return out;
    };
    Shear.prototype.tween = function (other, pct, out) {
        if (out === void 0) { out = new Shear(); }
        return Shear.tween(this, other, pct, out);
    };
    Shear.prototype.selfTween = function (other, pct) {
        return Shear.tween(this, other, pct, this);
    };
    return Shear;
}());
exports.Shear = Shear;
var Space = (function () {
    function Space() {
        this.position = new Position();
        this.rotation = new Rotation();
        this.scale = new Scale();
        this.shear = new Shear();
        this.affine = new Affine();
    }
    Space.prototype.updateAffine = function (affine) {
        if (affine === void 0) { affine = this.affine; }
        Vector.copy(this.position, affine.vector);
        Matrix.copy(this.rotation.updateMatrix(), affine.matrix);
        Matrix.multiply(affine.matrix, this.shear.updateMatrix(), affine.matrix);
        Matrix.multiply(affine.matrix, this.scale, affine.matrix);
        return affine;
    };
    Space.copy = function (space, out) {
        if (out === void 0) { out = new Space(); }
        out.position.copy(space.position);
        out.rotation.copy(space.rotation);
        out.scale.copy(space.scale);
        out.shear.copy(space.shear);
        return out;
    };
    Space.prototype.copy = function (other) {
        return Space.copy(other, this);
    };
    Space.prototype.load = function (json) {
        this.position.x = loadFloat(json, "x", 0);
        this.position.y = loadFloat(json, "y", 0);
        this.rotation.deg = loadFloat(json, "rotation", 0);
        this.scale.x = loadFloat(json, "scaleX", 1);
        this.scale.y = loadFloat(json, "scaleY", 1);
        this.shear.x.deg = loadFloat(json, "shearX", 0);
        this.shear.y.deg = loadFloat(json, "shearY", 0);
        return this;
    };
    Space.equal = function (a, b, epsilon) {
        if (epsilon === void 0) { epsilon = exports.EPSILON; }
        if (!a.position.equal(b.position, epsilon)) {
            return false;
        }
        if (!a.rotation.equal(b.rotation, epsilon)) {
            return false;
        }
        if (!a.scale.equal(b.scale, epsilon)) {
            return false;
        }
        if (!a.shear.equal(b.shear, epsilon)) {
            return false;
        }
        return true;
    };
    Space.prototype.equal = function (other, epsilon) {
        if (epsilon === void 0) { epsilon = exports.EPSILON; }
        return Space.equal(this, other, epsilon);
    };
    Space.identity = function (out) {
        if (out === void 0) { out = new Space(); }
        out.position.x = 0;
        out.position.y = 0;
        out.rotation.rad = 0;
        out.scale.x = 1;
        out.scale.y = 1;
        out.shear.x.rad = 0;
        out.shear.y.rad = 0;
        return out;
    };
    Space.translate = function (space, x, y) {
        Space.transform(space, new Vector(x, y), space.position);
        return space;
    };
    Space.rotate = function (space, rad) {
        if (Matrix.determinant(space.scale) < 0.0) {
            space.rotation.rad = wrapAngleRadians(space.rotation.rad - rad);
        }
        else {
            space.rotation.rad = wrapAngleRadians(space.rotation.rad + rad);
        }
        return space;
    };
    Space.scale = function (space, x, y) {
        Matrix.scale(space.scale, x, y, space.scale);
        return space;
    };
    Space.invert = function (space, out) {
        if (out === void 0) { out = new Space(); }
        if (space === out) {
            space = Space.copy(space, new Space());
        }
        Affine.invert(space.updateAffine(), out.affine);
        out.position.copy(out.affine.vector);
        out.shear.x.rad = -space.shear.x.rad;
        out.shear.y.rad = -space.shear.y.rad;
        var x_axis_rad = Math.atan2(out.affine.matrix.c, out.affine.matrix.a);
        out.rotation.rad = wrapAngleRadians(x_axis_rad - out.shear.x.rad);
        Matrix.combine(out.rotation.updateMatrix(), out.shear.updateMatrix(), out.scale);
        Matrix.extract(out.affine.matrix, out.scale, out.scale);
        return out;
    };
    Space.combine = function (a, b, out) {
        if (out === void 0) { out = new Space(); }
        if (a === out) {
            a = Space.copy(a, new Space());
        }
        if (b === out) {
            b = Space.copy(b, new Space());
        }
        Affine.combine(a.updateAffine(), b.updateAffine(), out.affine);
        out.position.copy(out.affine.vector);
        out.shear.x.rad = wrapAngleRadians(a.shear.x.rad + b.shear.x.rad);
        out.shear.y.rad = wrapAngleRadians(a.shear.y.rad + b.shear.y.rad);
        var x_axis_rad = Math.atan2(out.affine.matrix.c, out.affine.matrix.a);
        out.rotation.rad = wrapAngleRadians(x_axis_rad - out.shear.x.rad);
        Matrix.combine(out.rotation.updateMatrix(), out.shear.updateMatrix(), out.scale);
        Matrix.extract(out.affine.matrix, out.scale, out.scale);
        return out;
    };
    Space.extract = function (ab, a, out) {
        if (out === void 0) { out = new Space(); }
        if (ab === out) {
            ab = Space.copy(ab, new Space());
        }
        if (a === out) {
            a = Space.copy(a, new Space());
        }
        Affine.extract(ab.updateAffine(), a.updateAffine(), out.affine);
        out.position.copy(out.affine.vector);
        out.shear.x.rad = wrapAngleRadians(ab.shear.x.rad - a.shear.x.rad);
        out.shear.y.rad = wrapAngleRadians(ab.shear.y.rad - a.shear.y.rad);
        var x_axis_rad = Math.atan2(out.affine.matrix.c, out.affine.matrix.a);
        out.rotation.rad = wrapAngleRadians(x_axis_rad - out.shear.x.rad);
        Matrix.combine(out.rotation.updateMatrix(), out.shear.updateMatrix(), out.scale);
        Matrix.extract(out.affine.matrix, out.scale, out.scale);
        return out;
    };
    Space.transform = function (space, v, out) {
        if (out === void 0) { out = new Vector(); }
        return Affine.transform(space.updateAffine(), v, out);
    };
    Space.untransform = function (space, v, out) {
        if (out === void 0) { out = new Vector(); }
        return Affine.untransform(space.updateAffine(), v, out);
    };
    Space.tween = function (a, b, pct, out) {
        if (out === void 0) { out = new Space(); }
        a.position.tween(b.position, pct, out.position);
        a.rotation.tween(b.rotation, pct, out.rotation);
        a.scale.tween(b.scale, pct, out.scale);
        a.shear.tween(b.shear, pct, out.shear);
        return out;
    };
    Space.prototype.tween = function (other, pct, out) {
        if (out === void 0) { out = new Space(); }
        return Space.tween(this, other, pct, out);
    };
    Space.prototype.selfTween = function (other, pct) {
        return Space.tween(this, other, pct, this);
    };
    return Space;
}());
exports.Space = Space;
var Bone = (function () {
    function Bone() {
        this.color = new Color();
        this.parent_key = "";
        this.length = 0;
        this.local_space = new Space();
        this.world_space = new Space();
        this.inherit_rotation = true;
        this.inherit_scale = true;
        this.transform = "normal";
    }
    Bone.prototype.copy = function (other) {
        this.color.copy(other.color);
        this.parent_key = other.parent_key;
        this.length = other.length;
        this.local_space.copy(other.local_space);
        this.world_space.copy(other.world_space);
        this.inherit_rotation = other.inherit_rotation;
        this.inherit_scale = other.inherit_scale;
        this.transform = other.transform;
        return this;
    };
    Bone.prototype.load = function (json) {
        this.color.load(json.color, 0x989898ff);
        this.parent_key = loadString(json, "parent", "");
        this.length = loadFloat(json, "length", 0);
        this.local_space.load(json);
        this.inherit_rotation = loadBool(json, "inheritRotation", true);
        this.inherit_scale = loadBool(json, "inheritScale", true);
        this.transform = loadString(json, "transform", "normal");
        if (json.transform) {
            switch (json.transform) {
                case "normal":
                    this.inherit_rotation = this.inherit_scale = true;
                    break;
                case "onlyTranslation":
                    this.inherit_rotation = this.inherit_scale = false;
                    break;
                case "noRotationOrReflection":
                    this.inherit_rotation = false;
                    break;
                case "noScale":
                    this.inherit_scale = false;
                    break;
                case "noScaleOrReflection":
                    this.inherit_scale = false;
                    break;
                default:
                    console.log("TODO: Space.transform", json.transform);
                    break;
            }
        }
        return this;
    };
    Bone.flatten = function (bone, bones) {
        var bls = bone.local_space;
        var bws = bone.world_space;
        var parent = bones.get(bone.parent_key);
        if (!parent) {
            bws.copy(bls);
            bws.updateAffine();
        }
        else {
            Bone.flatten(parent, bones);
            var pws = parent.world_space;
            // compute bone world space position vector
            Space.transform(pws, bls.position, bws.position);
            // compute bone world affine rotation/scale matrix based in inheritance
            if (bone.inherit_rotation && bone.inherit_scale) {
                Matrix.copy(pws.affine.matrix, bws.affine.matrix);
            }
            else if (bone.inherit_rotation) {
                Matrix.identity(bws.affine.matrix);
                while (parent && parent.inherit_rotation) {
                    var pls = parent.local_space;
                    Matrix.rotate(bws.affine.matrix, pls.rotation.cos, pls.rotation.sin, bws.affine.matrix);
                    parent = bones.get(parent.parent_key);
                }
            }
            else if (bone.inherit_scale) {
                Matrix.identity(bws.affine.matrix);
                while (parent && parent.inherit_scale) {
                    var pls = parent.local_space;
                    var cos = pls.rotation.cos, sin = pls.rotation.sin;
                    Matrix.rotate(bws.affine.matrix, cos, sin, bws.affine.matrix);
                    Matrix.multiply(bws.affine.matrix, pls.scale, bws.affine.matrix);
                    if (pls.scale.x >= 0) {
                        sin = -sin;
                    }
                    Matrix.rotate(bws.affine.matrix, cos, sin, bws.affine.matrix);
                    parent = bones.get(parent.parent_key);
                }
            }
            else {
                Matrix.identity(bws.affine.matrix);
            }
            // apply bone local space
            bls.updateAffine();
            Matrix.multiply(bws.affine.matrix, bls.affine.matrix, bws.affine.matrix);
            // update bone world space
            bws.shear.x.rad = wrapAngleRadians(pws.shear.x.rad + bls.shear.x.rad);
            bws.shear.y.rad = wrapAngleRadians(pws.shear.y.rad + bls.shear.y.rad);
            var x_axis_rad = Math.atan2(bws.affine.matrix.c, bws.affine.matrix.a);
            bws.rotation.rad = wrapAngleRadians(x_axis_rad - bws.shear.x.rad);
            Matrix.combine(bws.rotation.updateMatrix(), bws.shear.updateMatrix(), bws.scale);
            Matrix.extract(bws.affine.matrix, bws.scale, bws.scale);
        }
        return bone;
    };
    return Bone;
}());
exports.Bone = Bone;
var Constraint = (function () {
    function Constraint() {
        ///public name: string = "";
        this.order = 0;
    }
    Constraint.prototype.load = function (json) {
        ///this.name = loadString(json, "name", "");
        this.order = loadInt(json, "order", 0);
        return this;
    };
    return Constraint;
}());
exports.Constraint = Constraint;
var Ikc = (function (_super) {
    __extends(Ikc, _super);
    function Ikc() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.bone_keys = [];
        _this.target_key = "";
        _this.mix = 1;
        _this.bend_positive = true;
        return _this;
    }
    Ikc.prototype.load = function (json) {
        _super.prototype.load.call(this, json);
        this.bone_keys = json["bones"] || [];
        this.target_key = loadString(json, "target", "");
        this.mix = loadFloat(json, "mix", 1);
        this.bend_positive = loadBool(json, "bendPositive", true);
        return this;
    };
    return Ikc;
}(Constraint));
exports.Ikc = Ikc;
var Xfc = (function (_super) {
    __extends(Xfc, _super);
    function Xfc() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.bone_keys = [];
        _this.target_key = "";
        _this.position_mix = 1;
        _this.position = new Position();
        _this.rotation_mix = 1;
        _this.rotation = new Rotation();
        _this.scale_mix = 1;
        _this.scale = new Scale();
        _this.shear_mix = 1;
        _this.shear = new Shear();
        return _this;
    }
    Xfc.prototype.load = function (json) {
        _super.prototype.load.call(this, json);
        this.bone_keys = json["bones"] || [];
        this.target_key = loadString(json, "target", "");
        this.position_mix = loadFloat(json, "translateMix", 1);
        this.position.x = loadFloat(json, "x", 0);
        this.position.y = loadFloat(json, "y", 0);
        this.rotation_mix = loadFloat(json, "rotateMix", 1);
        this.rotation.deg = loadFloat(json, "rotation", 0);
        this.scale_mix = loadFloat(json, "scaleMix", 1);
        this.scale.x = loadFloat(json, "scaleX", 1);
        this.scale.y = loadFloat(json, "scaleY", 1);
        this.shear_mix = loadFloat(json, "shearMix", 1);
        this.shear.x.deg = loadFloat(json, "shearX", 0);
        this.shear.y.deg = loadFloat(json, "shearY", 0);
        return this;
    };
    return Xfc;
}(Constraint));
exports.Xfc = Xfc;
var Ptc = (function (_super) {
    __extends(Ptc, _super);
    function Ptc() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.bone_keys = [];
        _this.target_key = "";
        _this.spacing_mode = "length"; // "length", "fixed", "percent"
        _this.spacing = 0;
        _this.position_mode = "percent"; // "fixed", "percent"
        _this.position_mix = 1;
        _this.position = 0;
        _this.rotation_mode = "tangent"; // "tangent", "chain", "chainscale"
        _this.rotation_mix = 1;
        _this.rotation = new Rotation();
        return _this;
    }
    Ptc.prototype.load = function (json) {
        _super.prototype.load.call(this, json);
        this.bone_keys = json["bones"] || [];
        this.target_key = loadString(json, "target", "");
        this.spacing_mode = loadString(json, "spacingMode", "length");
        this.spacing = loadFloat(json, "spacing", 0);
        this.position_mode = loadString(json, "positionMode", "percent");
        this.position_mix = loadFloat(json, "translateMix", 1);
        this.position = loadFloat(json, "position", 0);
        this.rotation_mode = loadString(json, "rotateMode", "tangent");
        this.rotation_mix = loadFloat(json, "rotateMix", 1);
        this.rotation.deg = loadFloat(json, "rotation", 0);
        return this;
    };
    return Ptc;
}(Constraint));
exports.Ptc = Ptc;
var Slot = (function () {
    function Slot() {
        this.bone_key = "";
        this.color = new Color();
        this.attachment_key = "";
        this.blend = "normal";
    }
    Slot.prototype.copy = function (other) {
        this.bone_key = other.bone_key;
        this.color.copy(other.color);
        this.attachment_key = other.attachment_key;
        this.blend = other.blend;
        return this;
    };
    Slot.prototype.load = function (json) {
        this.bone_key = loadString(json, "bone", "");
        this.color.load(json.color);
        this.attachment_key = loadString(json, "attachment", "");
        this.blend = loadString(json, "blend", "normal");
        return this;
    };
    return Slot;
}());
exports.Slot = Slot;
var Attachment = (function () {
    function Attachment(type) {
        this.type = "";
        this.name = "";
        this.type = type;
    }
    Attachment.prototype.load = function (json) {
        var type = loadString(json, "type", "region");
        if (type !== this.type) {
            throw new Error();
        }
        this.name = loadString(json, "name", "");
        return this;
    };
    return Attachment;
}());
exports.Attachment = Attachment;
var RegionAttachment = (function (_super) {
    __extends(RegionAttachment, _super);
    function RegionAttachment() {
        var _this = _super.call(this, "region") || this;
        _this.path = "";
        _this.color = new Color();
        _this.local_space = new Space();
        _this.width = 0;
        _this.height = 0;
        return _this;
    }
    RegionAttachment.prototype.load = function (json) {
        _super.prototype.load.call(this, json);
        this.path = loadString(json, "path", "");
        this.color.load(json.color);
        this.local_space.load(json);
        this.width = loadFloat(json, "width", 0);
        this.height = loadFloat(json, "height", 0);
        return this;
    };
    return RegionAttachment;
}(Attachment));
exports.RegionAttachment = RegionAttachment;
var BoundingBoxAttachment = (function (_super) {
    __extends(BoundingBoxAttachment, _super);
    function BoundingBoxAttachment() {
        var _this = _super.call(this, "boundingbox") || this;
        _this.color = new Color();
        _this.vertex_count = 0;
        _this.vertices = [];
        return _this;
    }
    BoundingBoxAttachment.prototype.load = function (json) {
        _super.prototype.load.call(this, json);
        this.color.load(json.color, 0x60f000ff);
        this.vertex_count = loadInt(json, "vertexCount", 0);
        /// The x/y pairs that make up the vertices of the polygon.
        this.vertices = json.vertices;
        return this;
    };
    return BoundingBoxAttachment;
}(Attachment));
exports.BoundingBoxAttachment = BoundingBoxAttachment;
var MeshAttachment = (function (_super) {
    __extends(MeshAttachment, _super);
    function MeshAttachment() {
        var _this = _super.call(this, "mesh") || this;
        _this.path = "";
        _this.color = new Color();
        _this.triangles = [];
        _this.edges = [];
        _this.vertices = [];
        _this.uvs = [];
        _this.hull = 0;
        return _this;
    }
    MeshAttachment.prototype.load = function (json) {
        _super.prototype.load.call(this, json);
        this.path = loadString(json, "path", "");
        this.color.load(json.color);
        this.triangles = json.triangles || [];
        this.edges = json.edges || [];
        this.vertices = json.vertices || [];
        this.uvs = json.uvs || [];
        this.hull = loadInt(json, "hull", 0);
        return this;
    };
    return MeshAttachment;
}(Attachment));
exports.MeshAttachment = MeshAttachment;
var LinkedMeshAttachment = (function (_super) {
    __extends(LinkedMeshAttachment, _super);
    function LinkedMeshAttachment() {
        var _this = _super.call(this, "linkedmesh") || this;
        _this.color = new Color();
        _this.skin_key = "";
        _this.parent_key = "";
        _this.inherit_deform = true;
        _this.width = 0;
        _this.height = 0;
        return _this;
    }
    LinkedMeshAttachment.prototype.load = function (json) {
        _super.prototype.load.call(this, json);
        this.color.load(json.color);
        this.skin_key = loadString(json, "skin", "");
        this.parent_key = loadString(json, "parent", "");
        this.inherit_deform = loadBool(json, "deform", true);
        this.width = loadInt(json, "width", 0);
        this.height = loadInt(json, "height", 0);
        return this;
    };
    return LinkedMeshAttachment;
}(Attachment));
exports.LinkedMeshAttachment = LinkedMeshAttachment;
var WeightedMeshAttachment = (function (_super) {
    __extends(WeightedMeshAttachment, _super);
    function WeightedMeshAttachment() {
        var _this = _super.call(this, "weightedmesh") || this;
        _this.path = "";
        _this.color = new Color();
        _this.triangles = [];
        _this.edges = [];
        _this.vertices = [];
        _this.uvs = [];
        _this.hull = 0;
        return _this;
    }
    WeightedMeshAttachment.prototype.load = function (json) {
        _super.prototype.load.call(this, json);
        this.path = loadString(json, "path", "");
        this.color.load(json.color);
        this.triangles = json.triangles || [];
        this.edges = json.edges || [];
        this.vertices = json.vertices || [];
        this.uvs = json.uvs || [];
        this.hull = loadInt(json, "hull", 0);
        return this;
    };
    return WeightedMeshAttachment;
}(Attachment));
exports.WeightedMeshAttachment = WeightedMeshAttachment;
var PathAttachment = (function (_super) {
    __extends(PathAttachment, _super);
    function PathAttachment() {
        var _this = _super.call(this, "path") || this;
        _this.color = new Color();
        _this.closed = false;
        _this.accurate = true;
        _this.lengths = [];
        _this.vertex_count = 0;
        _this.vertices = [];
        return _this;
    }
    PathAttachment.prototype.load = function (json) {
        _super.prototype.load.call(this, json);
        this.color.load(json.color, 0xff7f00ff);
        this.closed = loadBool(json, "closed", false);
        this.accurate = loadBool(json, "constantSpeed", true);
        this.lengths = json.lengths || [];
        this.vertex_count = loadInt(json, "vertexCount", 0);
        this.vertices = json.vertices || [];
        return this;
    };
    return PathAttachment;
}(Attachment));
exports.PathAttachment = PathAttachment;
var SkinSlot = (function () {
    function SkinSlot() {
        this.attachments = new SpineMap();
    }
    SkinSlot.prototype.load = function (json) {
        var _this = this;
        this.attachments.clear();
        Object.keys(json || {}).forEach(function (key) {
            switch (json[key].type) {
                default:
                case "region":
                    _this.attachments.set(key, new RegionAttachment().load(json[key]));
                    break;
                case "boundingbox":
                    _this.attachments.set(key, new BoundingBoxAttachment().load(json[key]));
                    break;
                case "mesh":
                    if (json[key].vertices.length === json[key].uvs.length) {
                        _this.attachments.set(key, new MeshAttachment().load(json[key]));
                    }
                    else {
                        json[key].type = "weightedmesh";
                        _this.attachments.set(key, new WeightedMeshAttachment().load(json[key]));
                    }
                    break;
                case "linkedmesh":
                    _this.attachments.set(key, new LinkedMeshAttachment().load(json[key]));
                    break;
                case "skinnedmesh":
                    json[key].type = "weightedmesh";
                case "weightedmesh":
                    _this.attachments.set(key, new WeightedMeshAttachment().load(json[key]));
                    break;
                case "path":
                    _this.attachments.set(key, new PathAttachment().load(json[key]));
                    break;
            }
        });
        return this;
    };
    return SkinSlot;
}());
exports.SkinSlot = SkinSlot;
var Skin = (function () {
    function Skin() {
        this.name = "";
        this.slots = new SpineMap();
    }
    Skin.prototype.load = function (json) {
        var _this = this;
        this.name = loadString(json, "name", "");
        Object.keys(json || {}).forEach(function (key) {
            _this.slots.set(key, new SkinSlot().load(json[key]));
        });
        return this;
    };
    Skin.prototype.iterateAttachments = function (callback) {
        this.slots.forEach(function (skin_slot, slot_key) {
            skin_slot.attachments.forEach(function (attachment, attachment_key) {
                callback(slot_key, skin_slot, (attachment && attachment.name) || attachment_key, attachment);
            });
        });
    };
    return Skin;
}());
exports.Skin = Skin;
var Event = (function () {
    function Event() {
        this.int_value = 0;
        this.float_value = 0;
        this.string_value = "";
    }
    Event.prototype.copy = function (other) {
        this.int_value = other.int_value;
        this.float_value = other.float_value;
        this.string_value = other.string_value;
        return this;
    };
    Event.prototype.load = function (json) {
        if (typeof (json["int"]) === "number") {
            this.int_value = loadInt(json, "int", 0);
        }
        if (typeof (json["float"]) === "number") {
            this.float_value = loadFloat(json, "float", 0);
        }
        if (typeof (json["string"]) === "string") {
            this.string_value = loadString(json, "string", "");
        }
        return this;
    };
    return Event;
}());
exports.Event = Event;
var Range = (function () {
    function Range() {
        this.min = 0;
        this.max = 0;
    }
    Object.defineProperty(Range.prototype, "length", {
        get: function () { return this.max - this.min; },
        enumerable: true,
        configurable: true
    });
    Range.prototype.reset = function () {
        this.min = 0;
        this.max = 0;
        return this;
    };
    Range.prototype.wrap = function (value) {
        return wrap(value, this.min, this.max);
    };
    Range.prototype.expandPoint = function (value) {
        this.min = Math.min(this.min, value);
        this.max = Math.max(this.max, value);
        return value;
    };
    Range.prototype.expandRange = function (range) {
        this.min = Math.min(this.min, range.min);
        this.max = Math.max(this.max, range.max);
        return range;
    };
    return Range;
}());
exports.Range = Range;
var Keyframe = (function () {
    function Keyframe() {
        this.time = 0;
    }
    Keyframe.prototype.drop = function () {
        this.time = 0;
        return this;
    };
    Keyframe.prototype.load = function (json) {
        this.time = 1000 * loadFloat(json, "time", 0); // convert to ms
        return this;
    };
    Keyframe.prototype.save = function (json) {
        saveFloat(json, "time", this.time / 1000, 0); // convert to s
        return this;
    };
    Keyframe.find = function (array, time) {
        if (!array)
            return -1;
        if (array.length <= 0)
            return -1;
        if (time < array[0].time)
            return -1;
        var last = array.length - 1;
        if (time >= array[last].time)
            return last;
        var lo = 0;
        var hi = last;
        if (hi === 0)
            return 0;
        var current = hi >> 1;
        while (true) {
            if (array[current + 1].time <= time) {
                lo = current + 1;
            }
            else {
                hi = current;
            }
            if (lo === hi)
                return lo;
            current = (lo + hi) >> 1;
        }
    };
    Keyframe.compare = function (a, b) {
        return a.time - b.time;
    };
    Keyframe.interpolate = function (keyframe0, keyframe1, time) {
        return (!keyframe0 || !keyframe1 || keyframe0.time === keyframe1.time) ? 0 : (time - keyframe0.time) / (keyframe1.time - keyframe0.time);
    };
    Keyframe.evaluate = function (keyframes, time, callback) {
        var keyframe0_index = Keyframe.find(keyframes, time);
        if (keyframe0_index !== -1) {
            var keyframe1_index = keyframe0_index + 1;
            var keyframe0 = keyframes[keyframe0_index];
            var keyframe1 = keyframes[keyframe1_index] || keyframe0;
            var k = Keyframe.interpolate(keyframe0, keyframe1, time);
            callback(keyframe0, keyframe1, k, keyframe0_index, keyframe1_index);
        }
    };
    return Keyframe;
}());
exports.Keyframe = Keyframe;
var Timeline = (function () {
    function Timeline() {
        this.range = new Range();
        this.keyframes = [];
    }
    Timeline.prototype.__load__ = function (json, ctor) {
        var _this = this;
        this.range.reset();
        this.keyframes.length = 0;
        json.forEach(function (keyframe_json) {
            var keyframe = new ctor().load(keyframe_json);
            _this.range.expandPoint(keyframe.time);
            _this.keyframes.push(keyframe);
        });
        this.keyframes.sort(Keyframe.compare);
        return this;
    };
    Timeline.evaluate = function (timeline, time, callback) {
        timeline && Keyframe.evaluate(timeline.keyframes, time, callback);
    };
    return Timeline;
}());
exports.Timeline = Timeline;
var CurveKeyframe = (function (_super) {
    __extends(CurveKeyframe, _super);
    function CurveKeyframe() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.curve = new Curve();
        return _this;
    }
    CurveKeyframe.prototype.load = function (json) {
        _super.prototype.load.call(this, json);
        this.curve.load(json.curve);
        return this;
    };
    CurveKeyframe.interpolate = function (curve_keyframe0, curve_keyframe1, time) {
        return curve_keyframe0 && curve_keyframe0.curve.evaluate(Keyframe.interpolate(curve_keyframe0, curve_keyframe1, time)) || 0;
    };
    return CurveKeyframe;
}(Keyframe));
exports.CurveKeyframe = CurveKeyframe;
var BonePositionKeyframe = (function (_super) {
    __extends(BonePositionKeyframe, _super);
    function BonePositionKeyframe() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.position = new Position();
        return _this;
    }
    BonePositionKeyframe.prototype.load = function (json) {
        _super.prototype.load.call(this, json);
        this.position.x = loadFloat(json, "x", 0);
        this.position.y = loadFloat(json, "y", 0);
        return this;
    };
    return BonePositionKeyframe;
}(CurveKeyframe));
exports.BonePositionKeyframe = BonePositionKeyframe;
var BonePositionTimeline = (function (_super) {
    __extends(BonePositionTimeline, _super);
    function BonePositionTimeline() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    BonePositionTimeline.prototype.load = function (json) {
        return _super.prototype.__load__.call(this, json, BonePositionKeyframe);
    };
    return BonePositionTimeline;
}(Timeline));
exports.BonePositionTimeline = BonePositionTimeline;
var BoneRotationKeyframe = (function (_super) {
    __extends(BoneRotationKeyframe, _super);
    function BoneRotationKeyframe() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.rotation = new Rotation();
        return _this;
    }
    BoneRotationKeyframe.prototype.load = function (json) {
        _super.prototype.load.call(this, json);
        this.rotation.deg = loadFloat(json, "angle", 0);
        return this;
    };
    return BoneRotationKeyframe;
}(CurveKeyframe));
exports.BoneRotationKeyframe = BoneRotationKeyframe;
var BoneRotationTimeline = (function (_super) {
    __extends(BoneRotationTimeline, _super);
    function BoneRotationTimeline() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    BoneRotationTimeline.prototype.load = function (json) {
        return _super.prototype.__load__.call(this, json, BoneRotationKeyframe);
    };
    return BoneRotationTimeline;
}(Timeline));
exports.BoneRotationTimeline = BoneRotationTimeline;
var BoneScaleKeyframe = (function (_super) {
    __extends(BoneScaleKeyframe, _super);
    function BoneScaleKeyframe() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.scale = new Scale();
        return _this;
    }
    BoneScaleKeyframe.prototype.load = function (json) {
        _super.prototype.load.call(this, json);
        this.scale.x = loadFloat(json, "x", 1);
        this.scale.y = loadFloat(json, "y", 1);
        return this;
    };
    return BoneScaleKeyframe;
}(CurveKeyframe));
exports.BoneScaleKeyframe = BoneScaleKeyframe;
var BoneScaleTimeline = (function (_super) {
    __extends(BoneScaleTimeline, _super);
    function BoneScaleTimeline() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    BoneScaleTimeline.prototype.load = function (json) {
        return _super.prototype.__load__.call(this, json, BoneScaleKeyframe);
    };
    return BoneScaleTimeline;
}(Timeline));
exports.BoneScaleTimeline = BoneScaleTimeline;
var BoneShearKeyframe = (function (_super) {
    __extends(BoneShearKeyframe, _super);
    function BoneShearKeyframe() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.shear = new Shear();
        return _this;
    }
    BoneShearKeyframe.prototype.load = function (json) {
        _super.prototype.load.call(this, json);
        this.shear.x.deg = loadFloat(json, "x", 0);
        this.shear.y.deg = loadFloat(json, "y", 0);
        return this;
    };
    return BoneShearKeyframe;
}(CurveKeyframe));
exports.BoneShearKeyframe = BoneShearKeyframe;
var BoneShearTimeline = (function (_super) {
    __extends(BoneShearTimeline, _super);
    function BoneShearTimeline() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    BoneShearTimeline.prototype.load = function (json) {
        return _super.prototype.__load__.call(this, json, BoneShearKeyframe);
    };
    return BoneShearTimeline;
}(Timeline));
exports.BoneShearTimeline = BoneShearTimeline;
var BoneTimeline = (function () {
    function BoneTimeline() {
        this.range = new Range();
    }
    BoneTimeline.prototype.load = function (json) {
        this.range.reset();
        delete this.position_timeline;
        delete this.rotation_timeline;
        delete this.scale_timeline;
        delete this.shear_timeline;
        json.translate && this.range.expandRange((this.position_timeline = new BonePositionTimeline().load(json.translate)).range);
        json.rotate && this.range.expandRange((this.rotation_timeline = new BoneRotationTimeline().load(json.rotate)).range);
        json.scale && this.range.expandRange((this.scale_timeline = new BoneScaleTimeline().load(json.scale)).range);
        json.shear && this.range.expandRange((this.shear_timeline = new BoneShearTimeline().load(json.shear)).range);
        return this;
    };
    return BoneTimeline;
}());
exports.BoneTimeline = BoneTimeline;
var SlotColorKeyframe = (function (_super) {
    __extends(SlotColorKeyframe, _super);
    function SlotColorKeyframe() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.color = new Color();
        return _this;
    }
    SlotColorKeyframe.prototype.load = function (json) {
        _super.prototype.load.call(this, json);
        this.color.load(json.color);
        return this;
    };
    return SlotColorKeyframe;
}(CurveKeyframe));
exports.SlotColorKeyframe = SlotColorKeyframe;
var SlotColorTimeline = (function (_super) {
    __extends(SlotColorTimeline, _super);
    function SlotColorTimeline() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    SlotColorTimeline.prototype.load = function (json) {
        return _super.prototype.__load__.call(this, json, SlotColorKeyframe);
    };
    return SlotColorTimeline;
}(Timeline));
exports.SlotColorTimeline = SlotColorTimeline;
var SlotAttachmentKeyframe = (function (_super) {
    __extends(SlotAttachmentKeyframe, _super);
    function SlotAttachmentKeyframe() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.name = "";
        return _this;
    }
    SlotAttachmentKeyframe.prototype.load = function (json) {
        _super.prototype.load.call(this, json);
        this.name = loadString(json, "name", "");
        return this;
    };
    return SlotAttachmentKeyframe;
}(Keyframe));
exports.SlotAttachmentKeyframe = SlotAttachmentKeyframe;
var SlotAttachmentTimeline = (function (_super) {
    __extends(SlotAttachmentTimeline, _super);
    function SlotAttachmentTimeline() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    SlotAttachmentTimeline.prototype.load = function (json) {
        return _super.prototype.__load__.call(this, json, SlotAttachmentKeyframe);
    };
    return SlotAttachmentTimeline;
}(Timeline));
exports.SlotAttachmentTimeline = SlotAttachmentTimeline;
var SlotTimeline = (function () {
    function SlotTimeline() {
        this.range = new Range();
    }
    SlotTimeline.prototype.load = function (json) {
        this.range.reset();
        delete this.color_timeline;
        delete this.attachment_timeline;
        json.color && this.range.expandRange((this.color_timeline = new SlotColorTimeline().load(json.color)).range);
        json.attachment && this.range.expandRange((this.attachment_timeline = new SlotAttachmentTimeline().load(json.attachment)).range);
        return this;
    };
    return SlotTimeline;
}());
exports.SlotTimeline = SlotTimeline;
var EventKeyframe = (function (_super) {
    __extends(EventKeyframe, _super);
    function EventKeyframe() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.name = "";
        _this.event = new Event();
        return _this;
    }
    EventKeyframe.prototype.load = function (json) {
        _super.prototype.load.call(this, json);
        this.name = loadString(json, "name", "");
        this.event.load(json);
        return this;
    };
    return EventKeyframe;
}(Keyframe));
exports.EventKeyframe = EventKeyframe;
var EventTimeline = (function (_super) {
    __extends(EventTimeline, _super);
    function EventTimeline() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    EventTimeline.prototype.load = function (json) {
        return _super.prototype.__load__.call(this, json, EventKeyframe);
    };
    return EventTimeline;
}(Timeline));
exports.EventTimeline = EventTimeline;
var SlotOffset = (function () {
    function SlotOffset() {
        this.slot_key = "";
        this.offset = 0;
    }
    SlotOffset.prototype.load = function (json) {
        this.slot_key = loadString(json, "slot", "");
        this.offset = loadInt(json, "offset", 0);
        return this;
    };
    return SlotOffset;
}());
exports.SlotOffset = SlotOffset;
var OrderKeyframe = (function (_super) {
    __extends(OrderKeyframe, _super);
    function OrderKeyframe() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.slot_offsets = [];
        return _this;
    }
    OrderKeyframe.prototype.load = function (json) {
        var _this = this;
        _super.prototype.load.call(this, json);
        this.slot_offsets.length = 0;
        json.offsets && json.offsets.forEach(function (offset_json) {
            _this.slot_offsets.push(new SlotOffset().load(offset_json));
        });
        return this;
    };
    return OrderKeyframe;
}(Keyframe));
exports.OrderKeyframe = OrderKeyframe;
var OrderTimeline = (function (_super) {
    __extends(OrderTimeline, _super);
    function OrderTimeline() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    OrderTimeline.prototype.load = function (json) {
        return _super.prototype.__load__.call(this, json, OrderKeyframe);
    };
    return OrderTimeline;
}(Timeline));
exports.OrderTimeline = OrderTimeline;
var IkcKeyframe = (function (_super) {
    __extends(IkcKeyframe, _super);
    function IkcKeyframe() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.mix = 1;
        _this.bend_positive = true;
        return _this;
    }
    IkcKeyframe.prototype.load = function (json) {
        _super.prototype.load.call(this, json);
        this.mix = loadFloat(json, "mix", 1);
        this.bend_positive = loadBool(json, "bendPositive", true);
        return this;
    };
    return IkcKeyframe;
}(CurveKeyframe));
exports.IkcKeyframe = IkcKeyframe;
var IkcTimeline = (function (_super) {
    __extends(IkcTimeline, _super);
    function IkcTimeline() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    IkcTimeline.prototype.load = function (json) {
        return _super.prototype.__load__.call(this, json, IkcKeyframe);
    };
    return IkcTimeline;
}(Timeline));
exports.IkcTimeline = IkcTimeline;
var XfcKeyframe = (function (_super) {
    __extends(XfcKeyframe, _super);
    function XfcKeyframe() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.position_mix = 1;
        _this.rotation_mix = 1;
        _this.scale_mix = 1;
        _this.shear_mix = 1;
        return _this;
    }
    XfcKeyframe.prototype.load = function (json) {
        _super.prototype.load.call(this, json);
        this.position_mix = loadFloat(json, "translateMix", 1);
        this.rotation_mix = loadFloat(json, "rotateMix", 1);
        this.scale_mix = loadFloat(json, "scaleMix", 1);
        this.shear_mix = loadFloat(json, "shearMix", 1);
        return this;
    };
    return XfcKeyframe;
}(CurveKeyframe));
exports.XfcKeyframe = XfcKeyframe;
var XfcTimeline = (function (_super) {
    __extends(XfcTimeline, _super);
    function XfcTimeline() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    XfcTimeline.prototype.load = function (json) {
        return _super.prototype.__load__.call(this, json, XfcKeyframe);
    };
    return XfcTimeline;
}(Timeline));
exports.XfcTimeline = XfcTimeline;
var PtcMixKeyframe = (function (_super) {
    __extends(PtcMixKeyframe, _super);
    function PtcMixKeyframe() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.position_mix = 0;
        _this.rotation_mix = 0;
        return _this;
    }
    PtcMixKeyframe.prototype.load = function (json) {
        _super.prototype.load.call(this, json);
        this.position_mix = loadFloat(json, "translateMix", 1);
        this.rotation_mix = loadFloat(json, "rotateMix", 1);
        return this;
    };
    return PtcMixKeyframe;
}(CurveKeyframe));
exports.PtcMixKeyframe = PtcMixKeyframe;
var PtcMixTimeline = (function (_super) {
    __extends(PtcMixTimeline, _super);
    function PtcMixTimeline() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    PtcMixTimeline.prototype.load = function (json) {
        return _super.prototype.__load__.call(this, json, PtcMixKeyframe);
    };
    return PtcMixTimeline;
}(Timeline));
exports.PtcMixTimeline = PtcMixTimeline;
var PtcSpacingKeyframe = (function (_super) {
    __extends(PtcSpacingKeyframe, _super);
    function PtcSpacingKeyframe() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.spacing = 0;
        return _this;
    }
    PtcSpacingKeyframe.prototype.load = function (json) {
        _super.prototype.load.call(this, json);
        this.spacing = loadFloat(json, "spacing", 0);
        return this;
    };
    return PtcSpacingKeyframe;
}(CurveKeyframe));
exports.PtcSpacingKeyframe = PtcSpacingKeyframe;
var PtcSpacingTimeline = (function (_super) {
    __extends(PtcSpacingTimeline, _super);
    function PtcSpacingTimeline() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    PtcSpacingTimeline.prototype.load = function (json) {
        return _super.prototype.__load__.call(this, json, PtcSpacingKeyframe);
    };
    return PtcSpacingTimeline;
}(Timeline));
exports.PtcSpacingTimeline = PtcSpacingTimeline;
var PtcPositionKeyframe = (function (_super) {
    __extends(PtcPositionKeyframe, _super);
    function PtcPositionKeyframe() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.position = 0;
        return _this;
    }
    PtcPositionKeyframe.prototype.load = function (json) {
        _super.prototype.load.call(this, json);
        this.position = loadFloat(json, "position", 0);
        return this;
    };
    return PtcPositionKeyframe;
}(CurveKeyframe));
exports.PtcPositionKeyframe = PtcPositionKeyframe;
var PtcPositionTimeline = (function (_super) {
    __extends(PtcPositionTimeline, _super);
    function PtcPositionTimeline() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    PtcPositionTimeline.prototype.load = function (json) {
        return _super.prototype.__load__.call(this, json, PtcPositionKeyframe);
    };
    return PtcPositionTimeline;
}(Timeline));
exports.PtcPositionTimeline = PtcPositionTimeline;
var PtcRotationKeyframe = (function (_super) {
    __extends(PtcRotationKeyframe, _super);
    function PtcRotationKeyframe() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.rotation = new Rotation();
        return _this;
    }
    PtcRotationKeyframe.prototype.load = function (json) {
        _super.prototype.load.call(this, json);
        this.rotation.deg = loadFloat(json, "rotation", 0);
        return this;
    };
    return PtcRotationKeyframe;
}(CurveKeyframe));
exports.PtcRotationKeyframe = PtcRotationKeyframe;
var PtcRotationTimeline = (function (_super) {
    __extends(PtcRotationTimeline, _super);
    function PtcRotationTimeline() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    PtcRotationTimeline.prototype.load = function (json) {
        return _super.prototype.__load__.call(this, json, PtcRotationKeyframe);
    };
    return PtcRotationTimeline;
}(Timeline));
exports.PtcRotationTimeline = PtcRotationTimeline;
var PtcTimeline = (function () {
    function PtcTimeline() {
        this.range = new Range();
    }
    PtcTimeline.prototype.load = function (json) {
        this.range.reset();
        delete this.ptc_mix_timeline;
        delete this.ptc_spacing_timeline;
        delete this.ptc_position_timeline;
        delete this.ptc_rotation_timeline;
        json.mix && this.range.expandRange((this.ptc_mix_timeline = new PtcMixTimeline().load(json.mix)).range);
        json.spacing && this.range.expandRange((this.ptc_spacing_timeline = new PtcSpacingTimeline().load(json.spacing)).range);
        json.position && this.range.expandRange((this.ptc_position_timeline = new PtcPositionTimeline().load(json.position)).range);
        json.rotation && this.range.expandRange((this.ptc_rotation_timeline = new PtcRotationTimeline().load(json.rotation)).range);
        return this;
    };
    return PtcTimeline;
}());
exports.PtcTimeline = PtcTimeline;
var FfdKeyframe = (function (_super) {
    __extends(FfdKeyframe, _super);
    function FfdKeyframe() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.offset = 0;
        _this.vertices = [];
        return _this;
    }
    FfdKeyframe.prototype.load = function (json) {
        _super.prototype.load.call(this, json);
        this.offset = loadInt(json, "offset", 0);
        this.vertices = json.vertices || [];
        return this;
    };
    return FfdKeyframe;
}(CurveKeyframe));
exports.FfdKeyframe = FfdKeyframe;
var FfdTimeline = (function (_super) {
    __extends(FfdTimeline, _super);
    function FfdTimeline() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    FfdTimeline.prototype.load = function (json) {
        return _super.prototype.__load__.call(this, json, FfdKeyframe);
    };
    return FfdTimeline;
}(Timeline));
exports.FfdTimeline = FfdTimeline;
var FfdAttachment = (function () {
    function FfdAttachment() {
        this.ffd_timeline = new FfdTimeline();
    }
    FfdAttachment.prototype.load = function (json) {
        this.ffd_timeline.load(json);
        return this;
    };
    return FfdAttachment;
}());
exports.FfdAttachment = FfdAttachment;
var FfdSlot = (function () {
    function FfdSlot() {
        this.ffd_attachments = new SpineMap();
    }
    FfdSlot.prototype.load = function (json) {
        var _this = this;
        this.ffd_attachments.clear();
        Object.keys(json || {}).forEach(function (key) {
            _this.ffd_attachments.set(key, new FfdAttachment().load(json[key]));
        });
        return this;
    };
    FfdSlot.prototype.iterateAttachments = function (callback) {
        this.ffd_attachments.forEach(function (ffd_attachment, ffd_attachment_key) {
            callback(ffd_attachment_key, ffd_attachment);
        });
    };
    return FfdSlot;
}());
exports.FfdSlot = FfdSlot;
var FfdSkin = (function () {
    function FfdSkin() {
        this.ffd_slots = new SpineMap();
    }
    FfdSkin.prototype.load = function (json) {
        var _this = this;
        this.ffd_slots.clear();
        Object.keys(json || {}).forEach(function (key) {
            _this.ffd_slots.set(key, new FfdSlot().load(json[key]));
        });
        return this;
    };
    FfdSkin.prototype.iterateAttachments = function (callback) {
        this.ffd_slots.forEach(function (ffd_slot, ffd_slot_key) {
            ffd_slot.iterateAttachments(function (ffd_attachment_key, ffd_attachment) {
                callback(ffd_slot_key, ffd_slot, ffd_attachment_key, ffd_attachment);
            });
        });
    };
    return FfdSkin;
}());
exports.FfdSkin = FfdSkin;
var Animation = (function () {
    function Animation() {
        ///public name: string = "";
        this.range = new Range();
        this.bone_timeline_map = new SpineMap();
        this.slot_timeline_map = new SpineMap();
        this.ikc_timeline_map = new SpineMap();
        this.xfc_timeline_map = new SpineMap();
        this.ptc_timeline_map = new SpineMap();
        this.ffd_skins = new SpineMap();
    }
    Animation.prototype.load = function (json) {
        var _this = this;
        this.range.reset();
        this.bone_timeline_map.clear();
        this.slot_timeline_map.clear();
        delete this.event_timeline;
        delete this.order_timeline;
        this.ikc_timeline_map.clear();
        this.xfc_timeline_map.clear();
        this.ptc_timeline_map.clear();
        this.ffd_skins.clear();
        json.bones && Object.keys(json.bones).forEach(function (key) {
            _this.range.expandRange(_this.bone_timeline_map.set(key, new BoneTimeline().load(json.bones[key])).range);
        });
        json.slots && Object.keys(json.slots).forEach(function (key) {
            _this.range.expandRange(_this.slot_timeline_map.set(key, new SlotTimeline().load(json.slots[key])).range);
        });
        json.events && this.range.expandRange((this.event_timeline = new EventTimeline().load(json.events)).range);
        json.draworder = json.draworder || json.drawOrder;
        json.draworder && this.range.expandRange((this.order_timeline = new OrderTimeline().load(json.draworder)).range);
        json.ik && Object.keys(json.ik).forEach(function (key) {
            _this.range.expandRange(_this.ikc_timeline_map.set(key, new IkcTimeline().load(json.ik[key])).range);
        });
        json.transform && Object.keys(json.transform).forEach(function (key) {
            _this.range.expandRange(_this.xfc_timeline_map.set(key, new XfcTimeline().load(json.transform[key])).range);
        });
        json.paths && Object.keys(json.paths).forEach(function (key) {
            _this.range.expandRange(_this.ptc_timeline_map.set(key, new PtcTimeline().load(json.paths[key])).range);
        });
        json.deform = json.deform || json.ffd;
        json.deform && Object.keys(json.deform).forEach(function (key) {
            _this.ffd_skins.set(key, new FfdSkin().load(json.deform[key]));
        });
        return this;
    };
    return Animation;
}());
exports.Animation = Animation;
var Skeleton = (function () {
    function Skeleton() {
        this.hash = "";
        this.spine = "";
        this.width = 0;
        this.height = 0;
        this.images = "";
    }
    Skeleton.prototype.load = function (json) {
        this.hash = loadString(json, "hash", "");
        this.spine = loadString(json, "spine", "");
        this.width = loadInt(json, "width", 0);
        this.height = loadInt(json, "height", 0);
        this.images = loadString(json, "images", "");
        return this;
    };
    return Skeleton;
}());
exports.Skeleton = Skeleton;
var Data = (function () {
    function Data() {
        this.name = "";
        this.skeleton = new Skeleton();
        this.bones = new SpineMap();
        this.ikcs = new SpineMap();
        this.xfcs = new SpineMap();
        this.ptcs = new SpineMap();
        this.slots = new SpineMap();
        this.skins = new SpineMap();
        this.events = new SpineMap();
        this.anims = new SpineMap();
    }
    Data.prototype.drop = function () {
        this.bones.clear();
        this.ikcs.clear();
        this.xfcs.clear();
        this.ptcs.clear();
        this.slots.clear();
        this.skins.clear();
        this.events.clear();
        this.anims.clear();
        return this;
    };
    Data.prototype.load = function (json) {
        var _this = this;
        this.bones.clear();
        this.ikcs.clear();
        this.xfcs.clear();
        this.ptcs.clear();
        this.slots.clear();
        this.skins.clear();
        this.events.clear();
        this.anims.clear();
        json.skeleton && this.skeleton.load(json.skeleton);
        json.bones && json.bones.forEach(function (bone_json) {
            _this.bones.set(bone_json.name, new Bone().load(bone_json));
        });
        json.ik && json.ik.forEach(function (ikc_json) {
            _this.ikcs.set(ikc_json.name, new Ikc().load(ikc_json));
        });
        // sort by order
        this.ikcs.keys.sort(function (a, b) {
            var ikc_a = _this.ikcs.get(a);
            var ikc_b = _this.ikcs.get(b);
            return (ikc_a && ikc_a.order || 0) - (ikc_b && ikc_b.order || 0);
        });
        json.transform && json.transform.forEach(function (xfc_json) {
            _this.xfcs.set(xfc_json.name, new Xfc().load(xfc_json));
        });
        // sort by order
        this.xfcs.keys.sort(function (a, b) {
            var xfc_a = _this.xfcs.get(a);
            var xfc_b = _this.xfcs.get(b);
            return (xfc_a && xfc_a.order || 0) - (xfc_b && xfc_b.order || 0);
        });
        json.path && json.path.forEach(function (ptc_json) {
            _this.ptcs.set(ptc_json.name, new Ptc().load(ptc_json));
        });
        // sort by order
        this.ptcs.keys.sort(function (a, b) {
            var ptc_a = _this.ptcs.get(a);
            var ptc_b = _this.ptcs.get(b);
            return (ptc_a && ptc_a.order || 0) - (ptc_b && ptc_b.order || 0);
        });
        json.slots && json.slots.forEach(function (slot_json) {
            _this.slots.set(slot_json.name, new Slot().load(slot_json));
        });
        json.skins && Object.keys(json.skins).forEach(function (key) {
            var skin = _this.skins.set(key, new Skin().load(json.skins[key]));
            skin.name = skin.name || key;
        });
        json.events && Object.keys(json.events).forEach(function (key) {
            _this.events.set(key, new Event().load(json.events[key]));
        });
        json.animations && Object.keys(json.animations).forEach(function (key) {
            _this.anims.set(key, new Animation().load(json.animations[key]));
        });
        this.iterateBones(function (bone_key, bone) {
            Bone.flatten(bone, _this.bones);
        });
        return this;
    };
    Data.prototype.loadSkeleton = function (json) {
        this.skeleton.load(json);
        return this;
    };
    Data.prototype.loadEvent = function (name, json) {
        this.events.set(name, new Event().load(json));
        return this;
    };
    Data.prototype.loadAnimation = function (name, json) {
        this.anims.set(name, new Animation().load(json));
        return this;
    };
    Data.prototype.getSkins = function () {
        return this.skins;
    };
    Data.prototype.getEvents = function () {
        return this.events;
    };
    Data.prototype.getAnims = function () {
        return this.anims;
    };
    Data.prototype.iterateBones = function (callback) {
        this.bones.forEach(function (data_bone, bone_key) {
            callback(bone_key, data_bone);
        });
    };
    Data.prototype.iterateAttachments = function (skin_key, callback) {
        var skin = this.skins.get(skin_key);
        var default_skin = this.skins.get("default");
        this.slots.forEach(function (slot, slot_key) {
            var skin_slot = (skin && skin.slots.get(slot_key)) || (default_skin && default_skin.slots.get(slot_key));
            var attachment = skin_slot && skin_slot.attachments.get(slot.attachment_key);
            var attachment_key = (attachment && attachment.name) || slot.attachment_key;
            if (attachment && (attachment.type === "linkedmesh")) {
                attachment_key = attachment.parent_key;
                attachment = skin_slot && skin_slot.attachments.get(attachment_key);
            }
            callback(slot_key, slot, skin_slot, attachment_key, attachment);
        });
    };
    Data.prototype.iterateSkins = function (callback) {
        this.skins.forEach(function (skin, skin_key) {
            callback(skin_key, skin);
        });
    };
    Data.prototype.iterateEvents = function (callback) {
        this.events.forEach(function (event, event_key) {
            callback(event_key, event);
        });
    };
    Data.prototype.iterateAnims = function (callback) {
        this.anims.forEach(function (anim, anim_key) {
            callback(anim_key, anim);
        });
    };
    return Data;
}());
exports.Data = Data;
var Pose = (function () {
    function Pose(data) {
        this.skin_key = "";
        this.anim_key = "";
        this.time = 0;
        this.prev_time = 0;
        this.elapsed_time = 0;
        this.wrapped_min = false;
        this.wrapped_max = false;
        this.dirty = true;
        this.bones = new SpineMap();
        this.slots = new SpineMap();
        this.events = new SpineMap();
        this.data = data;
    }
    Pose.prototype.drop = function () {
        this.bones.clear();
        this.slots.clear();
        this.events.clear();
        return this;
    };
    Pose.prototype.curSkel = function () {
        return this.data.skeleton;
    };
    Pose.prototype.getSkins = function () {
        return this.data.skins;
    };
    Pose.prototype.curSkin = function () {
        return this.data.skins.get(this.skin_key);
    };
    Pose.prototype.getSkin = function () {
        return this.skin_key;
    };
    Pose.prototype.setSkin = function (skin_key) {
        if (this.skin_key !== skin_key) {
            this.skin_key = skin_key;
        }
    };
    Pose.prototype.getAnims = function () {
        return this.data.anims;
    };
    Pose.prototype.curAnim = function () {
        return this.data.anims.get(this.anim_key);
    };
    Pose.prototype.curAnimLength = function () {
        var anim = this.data.anims.get(this.anim_key);
        return (anim && anim.range.length) || 0;
    };
    Pose.prototype.getAnim = function () {
        return this.anim_key;
    };
    Pose.prototype.setAnim = function (anim_key) {
        if (this.anim_key !== anim_key) {
            this.anim_key = anim_key;
            var anim = this.data.anims.get(this.anim_key);
            if (anim) {
                this.time = anim.range.wrap(this.time);
            }
            this.prev_time = this.time;
            this.elapsed_time = 0;
            this.dirty = true;
        }
    };
    Pose.prototype.getTime = function () {
        return this.time;
    };
    Pose.prototype.setTime = function (time) {
        var anim = this.data.anims.get(this.anim_key);
        if (anim) {
            time = anim.range.wrap(time);
        }
        if (this.time !== time) {
            this.time = time;
            this.prev_time = this.time;
            this.elapsed_time = 0;
            this.dirty = true;
        }
    };
    Pose.prototype.update = function (elapsed_time) {
        this.elapsed_time += elapsed_time;
        this.dirty = true;
    };
    Pose.prototype.strike = function () {
        if (!this.dirty) {
            return;
        }
        this.dirty = false;
        this.prev_time = this.time; // save previous time
        this.time += this.elapsed_time; // accumulate elapsed time
        var anim = this.data.anims.get(this.anim_key);
        this.wrapped_min = false;
        this.wrapped_max = false;
        if (anim) {
            this.wrapped_min = (this.elapsed_time < 0) && (this.time <= anim.range.min);
            this.wrapped_max = (this.elapsed_time > 0) && (this.time >= anim.range.max);
            this.time = anim.range.wrap(this.time);
        }
        this._strikeBones(anim);
        this._strikeIkcs(anim); // Inverse Kinematic Constraints
        this._strikeXfcs(anim); // Transform Constraints
        this._strikeSlots(anim);
        this._strikePtcs(anim); // Path Constraints
        this._strikeEvents(anim);
        this.elapsed_time = 0; // reset elapsed time for next strike
    };
    Pose.prototype._strikeBones = function (anim) {
        var _this = this;
        this.data.bones.forEach(function (data_bone, bone_key) {
            var pose_bone = _this.bones.get(bone_key) || _this.bones.set(bone_key, new Bone());
            // start with a copy of the data bone
            pose_bone.copy(data_bone);
            // tween anim bone if keyframes are available
            var bone_timeline = anim && anim.bone_timeline_map.get(bone_key);
            if (bone_timeline) {
                Timeline.evaluate(bone_timeline.position_timeline, _this.time, function (keyframe0, keyframe1, k) {
                    var pct = keyframe0.curve.evaluate(k);
                    pose_bone.local_space.position.x += tween(keyframe0.position.x, keyframe1.position.x, pct);
                    pose_bone.local_space.position.y += tween(keyframe0.position.y, keyframe1.position.y, pct);
                });
                Timeline.evaluate(bone_timeline.rotation_timeline, _this.time, function (keyframe0, keyframe1, k) {
                    var pct = keyframe0.curve.evaluate(k);
                    pose_bone.local_space.rotation.rad += tweenAngleRadians(keyframe0.rotation.rad, keyframe1.rotation.rad, pct);
                });
                Timeline.evaluate(bone_timeline.scale_timeline, _this.time, function (keyframe0, keyframe1, k) {
                    var pct = keyframe0.curve.evaluate(k);
                    pose_bone.local_space.scale.a *= tween(keyframe0.scale.a, keyframe1.scale.a, pct);
                    pose_bone.local_space.scale.d *= tween(keyframe0.scale.d, keyframe1.scale.d, pct);
                });
                Timeline.evaluate(bone_timeline.shear_timeline, _this.time, function (keyframe0, keyframe1, k) {
                    var pct = keyframe0.curve.evaluate(k);
                    pose_bone.local_space.shear.x.rad += tweenAngleRadians(keyframe0.shear.x.rad, keyframe1.shear.x.rad, pct);
                    pose_bone.local_space.shear.y.rad += tweenAngleRadians(keyframe0.shear.y.rad, keyframe1.shear.y.rad, pct);
                });
            }
        });
        this.iterateBones(function (bone_key, bone) {
            Bone.flatten(bone, _this.bones);
        });
    };
    Pose.prototype._strikeIkcs = function (anim) {
        var _this = this;
        this.data.ikcs.forEach(function (ikc, ikc_key) {
            var ikc_target = _this.bones.get(ikc.target_key);
            if (!ikc_target)
                return;
            Bone.flatten(ikc_target, _this.bones);
            var ikc_mix = ikc.mix;
            var ikc_bend_positive = ikc.bend_positive;
            var ikc_timeline = anim && anim.ikc_timeline_map.get(ikc_key);
            if (ikc_timeline) {
                Timeline.evaluate(ikc_timeline, _this.time, function (keyframe0, keyframe1, k) {
                    ikc_mix = tween(keyframe0.mix, keyframe1.mix, keyframe0.curve.evaluate(k));
                    // no tweening ik bend direction
                    ikc_bend_positive = keyframe0.bend_positive;
                });
            }
            var alpha = ikc_mix;
            var bendDir = (ikc_bend_positive) ? (1) : (-1);
            if (alpha === 0) {
                return;
            }
            switch (ikc.bone_keys.length) {
                case 1: {
                    var bone = _this.bones.get(ikc.bone_keys[0]);
                    if (!bone)
                        return;
                    Bone.flatten(bone, _this.bones);
                    var a1 = Math.atan2(ikc_target.world_space.position.y - bone.world_space.position.y, ikc_target.world_space.position.x - bone.world_space.position.x);
                    var bone_parent = _this.bones.get(bone.parent_key);
                    if (bone_parent) {
                        Bone.flatten(bone_parent, _this.bones);
                        if (Matrix.determinant(bone_parent.world_space.scale) < 0) {
                            a1 += bone_parent.world_space.rotation.rad;
                        }
                        else {
                            a1 -= bone_parent.world_space.rotation.rad;
                        }
                    }
                    bone.local_space.rotation.rad = tweenAngleRadians(bone.local_space.rotation.rad, a1, alpha);
                    break;
                }
                case 2: {
                    var parent_1 = _this.bones.get(ikc.bone_keys[0]);
                    if (!parent_1)
                        return;
                    Bone.flatten(parent_1, _this.bones);
                    var child = _this.bones.get(ikc.bone_keys[1]);
                    if (!child)
                        return;
                    Bone.flatten(child, _this.bones);
                    ///const px: number = parent.local_space.position.x;
                    ///const py: number = parent.local_space.position.y;
                    var psx = parent_1.local_space.scale.x;
                    var psy = parent_1.local_space.scale.y;
                    var cy = child.local_space.position.y;
                    var csx = child.local_space.scale.x;
                    var offset1 = 0, offset2 = 0, sign2 = 1;
                    if (psx < 0) {
                        psx = -psx;
                        offset1 = Math.PI;
                        sign2 = -1;
                    }
                    if (psy < 0) {
                        psy = -psy;
                        sign2 = -sign2;
                    }
                    if (csx < 0) {
                        csx = -csx;
                        offset2 = Math.PI;
                    }
                    var t = Vector.copy(ikc_target.world_space.position, new Vector());
                    var d = Vector.copy(child.world_space.position, new Vector());
                    var pp = _this.bones.get(parent_1.parent_key);
                    if (pp) {
                        Bone.flatten(pp, _this.bones);
                        Space.untransform(pp.world_space, t, t);
                        Space.untransform(pp.world_space, d, d);
                    }
                    Vector.subtract(t, parent_1.local_space.position, t);
                    Vector.subtract(d, parent_1.local_space.position, d);
                    var tx = t.x, ty = t.y;
                    var dx = d.x, dy = d.y;
                    var l1 = Math.sqrt(dx * dx + dy * dy), l2 = child.length * csx, a1 = void 0, a2 = void 0;
                    outer: if (Math.abs(psx - psy) <= 0.0001) {
                        l2 *= psx;
                        var cos = (tx * tx + ty * ty - l1 * l1 - l2 * l2) / (2 * l1 * l2);
                        if (cos < -1)
                            cos = -1;
                        else if (cos > 1)
                            cos = 1; // clamp
                        a2 = Math.acos(cos) * bendDir;
                        var adj = l1 + l2 * cos;
                        var opp = l2 * Math.sin(a2);
                        a1 = Math.atan2(ty * adj - tx * opp, tx * adj + ty * opp);
                    }
                    else {
                        cy = 0;
                        var a = psx * l2;
                        var b = psy * l2;
                        var ta = Math.atan2(ty, tx);
                        var aa = a * a;
                        var bb = b * b;
                        var ll = l1 * l1;
                        var dd = tx * tx + ty * ty;
                        var c0 = bb * ll + aa * dd - aa * bb;
                        var c1 = -2 * bb * l1;
                        var c2 = bb - aa;
                        var _d = c1 * c1 - 4 * c2 * c0;
                        if (_d >= 0) {
                            var q = Math.sqrt(_d);
                            if (c1 < 0)
                                q = -q;
                            q = -(c1 + q) / 2;
                            var r0 = q / c2, r1 = c0 / q;
                            var r = Math.abs(r0) < Math.abs(r1) ? r0 : r1;
                            if (r * r <= dd) {
                                var y_1 = Math.sqrt(dd - r * r) * bendDir;
                                a1 = ta - Math.atan2(y_1, r);
                                a2 = Math.atan2(y_1 / psy, (r - l1) / psx);
                                break outer;
                            }
                        }
                        var minAngle = 0, minDist = Number.MAX_VALUE, minX = 0, minY = 0;
                        var maxAngle = 0, maxDist = 0, maxX = 0, maxY = 0;
                        var angle = void 0, dist = void 0, x = void 0, y = void 0;
                        x = l1 + a;
                        dist = x * x;
                        if (dist > maxDist) {
                            maxAngle = 0;
                            maxDist = dist;
                            maxX = x;
                        }
                        x = l1 - a;
                        dist = x * x;
                        if (dist < minDist) {
                            minAngle = Math.PI;
                            minDist = dist;
                            minX = x;
                        }
                        angle = Math.acos(-a * l1 / (aa - bb));
                        x = a * Math.cos(angle) + l1;
                        y = b * Math.sin(angle);
                        dist = x * x + y * y;
                        if (dist < minDist) {
                            minAngle = angle;
                            minDist = dist;
                            minX = x;
                            minY = y;
                        }
                        if (dist > maxDist) {
                            maxAngle = angle;
                            maxDist = dist;
                            maxX = x;
                            maxY = y;
                        }
                        if (dd <= (minDist + maxDist) / 2) {
                            a1 = ta - Math.atan2(minY * bendDir, minX);
                            a2 = minAngle * bendDir;
                        }
                        else {
                            a1 = ta - Math.atan2(maxY * bendDir, maxX);
                            a2 = maxAngle * bendDir;
                        }
                    }
                    var offset = Math.atan2(cy, child.local_space.position.x) * sign2;
                    a1 = (a1 - offset) + offset1;
                    a2 = (a2 + offset) * sign2 + offset2;
                    parent_1.local_space.rotation.rad = tweenAngleRadians(parent_1.local_space.rotation.rad, a1, alpha);
                    child.local_space.rotation.rad = tweenAngleRadians(child.local_space.rotation.rad, a2, alpha);
                    break;
                }
            }
        });
        this.iterateBones(function (bone_key, bone) {
            Bone.flatten(bone, _this.bones);
        });
    };
    Pose.prototype._strikeXfcs = function (anim) {
        var _this = this;
        this.data.xfcs.forEach(function (xfc, xfc_key) {
            var xfc_target = _this.bones.get(xfc.target_key);
            if (!xfc_target)
                return;
            var xfc_position_mix = xfc.position_mix;
            var xfc_rotation_mix = xfc.rotation_mix;
            var xfc_scale_mix = xfc.scale_mix;
            var xfc_shear_mix = xfc.shear_mix;
            var xfc_timeline = anim && anim.xfc_timeline_map.get(xfc_key);
            if (xfc_timeline) {
                Timeline.evaluate(xfc_timeline, _this.time, function (keyframe0, keyframe1, k) {
                    var pct = keyframe0.curve.evaluate(k);
                    xfc_position_mix = tween(keyframe0.position_mix, keyframe1.position_mix, pct);
                    xfc_rotation_mix = tween(keyframe0.rotation_mix, keyframe1.rotation_mix, pct);
                    xfc_scale_mix = tween(keyframe0.scale_mix, keyframe1.scale_mix, pct);
                    xfc_shear_mix = tween(keyframe0.shear_mix, keyframe1.shear_mix, pct);
                });
            }
            var xfc_position = xfc.position;
            var xfc_rotation = xfc.rotation;
            var xfc_scale = xfc.scale;
            var xfc_shear = xfc.shear;
            var ta = xfc_target.world_space.affine.matrix.a, tb = xfc_target.world_space.affine.matrix.b;
            var tc = xfc_target.world_space.affine.matrix.c, td = xfc_target.world_space.affine.matrix.d;
            ///let degRadReflect = ta * td - tb * tc > 0 ? MathUtils.degRad : -MathUtils.degRad;
            ///let offsetRotation = this.data.offsetRotation * degRadReflect;
            ///let offsetShearY = this.data.offsetShearY * degRadReflect;
            xfc.bone_keys.forEach(function (bone_key) {
                var xfc_bone = _this.bones.get(bone_key);
                if (!xfc_bone)
                    return;
                if (xfc_position_mix !== 0) {
                    ///let temp = this.temp;
                    ///xfc_target.localToWorld(temp.set(xfc_position.x, xfc_position.y));
                    ///xfc_bone.world_space.affine.vector.x += (temp.x - xfc_bone.world_space.affine.vector.x) * xfc_position_mix;
                    ///xfc_bone.world_space.affine.vector.y += (temp.y - xfc_bone.world_space.affine.vector.y) * xfc_position_mix;
                    var xfc_world_position = Space.transform(xfc_target.world_space, xfc_position, new Vector());
                    xfc_bone.world_space.position.tween(xfc_world_position, xfc_position_mix, xfc_bone.world_space.position);
                }
                if (xfc_rotation_mix !== 0) {
                    var a = xfc_bone.world_space.affine.matrix.a; ///, b = xfc_bone.world_space.affine.matrix.b;
                    var c = xfc_bone.world_space.affine.matrix.c; ///, d = xfc_bone.world_space.affine.matrix.d;
                    var r = Math.atan2(tc, ta) - Math.atan2(c, a) + xfc_rotation.rad;
                    r = wrapAngleRadians(r);
                    r *= xfc_rotation_mix;
                    var cos = Math.cos(r), sin = Math.sin(r);
                    xfc_bone.world_space.affine.matrix.selfRotate(cos, sin);
                }
                if (xfc_scale_mix !== 0) {
                    var s = Math.sqrt(xfc_bone.world_space.affine.matrix.a * xfc_bone.world_space.affine.matrix.a + xfc_bone.world_space.affine.matrix.c * xfc_bone.world_space.affine.matrix.c);
                    var ts = Math.sqrt(ta * ta + tc * tc);
                    if (s > 0.00001)
                        s = (s + (ts - s + xfc_scale.x) * xfc_scale_mix) / s;
                    xfc_bone.world_space.affine.matrix.a *= s;
                    xfc_bone.world_space.affine.matrix.c *= s;
                    s = Math.sqrt(xfc_bone.world_space.affine.matrix.b * xfc_bone.world_space.affine.matrix.b + xfc_bone.world_space.affine.matrix.d * xfc_bone.world_space.affine.matrix.d);
                    ts = Math.sqrt(tb * tb + td * td);
                    if (s > 0.00001)
                        s = (s + (ts - s + xfc_scale.y) * xfc_scale_mix) / s;
                    xfc_bone.world_space.affine.matrix.b *= s;
                    xfc_bone.world_space.affine.matrix.d *= s;
                }
                if (xfc_shear_mix !== 0) {
                    var b = xfc_bone.world_space.affine.matrix.b, d = xfc_bone.world_space.affine.matrix.d;
                    var by = Math.atan2(d, b);
                    var r = Math.atan2(td, tb) - Math.atan2(tc, ta) - (by - Math.atan2(xfc_bone.world_space.affine.matrix.c, xfc_bone.world_space.affine.matrix.a));
                    r = wrapAngleRadians(r);
                    r = by + (r + xfc_shear.y.rad) * xfc_shear_mix;
                    var s = Math.sqrt(b * b + d * d);
                    xfc_bone.world_space.affine.matrix.b = Math.cos(r) * s;
                    xfc_bone.world_space.affine.matrix.d = Math.sin(r) * s;
                }
            });
        });
    };
    Pose.prototype._strikeSlots = function (anim) {
        var _this = this;
        this.data.slots.forEach(function (data_slot, slot_key) {
            var pose_slot = _this.slots.get(slot_key) || _this.slots.set(slot_key, new Slot());
            // start with a copy of the data slot
            pose_slot.copy(data_slot);
            // tween anim slot if keyframes are available
            var slot_timeline = anim && anim.slot_timeline_map.get(slot_key);
            if (slot_timeline) {
                Timeline.evaluate(slot_timeline.color_timeline, _this.time, function (keyframe0, keyframe1, k) {
                    keyframe0.color.tween(keyframe1.color, keyframe0.curve.evaluate(k), pose_slot.color);
                });
                Timeline.evaluate(slot_timeline.attachment_timeline, _this.time, function (keyframe0, keyframe1, k) {
                    // no tweening attachments
                    pose_slot.attachment_key = keyframe0.name;
                });
            }
        });
        this.data.slots.keys.forEach(function (key, index) { _this.slots.keys[index] = key; });
        var order_timeline = anim && anim.order_timeline;
        if (order_timeline) {
            Timeline.evaluate(order_timeline, this.time, function (keyframe0, keyframe1, k) {
                keyframe0.slot_offsets.forEach(function (slot_offset) {
                    var slot_index = _this.slots.keys.indexOf(slot_offset.slot_key);
                    if (slot_index !== -1) {
                        // delete old position
                        _this.slots.keys.splice(slot_index, 1);
                        // insert new position
                        _this.slots.keys.splice(slot_index + slot_offset.offset, 0, slot_offset.slot_key);
                    }
                });
            });
        }
    };
    Pose.prototype._strikePtcs = function (anim) {
        var _this = this;
        var skin = this.data.skins.get(this.skin_key);
        var default_skin = this.data.skins.get("default");
        this.data.ptcs.forEach(function (ptc, ptc_key) {
            var slot_key = ptc.target_key;
            var slot = _this.slots.get(slot_key);
            var skin_slot = (skin && skin.slots.get(slot_key)) || (default_skin && default_skin.slots.get(slot_key));
            var ptc_target = slot && skin_slot && skin_slot.attachments.get(slot.attachment_key);
            if (!(ptc_target instanceof PathAttachment))
                return;
            var ptc_spacing_mode = ptc.spacing_mode;
            var ptc_spacing = ptc.spacing;
            var ptc_position_mode = ptc.position_mode;
            var ptc_position_mix = ptc.position_mix;
            var ptc_position = ptc.position;
            var ptc_rotation_mode = ptc.rotation_mode;
            var ptc_rotation_mix = ptc.rotation_mix;
            var ptc_rotation = ptc.rotation;
            var ptc_timeline = anim && anim.ptc_timeline_map.get(ptc_key);
            if (ptc_timeline) {
                Timeline.evaluate(ptc_timeline.ptc_mix_timeline, _this.time, function (keyframe0, keyframe1, k) {
                    var pct = keyframe0.curve.evaluate(k);
                    ptc_position_mix = tween(keyframe0.position_mix, keyframe1.position_mix, pct);
                    ptc_rotation_mix = tween(keyframe0.rotation_mix, keyframe1.rotation_mix, pct);
                });
                Timeline.evaluate(ptc_timeline.ptc_spacing_timeline, _this.time, function (keyframe0, keyframe1, k) {
                    ptc_spacing = tween(keyframe0.spacing, keyframe1.spacing, keyframe0.curve.evaluate(k));
                });
                Timeline.evaluate(ptc_timeline.ptc_position_timeline, _this.time, function (keyframe0, keyframe1, k) {
                    ptc_position = tween(keyframe0.position, keyframe1.position, keyframe0.curve.evaluate(k));
                });
                Timeline.evaluate(ptc_timeline.ptc_rotation_timeline, _this.time, function (keyframe0, keyframe1, k) {
                    ptc_rotation.rad = tweenAngleRadians(keyframe0.rotation.rad, keyframe1.rotation.rad, keyframe0.curve.evaluate(k));
                });
            }
            ptc.bone_keys.forEach(function (bone_key) {
                var ptc_bone = _this.bones.get(bone_key);
                if (!ptc_bone)
                    return;
                // TODO: solve path constraint for ptc_bone (Bone) using ptc_target (PathAttachment)
                switch (ptc_spacing_mode) {
                    case "length":
                    case "fixed":
                    case "percent":
                        break;
                }
                switch (ptc_position_mode) {
                    case "fixed":
                    case "percent":
                        break;
                }
                switch (ptc_rotation_mode) {
                    case "tangent":
                    case "chain":
                    case "chainscale":
                        break;
                }
            });
        });
    };
    Pose.prototype._strikeEvents = function (anim) {
        var _this = this;
        this.events.clear();
        if (anim && anim.event_timeline) {
            var make_event_1 = function (event_keyframe) {
                var pose_event = new Event();
                var data_event = _this.data.events.get(event_keyframe.name);
                if (data_event) {
                    pose_event.copy(data_event);
                }
                pose_event.int_value = event_keyframe.event.int_value || pose_event.int_value;
                pose_event.float_value = event_keyframe.event.float_value || pose_event.float_value;
                pose_event.string_value = event_keyframe.event.string_value || pose_event.string_value;
                return pose_event;
            };
            if (this.elapsed_time < 0) {
                if (this.wrapped_min) {
                    // min    prev_time           time      max
                    //  |         |                |         |
                    //  ----------x                o<---------
                    // all events between min and prev_time, not including prev_time
                    // all events between max and time
                    anim.event_timeline.keyframes.forEach(function (event_keyframe) {
                        if (((anim.range.min <= event_keyframe.time) && (event_keyframe.time < _this.prev_time)) ||
                            ((_this.time <= event_keyframe.time) && (event_keyframe.time <= anim.range.max))) {
                            _this.events.set(event_keyframe.name, make_event_1(event_keyframe));
                        }
                    });
                }
                else {
                    // min       time          prev_time    max
                    //  |         |                |         |
                    //            o<---------------x
                    // all events between time and prev_time, not including prev_time
                    anim.event_timeline.keyframes.forEach(function (event_keyframe) {
                        if ((_this.time <= event_keyframe.time) && (event_keyframe.time < _this.prev_time)) {
                            _this.events.set(event_keyframe.name, make_event_1(event_keyframe));
                        }
                    });
                }
            }
            else {
                if (this.wrapped_max) {
                    // min       time          prev_time    max
                    //  |         |                |         |
                    //  --------->o                x----------
                    // all events between prev_time and max, not including prev_time
                    // all events between min and time
                    anim.event_timeline.keyframes.forEach(function (event_keyframe) {
                        if (((anim.range.min <= event_keyframe.time) && (event_keyframe.time <= _this.time)) ||
                            ((_this.prev_time < event_keyframe.time) && (event_keyframe.time <= anim.range.max))) {
                            _this.events.set(event_keyframe.name, make_event_1(event_keyframe));
                        }
                    });
                }
                else {
                    // min    prev_time           time      max
                    //  |         |                |         |
                    //            x--------------->o
                    // all events between prev_time and time, not including prev_time
                    anim.event_timeline.keyframes.forEach(function (event_keyframe) {
                        if ((_this.prev_time < event_keyframe.time) && (event_keyframe.time <= _this.time)) {
                            _this.events.set(event_keyframe.name, make_event_1(event_keyframe));
                        }
                    });
                }
            }
        }
    };
    Pose.prototype.iterateBones = function (callback) {
        this.bones.forEach(function (bone, bone_key) {
            callback(bone_key, bone);
        });
    };
    Pose.prototype.iterateAttachments = function (callback) {
        var skin = this.data.skins.get(this.skin_key);
        var default_skin = this.data.skins.get("default");
        this.slots.forEach(function (slot, slot_key) {
            var skin_slot = (skin && skin.slots.get(slot_key)) || (default_skin && default_skin.slots.get(slot_key));
            var attachment = skin_slot && skin_slot.attachments.get(slot.attachment_key);
            var attachment_key = (attachment && attachment.name) || slot.attachment_key;
            if (attachment && (attachment.type === "linkedmesh")) {
                attachment_key = attachment.parent_key;
                attachment = skin_slot && skin_slot.attachments.get(attachment_key);
            }
            callback(slot_key, slot, skin_slot, attachment_key, attachment);
        });
    };
    Pose.prototype.iterateEvents = function (callback) {
        this.events.forEach(function (event, event_key) {
            callback(event_key, event);
        });
    };
    return Pose;
}());
exports.Pose = Pose;


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

var Spine = __webpack_require__(1);
var RenderWebGL = (function () {
    function RenderWebGL(gl) {
        this.bone_map = new Spine.Map();
        this.skin_map = new Spine.Map();
        this.textures = new Spine.Map();
        this.projection = mat4x4Identity(new Float32Array(16));
        this.modelview = mat4x4Identity(new Float32Array(16));
        this.texmatrix = mat3x3Identity(new Float32Array(9));
        this.color = vec4Identity(new Float32Array(4));
        this.skin_shader_modelview_count = 16; // mat4
        this.skin_shader_modelview_array = new Float32Array(16 * this.skin_shader_modelview_count);
        this.skin_shader_blenders_count = 8; // vec2
        this.gl = gl;
        var mesh_shader_vs_src = [
            "uniform mat4 uProjection;",
            "uniform mat4 uModelview;",
            "uniform mat3 uTexMatrix;",
            "attribute vec2 aPosition;",
            "attribute vec2 aTexCoord;",
            "varying vec3 vTexCoord;",
            "void main(void) {",
            " gl_Position = uProjection * uModelview * vec4(aPosition, 0.0, 1.0);",
            " vTexCoord = uTexMatrix * vec3(aTexCoord, 1.0);",
            "}"
        ];
        var ffd_mesh_shader_vs_src = [
            "uniform mat4 uProjection;",
            "uniform mat4 uModelview;",
            "uniform mat3 uTexMatrix;",
            "uniform float uMorphWeight;",
            "attribute vec2 aPosition;",
            "attribute vec2 aTexCoord;",
            "attribute vec2 aPositionMorph0;",
            "attribute vec2 aPositionMorph1;",
            "varying vec3 vTexCoord;",
            "void main(void) {",
            " gl_Position = uProjection * uModelview * vec4(aPosition + mix(aPositionMorph0, aPositionMorph1, uMorphWeight), 0.0, 1.0);",
            " vTexCoord = uTexMatrix * vec3(aTexCoord, 1.0);",
            "}"
        ];
        var mesh_shader_fs_src = [
            "uniform sampler2D uSampler;",
            "uniform vec4 uColor;",
            "varying vec3 vTexCoord;",
            "void main(void) {",
            " gl_FragColor = uColor * texture2D(uSampler, vTexCoord.st);",
            "}"
        ];
        this.mesh_shader = glMakeShader(gl, mesh_shader_vs_src, mesh_shader_fs_src);
        this.ffd_mesh_shader = glMakeShader(gl, ffd_mesh_shader_vs_src, mesh_shader_fs_src);
        var skin_shader_vs_src = [
            "uniform mat4 uProjection;",
            "uniform mat4 uModelviewArray[" + this.skin_shader_modelview_count + "];",
            "uniform mat3 uTexMatrix;",
            "attribute vec2 aPosition;",
            "attribute vec2 aTexCoord;",
            repeat("attribute vec2 aBlenders{index};", this.skin_shader_blenders_count),
            "varying vec3 vTexCoord;",
            "void main(void) {",
            " vec4 position = vec4(aPosition, 0.0, 1.0);",
            " vec4 blendPosition = vec4(0.0);",
            repeat(" blendPosition += (uModelviewArray[int(aBlenders{index}.x)] * position) * aBlenders{index}.y;", this.skin_shader_blenders_count),
            " gl_Position = uProjection * vec4(blendPosition.xy, 0.0, 1.0);",
            " vTexCoord = uTexMatrix * vec3(aTexCoord, 1.0);",
            "}"
        ];
        var ffd_skin_shader_vs_src = [
            "uniform mat4 uProjection;",
            "uniform mat4 uModelviewArray[" + this.skin_shader_modelview_count + "];",
            "uniform mat3 uTexMatrix;",
            "uniform float uMorphWeight;",
            "attribute vec2 aPosition;",
            "attribute vec2 aTexCoord;",
            "attribute vec2 aPositionMorph0;",
            "attribute vec2 aPositionMorph1;",
            repeat("attribute vec2 aBlenders{index};", this.skin_shader_blenders_count),
            "varying vec3 vTexCoord;",
            "void main(void) {",
            " vec4 position = vec4(aPosition + mix(aPositionMorph0, aPositionMorph1, uMorphWeight), 0.0, 1.0);",
            " vec4 blendPosition = vec4(0.0);",
            repeat(" blendPosition += (uModelviewArray[int(aBlenders{index}.x)] * position) * aBlenders{index}.y;", this.skin_shader_blenders_count),
            " gl_Position = uProjection * vec4(blendPosition.xy, 0.0, 1.0);",
            " vTexCoord = uTexMatrix * vec3(aTexCoord, 1.0);",
            "}"
        ];
        var skin_shader_fs_src = [
            "uniform sampler2D uSampler;",
            "uniform vec4 uColor;",
            "varying vec3 vTexCoord;",
            "void main(void) {",
            " gl_FragColor = uColor * texture2D(uSampler, vTexCoord.st);",
            "}"
        ];
        this.skin_shader = glMakeShader(gl, skin_shader_vs_src, skin_shader_fs_src);
        this.ffd_skin_shader = glMakeShader(gl, ffd_skin_shader_vs_src, skin_shader_fs_src);
        this.region_vertex_position = glMakeVertex(gl, new Float32Array([-1, -1, 1, -1, 1, 1, -1, 1]), 2, gl.ARRAY_BUFFER, gl.STATIC_DRAW); // [ x, y ]
        this.region_vertex_texcoord = glMakeVertex(gl, new Float32Array([0, 1, 1, 1, 1, 0, 0, 0]), 2, gl.ARRAY_BUFFER, gl.STATIC_DRAW); // [ u, v ]
    }
    RenderWebGL.prototype.loadData = function (spine_data, atlas_data, images) {
        var _this = this;
        spine_data.iterateBones(function (bone_key, bone) {
            var render_bone = _this.bone_map.get(bone_key) || _this.bone_map.set(bone_key, new RenderBone());
            Spine.Space.invert(bone.world_space, render_bone.setup_space);
        });
        spine_data.iterateSkins(function (skin_key, skin) {
            var render_skin = _this.skin_map.get(skin_key) || _this.skin_map.set(skin_key, new RenderSkin());
            skin.iterateAttachments(function (slot_key, skin_slot, attachment_key, attachment) {
                if (!attachment) {
                    return;
                }
                var render_slot = render_skin.slot_map.get(slot_key) || render_skin.slot_map.set(slot_key, new RenderSlot());
                switch (attachment.type) {
                    case "region":
                        render_slot.attachment_map.set(attachment_key, new RenderRegionAttachment(_this).loadData(spine_data, skin_key, slot_key, attachment_key, attachment));
                        break;
                    case "mesh":
                        render_slot.attachment_map.set(attachment_key, new RenderMeshAttachment(_this).loadData(spine_data, skin_key, slot_key, attachment_key, attachment));
                        break;
                    case "weightedmesh":
                        render_slot.attachment_map.set(attachment_key, new RenderWeightedMeshAttachment(_this).loadData(spine_data, skin_key, slot_key, attachment_key, attachment));
                        break;
                }
            });
        });
        if (atlas_data) {
            var gl_1 = this.gl;
            atlas_data.pages.forEach(function (page) {
                if (page.format !== "RGBA8888") {
                    throw new Error(page.format);
                }
                var min_filter = gl_1.NONE;
                switch (page.min_filter) {
                    case "Nearest":
                        min_filter = gl_1.NEAREST;
                        break;
                    default:
                    case "Linear":
                        min_filter = gl_1.LINEAR;
                        break;
                    case "MipMapNearestNearest":
                        min_filter = gl_1.NEAREST_MIPMAP_NEAREST;
                        break;
                    case "MipMapLinearNearest":
                        min_filter = gl_1.LINEAR_MIPMAP_NEAREST;
                        break;
                    case "MipMapNearestLinear":
                        min_filter = gl_1.NEAREST_MIPMAP_LINEAR;
                        break;
                    case "MipMapLinearLinear":
                        min_filter = gl_1.LINEAR_MIPMAP_LINEAR;
                        break;
                }
                var mag_filter = gl_1.NONE;
                switch (page.mag_filter) {
                    case "Nearest":
                        mag_filter = gl_1.NEAREST;
                        break;
                    default:
                    case "Linear":
                        mag_filter = gl_1.LINEAR;
                        break;
                }
                var wrap_s = gl_1.NONE;
                switch (page.wrap_s) {
                    case "Repeat":
                        wrap_s = gl_1.REPEAT;
                        break;
                    default:
                    case "ClampToEdge":
                        wrap_s = gl_1.CLAMP_TO_EDGE;
                        break;
                    case "MirroredRepeat":
                        wrap_s = gl_1.MIRRORED_REPEAT;
                        break;
                }
                var wrap_t = gl_1.NONE;
                switch (page.wrap_t) {
                    case "Repeat":
                        wrap_t = gl_1.REPEAT;
                        break;
                    default:
                    case "ClampToEdge":
                        wrap_t = gl_1.CLAMP_TO_EDGE;
                        break;
                    case "MirroredRepeat":
                        wrap_t = gl_1.MIRRORED_REPEAT;
                        break;
                }
                var image_key = page.name;
                _this.textures.set(image_key, glMakeTexture(gl_1, images.get(image_key), min_filter, mag_filter, wrap_s, wrap_t));
            });
        }
        else {
            var gl_2 = this.gl;
            spine_data.iterateSkins(function (skin_key, skin) {
                skin.iterateAttachments(function (slot_key, skin_slot, attachment_key, attachment) {
                    if (!attachment) {
                        return;
                    }
                    switch (attachment.type) {
                        case "region":
                        case "mesh":
                        case "weightedmesh":
                            var image_key = attachment_key;
                            _this.textures.set(image_key, glMakeTexture(gl_2, images.get(image_key), gl_2.LINEAR, gl_2.LINEAR, gl_2.CLAMP_TO_EDGE, gl_2.CLAMP_TO_EDGE));
                            break;
                    }
                });
            });
        }
    };
    RenderWebGL.prototype.dropData = function (spine_data, atlas_data) {
        var _this = this;
        if (atlas_data === void 0) { atlas_data = null; }
        var gl = this.gl;
        this.textures.forEach(function (texture, image_key) {
            glDropTexture(gl, texture);
        });
        this.textures.clear();
        this.bone_map.clear();
        spine_data.iterateSkins(function (skin_key, skin) {
            var render_skin = _this.skin_map.get(skin_key);
            skin.iterateAttachments(function (slot_key, skin_slot, attachment_key, attachment) {
                if (!attachment) {
                    return;
                }
                var render_slot = render_skin && render_skin.slot_map.get(slot_key);
                var render_attachment = render_slot && render_slot.attachment_map.get(attachment_key);
                if (render_attachment) {
                    render_attachment.dropData(spine_data, skin_key, slot_key, attachment_key, attachment);
                }
            });
        });
        this.skin_map.clear();
    };
    RenderWebGL.prototype.drawPose = function (spine_pose, atlas_data) {
        var _this = this;
        if (atlas_data === void 0) { atlas_data = null; }
        var gl = this.gl;
        var alpha = this.color[3];
        spine_pose.iterateAttachments(function (slot_key, slot, skin_slot, attachment_key, attachment) {
            if (!attachment) {
                return;
            }
            if (attachment.type === "boundingbox") {
                return;
            }
            mat4x4Identity(_this.modelview);
            mat3x3Identity(_this.texmatrix);
            vec4CopyColor(_this.color, slot.color);
            _this.color[3] *= alpha;
            gl.enable(gl.BLEND);
            switch (slot.blend) {
                default:
                case "normal":
                    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
                    break;
                case "additive":
                    gl.blendFunc(gl.SRC_ALPHA, gl.ONE);
                    break;
                case "multiply":
                    gl.blendFunc(gl.DST_COLOR, gl.ONE_MINUS_SRC_ALPHA);
                    break;
                case "screen":
                    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_COLOR);
                    break;
            }
            var render_skin = _this.skin_map.get(spine_pose.skin_key);
            var render_skin_default = _this.skin_map.get("default");
            var render_slot = (render_skin && render_skin.slot_map.get(slot_key)) || (render_skin_default && render_skin_default.slot_map.get(slot_key));
            var render_attachment = render_slot && render_slot.attachment_map.get(attachment_key);
            if (render_attachment) {
                render_attachment.drawPose(spine_pose, atlas_data, spine_pose.skin_key, slot_key, slot, attachment_key, attachment);
            }
        });
        this.color[3] = alpha;
    };
    return RenderWebGL;
}());
exports.RenderWebGL = RenderWebGL;
var RenderBone = (function () {
    function RenderBone() {
        this.setup_space = new Spine.Space();
    }
    return RenderBone;
}());
var RenderSkin = (function () {
    function RenderSkin() {
        this.slot_map = new Spine.Map();
    }
    return RenderSkin;
}());
var RenderSlot = (function () {
    function RenderSlot() {
        this.attachment_map = new Spine.Map();
    }
    return RenderSlot;
}());
var RenderRegionAttachment = (function () {
    function RenderRegionAttachment(render) {
        this.render = render;
    }
    RenderRegionAttachment.prototype.loadData = function (spine_data, skin_key, slot_key, attachment_key, attachment) {
        return this;
    };
    RenderRegionAttachment.prototype.dropData = function (spine_data, skin_key, slot_key, attachment_key, attachment) {
        return this;
    };
    RenderRegionAttachment.prototype.drawPose = function (spine_pose, atlas_data, skin_key, slot_key, slot, attachment_key, attachment) {
        var gl = this.render.gl;
        var bone = spine_pose.bones.get(slot.bone_key);
        var site = atlas_data && atlas_data.sites[attachment.path || attachment.name || attachment_key];
        var page = site && site.page;
        var image_key = (page && page.name) || attachment.path || attachment.name || attachment_key;
        var texture = this.render.textures.get(image_key);
        if (!texture) {
            return;
        }
        mat3x3ApplyAtlasPageTexcoord(this.render.texmatrix, page);
        mat3x3ApplyAtlasSiteTexcoord(this.render.texmatrix, site);
        bone && mat4x4ApplySpace(this.render.modelview, bone.world_space);
        mat4x4ApplySpace(this.render.modelview, attachment.local_space);
        mat4x4Scale(this.render.modelview, attachment.width / 2, attachment.height / 2);
        mat4x4ApplyAtlasSitePosition(this.render.modelview, site);
        var shader = this.render.mesh_shader;
        gl.useProgram(shader.program);
        gl.uniformMatrix4fv(shader.uniforms.get("uProjection") || 0, false, this.render.projection);
        gl.uniformMatrix4fv(shader.uniforms.get("uModelview") || 0, false, this.render.modelview);
        gl.uniformMatrix3fv(shader.uniforms.get("uTexMatrix") || 0, false, this.render.texmatrix);
        gl.uniform4fv(shader.uniforms.get("uColor") || 0, this.render.color);
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, texture.texture);
        gl.uniform1i(shader.uniforms.get("uSampler") || 0, 0);
        glSetupAttribute(gl, shader, "aPosition", this.render.region_vertex_position);
        glSetupAttribute(gl, shader, "aTexCoord", this.render.region_vertex_texcoord);
        gl.drawArrays(gl.TRIANGLE_FAN, 0, this.render.region_vertex_position.count);
        glResetAttributes(gl, shader);
    };
    return RenderRegionAttachment;
}());
var RenderMeshAttachment = (function () {
    function RenderMeshAttachment(render) {
        this.ffd_attachment_map = new Spine.Map();
        this.render = render;
    }
    RenderMeshAttachment.prototype.loadData = function (spine_data, skin_key, slot_key, attachment_key, attachment) {
        var _this = this;
        var gl = this.render.gl;
        var vertex_count = attachment.vertices.length / 2;
        var vertex_position = new Float32Array(attachment.vertices);
        var vertex_texcoord = new Float32Array(attachment.uvs);
        var vertex_triangle = new Uint16Array(attachment.triangles);
        this.vertex_position = glMakeVertex(gl, vertex_position, 2, gl.ARRAY_BUFFER, gl.STATIC_DRAW);
        this.vertex_texcoord = glMakeVertex(gl, vertex_texcoord, 2, gl.ARRAY_BUFFER, gl.STATIC_DRAW);
        this.vertex_triangle = glMakeVertex(gl, vertex_triangle, 1, gl.ELEMENT_ARRAY_BUFFER, gl.STATIC_DRAW);
        spine_data.iterateAnims(function (anim_key, anim) {
            var ffd_skin = anim.ffd_skins && anim.ffd_skins.get(skin_key);
            var ffd_slot = ffd_skin && ffd_skin.ffd_slots.get(slot_key);
            var ffd_attachment = ffd_slot && ffd_slot.ffd_attachments.get(attachment_key);
            if (ffd_attachment) {
                var render_ffd_attachment_1 = _this.ffd_attachment_map.set(anim_key, new RenderFfdAttachment());
                ffd_attachment.ffd_timeline.keyframes.forEach(function (ffd_keyframe, ffd_keyframe_index) {
                    var render_ffd_keyframe = render_ffd_attachment_1.ffd_keyframes[ffd_keyframe_index] = new RenderFfdKeyframe();
                    var vertex_position_morph = new Float32Array(2 * vertex_count);
                    vertex_position_morph.subarray(ffd_keyframe.offset, ffd_keyframe.offset + ffd_keyframe.vertices.length).set(new Float32Array(ffd_keyframe.vertices));
                    render_ffd_keyframe.vertex_position_morph = glMakeVertex(gl, vertex_position_morph, 2, gl.ARRAY_BUFFER, gl.STATIC_DRAW);
                });
            }
        });
        return this;
    };
    RenderMeshAttachment.prototype.dropData = function (spine_data, skin_key, slot_key, attachment_key, attachment) {
        var gl = this.render.gl;
        glDropVertex(gl, this.vertex_position);
        glDropVertex(gl, this.vertex_texcoord);
        glDropVertex(gl, this.vertex_triangle);
        this.ffd_attachment_map.forEach(function (render_ffd_attachment, anim_key) {
            render_ffd_attachment.ffd_keyframes.forEach(function (ffd_keyframe) {
                glDropVertex(gl, ffd_keyframe.vertex_position_morph);
            });
        });
        return this;
    };
    RenderMeshAttachment.prototype.drawPose = function (spine_pose, atlas_data, skin_key, slot_key, slot, attachment_key, attachment) {
        var gl = this.render.gl;
        var bone = spine_pose.bones.get(slot.bone_key);
        var site = atlas_data && atlas_data.sites[attachment.path || attachment.name || attachment_key];
        var page = site && site.page;
        var image_key = (page && page.name) || attachment.path || attachment.name || attachment_key;
        var texture = this.render.textures.get(image_key);
        if (!texture) {
            return;
        }
        bone && mat4x4ApplySpace(this.render.modelview, bone.world_space);
        mat4x4ApplyAtlasSitePosition(this.render.modelview, site);
        var anim = spine_pose.data.anims.get(spine_pose.anim_key);
        var ffd_skin = anim && anim.ffd_skins && anim.ffd_skins.get(spine_pose.skin_key);
        var ffd_slot = ffd_skin && ffd_skin.ffd_slots.get(slot_key);
        var ffd_attachment = ffd_slot && ffd_slot.ffd_attachments.get(attachment_key);
        var ffd_timeline = ffd_attachment && ffd_attachment.ffd_timeline;
        var ffd_keyframes = ffd_timeline && ffd_timeline.keyframes;
        var ffd_keyframe0_index = Spine.Keyframe.find(ffd_keyframes, spine_pose.time);
        var ffd_keyframe1_index = ffd_keyframe0_index + 1 || ffd_keyframe0_index;
        var ffd_keyframe0 = (ffd_keyframes && ffd_keyframes[ffd_keyframe0_index]);
        var ffd_keyframe1 = (ffd_keyframes && ffd_keyframes[ffd_keyframe1_index]) || ffd_keyframe0;
        var ffd_weight = Spine.FfdKeyframe.interpolate(ffd_keyframe0, ffd_keyframe1, spine_pose.time);
        var render_ffd_attachment = this.ffd_attachment_map.get(spine_pose.anim_key);
        var render_ffd_keyframe0 = (render_ffd_attachment && render_ffd_attachment.ffd_keyframes[ffd_keyframe0_index]);
        var render_ffd_keyframe1 = (render_ffd_attachment && render_ffd_attachment.ffd_keyframes[ffd_keyframe1_index]) || render_ffd_keyframe0;
        var shader = ffd_keyframe0 ? this.render.ffd_mesh_shader : this.render.mesh_shader;
        gl.useProgram(shader.program);
        gl.uniformMatrix4fv(shader.uniforms.get("uProjection") || 0, false, this.render.projection);
        gl.uniformMatrix4fv(shader.uniforms.get("uModelview") || 0, false, this.render.modelview);
        gl.uniformMatrix3fv(shader.uniforms.get("uTexMatrix") || 0, false, this.render.texmatrix);
        gl.uniform4fv(shader.uniforms.get("uColor") || 0, this.render.color);
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, texture.texture);
        gl.uniform1i(shader.uniforms.get("uSampler") || 0, 0);
        glSetupAttribute(gl, shader, "aPosition", this.vertex_position);
        glSetupAttribute(gl, shader, "aTexCoord", this.vertex_texcoord);
        ffd_keyframe0 && gl.uniform1f(shader.uniforms.get("uMorphWeight") || 0, ffd_weight);
        render_ffd_keyframe0 && glSetupAttribute(gl, shader, "aPositionMorph0", render_ffd_keyframe0.vertex_position_morph);
        render_ffd_keyframe1 && glSetupAttribute(gl, shader, "aPositionMorph1", render_ffd_keyframe1.vertex_position_morph);
        var vertex_triangle = this.vertex_triangle;
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, vertex_triangle.buffer);
        gl.drawElements(gl.TRIANGLES, vertex_triangle.count, vertex_triangle.type, 0);
        glResetAttributes(gl, shader);
    };
    return RenderMeshAttachment;
}());
var RenderWeightedMeshAttachment = (function () {
    function RenderWeightedMeshAttachment(render) {
        this.blend_bone_index_array = [];
        this.ffd_attachment_map = new Spine.Map();
        this.render = render;
    }
    RenderWeightedMeshAttachment.prototype.loadData = function (spine_data, skin_key, slot_key, attachment_key, attachment) {
        var _this = this;
        function parseBlenders(vertices, index, callback) {
            var blender_count = vertices[index++];
            for (var blender_index = 0; blender_index < blender_count; ++blender_index) {
                var blender = new Blender();
                blender.bone_index = vertices[index++];
                blender.position.x = vertices[index++];
                blender.position.y = vertices[index++];
                blender.weight = vertices[index++];
                callback(blender, blender_index);
            }
            return index;
        }
        var gl = this.render.gl;
        var vertex_count = attachment.uvs.length / 2;
        var vertex_position = new Float32Array(2 * vertex_count); // [ x, y ]
        var vertex_texcoord = new Float32Array(attachment.uvs); // [ u, v ]
        var vertex_blenders = new Float32Array(2 * vertex_count * this.render.skin_shader_blenders_count); // [ i0, w0, i1, w1, ... ]
        var vertex_triangle = new Uint16Array(attachment.triangles);
        var blend_bone_index_array = this.blend_bone_index_array;
        var _loop_1 = function (vertex_index, parse_index) {
            var blender_array = [];
            parse_index = parseBlenders(attachment.vertices, parse_index, function (blender) { blender_array.push(blender); });
            // sort descending by weight
            blender_array.sort(function (a, b) { return b.weight - a.weight; });
            // clamp to limit
            if (blender_array.length > this_1.render.skin_shader_blenders_count) {
                console.log("blend array length for", attachment_key, "is", blender_array.length, "so clamp to", this_1.render.skin_shader_blenders_count);
                blender_array.length = this_1.render.skin_shader_blenders_count;
            }
            // normalize weights
            var weight_sum = 0;
            blender_array.forEach(function (blender) { weight_sum += blender.weight; });
            blender_array.forEach(function (blender) { blender.weight /= weight_sum; });
            var position = new Spine.Vector();
            blender_array.forEach(function (blender, blender_index) {
                var bone_key = spine_data.bones.keys[blender.bone_index];
                var bone = spine_data.bones.get(bone_key);
                var blend_position = new Spine.Vector();
                bone && Spine.Space.transform(bone.world_space, blender.position, blend_position);
                position.selfAdd(blend_position.selfScale(blender.weight));
                // keep track of which bones are used for blending
                if (blend_bone_index_array.indexOf(blender.bone_index) === -1) {
                    blend_bone_index_array.push(blender.bone_index);
                }
                // index into skin_shader_modelview_array, not spine_pose.data.bone_keys
                vertex_blenders[vertex_index * 2 * _this.render.skin_shader_blenders_count + blender_index * 2 + 0] = blend_bone_index_array.indexOf(blender.bone_index);
                vertex_blenders[vertex_index * 2 * _this.render.skin_shader_blenders_count + blender_index * 2 + 1] = blender.weight;
            });
            vertex_position[vertex_index * 2 + 0] = position.x;
            vertex_position[vertex_index * 2 + 1] = position.y;
            if (blend_bone_index_array.length > this_1.render.skin_shader_modelview_count) {
                console.log("blend bone index array length for", attachment_key, "is", blend_bone_index_array.length, "greater than", this_1.render.skin_shader_modelview_count);
            }
            out_parse_index_1 = parse_index;
        };
        var this_1 = this, out_parse_index_1;
        for (var vertex_index = 0, parse_index = 0; vertex_index < vertex_count; ++vertex_index) {
            _loop_1(vertex_index, parse_index);
            parse_index = out_parse_index_1;
        }
        this.vertex_position = glMakeVertex(gl, vertex_position, 2, gl.ARRAY_BUFFER, gl.STATIC_DRAW);
        this.vertex_texcoord = glMakeVertex(gl, vertex_texcoord, 2, gl.ARRAY_BUFFER, gl.STATIC_DRAW);
        this.vertex_blenders = glMakeVertex(gl, vertex_blenders, 2, gl.ARRAY_BUFFER, gl.STATIC_DRAW);
        this.vertex_triangle = glMakeVertex(gl, vertex_triangle, 1, gl.ELEMENT_ARRAY_BUFFER, gl.STATIC_DRAW);
        spine_data.iterateAnims(function (anim_key, anim) {
            var ffd_skin = anim.ffd_skins && anim.ffd_skins.get(skin_key);
            var ffd_slot = ffd_skin && ffd_skin.ffd_slots.get(slot_key);
            var ffd_attachment = ffd_slot && ffd_slot.ffd_attachments.get(attachment_key);
            if (ffd_attachment) {
                var render_ffd_attachment_2 = _this.ffd_attachment_map.set(anim_key, new RenderFfdAttachment());
                ffd_attachment.ffd_timeline.keyframes.forEach(function (ffd_keyframe, ffd_keyframe_index) {
                    var render_ffd_keyframe = render_ffd_attachment_2.ffd_keyframes[ffd_keyframe_index] = new RenderFfdKeyframe();
                    var vertex_position_morph = new Float32Array(2 * vertex_count);
                    var _loop_2 = function (vertex_index, parse_index, ffd_index) {
                        var blender_array = [];
                        parse_index = parseBlenders(attachment.vertices, parse_index, function (blender) { blender_array.push(blender); });
                        var position_morph = new Spine.Vector();
                        blender_array.forEach(function (blender) {
                            var bone_key = spine_data.bones.keys[blender.bone_index];
                            var bone = spine_data.bones.get(bone_key);
                            var blend_position = new Spine.Vector();
                            blend_position.x = ffd_keyframe.vertices[ffd_index - ffd_keyframe.offset] || 0;
                            ++ffd_index;
                            blend_position.y = ffd_keyframe.vertices[ffd_index - ffd_keyframe.offset] || 0;
                            ++ffd_index;
                            bone && Spine.Matrix.transform(bone.world_space.affine.matrix, blend_position, blend_position);
                            position_morph.selfAdd(blend_position.selfScale(blender.weight));
                        });
                        vertex_position_morph[vertex_index * 2 + 0] = position_morph.x;
                        vertex_position_morph[vertex_index * 2 + 1] = position_morph.y;
                        out_parse_index_2 = parse_index;
                        out_ffd_index_1 = ffd_index;
                    };
                    var out_parse_index_2, out_ffd_index_1;
                    for (var vertex_index = 0, parse_index = 0, ffd_index = 0; vertex_index < vertex_count; ++vertex_index) {
                        _loop_2(vertex_index, parse_index, ffd_index);
                        parse_index = out_parse_index_2;
                        ffd_index = out_ffd_index_1;
                    }
                    render_ffd_keyframe.vertex_position_morph = glMakeVertex(gl, vertex_position_morph, 2, gl.ARRAY_BUFFER, gl.STATIC_DRAW);
                });
            }
        });
        return this;
    };
    RenderWeightedMeshAttachment.prototype.dropData = function (spine_data, skin_key, slot_key, attachment_key, attachment) {
        var gl = this.render.gl;
        glDropVertex(gl, this.vertex_position);
        glDropVertex(gl, this.vertex_blenders);
        glDropVertex(gl, this.vertex_texcoord);
        glDropVertex(gl, this.vertex_triangle);
        this.ffd_attachment_map.forEach(function (render_ffd_attachment, anim_key) {
            render_ffd_attachment.ffd_keyframes.forEach(function (ffd_keyframe) {
                glDropVertex(gl, ffd_keyframe.vertex_position_morph);
            });
        });
        return this;
    };
    RenderWeightedMeshAttachment.prototype.drawPose = function (spine_pose, atlas_data, skin_key, slot_key, slot, attachment_key, attachment) {
        var gl = this.render.gl;
        var site = atlas_data && atlas_data.sites[attachment.path || attachment.name || attachment_key];
        var page = site && site.page;
        var image_key = (page && page.name) || attachment.path || attachment.name || attachment_key;
        var texture = this.render.textures.get(image_key);
        if (!texture) {
            return;
        }
        mat3x3ApplyAtlasPageTexcoord(this.render.texmatrix, page);
        mat3x3ApplyAtlasSiteTexcoord(this.render.texmatrix, site);
        // update skin shader modelview array
        var blend_bone_index_array = this.blend_bone_index_array;
        for (var index = 0; index < blend_bone_index_array.length; ++index) {
            if (index < this.render.skin_shader_modelview_count) {
                var bone_index = blend_bone_index_array[index];
                var bone_key = spine_pose.bones.keys[bone_index];
                var bone = spine_pose.bones.get(bone_key);
                var render_bone = this.render.bone_map.get(bone_key);
                var modelview = this.render.skin_shader_modelview_array.subarray(index * 16, (index + 1) * 16);
                mat4x4Copy(modelview, this.render.modelview);
                bone && mat4x4ApplySpace(modelview, bone.world_space);
                render_bone && mat4x4ApplySpace(modelview, render_bone.setup_space);
                mat4x4ApplyAtlasSitePosition(modelview, site);
            }
        }
        var anim = spine_pose.data.anims.get(spine_pose.anim_key);
        var ffd_skin = anim && anim.ffd_skins && anim.ffd_skins.get(spine_pose.skin_key);
        var ffd_slot = ffd_skin && ffd_skin.ffd_slots.get(slot_key);
        var ffd_attachment = ffd_slot && ffd_slot.ffd_attachments.get(attachment_key);
        var ffd_timeline = ffd_attachment && ffd_attachment.ffd_timeline;
        var ffd_keyframes = ffd_timeline && ffd_timeline.keyframes;
        var ffd_keyframe0_index = Spine.Keyframe.find(ffd_keyframes, spine_pose.time);
        var ffd_keyframe1_index = ffd_keyframe0_index + 1 || ffd_keyframe0_index;
        var ffd_keyframe0 = (ffd_keyframes && ffd_keyframes[ffd_keyframe0_index]);
        var ffd_keyframe1 = (ffd_keyframes && ffd_keyframes[ffd_keyframe1_index]) || ffd_keyframe0;
        var ffd_weight = Spine.FfdKeyframe.interpolate(ffd_keyframe0, ffd_keyframe1, spine_pose.time);
        var render_ffd_attachment = this.ffd_attachment_map.get(spine_pose.anim_key);
        var render_ffd_keyframe0 = (render_ffd_attachment && render_ffd_attachment.ffd_keyframes[ffd_keyframe0_index]);
        var render_ffd_keyframe1 = (render_ffd_attachment && render_ffd_attachment.ffd_keyframes[ffd_keyframe1_index]) || render_ffd_keyframe0;
        var shader = ffd_keyframe0 ? this.render.ffd_skin_shader : this.render.skin_shader;
        gl.useProgram(shader.program);
        gl.uniformMatrix4fv(shader.uniforms.get("uProjection") || 0, false, this.render.projection);
        gl.uniformMatrix4fv(shader.uniforms.get("uModelviewArray[0]") || 0, false, this.render.skin_shader_modelview_array);
        gl.uniformMatrix3fv(shader.uniforms.get("uTexMatrix") || 0, false, this.render.texmatrix);
        gl.uniform4fv(shader.uniforms.get("uColor") || 0, this.render.color);
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, texture.texture);
        gl.uniform1i(shader.uniforms.get("uSampler") || 0, 0);
        glSetupAttribute(gl, shader, "aPosition", this.vertex_position);
        glSetupAttribute(gl, shader, "aTexCoord", this.vertex_texcoord);
        glSetupAttribute(gl, shader, "aBlenders{index}", this.vertex_blenders, this.render.skin_shader_blenders_count);
        ffd_keyframe0 && gl.uniform1f(shader.uniforms.get("uMorphWeight") || 0, ffd_weight);
        render_ffd_keyframe0 && glSetupAttribute(gl, shader, "aPositionMorph0", render_ffd_keyframe0.vertex_position_morph);
        render_ffd_keyframe1 && glSetupAttribute(gl, shader, "aPositionMorph1", render_ffd_keyframe1.vertex_position_morph);
        var vertex_triangle = this.vertex_triangle;
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, vertex_triangle.buffer);
        gl.drawElements(gl.TRIANGLES, vertex_triangle.count, vertex_triangle.type, 0);
        glResetAttributes(gl, shader);
    };
    return RenderWeightedMeshAttachment;
}());
var Blender = (function () {
    function Blender() {
        this.position = new Spine.Vector();
        this.bone_index = -1;
        this.weight = 0;
    }
    return Blender;
}());
var RenderFfdAttachment = (function () {
    function RenderFfdAttachment() {
        this.ffd_keyframes = [];
    }
    return RenderFfdAttachment;
}());
var RenderFfdKeyframe = (function () {
    function RenderFfdKeyframe() {
    }
    return RenderFfdKeyframe;
}());
function repeat(format, count) {
    var array = [];
    for (var index = 0; index < count; ++index) {
        array.push(format.replace(/{index}/g, index.toString()));
    }
    return array;
}
function flatten(array, out) {
    if (out === void 0) { out = []; }
    array.forEach(function (value) {
        if (Array.isArray(value)) {
            flatten(value, out);
        }
        else {
            out.push(value);
        }
    });
    return out;
}
var RenderShader = (function () {
    function RenderShader() {
    }
    return RenderShader;
}());
var RenderVertex = (function () {
    function RenderVertex() {
    }
    return RenderVertex;
}());
var RenderTexture = (function () {
    function RenderTexture() {
    }
    return RenderTexture;
}());
function vec4Identity(v) {
    v[0] = v[1] = v[2] = v[3] = 1.0;
    return v;
}
exports.vec4Identity = vec4Identity;
function vec4CopyColor(v, color) {
    v[0] = color.r;
    v[1] = color.g;
    v[2] = color.b;
    v[3] = color.a;
    return v;
}
exports.vec4CopyColor = vec4CopyColor;
function vec4ApplyColor(v, color) {
    v[0] *= color.r;
    v[1] *= color.g;
    v[2] *= color.b;
    v[3] *= color.a;
    return v;
}
exports.vec4ApplyColor = vec4ApplyColor;
function mat3x3Identity(m) {
    m[1] = m[2] = m[3] =
        m[5] = m[6] = m[7] = 0.0;
    m[0] = m[4] = m[8] = 1.0;
    return m;
}
exports.mat3x3Identity = mat3x3Identity;
function mat3x3Copy(m, other) {
    m.set(other);
    return m;
}
exports.mat3x3Copy = mat3x3Copy;
function mat3x3Ortho(m, l, r, b, t) {
    var lr = 1 / (l - r);
    var bt = 1 / (b - t);
    m[0] *= -2 * lr;
    m[4] *= -2 * bt;
    m[6] += (l + r) * lr;
    m[7] += (t + b) * bt;
    return m;
}
exports.mat3x3Ortho = mat3x3Ortho;
function mat3x3Translate(m, x, y) {
    m[6] += m[0] * x + m[3] * y;
    m[7] += m[1] * x + m[4] * y;
    return m;
}
exports.mat3x3Translate = mat3x3Translate;
function mat3x3RotateCosSin(m, c, s) {
    var m0 = m[0];
    var m1 = m[1];
    var m3 = m[3];
    var m4 = m[4];
    m[0] = m0 * c + m3 * s;
    m[1] = m1 * c + m4 * s;
    m[3] = m3 * c - m0 * s;
    m[4] = m4 * c - m1 * s;
    return m;
}
exports.mat3x3RotateCosSin = mat3x3RotateCosSin;
function mat3x3Rotate(m, angle) {
    return mat3x3RotateCosSin(m, Math.cos(angle), Math.sin(angle));
}
exports.mat3x3Rotate = mat3x3Rotate;
function mat3x3Scale(m, x, y) {
    m[0] *= x;
    m[1] *= x;
    m[2] *= x;
    m[3] *= y;
    m[4] *= y;
    m[5] *= y;
    return m;
}
exports.mat3x3Scale = mat3x3Scale;
function mat3x3Transform(m, v, out) {
    var x = m[0] * v[0] + m[3] * v[1] + m[6];
    var y = m[1] * v[0] + m[4] * v[1] + m[7];
    var w = m[2] * v[0] + m[5] * v[1] + m[8];
    var iw = (w) ? (1 / w) : (1);
    out[0] = x * iw;
    out[1] = y * iw;
    return out;
}
exports.mat3x3Transform = mat3x3Transform;
function mat3x3ApplySpace(m, space) {
    if (space) {
        mat3x3Translate(m, space.position.x, space.position.y);
        mat3x3Rotate(m, space.rotation.rad);
        mat3x3Scale(m, space.scale.x, space.scale.y);
    }
    return m;
}
exports.mat3x3ApplySpace = mat3x3ApplySpace;
function mat3x3ApplyAtlasPageTexcoord(m, page) {
    if (page) {
        mat3x3Scale(m, 1 / page.w, 1 / page.h);
    }
    return m;
}
exports.mat3x3ApplyAtlasPageTexcoord = mat3x3ApplyAtlasPageTexcoord;
function mat3x3ApplyAtlasSiteTexcoord(m, site) {
    if (site) {
        mat3x3Translate(m, site.x, site.y);
        if (site.rotate === -1) {
            mat3x3Translate(m, 0, site.w); // bottom-left corner
            mat3x3RotateCosSin(m, 0, -1); // -90 degrees
        }
        else if (site.rotate === 1) {
            mat3x3Translate(m, site.h, 0); // top-right corner
            mat3x3RotateCosSin(m, 0, 1); // 90 degrees
        }
        mat3x3Scale(m, site.w, site.h);
    }
    return m;
}
exports.mat3x3ApplyAtlasSiteTexcoord = mat3x3ApplyAtlasSiteTexcoord;
function mat3x3ApplyAtlasSitePosition(m, site) {
    if (site) {
        mat3x3Scale(m, 1 / site.original_w, 1 / site.original_h);
        mat3x3Translate(m, 2 * site.offset_x - (site.original_w - site.w), (site.original_h - site.h) - 2 * site.offset_y);
        mat3x3Scale(m, site.w, site.h);
    }
    return m;
}
exports.mat3x3ApplyAtlasSitePosition = mat3x3ApplyAtlasSitePosition;
function mat4x4Identity(m) {
    m[1] = m[2] = m[3] = m[4] =
        m[6] = m[7] = m[8] = m[9] =
            m[11] = m[12] = m[13] = m[14] = 0.0;
    m[0] = m[5] = m[10] = m[15] = 1.0;
    return m;
}
exports.mat4x4Identity = mat4x4Identity;
function mat4x4Copy(m, other) {
    m.set(other);
    return m;
}
exports.mat4x4Copy = mat4x4Copy;
function mat4x4Ortho(m, l, r, b, t, n, f) {
    var lr = 1 / (l - r);
    var bt = 1 / (b - t);
    var nf = 1 / (n - f);
    m[0] = -2 * lr;
    m[5] = -2 * bt;
    m[10] = 2 * nf;
    m[12] = (l + r) * lr;
    m[13] = (t + b) * bt;
    m[14] = (f + n) * nf;
    return m;
}
exports.mat4x4Ortho = mat4x4Ortho;
function mat4x4Translate(m, x, y, z) {
    if (z === void 0) { z = 0; }
    m[12] += m[0] * x + m[4] * y + m[8] * z;
    m[13] += m[1] * x + m[5] * y + m[9] * z;
    m[14] += m[2] * x + m[6] * y + m[10] * z;
    m[15] += m[3] * x + m[7] * y + m[11] * z;
    return m;
}
exports.mat4x4Translate = mat4x4Translate;
function mat4x4RotateCosSinZ(m, c, s) {
    var a_x = m[0];
    var a_y = m[1];
    var a_z = m[2];
    var a_w = m[3];
    var b_x = m[4];
    var b_y = m[5];
    var b_z = m[6];
    var b_w = m[7];
    m[0] = a_x * c + b_x * s;
    m[1] = a_y * c + b_y * s;
    m[2] = a_z * c + b_z * s;
    m[3] = a_w * c + b_w * s;
    m[4] = b_x * c - a_x * s;
    m[5] = b_y * c - a_y * s;
    m[6] = b_z * c - a_z * s;
    m[7] = b_w * c - a_w * s;
    return m;
}
exports.mat4x4RotateCosSinZ = mat4x4RotateCosSinZ;
function mat4x4RotateZ(m, angle) {
    return mat4x4RotateCosSinZ(m, Math.cos(angle), Math.sin(angle));
}
exports.mat4x4RotateZ = mat4x4RotateZ;
function mat4x4Scale(m, x, y, z) {
    if (z === void 0) { z = 1; }
    m[0] *= x;
    m[1] *= x;
    m[2] *= x;
    m[3] *= x;
    m[4] *= y;
    m[5] *= y;
    m[6] *= y;
    m[7] *= y;
    m[8] *= z;
    m[9] *= z;
    m[10] *= z;
    m[11] *= z;
    return m;
}
exports.mat4x4Scale = mat4x4Scale;
function mat4x4ApplySpace(m, space) {
    if (space) {
        mat4x4Translate(m, space.position.x, space.position.y);
        mat4x4RotateZ(m, space.rotation.rad);
        mat4x4Scale(m, space.scale.x, space.scale.y);
    }
    return m;
}
exports.mat4x4ApplySpace = mat4x4ApplySpace;
function mat4x4ApplyAtlasPageTexcoord(m, page) {
    if (page) {
        mat4x4Scale(m, 1 / page.w, 1 / page.h);
    }
    return m;
}
exports.mat4x4ApplyAtlasPageTexcoord = mat4x4ApplyAtlasPageTexcoord;
function mat4x4ApplyAtlasSiteTexcoord(m, site) {
    if (site) {
        mat4x4Translate(m, site.x, site.y);
        if (site.rotate === -1) {
            mat4x4Translate(m, 0, site.w); // bottom-left corner
            mat4x4RotateCosSinZ(m, 0, -1); // -90 degrees
        }
        else if (site.rotate === 1) {
            mat4x4Translate(m, site.h, 0); // top-right corner
            mat4x4RotateCosSinZ(m, 0, 1); // 90 degrees
        }
        mat4x4Scale(m, site.w, site.h);
    }
    return m;
}
exports.mat4x4ApplyAtlasSiteTexcoord = mat4x4ApplyAtlasSiteTexcoord;
function mat4x4ApplyAtlasSitePosition(m, site) {
    if (site) {
        mat4x4Scale(m, 1 / site.original_w, 1 / site.original_h);
        mat4x4Translate(m, 2 * site.offset_x - (site.original_w - site.w), (site.original_h - site.h) - 2 * site.offset_y);
        mat4x4Scale(m, site.w, site.h);
    }
    return m;
}
exports.mat4x4ApplyAtlasSitePosition = mat4x4ApplyAtlasSitePosition;
function glCompileShader(gl, src, type) {
    var shader = gl.createShader(type);
    gl.shaderSource(shader, src.join("\n"));
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        src.forEach(function (line, index) { console.log(index + 1, line); });
        console.log(gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        shader = null;
    }
    return shader;
}
exports.glCompileShader = glCompileShader;
function glLinkProgram(gl, vs, fs) {
    var program = gl.createProgram();
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.log("could not link shader program");
        gl.detachShader(program, vs);
        gl.detachShader(program, fs);
        gl.deleteProgram(program);
        program = null;
    }
    return program;
}
exports.glLinkProgram = glLinkProgram;
function glGetUniforms(gl, program, uniforms) {
    if (uniforms === void 0) { uniforms = new Map(); }
    var count = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS);
    for (var index = 0; index < count; ++index) {
        var uniform = gl.getActiveUniform(program, index);
        if (!uniform)
            continue;
        var uniform_location = gl.getUniformLocation(program, uniform.name);
        if (!uniform_location)
            continue;
        uniforms.set(uniform.name, uniform_location);
    }
    return uniforms;
}
exports.glGetUniforms = glGetUniforms;
function glGetAttribs(gl, program, attribs) {
    if (attribs === void 0) { attribs = new Map(); }
    var count = gl.getProgramParameter(program, gl.ACTIVE_ATTRIBUTES);
    for (var index = 0; index < count; ++index) {
        var attrib = gl.getActiveAttrib(program, index);
        if (!attrib)
            continue;
        attribs.set(attrib.name, gl.getAttribLocation(program, attrib.name));
    }
    return attribs;
}
exports.glGetAttribs = glGetAttribs;
function glMakeShader(gl, vs_src, fs_src) {
    var shader = new RenderShader();
    var header = [
        "precision mediump int;",
        "precision mediump float;"
    ];
    shader.vs_src = header.concat(flatten(vs_src));
    shader.fs_src = header.concat(flatten(fs_src));
    shader.vs = glCompileShader(gl, shader.vs_src, gl.VERTEX_SHADER);
    shader.fs = glCompileShader(gl, shader.fs_src, gl.FRAGMENT_SHADER);
    shader.program = glLinkProgram(gl, shader.vs, shader.fs);
    shader.uniforms = glGetUniforms(gl, shader.program);
    shader.attribs = glGetAttribs(gl, shader.program);
    return shader;
}
exports.glMakeShader = glMakeShader;
function glDropShader(gl, shader) {
    if (shader.program === gl.getParameter(gl.CURRENT_PROGRAM)) {
        glResetAttributes(gl, shader);
        gl.useProgram(null);
    }
    gl.deleteProgram(shader.program);
    shader.program = null;
}
exports.glDropShader = glDropShader;
function glMakeVertex(gl, type_array, size, buffer_type, buffer_draw) {
    var vertex = new RenderVertex();
    if (type_array instanceof Float32Array) {
        vertex.type = gl.FLOAT;
    }
    else if (type_array instanceof Int8Array) {
        vertex.type = gl.BYTE;
    }
    else if (type_array instanceof Uint8Array) {
        vertex.type = gl.UNSIGNED_BYTE;
    }
    else if (type_array instanceof Int16Array) {
        vertex.type = gl.SHORT;
    }
    else if (type_array instanceof Uint16Array) {
        vertex.type = gl.UNSIGNED_SHORT;
    }
    else if (type_array instanceof Int32Array) {
        vertex.type = gl.INT;
    }
    else if (type_array instanceof Uint32Array) {
        vertex.type = gl.UNSIGNED_INT;
    }
    else {
        vertex.type = gl.NONE;
        throw new Error();
    }
    vertex.size = size;
    vertex.count = type_array.length / vertex.size;
    vertex.type_array = type_array;
    vertex.buffer = gl.createBuffer();
    vertex.buffer_type = buffer_type;
    vertex.buffer_draw = buffer_draw;
    gl.bindBuffer(vertex.buffer_type, vertex.buffer);
    gl.bufferData(vertex.buffer_type, vertex.type_array, vertex.buffer_draw);
    return vertex;
}
exports.glMakeVertex = glMakeVertex;
function glDropVertex(gl, vertex) {
    if (vertex.buffer === gl.getParameter(gl.ARRAY_BUFFER_BINDING)) {
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
    }
    gl.deleteBuffer(vertex.buffer);
    vertex.buffer = null;
}
exports.glDropVertex = glDropVertex;
function glMakeTexture(gl, image, min_filter, mag_filter, wrap_s, wrap_t) {
    var texture = new RenderTexture();
    texture.texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture.texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, min_filter);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, mag_filter);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, wrap_s);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, wrap_t);
    return texture;
}
exports.glMakeTexture = glMakeTexture;
function glDropTexture(gl, texture) {
    if (texture.texture === gl.getParameter(gl.TEXTURE_BINDING_2D)) {
        gl.bindTexture(gl.TEXTURE_2D, null);
    }
    gl.deleteTexture(texture.texture);
    texture.texture = null;
}
exports.glDropTexture = glDropTexture;
function glSetupAttribute(gl, shader, format, vertex, count) {
    if (count === void 0) { count = 0; }
    gl.bindBuffer(vertex.buffer_type, vertex.buffer);
    if (count > 0) {
        var sizeof_vertex = vertex.type_array.BYTES_PER_ELEMENT * vertex.size; // in bytes
        var stride = sizeof_vertex * count;
        for (var index = 0; index < count; ++index) {
            var offset = sizeof_vertex * index;
            var attrib = shader.attribs.get(format.replace(/{index}/g, index.toString())) || 0;
            gl.vertexAttribPointer(attrib, vertex.size, vertex.type, false, stride, offset);
            gl.enableVertexAttribArray(attrib);
        }
    }
    else {
        var attrib = shader.attribs.get(format) || 0;
        gl.vertexAttribPointer(attrib, vertex.size, vertex.type, false, 0, 0);
        gl.enableVertexAttribArray(attrib);
    }
}
exports.glSetupAttribute = glSetupAttribute;
function glResetAttribute(gl, shader, format, vertex, count) {
    if (count === void 0) { count = 0; }
    if (count > 0) {
        for (var index = 0; index < count; ++index) {
            var attrib = shader.attribs.get(format.replace(/{index}/g, index.toString())) || 0;
            gl.disableVertexAttribArray(attrib);
        }
    }
    else {
        var attrib = shader.attribs.get(format) || 0;
        gl.disableVertexAttribArray(attrib);
    }
}
exports.glResetAttribute = glResetAttribute;
function glResetAttributes(gl, shader) {
    shader.attribs.forEach(function (value, key) {
        if (value !== -1) {
            gl.disableVertexAttribArray(value);
        }
    });
}
exports.glResetAttributes = glResetAttributes;


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {module.exports = global["Atlas"] = __webpack_require__(7);
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(0)))

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {module.exports = global["RenderCtx2D"] = __webpack_require__(8);
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(0)))

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {module.exports = global["RenderWebGL"] = __webpack_require__(2);
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(0)))

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {module.exports = global["Spine"] = __webpack_require__(1);
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(0)))

/***/ }),
/* 7 */
/***/ (function(module, exports) {

function trim(s) {
    return s.replace(/^\s+|\s+$/g, "");
}
var Page = (function () {
    function Page() {
        this.name = "";
        this.w = 0;
        this.h = 0;
        this.format = "RGBA8888";
        this.min_filter = "linear";
        this.mag_filter = "linear";
        this.wrap_s = "clamp-to-edge";
        this.wrap_t = "clamp-to-edge";
    }
    return Page;
}());
exports.Page = Page;
var Site = (function () {
    function Site() {
        this.x = 0;
        this.y = 0;
        this.w = 0;
        this.h = 0;
        this.rotate = 0;
        this.offset_x = 0;
        this.offset_y = 0;
        this.original_w = 0;
        this.original_h = 0;
        this.index = -1;
    }
    return Site;
}());
exports.Site = Site;
var Data = (function () {
    function Data() {
        this.pages = [];
        this.sites = {};
    }
    Data.prototype.drop = function () {
        this.pages = [];
        this.sites = {};
        return this;
    };
    Data.prototype.import = function (text) {
        return this.importAtlasText(text);
    };
    Data.prototype.export = function (text) {
        if (text === void 0) { text = ""; }
        return this.exportAtlasText(text);
    };
    Data.prototype.importAtlasText = function (text) {
        var lines = text.split(/\n|\r\n/);
        return this.importAtlasTextLines(lines);
    };
    Data.prototype.exportAtlasText = function (text) {
        if (text === void 0) { text = ""; }
        var lines = this.exportAtlasTextLines([]);
        return text + lines.join("\n");
    };
    Data.prototype.importAtlasTextLines = function (lines) {
        var _this = this;
        this.pages = [];
        this.sites = {};
        var page = null;
        var site = null;
        var match = null;
        lines.forEach(function (line) {
            if (trim(line).length === 0) {
                page = null;
                site = null;
            }
            else if ((match = line.match(/^size: (.*),(.*)$/))) {
                if (!page)
                    throw new Error();
                page.w = parseInt(match[1], 10);
                page.h = parseInt(match[2], 10);
            }
            else if ((match = line.match(/^format: (.*)$/))) {
                if (!page)
                    throw new Error();
                page.format = match[1];
            }
            else if ((match = line.match(/^filter: (.*),(.*)$/))) {
                if (!page)
                    throw new Error();
                page.min_filter = match[1];
                page.mag_filter = match[2];
            }
            else if ((match = line.match(/^repeat: (.*)$/))) {
                if (!page)
                    throw new Error();
                var repeat = match[1];
                page.wrap_s = ((repeat === "x") || (repeat === "xy")) ? ("Repeat") : ("ClampToEdge");
                page.wrap_t = ((repeat === "y") || (repeat === "xy")) ? ("Repeat") : ("ClampToEdge");
            }
            else if ((match = line.match(/^orig: (.*)[,| x] (.*)$/))) {
                var original_w = parseInt(match[1], 10);
                var original_h = parseInt(match[2], 10);
                console.log("page:orig", original_w, original_h);
            }
            else if (page === null) {
                page = new Page();
                page.name = line;
                _this.pages.push(page);
            }
            else {
                if ((match = line.match(/^ {2}rotate: (.*)$/))) {
                    if (!site)
                        throw new Error();
                    site.rotate = (match[1] === "true") ? -1 : 0; // -90 degrees
                }
                else if ((match = line.match(/^ {2}xy: (.*), (.*)$/))) {
                    if (!site)
                        throw new Error();
                    site.x = parseInt(match[1], 10);
                    site.y = parseInt(match[2], 10);
                }
                else if ((match = line.match(/^ {2}size: (.*), (.*)$/))) {
                    if (!site)
                        throw new Error();
                    site.w = parseInt(match[1], 10);
                    site.h = parseInt(match[2], 10);
                }
                else if ((match = line.match(/^ {2}orig: (.*), (.*)$/))) {
                    if (!site)
                        throw new Error();
                    site.original_w = parseInt(match[1], 10);
                    site.original_h = parseInt(match[2], 10);
                }
                else if ((match = line.match(/^ {2}offset: (.*), (.*)$/))) {
                    if (!site)
                        throw new Error();
                    site.offset_x = parseInt(match[1], 10);
                    site.offset_y = parseInt(match[2], 10);
                }
                else if ((match = line.match(/^ {2}index: (.*)$/))) {
                    if (!site)
                        throw new Error();
                    site.index = parseInt(match[1], 10);
                }
                else {
                    if (site) {
                        site.original_w = site.original_w || site.w;
                        site.original_h = site.original_h || site.h;
                    }
                    site = new Site();
                    site.page = page;
                    _this.sites[line] = site;
                }
            }
        });
        return this;
    };
    Data.prototype.exportAtlasTextLines = function (lines) {
        var _this = this;
        if (lines === void 0) { lines = []; }
        this.pages.forEach(function (page) {
            lines.push(""); // empty line denotes new page
            lines.push(page.name);
            lines.push("size: " + page.w + "," + page.h);
            lines.push("format: " + page.format);
            lines.push("filter: " + page.min_filter + "," + page.mag_filter);
            var repeat = "none";
            if ((page.wrap_s === "Repeat") && (page.wrap_t === "Repeat")) {
                repeat = "xy";
            }
            else if (page.wrap_s === "Repeat") {
                repeat = "x";
            }
            else if (page.wrap_t === "Repeat") {
                repeat = "y";
            }
            lines.push("repeat: " + repeat);
            Object.keys(_this.sites).forEach(function (site_key) {
                var site = _this.sites[site_key];
                if (site.page !== page) {
                    return;
                }
                lines.push(site_key);
                lines.push("  rotate: " + (site.rotate === 0 ? "false" : "true"));
                lines.push("  xy: " + site.x + ", " + site.y);
                lines.push("  size: " + site.w + ", " + site.h);
                lines.push("  orig: " + site.original_w + ", " + site.original_h);
                lines.push("  offset: " + site.offset_x + ", " + site.offset_y);
                lines.push("  index: " + site.index);
            });
        });
        return lines;
    };
    Data.prototype.importTpsText = function (tps_text) {
        this.pages = [];
        this.sites = {};
        return this.importTpsTextPage(tps_text, 0);
    };
    Data.prototype.importTpsTextPage = function (tps_text, page_index) {
        var _this = this;
        if (page_index === void 0) { page_index = 0; }
        var tps_json = JSON.parse(tps_text);
        var page = this.pages[page_index] = new Page();
        if (tps_json.meta) {
            // TexturePacker only supports one page
            page.w = tps_json.meta.size.w;
            page.h = tps_json.meta.size.h;
            page.name = tps_json.meta.image;
        }
        Object.keys(tps_json.frames || {}).forEach(function (key) {
            var frame = tps_json.frames[key];
            var site = _this.sites[key] = new Site();
            site.page = page;
            site.x = frame.frame.x;
            site.y = frame.frame.y;
            site.w = frame.frame.w;
            site.h = frame.frame.h;
            site.rotate = frame.rotated ? 1 : 0; // 90 degrees
            site.offset_x = (frame.spriteSourceSize && frame.spriteSourceSize.x) || 0;
            site.offset_y = (frame.spriteSourceSize && frame.spriteSourceSize.y) || 0;
            site.original_w = (frame.sourceSize && frame.sourceSize.w) || site.w;
            site.original_h = (frame.sourceSize && frame.sourceSize.h) || site.h;
        });
        return this;
    };
    return Data;
}());
exports.Data = Data;


/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

var Spine = __webpack_require__(1);
var render_webgl_1 = __webpack_require__(2);
var RenderCtx2D = (function () {
    function RenderCtx2D(ctx) {
        this.images = new Spine.Map();
        this.skin_map = new Spine.Map();
        this.region_vertex_position = new Float32Array([-1, -1, 1, -1, 1, 1, -1, 1]); // [ x, y ]
        this.region_vertex_texcoord = new Float32Array([0, 1, 1, 1, 1, 0, 0, 0]); // [ u, v ]
        this.region_vertex_triangle = new Uint16Array([0, 1, 2, 0, 2, 3]); // [ i0, i1, i2 ]
        this.ctx = ctx;
    }
    RenderCtx2D.prototype.loadData = function (spine_data, atlas_data, images) {
        var _this = this;
        if (atlas_data === void 0) { atlas_data = null; }
        this.images = images;
        spine_data.iterateSkins(function (skin_key, skin) {
            var render_skin = _this.skin_map.get(skin_key) || _this.skin_map.set(skin_key, new RenderSkin());
            skin.iterateAttachments(function (slot_key, skin_slot, attachment_key, attachment) {
                if (!attachment) {
                    return;
                }
                var render_slot = render_skin.slot_map.get(slot_key) || render_skin.slot_map.set(slot_key, new RenderSlot());
                switch (attachment.type) {
                    case "region":
                        render_slot.attachment_map.set(attachment_key, new RenderRegionAttachment(_this).loadData(spine_data, attachment));
                        break;
                    case "boundingbox":
                        render_slot.attachment_map.set(attachment_key, new RenderBoundingBoxAttachment(_this).loadData(spine_data, attachment));
                        break;
                    case "mesh":
                        render_slot.attachment_map.set(attachment_key, new RenderMeshAttachment(_this).loadData(spine_data, attachment));
                        break;
                    case "weightedmesh":
                        render_slot.attachment_map.set(attachment_key, new RenderWeightedMeshAttachment(_this).loadData(spine_data, attachment));
                        break;
                    case "path":
                        render_slot.attachment_map.set(attachment_key, new RenderPathAttachment(_this).loadData(spine_data, attachment));
                        break;
                }
            });
        });
    };
    RenderCtx2D.prototype.dropData = function (spine_data, atlas_data) {
        var _this = this;
        if (atlas_data === void 0) { atlas_data = null; }
        this.images.clear();
        spine_data.iterateSkins(function (skin_key, skin) {
            var render_skin = _this.skin_map.get(skin_key);
            skin.iterateAttachments(function (slot_key, skin_slot, attachment_key, attachment) {
                if (!attachment) {
                    return;
                }
                var render_slot = render_skin && render_skin.slot_map.get(slot_key);
                var render_attachment = render_slot && render_slot.attachment_map.get(attachment_key);
                if (render_attachment) {
                    render_attachment.dropData(spine_data, attachment);
                }
            });
        });
        this.skin_map.clear();
    };
    RenderCtx2D.prototype.updatePose = function (spine_pose, atlas_data) {
        var _this = this;
        spine_pose.iterateAttachments(function (slot_key, slot, skin_slot, attachment_key, attachment) {
            if (!attachment) {
                return;
            }
            var render_skin = _this.skin_map.get(spine_pose.skin_key);
            var render_skin_default = _this.skin_map.get("default");
            var render_slot = (render_skin && render_skin.slot_map.get(slot_key)) || (render_skin_default && render_skin_default.slot_map.get(slot_key));
            var render_attachment = render_slot && render_slot.attachment_map.get(attachment_key);
            if (render_attachment) {
                render_attachment.updatePose(spine_pose, atlas_data, slot_key, attachment_key, attachment);
            }
        });
    };
    RenderCtx2D.prototype.drawPose = function (spine_pose, atlas_data) {
        var _this = this;
        var ctx = this.ctx;
        this.updatePose(spine_pose, atlas_data);
        spine_pose.iterateAttachments(function (slot_key, slot, skin_slot, attachment_key, attachment) {
            if (!attachment) {
                return;
            }
            var render_skin = _this.skin_map.get(spine_pose.skin_key);
            var render_skin_default = _this.skin_map.get("default");
            var render_slot = (render_skin && render_skin.slot_map.get(slot_key)) || (render_skin_default && render_skin_default.slot_map.get(slot_key));
            var render_attachment = render_slot && render_slot.attachment_map.get(attachment_key);
            if (render_attachment) {
                ctx.save();
                // slot.color.rgb
                ctx.globalAlpha *= slot.color.a;
                switch (slot.blend) {
                    default:
                    case "normal":
                        ctx.globalCompositeOperation = "source-over";
                        break;
                    case "additive":
                        ctx.globalCompositeOperation = "lighter";
                        break;
                    case "multiply":
                        ctx.globalCompositeOperation = "multiply";
                        break;
                    case "screen":
                        ctx.globalCompositeOperation = "screen";
                        break;
                }
                render_attachment.drawPose(spine_pose, atlas_data, slot, attachment_key, attachment);
                ctx.restore();
            }
        });
    };
    RenderCtx2D.prototype.drawDebugPose = function (spine_pose, atlas_data) {
        var _this = this;
        var ctx = this.ctx;
        this.updatePose(spine_pose, atlas_data);
        spine_pose.iterateAttachments(function (slot_key, slot, skin_slot, attachment_key, attachment) {
            if (!attachment) {
                return;
            }
            var render_skin = _this.skin_map.get(spine_pose.skin_key);
            var render_skin_default = _this.skin_map.get("default");
            var render_slot = (render_skin && render_skin.slot_map.get(slot_key)) || (render_skin_default && render_skin_default.slot_map.get(slot_key));
            var render_attachment = render_slot && render_slot.attachment_map.get(attachment_key);
            if (render_attachment) {
                render_attachment.drawDebugPose(spine_pose, atlas_data, slot, attachment_key, attachment);
            }
        });
        spine_pose.iterateBones(function (bone_key, bone) {
            ctx.save();
            ctxApplySpace(ctx, bone.world_space);
            ctxDrawPoint(ctx);
            ctx.restore();
        });
        ctxDrawIkConstraints(ctx, spine_pose.data, spine_pose.bones);
    };
    RenderCtx2D.prototype.drawDebugData = function (spine_pose, atlas_data) {
        var _this = this;
        var ctx = this.ctx;
        spine_pose.data.iterateAttachments(spine_pose.skin_key, function (slot_key, slot, skin_slot, attachment_key, attachment) {
            if (!attachment) {
                return;
            }
            var render_skin = _this.skin_map.get(spine_pose.skin_key);
            var render_skin_default = _this.skin_map.get("default");
            var render_slot = (render_skin && render_skin.slot_map.get(slot_key)) || (render_skin_default && render_skin_default.slot_map.get(slot_key));
            var render_attachment = render_slot && render_slot.attachment_map.get(attachment_key);
            if (render_attachment) {
                render_attachment.drawDebugData(spine_pose, atlas_data, slot, attachment_key, attachment);
            }
        });
        spine_pose.data.iterateBones(function (bone_key, bone) {
            ctx.save();
            ctxApplySpace(ctx, bone.world_space);
            ctxDrawPoint(ctx);
            ctx.restore();
        });
        ctxDrawIkConstraints(ctx, spine_pose.data, spine_pose.data.bones);
    };
    return RenderCtx2D;
}());
exports.RenderCtx2D = RenderCtx2D;
var RenderSkin = (function () {
    function RenderSkin() {
        this.slot_map = new Spine.Map();
    }
    return RenderSkin;
}());
var RenderSlot = (function () {
    function RenderSlot() {
        this.attachment_map = new Spine.Map();
    }
    return RenderSlot;
}());
var RenderRegionAttachment = (function () {
    function RenderRegionAttachment(render) {
        this.render = render;
    }
    RenderRegionAttachment.prototype.loadData = function (spine_data, attachment) {
        return this;
    };
    RenderRegionAttachment.prototype.dropData = function (spine_data, attachment) {
        return this;
    };
    RenderRegionAttachment.prototype.updatePose = function (spine_pose, atlas_data, slot_key, attachment_key, attachment) {
    };
    RenderRegionAttachment.prototype.drawPose = function (spine_pose, atlas_data, slot, attachment_key, attachment) {
        var ctx = this.render.ctx;
        var bone = spine_pose.bones.get(slot.bone_key);
        var site = atlas_data && atlas_data.sites[attachment.path || attachment.name || attachment_key];
        var page = site && site.page;
        var image_key = (page && page.name) || attachment.path || attachment.name || attachment_key;
        var image = this.render.images.get(image_key);
        if (!image || !image.complete) {
            return;
        }
        ctx.save();
        bone && ctxApplySpace(ctx, bone.world_space);
        ctxApplySpace(ctx, attachment.local_space);
        ctxApplyAtlasSitePosition(ctx, site);
        ctx.scale(attachment.width / 2, attachment.height / 2);
        ctxDrawImageMesh(ctx, this.render.region_vertex_triangle, this.render.region_vertex_position, this.render.region_vertex_texcoord, image, site);
        ctx.restore();
    };
    RenderRegionAttachment.prototype.drawDebugPose = function (spine_pose, atlas_data, slot, attachment_key, attachment) {
        var ctx = this.render.ctx;
        var bone = spine_pose.bones.get(slot.bone_key);
        var site = atlas_data && atlas_data.sites[attachment.path || attachment.name || attachment_key];
        ctx.save();
        bone && ctxApplySpace(ctx, bone.world_space);
        ctxApplySpace(ctx, attachment.local_space);
        ctxApplyAtlasSitePosition(ctx, site);
        ctx.beginPath();
        ctx.rect(-attachment.width / 2, -attachment.height / 2, attachment.width, attachment.height);
        ctx.fillStyle = "rgba(127,127,127,0.25)";
        ctx.fill();
        ctx.strokeStyle = "rgba(127,127,127,1.0)";
        ctx.stroke();
        ctx.restore();
    };
    RenderRegionAttachment.prototype.drawDebugData = function (spine_pose, atlas_data, slot, attachment_key, attachment) {
        var ctx = this.render.ctx;
        var bone = spine_pose.data.bones.get(slot.bone_key);
        var site = atlas_data && atlas_data.sites[attachment.path || attachment.name || attachment_key];
        ctx.save();
        bone && ctxApplySpace(ctx, bone.world_space);
        ctxApplySpace(ctx, attachment.local_space);
        ctxApplyAtlasSitePosition(ctx, site);
        ctx.beginPath();
        ctx.rect(-attachment.width / 2, -attachment.height / 2, attachment.width, attachment.height);
        ctx.fillStyle = "rgba(127,127,127,0.25)";
        ctx.fill();
        ctx.strokeStyle = "rgba(127,127,127,1.0)";
        ctx.stroke();
        ctx.restore();
    };
    return RenderRegionAttachment;
}());
var RenderBoundingBoxAttachment = (function () {
    function RenderBoundingBoxAttachment(render) {
        this.render = render;
    }
    RenderBoundingBoxAttachment.prototype.loadData = function (spine_data, attachment) {
        return this;
    };
    RenderBoundingBoxAttachment.prototype.dropData = function (spine_data, attachment) {
        return this;
    };
    RenderBoundingBoxAttachment.prototype.updatePose = function (spine_pose, atlas_data, slot_key, attachment_key, attachment) {
    };
    RenderBoundingBoxAttachment.prototype.drawPose = function (spine_pose, atlas_data, slot, attachment_key, attachment) {
    };
    RenderBoundingBoxAttachment.prototype.drawDebugPose = function (spine_pose, atlas_data, slot, attachment_key, attachment) {
        var ctx = this.render.ctx;
        var bone = spine_pose.bones.get(slot.bone_key);
        ctx.save();
        bone && ctxApplySpace(ctx, bone.world_space);
        ctx.beginPath();
        var x = 0;
        attachment.vertices.forEach(function (value, index) {
            if (index & 1) {
                ctx.lineTo(x, value);
            }
            else {
                x = value;
            }
        });
        ctx.closePath();
        ctx.strokeStyle = attachment.color.toString();
        ctx.stroke();
        ctx.restore();
    };
    RenderBoundingBoxAttachment.prototype.drawDebugData = function (spine_pose, atlas_data, slot, attachment_key, attachment) {
        var ctx = this.render.ctx;
        var bone = spine_pose.data.bones.get(slot.bone_key);
        ctx.save();
        bone && ctxApplySpace(ctx, bone.world_space);
        ctx.beginPath();
        var x = 0;
        attachment.vertices.forEach(function (value, index) {
            if (index & 1) {
                ctx.lineTo(x, value);
            }
            else {
                x = value;
            }
        });
        ctx.closePath();
        ctx.strokeStyle = attachment.color.toString();
        ctx.stroke();
        ctx.restore();
    };
    return RenderBoundingBoxAttachment;
}());
var RenderMeshAttachment = (function () {
    function RenderMeshAttachment(render) {
        this.render = render;
    }
    RenderMeshAttachment.prototype.loadData = function (spine_data, attachment) {
        this.vertex_count = attachment.vertices.length / 2;
        this.vertex_position = new Float32Array(attachment.vertices);
        this.vertex_texcoord = new Float32Array(attachment.uvs);
        this.vertex_triangle = new Uint16Array(attachment.triangles);
        return this;
    };
    RenderMeshAttachment.prototype.dropData = function (spine_data, attachment) {
        return this;
    };
    RenderMeshAttachment.prototype.updatePose = function (spine_pose, atlas_data, slot_key, attachment_key, attachment) {
        var anim = spine_pose.data.anims.get(spine_pose.anim_key);
        var ffd_skin = anim && anim.ffd_skins && anim.ffd_skins.get(spine_pose.skin_key);
        var ffd_slot = ffd_skin && ffd_skin.ffd_slots.get(slot_key);
        var ffd_attachment = ffd_slot && ffd_slot.ffd_attachments.get(attachment_key);
        var ffd_timeline = ffd_attachment && ffd_attachment.ffd_timeline;
        var ffd_keyframes = ffd_timeline && ffd_timeline.keyframes;
        var ffd_keyframe0_index = Spine.Keyframe.find(ffd_keyframes, spine_pose.time);
        var ffd_keyframe1_index = ffd_keyframe0_index + 1 || ffd_keyframe0_index;
        var ffd_keyframe0 = (ffd_keyframes && ffd_keyframes[ffd_keyframe0_index]);
        var ffd_keyframe1 = (ffd_keyframes && ffd_keyframes[ffd_keyframe1_index]) || ffd_keyframe0;
        var ffd_weight = Spine.FfdKeyframe.interpolate(ffd_keyframe0, ffd_keyframe1, spine_pose.time);
        if (ffd_keyframe0 && ffd_keyframe1) {
            for (var index = 0; index < this.vertex_position.length; ++index) {
                var v0 = ffd_keyframe0.vertices[index - ffd_keyframe0.offset] || 0;
                var v1 = ffd_keyframe1.vertices[index - ffd_keyframe1.offset] || 0;
                this.vertex_position[index] = attachment.vertices[index] + Spine.tween(v0, v1, ffd_weight);
            }
        }
    };
    RenderMeshAttachment.prototype.drawPose = function (spine_pose, atlas_data, slot, attachment_key, attachment) {
        var ctx = this.render.ctx;
        var bone = spine_pose.bones.get(slot.bone_key);
        var site = atlas_data && atlas_data.sites[attachment.path || attachment.name || attachment_key];
        var page = site && site.page;
        var image_key = (page && page.name) || attachment.path || attachment.name || attachment_key;
        var image = this.render.images.get(image_key);
        if (!image || !image.complete) {
            return;
        }
        ctx.save();
        bone && ctxApplySpace(ctx, bone.world_space);
        ctxApplyAtlasSitePosition(ctx, site);
        ctxDrawImageMesh(ctx, this.vertex_triangle, this.vertex_position, this.vertex_texcoord, image, site);
        ctx.restore();
    };
    RenderMeshAttachment.prototype.drawDebugPose = function (spine_pose, atlas_data, slot, attachment_key, attachment) {
        var ctx = this.render.ctx;
        var bone = spine_pose.bones.get(slot.bone_key);
        var site = atlas_data && atlas_data.sites[attachment.path || attachment.name || attachment_key];
        ctx.save();
        bone && ctxApplySpace(ctx, bone.world_space);
        ctxApplyAtlasSitePosition(ctx, site);
        ctxDrawMesh(ctx, this.vertex_triangle, this.vertex_position, "rgba(127,127,127,1.0)", "rgba(127,127,127,0.25)");
        ctx.restore();
    };
    RenderMeshAttachment.prototype.drawDebugData = function (spine_pose, atlas_data, slot, attachment_key, attachment) {
        var ctx = this.render.ctx;
        var bone = spine_pose.data.bones.get(slot.bone_key);
        var site = atlas_data && atlas_data.sites[attachment.path || attachment.name || attachment_key];
        ctx.save();
        bone && ctxApplySpace(ctx, bone.world_space);
        ctxApplyAtlasSitePosition(ctx, site);
        ctxDrawMesh(ctx, this.vertex_triangle, this.vertex_position, "rgba(127,127,127,1.0)", "rgba(127,127,127,0.25)");
        ctx.restore();
    };
    return RenderMeshAttachment;
}());
var RenderWeightedMeshAttachment = (function () {
    function RenderWeightedMeshAttachment(render) {
        this.render = render;
    }
    RenderWeightedMeshAttachment.prototype.loadData = function (spine_data, attachment) {
        var vertex_count = this.vertex_count = attachment.uvs.length / 2;
        var vertex_setup_position = this.vertex_setup_position = new Float32Array(2 * vertex_count);
        var vertex_blend_position = this.vertex_blend_position = new Float32Array(2 * vertex_count);
        this.vertex_texcoord = new Float32Array(attachment.uvs);
        this.vertex_triangle = new Uint16Array(attachment.triangles);
        var position = new Spine.Vector();
        for (var vertex_index = 0, index = 0; vertex_index < vertex_count; ++vertex_index) {
            var blender_count = attachment.vertices[index++];
            var setup_position_x = 0;
            var setup_position_y = 0;
            for (var blender_index = 0; blender_index < blender_count; ++blender_index) {
                var bone_index = attachment.vertices[index++];
                position.x = attachment.vertices[index++];
                position.y = attachment.vertices[index++];
                var weight = attachment.vertices[index++];
                var bone_key = spine_data.bones.keys[bone_index];
                var bone = spine_data.bones.get(bone_key);
                bone && Spine.Space.transform(bone.world_space, position, position);
                setup_position_x += position.x * weight;
                setup_position_y += position.y * weight;
            }
            var vertex_setup_position_offset = vertex_index * 2;
            vertex_setup_position[vertex_setup_position_offset++] = setup_position_x;
            vertex_setup_position[vertex_setup_position_offset++] = setup_position_y;
        }
        vertex_blend_position.set(vertex_setup_position);
        return this;
    };
    RenderWeightedMeshAttachment.prototype.dropData = function (spine_data, attachment) {
        return this;
    };
    RenderWeightedMeshAttachment.prototype.updatePose = function (spine_pose, atlas_data, slot_key, attachment_key, attachment) {
        var anim = spine_pose.data.anims.get(spine_pose.anim_key);
        var ffd_skin = anim && anim.ffd_skins && anim.ffd_skins.get(spine_pose.skin_key);
        var ffd_slot = ffd_skin && ffd_skin.ffd_slots.get(slot_key);
        var ffd_attachment = ffd_slot && ffd_slot.ffd_attachments.get(attachment_key);
        var ffd_timeline = ffd_attachment && ffd_attachment.ffd_timeline;
        var ffd_keyframes = ffd_timeline && ffd_timeline.keyframes;
        var ffd_keyframe0_index = Spine.Keyframe.find(ffd_keyframes, spine_pose.time);
        var ffd_keyframe1_index = ffd_keyframe0_index + 1 || ffd_keyframe0_index;
        var ffd_keyframe0 = (ffd_keyframes && ffd_keyframes[ffd_keyframe0_index]);
        var ffd_keyframe1 = (ffd_keyframes && ffd_keyframes[ffd_keyframe1_index]) || ffd_keyframe0;
        var ffd_weight = Spine.FfdKeyframe.interpolate(ffd_keyframe0, ffd_keyframe1, spine_pose.time);
        if (ffd_keyframe0 && ffd_keyframe1) {
            var vertex_blend_position = this.vertex_blend_position;
            var position = new Spine.Vector();
            for (var vertex_index = 0, index = 0, ffd_index = 0; vertex_index < this.vertex_count; ++vertex_index) {
                var blender_count = attachment.vertices[index++];
                var blend_position_x = 0;
                var blend_position_y = 0;
                for (var blender_index = 0; blender_index < blender_count; ++blender_index) {
                    var bone_index = attachment.vertices[index++];
                    position.x = attachment.vertices[index++];
                    position.y = attachment.vertices[index++];
                    var weight = attachment.vertices[index++];
                    var bone_key = spine_pose.bones.keys[bone_index];
                    var bone = spine_pose.bones.get(bone_key);
                    var x0 = ffd_keyframe0.vertices[ffd_index - ffd_keyframe0.offset] || 0;
                    var x1 = ffd_keyframe1.vertices[ffd_index - ffd_keyframe1.offset] || 0;
                    position.x += Spine.tween(x0, x1, ffd_weight);
                    ++ffd_index;
                    var y0 = ffd_keyframe0.vertices[ffd_index - ffd_keyframe0.offset] || 0;
                    var y1 = ffd_keyframe1.vertices[ffd_index - ffd_keyframe1.offset] || 0;
                    position.y += Spine.tween(y0, y1, ffd_weight);
                    ++ffd_index;
                    bone && Spine.Space.transform(bone.world_space, position, position);
                    blend_position_x += position.x * weight;
                    blend_position_y += position.y * weight;
                }
                vertex_blend_position[vertex_index * 2 + 0] = blend_position_x;
                vertex_blend_position[vertex_index * 2 + 1] = blend_position_y;
            }
        }
        else {
            var vertex_blend_position = this.vertex_blend_position;
            var position = new Spine.Vector();
            for (var vertex_index = 0, index = 0; vertex_index < this.vertex_count; ++vertex_index) {
                var blender_count = attachment.vertices[index++];
                var blend_position_x = 0;
                var blend_position_y = 0;
                for (var blender_index = 0; blender_index < blender_count; ++blender_index) {
                    var bone_index = attachment.vertices[index++];
                    position.x = attachment.vertices[index++];
                    position.y = attachment.vertices[index++];
                    var weight = attachment.vertices[index++];
                    var bone_key = spine_pose.bones.keys[bone_index];
                    var bone = spine_pose.bones.get(bone_key);
                    bone && Spine.Space.transform(bone.world_space, position, position);
                    blend_position_x += position.x * weight;
                    blend_position_y += position.y * weight;
                }
                var vertex_position_offset = vertex_index * 2;
                vertex_blend_position[vertex_position_offset++] = blend_position_x;
                vertex_blend_position[vertex_position_offset++] = blend_position_y;
            }
        }
    };
    RenderWeightedMeshAttachment.prototype.drawPose = function (spine_pose, atlas_data, slot, attachment_key, attachment) {
        var ctx = this.render.ctx;
        var site = atlas_data && atlas_data.sites[attachment.path || attachment.name || attachment_key];
        var page = site && site.page;
        var image_key = (page && page.name) || attachment.path || attachment.name || attachment_key;
        var image = this.render.images.get(image_key);
        if (!image || !image.complete) {
            return;
        }
        ctx.save();
        ctxApplyAtlasSitePosition(ctx, site);
        ctxDrawImageMesh(ctx, this.vertex_triangle, this.vertex_blend_position, this.vertex_texcoord, image, site);
        ctx.restore();
    };
    RenderWeightedMeshAttachment.prototype.drawDebugPose = function (spine_pose, atlas_data, slot, attachment_key, attachment) {
        var ctx = this.render.ctx;
        var site = atlas_data && atlas_data.sites[attachment.path || attachment.name || attachment_key];
        ctx.save();
        ctxApplyAtlasSitePosition(ctx, site);
        ctxDrawMesh(ctx, this.vertex_triangle, this.vertex_blend_position, "rgba(127,127,127,1.0)", "rgba(127,127,127,0.25)");
        ctx.restore();
    };
    RenderWeightedMeshAttachment.prototype.drawDebugData = function (spine_pose, atlas_data, slot, attachment_key, attachment) {
        var ctx = this.render.ctx;
        var site = atlas_data && atlas_data.sites[attachment.path || attachment.name || attachment_key];
        ctx.save();
        ctxApplyAtlasSitePosition(ctx, site);
        ctxDrawMesh(ctx, this.vertex_triangle, this.vertex_setup_position, "rgba(127,127,127,1.0)", "rgba(127,127,127,0.25)");
        ctx.restore();
    };
    return RenderWeightedMeshAttachment;
}());
var RenderPathAttachment = (function () {
    function RenderPathAttachment(render) {
        this.render = render;
    }
    RenderPathAttachment.prototype.loadData = function (spine_data, attachment) {
        return this;
    };
    RenderPathAttachment.prototype.dropData = function (spine_data, attachment) {
        return this;
    };
    RenderPathAttachment.prototype.updatePose = function (spine_pose, atlas_data, slot_key, attachment_key, attachment) {
    };
    RenderPathAttachment.prototype.drawPose = function (spine_pose, atlas_data, slot, attachment_key, attachment) {
    };
    RenderPathAttachment.prototype.drawDebugPose = function (spine_pose, atlas_data, slot, attachment_key, attachment) {
        var ctx = this.render.ctx;
        var bone = spine_pose.bones.get(slot.bone_key);
        ctx.save();
        bone && ctxApplySpace(ctx, bone.world_space);
        ctx.beginPath();
        var x = 0;
        attachment.vertices.forEach(function (value, index) {
            if (index & 1) {
                ctx.lineTo(x, value);
            }
            else {
                x = value;
            }
        });
        ctx.closePath();
        ctx.strokeStyle = attachment.color.toString();
        ctx.stroke();
        ctx.restore();
    };
    RenderPathAttachment.prototype.drawDebugData = function (spine_pose, atlas_data, slot, attachment_key, attachment) {
        var ctx = this.render.ctx;
        var bone = spine_pose.data.bones.get(slot.bone_key);
        ctx.save();
        bone && ctxApplySpace(ctx, bone.world_space);
        ctx.beginPath();
        var x = 0;
        attachment.vertices.forEach(function (value, index) {
            if (index & 1) {
                ctx.lineTo(x, value);
            }
            else {
                x = value;
            }
        });
        ctx.closePath();
        ctx.strokeStyle = attachment.color.toString();
        ctx.stroke();
        ctx.restore();
    };
    return RenderPathAttachment;
}());
function ctxApplySpace(ctx, space) {
    if (space) {
        ctx.translate(space.position.x, space.position.y);
        ctx.rotate(space.rotation.rad);
        ctx.scale(space.scale.x, space.scale.y);
    }
}
function ctxApplyAtlasSitePosition(ctx, site) {
    if (site) {
        ctx.scale(1 / site.original_w, 1 / site.original_h);
        ctx.translate(2 * site.offset_x - (site.original_w - site.w), (site.original_h - site.h) - 2 * site.offset_y);
        ctx.scale(site.w, site.h);
    }
}
function ctxDrawCircle(ctx, color, scale) {
    if (color === void 0) { color = "grey"; }
    if (scale === void 0) { scale = 1; }
    ctx.beginPath();
    ctx.arc(0, 0, 12 * scale, 0, 2 * Math.PI, false);
    ctx.strokeStyle = color;
    ctx.stroke();
}
function ctxDrawPoint(ctx, color, scale) {
    if (color === void 0) { color = "blue"; }
    if (scale === void 0) { scale = 1; }
    ctx.beginPath();
    ctx.arc(0, 0, 12 * scale, 0, 2 * Math.PI, false);
    ctx.strokeStyle = color;
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(24 * scale, 0);
    ctx.strokeStyle = "red";
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(0, 24 * scale);
    ctx.strokeStyle = "green";
    ctx.stroke();
}
function ctxDrawMesh(ctx, triangles, positions, stroke_style, fill_style) {
    if (stroke_style === void 0) { stroke_style = "grey"; }
    if (fill_style === void 0) { fill_style = ""; }
    ctx.beginPath();
    for (var index = 0; index < triangles.length;) {
        var triangle0 = triangles[index++] * 2;
        var x0 = positions[triangle0];
        var y0 = positions[triangle0 + 1];
        var triangle1 = triangles[index++] * 2;
        var x1 = positions[triangle1];
        var y1 = positions[triangle1 + 1];
        var triangle2 = triangles[index++] * 2;
        var x2 = positions[triangle2];
        var y2 = positions[triangle2 + 1];
        ctx.moveTo(x0, y0);
        ctx.lineTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.lineTo(x0, y0);
    }
    if (fill_style) {
        ctx.fillStyle = fill_style;
        ctx.fill();
    }
    ctx.strokeStyle = stroke_style;
    ctx.stroke();
}
function ctxDrawImageMesh(ctx, triangles, positions, texcoords, image, site) {
    var page = site && site.page;
    var site_texmatrix = new Float32Array(9);
    var site_texcoord = new Float32Array(2);
    render_webgl_1.mat3x3Identity(site_texmatrix);
    image && render_webgl_1.mat3x3Scale(site_texmatrix, image.width, image.height);
    render_webgl_1.mat3x3ApplyAtlasPageTexcoord(site_texmatrix, page);
    render_webgl_1.mat3x3ApplyAtlasSiteTexcoord(site_texmatrix, site);
    // http://www.irrlicht3d.org/pivot/entry.php?id=1329
    for (var index = 0; index < triangles.length;) {
        var triangle0 = triangles[index++] * 2;
        var position0 = positions.subarray(triangle0, triangle0 + 2);
        var x0 = position0[0];
        var y0 = position0[1];
        var texcoord0 = render_webgl_1.mat3x3Transform(site_texmatrix, texcoords.subarray(triangle0, triangle0 + 2), site_texcoord);
        var u0 = texcoord0[0];
        var v0 = texcoord0[1];
        var triangle1 = triangles[index++] * 2;
        var position1 = positions.subarray(triangle1, triangle1 + 2);
        var x1 = position1[0];
        var y1 = position1[1];
        var texcoord1 = render_webgl_1.mat3x3Transform(site_texmatrix, texcoords.subarray(triangle1, triangle1 + 2), site_texcoord);
        var u1 = texcoord1[0];
        var v1 = texcoord1[1];
        var triangle2 = triangles[index++] * 2;
        var position2 = positions.subarray(triangle2, triangle2 + 2);
        var x2 = position2[0];
        var y2 = position2[1];
        var texcoord2 = render_webgl_1.mat3x3Transform(site_texmatrix, texcoords.subarray(triangle2, triangle2 + 2), site_texcoord);
        var u2 = texcoord2[0];
        var v2 = texcoord2[1];
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(x0, y0);
        ctx.lineTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.closePath();
        ctx.clip();
        x1 -= x0;
        y1 -= y0;
        x2 -= x0;
        y2 -= y0;
        u1 -= u0;
        v1 -= v0;
        u2 -= u0;
        v2 -= v0;
        var id = 1 / (u1 * v2 - u2 * v1);
        var a = id * (v2 * x1 - v1 * x2);
        var b = id * (v2 * y1 - v1 * y2);
        var c = id * (u1 * x2 - u2 * x1);
        var d = id * (u1 * y2 - u2 * y1);
        var e = x0 - (a * u0 + c * v0);
        var f = y0 - (b * u0 + d * v0);
        ctx.transform(a, b, c, d, e, f);
        image && ctx.drawImage(image, 0, 0);
        ctx.restore();
    }
}
function ctxDrawIkConstraints(ctx, spine_data, bones) {
    spine_data.ikcs.forEach(function (ikc, ikc_key) {
        var target = bones.get(ikc.target_key);
        switch (ikc.bone_keys.length) {
            case 1:
                var bone = bones.get(ikc.bone_keys[0]);
                ctx.beginPath();
                target && ctx.moveTo(target.world_space.position.x, target.world_space.position.y);
                bone && ctx.lineTo(bone.world_space.position.x, bone.world_space.position.y);
                ctx.strokeStyle = "yellow";
                ctx.stroke();
                ctx.save();
                target && ctxApplySpace(ctx, target.world_space);
                ctxDrawCircle(ctx, "yellow", 1.5);
                ctx.restore();
                ctx.save();
                bone && ctxApplySpace(ctx, bone.world_space);
                ctxDrawCircle(ctx, "yellow", 0.5);
                ctx.restore();
                break;
            case 2:
                var parent_1 = bones.get(ikc.bone_keys[0]);
                var child = bones.get(ikc.bone_keys[1]);
                ctx.beginPath();
                target && ctx.moveTo(target.world_space.position.x, target.world_space.position.y);
                child && ctx.lineTo(child.world_space.position.x, child.world_space.position.y);
                parent_1 && ctx.lineTo(parent_1.world_space.position.x, parent_1.world_space.position.y);
                ctx.strokeStyle = "yellow";
                ctx.stroke();
                ctx.save();
                target && ctxApplySpace(ctx, target.world_space);
                ctxDrawCircle(ctx, "yellow", 1.5);
                ctx.restore();
                ctx.save();
                child && ctxApplySpace(ctx, child.world_space);
                ctxDrawCircle(ctx, "yellow", 0.75);
                ctx.restore();
                ctx.save();
                parent_1 && ctxApplySpace(ctx, parent_1.world_space);
                ctxDrawCircle(ctx, "yellow", 0.5);
                ctx.restore();
                break;
        }
    });
}


/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

///import * as Spine from "./spine.ts/spine";
///import * as Atlas from "./spine.ts/demo/atlas";
///import * as RenderCtx2D from "./spine.ts/demo/render-ctx2d";
///import * as RenderWebGL from "./spine.ts/demo/render-webgl";
///export { Spine as Spine }
///export { Atlas as Atlas }
///export { RenderCtx2D as RenderCtx2D }
///export { RenderWebGL as RenderWebGL }
__webpack_require__(6);
__webpack_require__(3);
__webpack_require__(4);
__webpack_require__(5);


/***/ })
/******/ ]);