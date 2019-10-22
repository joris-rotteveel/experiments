/**
 * Created by joris on 29/01/14.
 */

define([
    "jquery",
    "underscore",
    "model/triangle/connector_pair",
    'backbone'
],


    function ($, _, ConnectorPair, Backbone) {


        var triangle = Backbone.Model.extend({


//        var triangle = function (connectorPointA, connectorPointB, connectorPointC,neighbour) {
            initialize: function (options) {


                this.pairs = [];

                this._hueDirty = false;


                this.id = _.uniqueId('triangle_');

                this.connectorPointA = options.connectorPointA;
                this.connectorPointB = options.connectorPointB;
                this.connectorPointC = options.connectorPointC;

                this.pairs.push(new ConnectorPair(this.connectorPointA, this.connectorPointB));
                this.pairs.push(new ConnectorPair(this.connectorPointB, this.connectorPointC));
                this.pairs.push(new ConnectorPair(this.connectorPointA, this.connectorPointC));


                this._gradientColor = '#ff0000';
                this._baseColor = '#ff0000';
                this.colorPool = [];

            },

            setClean: function () {
                this._colorDirty = false;
            },

            setBaseColor: function (color) {

                this._colorDirty = true;
                this._baseColor = color;
            },
            getBaseColor: function () {
                return this._baseColor;
            },

            setGradientColor: function (color) {
                this._colorDirty = true;
                this._gradientColor = color;
            },
            getGradientColor: function () {
                return this._gradientColor;
            },


            isDirty: function (type) {

                switch (type) {

                    case "color":
                        return this._colorDirty;

                }

                return false;
            }


        });

        return triangle;

    });

