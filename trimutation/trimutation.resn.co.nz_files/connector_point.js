/**
 * Created by joris on 29/01/14.
 */

define([
    "jquery",
   "underscore"
],


    function ($, _) {


        var p = function (x, y, z) {

            this.x = x;
            this.y = y;
            this.z = z;

            this.baseX = x;
            this.baseY = y;
            this.baseZ = z;


            this.parents = [];

        }  ;


        var functions = {
            connections: [],
            connectTo: function (connectorPoint) {
                this.connections.push(connectorPoint);
            },

            getParentByID: function (id) {
                return this.parents.indexOf(id);

            },

            addParentTriangle: function (id) {

                if (this.parents.indexOf(id) === -1) {
                    this.parents.push(id);
                }

            }


        };


        _.extend(p.prototype, functions);

        return p;

    }) ;
