define([
	"jquery",
	"underscore",
	"backbone"


], function (
	$,
	_,
	Backbone


) {
	"use strict";
    return Backbone.View.extend({


        initialize: function () {

        },

        show:function(){},
        hide:function(){

            this.onHideComplete();
        },

         onHideComplete:function(){

             this.trigger('hidePageComplete',this)  ;

         },
        render: function () {

        },


        onResize: function (evt) {

        },


        destroy: function () {
            this.stopListening();
            this.off();
        }
    });
});
