/**
 * Created by joris on 31/01/14.
 */


define([
    "jquery",
    "underscore"
], function ($, _) {

    var Point = function (x, y) {
        this.x = x;
        this.y = y;
    };

    var functions = {

        x: 0,
        y: 0,

        subtract: function (p) {
            return new Point(this.x - p.x, this.y - p.y);
        },

        add: function (p) {
            return new Point(this.x + p.x, this.y + p.y)  ;
        },

        clone: function () {
            return new Point(this.x, this.y);
        },

        getNormal: function () {
            return new Point(-this.y, this.x) ;
        },

        angle: function () {
            return Math.atan2(this.y, this.x);
        },

        fromPolar: function (angle, length) {
            var l = length || 1;
            return new Point(l * Math.cos(angle), l * Math.sin(angle));
        },

        lerp: function (a, b, pi) {
            this.x = pi * b.x + (1 - pi) * a.x;
            this.y = pi * b.y + (1 - pi) * a.y;
            return this;
        },

        scaleBy: function (amt) {
            this.x *= amt;
            this.y *= amt;
            return this;
        },

        length: function () {
            return Math.sqrt(this.x * this.x + this.y * this.y) ;
        },
        dot: function (b) {
            return this.x * b.x + this.y * b.y;
        },

        normalize: function (len) {
            var mag = len || 1;
            var curLen = this.length();
            var xpos=this.x;
            var ypos=this.x;
            xpos /= curLen / mag;
            ypos /= curLen / mag;
            return new Point(xpos,ypos);
        },

        mean: function (pointList) {
            var x = 0;
            var y = 0;
            for (var i = 0; i < pointList.length; i++) {
                x += pointList[i].x;
                y += pointList[i].y;
            }
            x /= pointList.length;
            y /= pointList.length;
            return new Point(x, y);
        }

    };

    _.extend(Point.prototype, functions);

    return Point;

})    ;



