/**
 * User: emlyn
 * Date: 27/06/12
 * Time: 2:16 PM
 */
define(["backbone"], function (Backbone) {
    var Collection = Backbone.Collection.extend({
        amountOfHighlights:0,

        setUpdatedTriangles: function (triangleArray) {
            this.trigger('trianglesUpdated', triangleArray);
        },

        flash:function(startAlpha){
            this.trigger('startFlash',startAlpha/100);
        },

        reset: function () {


            this.amountOfHighlights = 0;

            Backbone.Collection.prototype.reset.call(this);
        }



    });

    return new Collection();
});