/**
 * User: emlyn
 * Date: 27/06/12
 * Time: 2:14 PM
 */
define([
    'jquery',
    'underscore',
    'config',
    "model/app_model",
    'util/anim_frame',
    'model/triangle_collection',
    'util/processors/beat_processor',
    'util/processors/hue_shift_processor',
    'util/processors/color_pool_processor',
    'util/utils',
    'model/triangle/connector_point',
    'model/triangle/triangle',
    'util/key',
    'model/settings_model',

    'model/beat_model',
    'util/view_communicator'


], function ($, _, Config, AppModel, AnimationFrame, TriangleCollection, BeatProcessor, HueShiftProcessor, ColorPoolProcessor, Util, ConnectorPoint, Triangle, Key, SettingsModel, BeatModel, Communicator) {

    var controller = {
        movingPointsProcessor: null,


        init: function () {

            this.movingPointsProcessor = new BeatProcessor();
            this.hueShiftProcessor = new HueShiftProcessor();
            this.colorPoolProcessor = new ColorPoolProcessor();

            Communicator.on('home_reset', this.onTrianglesReset, this);
            Communicator.on('home_show', this.onHomeStart, this);
            TriangleCollection.on('add', this.onTriangleAdded, this);
            TriangleCollection.on('reset', this.onTrianglesReset, this);

            BeatModel.on('change:beat', this.onBeat, this);

            //  $(window).on('keydown', _.bind(this.onKeyDown,this));

        },


        start: function () {

        },

        onHomeStart: function () {

            this.onTrianglesReset();
            this.colorPoolProcessor.start();
        },

        onTrianglesReset: function () {
            this.hueShiftProcessor.reset();
            this.movingPointsProcessor.reset();
            this.colorPoolProcessor.reset();

        },


        onKeyDown: function (e) {
            e.preventDefault();
            var updated = this.updateColors(null);
            if (updated.length > 0) {

                TriangleCollection.setUpdatedTriangles(updated);
            }

        },

        onBeat: function (beatModel, beat) {


            var beatID = beat.get('note');

            var updated = [];

            if (beatID === Config.MIDI_NOTES.E1) {
                console.log('E1 (Flash) '+ beat.get('vel'));
                this.flash(beat);
            }

            if (beatID === Config.MIDI_NOTES.D1) {
                console.log('D1 (change colors) ');
                updated = this.updateHue(beat);
            }

            if (beatID === Config.MIDI_NOTES.C1) {
                console.log('C1 (update points) '+ beat.get('vel'));
                updated = this.updatePoints(beat);
            }

            if (beatID === Config.MIDI_NOTES.B0) {

                console.log('B0 (Swap colors) '+ beat.get('vel'));
                updated = this.updateColors(beat);
            }

            if (beatID === Config.MIDI_NOTES.A0) {

                console.log('A0 (change amount if triangles) '+ beat.get('vel'));
                this.updateMaxAMountOfTriangles(beat);
            }


            if (beatID === Config.MIDI_NOTES.G0) {

                console.log('G0 (change color group size ) '+ beat.get('vel'));
                this.updateColorGroupSize(beat);
            }

            if (beatID === Config.MIDI_NOTES.F0) {

                console.log('F0 (update multiple points ) '+ beat.get('vel'));
                this.updateMultiplePoints(beat);
            }

            if (updated.length > 0) {

                TriangleCollection.setUpdatedTriangles(updated);
            }
        },

        updateMultiplePoints: function (beat) {
            SettingsModel.amountOfMultiplePoints = Math.round(beat.get('vel'));// / 127) * 10);
        },

        updateColorGroupSize: function (beat) {
            SettingsModel.colorGroupSize = (beat.get('vel'));// / 127) * 60;
        },

        updateMaxAMountOfTriangles: function (beat) {
            SettingsModel.maxAmountOfTrianglesInShape = (beat.get('vel'));// / 127) * 20;
        },

        updateHue: function (beat) {
            var updated = this.hueShiftProcessor.update();
            return updated;
        },

        flash:function(beat){
            //show a flash
             TriangleCollection.flash(beat.get('vel'));

        },

        updateColors: function (beat) {


            return this.colorPoolProcessor.update(beat);

        },


        updatePoints: function (beat) {

            var beatID = beat.get('note');
            var max = 1;
            var min = -1;
            var beatStrength = Math.random() * (max - min) + min;

            var updatedPoints = this.movingPointsProcessor.update(beatID, beatStrength, (beat.get('vel') / 127) * SettingsModel.beatOffset);
            var updatedTriangles = [];

            //# make sure we only update the triangles that have dirty points
            for (var i = 0; i < updatedPoints.length; i++) {

                var parents = updatedPoints[i].parents;

                for (var j = 0; j < parents.length; j++) {
                    var id = parents[j];
                    var triangle = TriangleCollection.get(id);
                    triangle.pointsDirty = true;
                    if (updatedTriangles.indexOf(triangle) === -1) {
                        updatedTriangles.push(triangle);
                    }
                }
            }

            return updatedTriangles;
        },


        onTriangleAdded: function (triangle) {


            this.hueShiftProcessor.add(triangle);
            this.colorPoolProcessor.add(triangle);

            //# a new triangle has been added, check if we want to be able to manipulate the points

            if (SettingsModel.useBeatTriangle) {


                var parents_A = triangle.connectorPointA.parents;
                var parents_B = triangle.connectorPointB.parents;
                var parents_C = triangle.connectorPointC.parents;

                //merge the 3 arrays and remove duplicate points
                var uniqueParents = _.union(parents_A, parents_B, parents_C);

                var joined = [];

                for (var i = 0; i < uniqueParents.length; i++) {

                    var parentID = uniqueParents[i];
                    if (joined.indexOf(triangle.connectorPointA) === -1 && triangle.connectorPointA.getParentByID(parentID)) {
                        joined.push(triangle.connectorPointA);
                    } else if (joined.indexOf(triangle.connectorPointB) === -1 && triangle.connectorPointB.getParentByID(parentID)) {
                        joined.push(triangle.connectorPointB);
                    } else if (joined.indexOf(triangle.connectorPointC) === -1 && triangle.connectorPointC.getParentByID(parentID)) {
                        joined.push(triangle.connectorPointC);

                    }

                }

                for (i = 0; i < joined.length; i++) {
                    this.movingPointsProcessor.addPoint(joined[i]);

                }


            }


        }


    };

    controller.init();

    return controller;
});