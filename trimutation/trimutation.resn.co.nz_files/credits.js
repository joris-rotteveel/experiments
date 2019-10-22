define([
    "jquery",
    "underscore",
    "backbone",
    "config",
    "handlebars",
    "view/common/base_view",
    'router',
    'model/app_model'
], function (
    $,
    _,
    Backbone,
    Config,
    Handlebars,
    BaseView,Router,AppModel
) {

    "use strict";

  return BaseView.extend({

      events:{

          'click .js-start-button':'onStartClick'

      },

      onStartClick: function (e) {

          Router.setPage(AppModel.PAGES.VISUALISER);

      }



	});
});
