define([
    "jquery",
    "underscore",
    "backbone",
    "config",
    "view/common/base_view",
    'libs/tweenMax',
    'router',
    'model/app_model'

] , function ( $ , _ , Backbone , Config , BaseView , TweenMax , Router , AppModel ) {

    "use strict";

    return BaseView.extend({


        events : {
            'click .js-volume'     : 'onVolumeClick' ,
            'click .js-fullscreen' : 'onFullScreenClick'
        } ,

        initialize : function () {
            this.$('.js-volume').hide();
            AppModel.on('change:mute' , this.onMute , this);
            AppModel.on('change:fullScreen' , this.onFullScreen , this);
        } ,

        show:function(){

            this.$('.js-volume').show();
        },

        onMute       : function ( model , isMuted ) {

            if ( isMuted ) {
                this.$('.js-volume').addClass('muted');
            } else {
                this.$('.js-volume').removeClass('muted');
            }

        } ,
        onFullScreen : function ( model , isFullScreen ) {

            if ( isFullScreen ) {
                this.$('.js-fullscreen').addClass('fullscreen');
            } else {
                this.$('.js-fullscreen').removeClass('fullscreen');
            }

        } ,

        onVolumeClick : function ( e ) {
            this.trigger('toggleVolume');

        } ,

        onFullScreenClick : function ( e ) {
            this.trigger('toggleFullScreen');

        }


    });
})
;
