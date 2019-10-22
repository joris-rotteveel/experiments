/**
 * User: emlyn
 * Date: 27/06/12
 * Time: 2:14 PM
 */
define([
    'underscore',
    "model/app_model",
    'util/anim_frame',
    'model/triangle_collection',
    'model/settings_model',
    'util/utils',
    'util/input_recorder',
    'model/triangle/connector_point',
    'model/triangle/triangle',
    'util/view_communicator'

], function (_, AppModel, AnimationFrame, TriangleCollection, SettingsModel, Util, Input, ConnectorPoint, Triangle, Communicator) {

    var controller = {

        init: function () {
            AppModel.set('lastX', 0);
            AppModel.set('lastY', 0);

            Communicator.on('home_addPoint', _.bind(this.onClick, this));
            Communicator.on('home_clearing', _.bind(this.onClear, this));
            Communicator.on('home_clearing_done', _.bind(this.onClearDone, this));
            Communicator.on('home_start', _.bind(this.onHomeStart, this));
            Communicator.on('trianglesRendered', _.bind(this.onRendered, this));

        },

        onRendered: function (renderedTriangles) {

            for (var i = 0; i < renderedTriangles.length; i++) {

                var triangle = renderedTriangles[i];
                triangle.setClean();

            }
        },

        onHomeStart: function () {

            var t1X = 0;
            var t1Y = Util.random(-50, 50);

            var t2X = Util.random(100, 370);
            var t2Y = Util.random(-20, 20);

            var t3X = Util.random(-50, 50);

            var t3Y = Util.random(100, 370);
            if (Math.random() > 0.5) {
                t3Y *= -1;
            }

            var t1 = new ConnectorPoint(t1X, t1Y, 0);
            var t2 = new ConnectorPoint(t2X, t2Y, 0);
            var t3 = new ConnectorPoint(t3X, t3Y, 0);

            var triangle = this.createTriangle(t1, t2, t3);

            //# add the triangle to the collection
            TriangleCollection.add(triangle);

        },

        onClearDone: function () {
            AppModel.set('clearing', false);
        },
        onClear: function () {
            AppModel.set('clearing', true);
            TriangleCollection.reset();


        },

        createTriangle: function (t1, t2, t3) {

            var t = new Triangle({connectorPointA: t1, connectorPointB: t2, connectorPointC: t3});

            //#make sure the connector points know to what triangle id it belongs
            t.connectorPointA.addParentTriangle(t.id);
            t.connectorPointB.addParentTriangle(t.id);
            t.connectorPointC.addParentTriangle(t.id);

            return t;
        },



        onClick: function () {
            this.addPoint();
        },

        updatePoints: function (xpos, ypos) {

            var closestToCurrentMouse = this.getClosestToPoint({x: xpos, y: ypos});
            var newPoint = new ConnectorPoint(xpos, ypos, 0);
            var triangle = this.createTriangle(closestToCurrentMouse.connectorPoint1, closestToCurrentMouse.connectorPoint2, newPoint);

            //# add the triangle to the collection
            TriangleCollection.add(triangle);
        },

        getClosestToPoint: function (p) {

            var closestTriangle;
            var closestPairToPoint;
            var dist;

            for (var i = 0; i < TriangleCollection.length; i++) {

                var triangle = TriangleCollection.at(i);
                var availablePairs = triangle.pairs;

                for (var j = 0; j < availablePairs.length; j++) {
                    var p2 = availablePairs[j].avPos;
                    var currentDist = Util.distance(p, p2);

                    if (!dist || currentDist < dist) {
                        dist = currentDist;
                        closestTriangle = triangle;
                        closestPairToPoint = availablePairs[j];
                    }
                }
            }

            return closestPairToPoint;

        },

        onUpdate: function () {
        },

        addPoint: function () {

            var current = new Date().getTime() / 1000;
            var timePassed = current - AppModel.get('previousTime');

            //because we transformed the registration point, we need to add this to the input coordiantes
            //we scale the holder, divide the coordinates to reflect that
            //offset the outcome by the holder.x
            // var holderOffsets=AppModel.holderOffsets;

            var mouseDistance = Util.distance({x: AppModel.get('lastX'), y: AppModel.get('lastY')}, {x: Input.x, y: Input.y});
            var hasEnoughPaint = TriangleCollection.length < SettingsModel.maxAmountOfTrianglesInShape;


            if (hasEnoughPaint && !AppModel.get('clearing') && timePassed > SettingsModel.timeThreshold && mouseDistance > SettingsModel.minDistanceToDraw) {


                AppModel.set('lastY', Input.y);
                AppModel.set('lastX', Input.x);
                AppModel.set('previousTime', current);

                var offsetX = AppModel.get('offsetX');
                var offsetY = AppModel.get('offsetY');
                var scale = AppModel.get('scale');
                var cx = AppModel.get('centerX');
                var cy = AppModel.get('centerY');

                var convertedInputX = (Input.x + ((scale - 1) * cx)) / scale;
                var convertedInputY = (Input.y + ((scale - 1) * cy)) / scale;

                var p = {x: convertedInputX - (offsetX / scale), y: convertedInputY - (offsetY / scale)};
                this.updatePoints(p.x, p.y);


                for (var i = 0; i < SettingsModel.amountOfMultiplePoints; i++) {

                    this.updatePoints(p.x + (Math.random() * 300 - 150), p.y + (Math.random() * 300 - 150));
                }

            }

        }


    };

    controller.init();

    return controller;
});