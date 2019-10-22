/**
 * Created by joris on 18/02/14.
 */

define(
    [
        "jquery",
        'backbone',
        "underscore",
        'util/utils',
        'libs/tweenMax'
    ],

    function ($, Backbone, _, Util, TweenMax) {


        var processor = function () {
            this.triangles = [];
        };

        var functions = {

            update: function () {
                //change color
                //   triangle.get('')

//                Math.round(Math.random() * ( SSettingsModel.colorPool.length - 1)
                var updated = [];
                for (var i = 0; i < this.triangles.length; i++) {

                    var triangleModel = this.triangles[i];
                    var colorPool = triangleModel.colorPool;
                    var color = colorPool[Math.round(Math.random() * ( colorPool.length - 1))];
                    triangleModel.setBaseColor(color.base);
                    triangleModel.setGradientColor(color.gradient);
                    updated.push(triangleModel);
                }

                return updated;
            },

            add: function (triangleModel) {

                this.triangles.push(triangleModel);

            },


            reset: function () {
                this.triangles = [];
            }

        };

        _.extend(processor.prototype, functions);
        _.extend(processor.prototype, Backbone.Events);


        return processor;

    }

);
