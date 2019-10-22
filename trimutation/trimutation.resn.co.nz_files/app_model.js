define(["backbone"], function (Backbone) {


    var Model = Backbone.Model.extend({


        defaults: {
            mute:false,
            fullScreen:false,

            offsetX: window.innerWidth / 2,
            offsetY: window.innerHeight / 2,

            scale: 1,
            centerX: 250 / 2,
            centerY: 250 / 2,

            canvasTargetX: 0,
            canvasTargetY: 0,
            canvasVelocityX: 0,
            canvasVelocityY: 0,

            previousTime:0

        },

        PAGES: {
            HOME: "HOME",
            VISUALISER: "VISUALISER",
            CREDITS: "CREDITS",
            LOADER: "LOADER"
        },

        update: function () {

            this.trigger('update');
        }



    });

    return new Model();
});