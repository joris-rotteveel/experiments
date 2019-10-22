define([
    "jquery",
    "underscore",

    "backbone",
    "config",
    'util/input_recorder',

    "view/common/base_view",
    "view/pages/elements/gradient_background",
    'model/app_model',
    'libs/snap.svg-min',
    'model/triangle/triangle',
    'util/utils',
    'libs/datgui',
    'util/point',
    'util/key',
    'model/settings_model',
    'util/view_communicator',
    'model/triangle_collection' ,
    'model/loader_model',
    'model/sound_model',
    'libs/tweenMax'   ,
    'router'

], function ($, _, Backbone, Config, Input, BaseView, GradientBackground, AppModel, Snap, Triangle, Util, GUI, Point, Key, SettingsModel, Communicator, TriangleCollection, LoadModel, SoundModel, TweenMax, Router) {

    "use strict";

    LoadModel.add(

        {
            id: 'gradient',
            src: Config.CDN + '/img/gradient.png'
        }
    );

    return BaseView.extend({

        snap: null,
        clearing: false,

        initialize: function () {

//            var gui = new GUI();
//
//            gui.add(SettingsModel, 'maxCenterOffset', 0, 500);
//            gui.add(SettingsModel, 'minDistanceToDraw', 0, 500).step(2);
//            gui.add(SettingsModel, 'scaleEaseFactor', 0.0001, 1).step(0.00001);
//            gui.add(SettingsModel, 'maxScale', 1, 20).listen();
//            gui.add(SettingsModel, 'maxAmountOfTrianglesInShape', 3, 60).step(1).listen();
//            gui.add(SettingsModel, 'colorGroupSize', 1, 200).step(1);
//            gui.add(SettingsModel, 'amountOfMultiplePoints', 0, 10).step(1);
//            gui.add(SettingsModel, 'useBeatTriangle').listen();
//            gui.add(SettingsModel, 'beatOffset', 0, SettingsModel.maxBeatOffset).step(1);


            this.snap = new Snap('.js-svg_holder_home');
            this.flash = this.$('.js-flash');
            this.gradientBackground = new GradientBackground({el: this.$('.js-gradient'), image: LoadModel.getResult('gradient')});

            this.reset();


            AppModel.on('update', _.bind(this.onUpdate, this));
            SoundModel.on('soundComplete', this.onSoundComplete, this);

            if (Config.TABLET || Config.MOBILE) {

                this.$el.on('touchstart', _.bind(this.onMouseDown, this));
                this.$el.on('touchend', _.bind(this.onMouseUp, this));
            } else {

                this.$el.on('mousedown', _.bind(this.onMouseDown, this));
                this.$el.on('mouseup', _.bind(this.onMouseUp, this));

            }

            TriangleCollection.on('add', _.bind(this.onTriangleAdded, this));
            TriangleCollection.on('reset', _.bind(this.onTriangleReset, this));
            TriangleCollection.on('trianglesUpdated', _.bind(this.onTrianglesUpdated, this));
            TriangleCollection.on('startFlash', _.bind(this.onStartFlash, this));



        },

        onStartFlash:function(startAlpha){

            this.flashTween = TweenMax.fromTo(this.flash, startAlpha, {autoAlpha: 0.2}, {autoAlpha: 0});
        },

        show: function () {
            SettingsModel.reset();
            Communicator.trigger('home_show');
            this.reset();
            this.start();
        },

        start: function () {


            Communicator.trigger('home_start');

        },

        onSoundComplete: function (sound) {

            var src = sound.src;
            LoadModel.get(Config.TRACK_NAME).get('src');

            if (src === LoadModel.get(Config.TRACK_NAME).get('src')) {

                Router.setPage(AppModel.PAGES.CREDITS);

            }

        },

        onMouseDown: function (e) {


            if (TriangleCollection.length > 1) {
                Communicator.trigger('home_clearing');
            }
            SettingsModel.useBrush = true;
        },


        onMouseUp: function (e) {
            SettingsModel.useBrush = false;


        },


        onClick: function (e) {
            e.preventDefault();
            this.addPoint();

        },


        onTriangleReset: function (newModel, oldModel) {

            if (!this.clearing) {

                this.clearing = true;

                var triangles = oldModel.previousModels;
                var delay = 0;
                for (var i = triangles.length - 1; i >= 0; i--) {
                    var t = triangles[i].id;
                    var callback = null;
                    if (i === 0) {

                        callback = _.bind(this.restart, this);
                    }
                    _.delay(_.bind(this.hideTriangle, this), delay, t, callback);
                    delay += 0.5;
                }
            }
        },


        hideTriangle: function (id, callback) {

            var path = this.snap.select('#' + id);

            if (path) {

                Snap.animate(1, 0, function (value) {
                    path.transform('s' + value);
                }, 0, window.mina.easeout, callback);
            } else {

                if (callback) {
                    callback();
                }
            }

        },
        restart: function () {
            Communicator.trigger('home_clearing_done');
            this.reset();
            this.start();

        },
        reset: function () {


            TweenMax.to(this.flash, 0.5, {autoAlpha: 0});
            this.snap.clear();
            if (this.flashTween) {
                this.flashTween.kill();
            }

            this.positionHolder = this.snap.group({id: 'positionHolder' });
            this.clearing = false;

            Communicator.trigger('home_reset');

        },

        onUpdate: function () {

            if (SettingsModel.useBrush) {
                this.addPoint();
            }

            var offsetX = AppModel.get('offsetX');
            var offsetY = AppModel.get('offsetY');
            var scale = AppModel.get('scale');
            var cx = AppModel.get('centerX');
            var cy = AppModel.get('centerY');

            this.positionHolder.attr({
                transform: "t" + offsetX + ' ' + offsetY + ' s' + scale + ' ' + scale + ' ' + cx + ' ' + cy
            });

            this.gradientBackground.update(Input.x, Input.y);

        },
        addPoint: function () {
            Communicator.trigger('home_addPoint');
        },

        onTriangleAdded: function (triangle) {
            var time = 0;
            if (TriangleCollection.length > 1) {
                time = 200;
            }
            this.drawTriangle(triangle, time);
        },

        onTrianglesUpdated: function (triangleArray) {

            var huesChanged = false;
            for (var i = 0; i < triangleArray.length; i++) {
                var triangle = triangleArray[i];
                var moveTo = 'M' + triangle.connectorPointA.x + ',' + triangle.connectorPointA.y;
                var lineTo = 'L' + triangle.connectorPointB.x + ',' + triangle.connectorPointB.y;
                var lineTo2 = 'L' + triangle.connectorPointC.x + ',' + triangle.connectorPointC.y;
                var path = moveTo + lineTo + lineTo2 + "Z";

                var id = '#' + triangle.id;

                if (!huesChanged && triangle.isDirty('color')) {
                    huesChanged = true;
                }

                //# just update the snapping to the points
                this.snap.select(id).attr({
                    d: path,
                    fill: this.getGradient(triangle)
                });


            }
            if (huesChanged) {
           //     this.flashTween = TweenMax.fromTo(this.flash, 0.5, {autoAlpha: 0.2}, {autoAlpha: 0});
            }

            Communicator.trigger('trianglesRendered', triangleArray);

        },


        drawTriangle: function (triangle, time) {

            if (_.isUndefined(time)) {

                time = 0;
            }

            var moveTo = 'M' + triangle.connectorPointA.x + ',' + triangle.connectorPointA.y;
            var lineTo = 'L' + triangle.connectorPointB.x + ',' + triangle.connectorPointB.y;
            var lineTo2 = 'L' + triangle.connectorPointC.x + ',' + triangle.connectorPointC.y;

            var path = this.snap.path(moveTo + lineTo + lineTo2 + "Z");
            var centerPoint = Util.interpolate({x: triangle.connectorPointA.x, y: triangle.connectorPointA.y}, {x: triangle.connectorPointB.x, y: triangle.connectorPointB.y}, 0.5);
            var gradient = this.getGradient(triangle);

            path.attr({
                fill: gradient,
                id: triangle.id,
                transform: 's0'
            });

            Snap.animate(0, 1, function (value) {
                path.transform('s' + value + ' ' + centerPoint.x + ' ' + centerPoint.y);
            }, time, window.mina.easeout);


            this.positionHolder.append(path);
        },

        getGradient: function (triangle) {

            var base1 = new Point(triangle.connectorPointA.x, triangle.connectorPointA.y);
            var base2 = new Point(triangle.connectorPointB.x, triangle.connectorPointB.y);
            var end = new Point(triangle.connectorPointC.x, triangle.connectorPointC.y);

            //find the center of the bottompart of the triangle
            var gradientBase = new Point().lerp(base1, base2, 0.5);
            //calculate the Normal (90 degrees), to know the direction of the gradient
            var baseDir = base1.subtract(base2);
            var gradientDir = base1.subtract(base2).getNormal();
            //Find out where the lines would intersect
            var gradientEnd = Util.intersect(gradientBase, gradientDir, end, baseDir);
            var gradient = this.snap.gradient("L(" + gradientBase.x + "," + gradientBase.y + "," + gradientEnd.point.x + "," + gradientEnd.point.y + ")" + triangle.getGradientColor() + "-" + triangle.getBaseColor() + "-" + triangle.getBaseColor());


            return gradient;

        }

    });
})
;
