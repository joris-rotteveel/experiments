/**
 * User: emlyn
 * Date: 27/06/12
 * Time: 2:14 PM
 */
define([
    'config',
    "router",
    "model/app_model",
    "model/sound_model",
    "model/loader_model"
] , function ( Config , Router , AppModel , SoundModel , LoadModel ) {

    var controller = {

        init : function () {
            Router.on("page" , this.onRouterPage , this);
            AppModel.on('change:mute' , this.onMute , this);
            AppModel.on('change:fullScreen' , this.onFullScreen , this);

        } ,

        onMute : function ( model , isMuted ) {
            if ( isMuted ) {
                SoundModel.setMute();
            } else {
                SoundModel.unMute();
            }
        } ,

        onFullScreen : function ( model , isFullScreen ) {
            if ( isFullScreen ) {
                this.requestFullScreen(document.body);
            } else {
                this.exitFullScreen(document.body);

            }
        } ,

        exitFullScreen : function ( element ) {
            if ( document.exitFullscreen ) {
                document.exitFullscreen();
            } else if ( document.msExitFullscreen ) {
                document.msExitFullscreen();
            } else if ( document.mozCancelFullScreen ) {
                document.mozCancelFullScreen();
            } else if ( document.webkitExitFullscreen ) {
                document.webkitExitFullscreen();
            }
        } ,

        requestFullScreen : function ( element ) {
            if ( document.documentElement.requestFullscreen ) {
                document.documentElement.requestFullscreen();
            } else if ( document.documentElement.msRequestFullscreen ) {
                document.documentElement.msRequestFullscreen();
            } else if ( document.documentElement.mozRequestFullScreen ) {
                document.documentElement.mozRequestFullScreen();
            } else if ( document.documentElement.webkitRequestFullscreen ) {
                document.documentElement.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
            }
        } ,

        onRouterPage : function ( page , pageOptions ) {
            AppModel.set({'page' : page , 'pageOptions' : pageOptions});
        }
    };

    controller.init();

    return controller;
});