define([
    "jquery",
    "config",
    "underscore",
    'util/point'

], function ($, Config, _, Point) {
    "use strict";
    return {

        //#usage  Util.centerAndScale(div,window.innerWidth,this.originalWidth,this.originalHeight);
        //# div : the jquery element of the div
        //# desiredWidth : the new width
        //# originalWidth : the original width
        //# originalHeight : the original height
        //# centerWidth : the width  where the div will be centered in

        centerAndScale: function (div, desiredWidth, originalWidth, originalHeight, centerWidth) {
            if (!centerWidth) {
                centerWidth = desiredWidth;
            }
            var screenWidth = desiredWidth;
            var scale = (screenWidth / originalWidth);
            var scaleString = "scale(" + scale + "," + scale + ")";

            var overflow = centerWidth - (scale * originalWidth);

            var offsetX = (overflow) / 2;
            var offsetY = (scale * originalHeight) / 2;


            div.css("left", offsetX);
            div.css("transform", scaleString);
            div.css("margin-top", -offsetY);
            div.css("top", "50%");

        },

        inRange: function (value, rangeStart, rangeEnd) {


            return   ( value < Math.max(rangeStart, rangeEnd) && value > Math.min(rangeStart, rangeEnd));

        },

        interpolate: function (a, b, frac) // points A and B, frac between 0 and 1
        {
            var nx = a.x + (b.x - a.x) * frac;
            var ny = a.y + (b.y - a.y) * frac;
            return {x: nx, y: ny};
        },

        distance: function (point1, point2) {
            var xs = 0;
            var ys = 0;

            xs = point2.x - point1.x;
            xs = xs * xs;

            ys = point2.y - point1.y;
            ys = ys * ys;

            return Math.sqrt(xs + ys);


        },

        intersect: function (a_p1, a_r1, a_p2, a_r2) {

            a_r1.normalize(1);
            a_r2.normalize(1);

            var returner = {};
            try {
                var ta = a_r1.y / a_r1.x;
                var tb = a_p1.y - ta * a_p1.x;


                var tc = a_r2.y / a_r2.x;
                var td = a_p2.y - tc * a_p2.x;

                returner.xIntercept = (td - tb) / (ta - tc);
                returner.yIntercept = ta * returner.xIntercept + tb;

                if (Math.abs(ta) === Infinity) {
                    //r1 is vertical
                    returner.xIntercept = a_p1.x;
                    returner.yIntercept = tc * returner.xIntercept + td;

                } else if (Math.abs(tc) === Infinity) {
                    //r2 is vertical
                    returner.xIntercept = a_p2.x;
                    returner.yIntercept = returner.xIntercept * ta + tb;
                } else if (Math.abs(ta) === 0) {
                    //r1 is horizontal
                    returner.yIntercept = a_p2.y; //
                    returner.xIntercept = (returner.yIntercept - td) / tc;
                }
                var m = returner.xIntercept;
                var p = a_p1.x;
                var q = a_r1.x;
                /*
                 * The approach that seems to work more robustly is
                 * that we have the x-intercept.
                 * if we divide the difference between the origin, a_p1.x, by the
                 * ray's x magnitude, a_p1.x-a_r1.x,
                 * */

                returner.tValue = (a_p1.x - returner.xIntercept ) / (a_r1.x);
                returner.uValue = (a_p2.x - returner.xIntercept ) / (a_r2.x);


                returner.mirrorPi = (returner.xIntercept - a_r2.x) / (a_p2.x - a_r2.x);
            } catch (e) {

            }
            returner.point = new Point(returner.xIntercept, returner.yIntercept);

            return returner;
        },

        random: function (min, max) {

            return Math.random() * (max - min + 1) + min;

        }




    };
});