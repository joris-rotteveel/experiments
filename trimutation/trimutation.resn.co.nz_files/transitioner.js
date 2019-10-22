define([
    "jquery",
    "underscore",
    "config",
    "backbone",
    "controller/app_controller",
    "controller/loader_controller",
    "model/app_model",
    "model/loader_model",
    'util/view_communicator'

], function (
    $,
    _,
    Config,
    Backbone,
    AppController,
    LoaderController,
    AppModel,
    LoaderModel,
    Communicator
    ) {

    "use strict";

    return Backbone.View.extend({

        viewMap: null,
        currentSection: null,
        createdPages:{},
        transitionType:'hideShow',

        initialize: function (options) {

            this.options=options;

            if( _.has(this.options, 'viewMap') ) {
                this.viewMap = this.options['viewMap'];
            } else {
                throw new Error("viewMap option not set");
            }

            if( _.has(this.options, 'type') ) {
                this.transitionType=this.options['type'];
            }




            AppModel.on("change:page", this.onAppModelPage, this);

        },

        onResize: function (evt) {
            if (this.currentSection) {
                this.currentSection.onResize(evt);
            }
        },


        onAppModelPage: function (model, page) {

            var pageId = page;
            var view;

            if (page !== AppModel.PAGES.LOADER && !LoaderModel.hasLoaded()) {
                AppModel.set('postLoaderPage', pageId);
                AppModel.set('page', AppModel.PAGES.LOADER);
                return;
            }


            //# If the view is already displayed, abort.
            if (this.currentViewId === pageId) {
                return;
            }

            var ViewClass = this.viewMap[pageId];
            if(!ViewClass){
                throw new Error("View class not found for: "+pageId);
            }

            Communicator.trigger('transitionStart');
            switch(this.transitionType){

                case 'cross':
                    this.transitionCrossStart(pageId);
                    break;

                default:
                    this.transitionHideShowStart(pageId);

            }

        }    ,


  ///# hide and show pages at same time
        transitionCrossStart:function(pageId){
            var prevSection = this.currentSection || null;

            var direction='down';


            if (prevSection) {
                var currentIndex = AppModel.NAV_ORDER.indexOf(pageId);
                var prevIndex = AppModel.NAV_ORDER.indexOf(this.currentViewId);
                if (currentIndex > prevIndex) {

                    direction= 'down';
                } else {

                    direction= 'up';
                }

            }
            this.newViewId = pageId;

            if (prevSection) {
                prevSection.on('hidePageComplete',this.onPrevSectionCrossHideComplete,this);
                prevSection.hide(direction);

            }

            var ViewClass = this.viewMap[this.newViewId];
            var instance = this.createdPages[this.newViewId];

            if(!instance){
                var newInstance = new ViewClass({el: this.$('.js-'+this.newViewId.toLowerCase())});
                this.createdPages[this.newViewId] = newInstance;
                instance = newInstance;
            }

            this.currentViewId = this.newViewId;
            this.currentSection = instance;

            this.currentSection.render();
            this.currentSection.onResize();
            this.currentSection.show(direction);
            this.currentSection.$el.show();



        },

        onPrevSectionCrossHideComplete:function(target){

            if (target) {
                var prevSection = target;
              //  prevSection.off(null,null,this);
                prevSection.$el.hide();
            }
            Communicator.trigger('transitionEnd');

        },

  ///# hide page and then show next page
        transitionHideShowStart:function(pageId){
            var prevSection = this.currentSection || null;
            this.newViewId = pageId;

            if (prevSection) {
                prevSection.on('hidePageComplete',this.onPrevSectionHideComplete,this);
                prevSection.hide();

            } else{
                this.onPrevSectionHideComplete(null);
            }
        },


        onPrevSectionHideComplete:function(target){

            if (target) {

                var prevSection = target;
                prevSection.$el.hide();
            }

            var ViewClass = this.viewMap[this.newViewId];
            var instance = this.createdPages[this.newViewId];

            if(!instance){
                var newInstance = new ViewClass({el: this.$('.js-'+this.newViewId.toLowerCase())});
                this.createdPages[this.newViewId] = newInstance;
                instance = newInstance;
            }

            this.currentViewId = this.newViewId;

            this.currentSection = instance;

            this.currentSection.render();
            this.currentSection.onResize();
            this.currentSection.show();
            this.currentSection.$el.show();

            AppModel.set({'pageRendered':this.currentViewId});
            Communicator.trigger('transitionEnd');
        }




    });
});
