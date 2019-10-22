define([
	"underscore",
	"libs/createjs/movieclip"
], function (
	_,
	createjs
	) {
	"use strict";
	var lib = window.lib = {};
	var images = window.images = {};

	_.extend(createjs, {

		lib: lib,
		images: images

	});

	return createjs;
});