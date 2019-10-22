define([
    "jquery",
    "underscore",
    "config",
    "router",
    "controller/app_controller",
    "controller/canvas_controller",
    "controller/triangle_controller",
    "controller/loader_controller",
    "controller/fx_controller",
    "controller/sound_controller",
    "model/sound_model",
    "model/app_model",
    "model/settings_model",
    "model/triangle_collection",
    'model/loader_model',
    'model/fx_collection',
    "view/common/transitioner",
    "view/pages/loader",
    "view/pages/home",
    "view/pages/visualiser",
    "view/pages/credits",
    "view/footer"

] , function ( $ , _ , Config , Router , AppController , CanvasController , TriangleController , LoaderController , FXController , SoundController , SoundModel , AppModel , SettingsModel , TriangleModel , LoaderModel , FXCollection , Transitioner , LoaderView , HomeView , VisualiserView , AboutView , FooterView ) {

    "use strict";

    Router.setRoutes([
        ["", AppModel.PAGES.HOME],
        ["visualiser", AppModel.PAGES.VISUALISER],
        ["credits", AppModel.PAGES.CREDITS]

    ]);

    var viewMap = {};
    viewMap[AppModel.PAGES.LOADER] = LoaderView;
    viewMap[AppModel.PAGES.HOME] = HomeView;
    viewMap[AppModel.PAGES.VISUALISER] = VisualiserView;
    viewMap[AppModel.PAGES.CREDITS] = AboutView;

    // LoaderModel.add([
    //     { src: Config.CDN + '/css/all.css' }
    // ]);

    return {

        rootNode            : $('#rootNode') ,
        transitioner        : null ,
        fx_collection_ready : false ,
        loader_ready        : false ,

        start : function () {

            this.transitioner = new Transitioner({
                el      : this.rootNode ,
                viewMap : viewMap
            });

            this.footer = new FooterView({el : $('.footer')});
            this.footer.on('toggleVolume' , this.onToggleVolume , this);
            this.footer.on('toggleFullScreen' , this.onToggleFullScreen , this);

            window.onresize = _.bind(this.onResize , this);
            LoaderModel.on('complete' , this.onLoaderComplete , this);
            LoaderModel.on('soundLoaded' , this.onSoundComplete , this);

            LoaderController.start();
            Router.start();

        } ,

        onToggleVolume : function () {
            AppModel.set('mute' , !AppModel.get('mute'));
        } ,

        onToggleFullScreen : function () {

            AppModel.set('fullScreen' , !AppModel.get('fullScreen'));
        } ,

        onLoaderComplete : function () {
            this.startMain();

        } ,

        startMain : function () {

            var postLoaderPage = AppModel.get('postLoaderPage');
            AppModel.unset('postLoaderPage');
            AppModel.set('page' , postLoaderPage);

            this.footer.show();
        } ,

        onResize : function ( evt ) {

            this.transitioner.onResize(evt);
        }



    };

});