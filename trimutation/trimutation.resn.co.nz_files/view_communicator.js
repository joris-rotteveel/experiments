define(["jquery", "underscore", 'backbone'], function ($, _, Backbone) {

    var object = {};
    _.extend(object, Backbone.Events);

    return object;
});