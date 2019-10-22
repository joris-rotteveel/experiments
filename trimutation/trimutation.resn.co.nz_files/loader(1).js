define([
	"jquery",
	"underscore",
	"view/common/base_view",
	"config",
	"router",
	"model/app_model",
	"model/loader_model"
], function (
	$,
	_,
	BaseView,
	Config,
	Router,
	AppModel,
	LoaderModel

) {
	"use strict";
return BaseView.extend({

		initialize: function() {

		},

		render: function() {
			LoaderModel.on('progress', this.onLoadProgress, this);
		},

		onLoadProgress: function( evt ) {


		}

	});
});
