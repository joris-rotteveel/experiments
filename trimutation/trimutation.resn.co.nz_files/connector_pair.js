/**
 * Created by joris on 29/01/14.
 */

define([
    "jquery",
    "underscore",
    'util/utils'
],


    function ($, _, Util) {

        var p = function (connectorPoint1, connectorPoint2) {


            this.connectorPoint1 = connectorPoint1;
            this.connectorPoint2 = connectorPoint2;

            connectorPoint1.connectTo(connectorPoint2);
            connectorPoint2.connectTo(connectorPoint1);

            this.avPos = Util.interpolate({x: connectorPoint1.x, y: connectorPoint1.y}, {x: connectorPoint2.x, y: connectorPoint2.y}, 0.5);

        };

        var functions = {

            calculateCenter: function () {
                this.avPos = Util.interpolate({x: this.connectorPoint1.x, y: this.connectorPoint1.y}, {x: this.connectorPoint2.x, y: this.connectorPoint2.y}, 0.5);
                return this.avPos;
            }


        };


        _.extend(p.prototype, functions);

        return p;

    });
