define([
    "jquery",
    "underscore",
    "backbone",
    "config",
    "view/common/base_view",
    'libs/tweenMax',
    'router',
    'model/app_model'

], function ($,
             _,
             Backbone,
             Config,
             BaseView,
             TweenMax,
             Router,
            AppModel
    ) {

    "use strict";


    return BaseView.extend({

        snap: null,
        clearing: false,

        events:{

            'click .js-start-button':'onStartClick'

        },

        onStartClick: function (e) {

            Router.setPage(AppModel.PAGES.VISUALISER);

        }


    });
})
;
