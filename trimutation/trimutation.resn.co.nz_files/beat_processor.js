/**
 * Created by joris on 18/02/14.
 */

define(
    [
        "jquery",
        "underscore",
        'util/utils'
    ],

    function ($, _,Util) {

        var processor = function () {
            this.points = [];
        };

        var functions = {

            update: function (beatID,strength,maxRadius) {

                var updated = [];
                for (var i = 0; i < this.points.length; i++) {

                    //# strength is a value between -1 and 1;
                    var maxX = Util.random(-maxRadius,maxRadius);
                    var maxY =Util.random(-maxRadius,maxRadius);
                    //# random direction
                    var angle = Math.random() * (Math.PI * 2);

                    var connectorPoint = this.points[i];
                    connectorPoint.x = connectorPoint.baseX + Math.cos(angle) * (maxX * strength);
                    connectorPoint.y = connectorPoint.baseY + Math.sin(angle) * (maxY * strength);
                    updated.push(connectorPoint);

                }
                return updated;
            },

            addPoint: function (point) {
                //#check the attachedPoints
                this.points.push(point);
            } ,

            reset:function(){
                this.points = [];
            }

        } ;

        _.extend(processor.prototype, functions);


        return processor;

    }

);
