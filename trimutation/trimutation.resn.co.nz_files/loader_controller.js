/**
 * User: emlyn
 * Date: 27/06/12
 * Time: 2:14 PM
 */
define([
	"underscore",
    "router",
    "model/loader_model",
    'model/fx_collection',
	"util/createjs"
],function (
	_,
    Router,
    LoaderModel,
    FXCollection,
	createjs
) {
	"use strict";
    var controller = {

        init: function() {
			LoaderModel.on('loaded', this.onFileLoaded, this);
			LoaderModel.on('complete', this.onLoaderComplete, this);
        },

        onFileLoaded: function(evt) {
			if(evt.item.createjs) {
				if(!createjs.images[evt.item.createjs.ns]) {
					createjs.images[evt.item.createjs.ns] = {};
				}

				//# Check for spritesheet
				if(evt.item.createjs.spritesheet) {

					var img = evt.result;

					var iCanvas = document.createElement("canvas");
					iCanvas.width = img.width;
					iCanvas.height = img.height;

					var iCtx = iCanvas.getContext("2d");
					iCtx.drawImage(img, 0,0);

					var sCanvas, sCtx;
					_.each(evt.item.createjs.spritesheet, function(spriteInfo) {

						sCanvas = document.createElement("canvas");
						sCanvas.width = spriteInfo.width;
						sCanvas.height = spriteInfo.height;

						sCtx = sCanvas.getContext("2d");
						sCtx.drawImage(iCanvas, spriteInfo.x, spriteInfo.y, spriteInfo.width, spriteInfo.height, 0, 0, spriteInfo.width, spriteInfo.height);

						createjs.images[evt.item.createjs.ns][spriteInfo.id] = sCanvas;
					});
				} else {
					createjs.images[evt.item.createjs.ns][evt.item.createjs.id] = evt.result;
				}

			}
        },



        onFXCollectionSuccess: function () {

            this.fx_collection_ready = true;
            this.evalStart();

        },

        onLoaderComplete: function () {

            this.loader_ready = true;
            this.evalStart();
        },

        evalStart: function () {

            if (this.loader_ready && this.fx_collection_ready) {

                LoaderModel.preloadingDone();
            }
        },

        start: function() {
            FXCollection.fetch(
                {
                    add: true,
                    success: _.bind(this.onFXCollectionSuccess, this),
                    error: function () {

                    }
                }
            );

            LoaderModel.start();
		}

};

    controller.init();

    return controller;
});