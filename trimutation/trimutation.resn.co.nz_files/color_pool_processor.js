/**
 * Created by joris on 18/02/14.
 */

define(
    [
        "jquery",
        'backbone',
        "underscore",
        'model/settings_model',
        'model/triangle_collection',
        'util/utils',
        'libs/tweenMax'
    ],

    function ($, Backbone, _, SettingsModel, TriangleCollection, Util, TweenMax) {


        var processor = function () {
            this.triangles = [];
        };

        var functions = {

            start: function () {
                SettingsModel.changeColorPools(SettingsModel.greyTones, SettingsModel.greyTonesHighLights);
                var index = Math.round(Math.random() * (SettingsModel.colorPool.length - 1));
                SettingsModel.set('currentColorBase', SettingsModel.colorPool[index]);
            },

            update: function (beat) {

                var vel = beat.get('vel');
                if (vel < 50) {
                    //set color pool to use colors
                    SettingsModel.changeColorPools(SettingsModel.colorTones, []);
                } else {
                    //set color pool to use black and white
                    SettingsModel.changeColorPools(SettingsModel.greyTones, SettingsModel.greyTonesHighLights);

                }


                var updated = [];
                for (var i = 0; i < this.triangles.length; i++) {

                    var triangleModel = this.triangles[i];

                    this.updateColorHighlights();
                    if (i % SettingsModel.colorGroupSize === 0) {
                        var index = Math.round(Math.random() * (SettingsModel.colorPool.length - 1));
                        SettingsModel.set('currentColorBase', SettingsModel.colorPool[index]);
                    }

                    this.setTriangleColor(triangleModel);
                    updated.push(triangleModel);
                }

                return updated;
            },

            updateColorHighlights: function () {

                if (SettingsModel.currentColors === SettingsModel.highlightPool || TriangleCollection.length % SettingsModel.colorGroupSize === 0) {

                    var threshold = Math.random();
                    if (threshold < 0.25 && TriangleCollection.amountOfHighlights < SettingsModel.amountOfHighLights && SettingsModel.highlightPool.length > 0) {
                        //use highlights
                        SettingsModel.currentColors = SettingsModel.highlightPool;
                        TriangleCollection.amountOfHighlights += 1;

                    } else {
                        //use color
                        SettingsModel.currentColors = SettingsModel.colorPool;
                    }

                    var index = Math.round(Math.random() * (SettingsModel.currentColors.length - 1));
                    SettingsModel.set('currentColorBase', SettingsModel.currentColors[index]);
                }

            },

            setTriangleColor: function (triangle) {

                var colorPool = SettingsModel.get('currentColorBase');
                var color = colorPool[Math.round(Math.random() * ( SettingsModel.get('currentColorBase').length - 1))];

                triangle.colorPool = colorPool;
                triangle.setBaseColor(color.base);
                triangle.setGradientColor(color.gradient);

            },

            add: function (triangleModel) {

                this.updateColorHighlights();
                this.setTriangleColor(triangleModel);
                this.triangles.push(triangleModel);

            },


            reset: function () {
                this.triangles = [];
            }

        };

        _.extend(processor.prototype, functions);
        _.extend(processor.prototype, Backbone.Events);


        processor.prototype.updateColorHighlights();

        return processor;

    }
);
