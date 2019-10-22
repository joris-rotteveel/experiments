define([
    "jquery",
    "underscore",
    "view/common/base_view",
    "backbone",
    "config",
    'libs/createjs/movieclip',
    'libs/tweenMax',
    'util/utils'


], function ($, _, BaseView, Backbone, Config, createjs, TweenMax, Util) {

    "use strict";

    return Backbone.View.extend({



        initialize: function (options) {

            this.canvas = $('<canvas id ="gradient" width="100px" height="100px">');
            this.image = new createjs.Bitmap(options.image);
            this.ctx = this.canvas[0].getContext("2d");
            this.$el.append(this.canvas);

            this.stage = new createjs.Stage('gradient');

            this.originalWidth = options.image.width;
            this.originalHeight = options.image.height;

            this.image.regX = this.originalWidth / 2;
            this.image.regY = this.originalHeight / 2;


            this.stage.addChild(this.image);
            this.resize($(window).width(), $(window).height());
            this.move();


        },


        move: function () {

            TweenMax.to(this.image, Util.random(8, 11), {

                x: Math.random() * this.width,
                rotation: Math.random() * 360,
                scaleX: 0.2 + Math.random() * 2,
                onComplete: _.bind(this.move, this),
                ease: 'Circ.easeInOut'

            });


        },


        resize: function (w, h) {

            this.width = this.canvas[0].width = w;
            this.height = this.canvas[0].height = h;

            var diagonal = Math.sqrt(w * w + h * h);

            var nh = diagonal / this.originalHeight;
            this.image.scaleY = nh * 2;
            // this.image.scaleX = (w / this.originalWidth) * 1;

            this.image.y = this.height / 2;
            this.stage.update();


        },


        update: function (mouseX, mouseY) {
            this.stage.update();

        }


    });
});
