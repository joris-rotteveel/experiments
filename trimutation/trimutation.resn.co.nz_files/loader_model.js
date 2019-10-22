define([
    "underscore",
    "backbone",
    "config",
    "libs/createjs/preloadjs",
    "libs/createjs/soundjs"
] , function ( _ , Backbone , Config , PreloadJS , SoundJS ) {
    "use strict";
    var Model = Backbone.Collection.extend({

        preloader : null ,
        loadDone  : false ,

        initialize : function () {
            PreloadJS.loadTimeout = 100000;
            this.preloader = new PreloadJS(false);
            SoundJS.alternateExtensions = ["mp3"];
            this.preloader.installPlugin(SoundJS);
            //	this.preloader.setMaxConnections(4);
            this.preloader.maintainScriptOrder = false;
            this.preloader.addEventListener("fileload" , _.bind(this.onFileLoaded , this));
            this.preloader.addEventListener("complete" , _.bind(this.onComplete , this));
            this.preloader.addEventListener("progress" , _.bind(this.onProgress , this));
            this.preloader.addEventListener("error" , _.bind(this.onError , this));

            //# WORK AROUND THE PRELOAD JS BUG
            // SoundJS.addEventListener("fileload" , _.bind(this.onSoundLoaded , this));

            this.on('add' , this.onAdded , this);
            this.on('change:loaded' , this.onLoaded , this);
        } ,

        onLoaded : function ( model , loaded ) {
            if ( !loaded ) {
                throw new Error("Load set to false");
            }
        } ,

        onProgress : function ( evt ) {
            this.trigger('progress' , evt);
        } ,

        onAdded : function ( item ) {
            if ( !item.has('id') ) {
                item.set({id : item.get('src')});
            }

            item.set({loaded : false} , {silent : true});

            var json = item.toJSON();
            var src = item.get('src');
            var isSound = src.indexOf('.mp3') !== -1 || src.indexOf('.ogg') !== -1;
            if ( false && isSound ) {
                SoundJS.registerSound(json);
            } else {


                // json.callback='maps';
                this.preloader.loadFile(json , false);

            }
        } ,

        onFileLoaded  : function ( evt ) {
           // console.log(evt.item.id)
            this.get(evt.item.id).set(_.extend(evt.item , {'loaded' : true}));
            this.trigger('loaded' , evt);
        } ,
        onSoundLoaded : function ( evt ) {

          //  console.log('SOUND LOADED')

            this.soundLoadDone = true;

            this.get(evt.id).set('loaded' , true);
            var item = {};
            item.id = evt.id;
            item.type = 'sound';
            evt.item = item;

            this.trigger('loaded' , evt);
            this.evalLoaders();
        } ,

        onComplete : function ( evt ) {


            this.loadDone = true;

            this.evalLoaders();
        } ,

        preloadingDone : function () {

            this.trigger('preloadingComplete');
        } ,

        evalLoaders : function () {

            this.trigger('complete');

        } ,

        start : function () {
            this.preloader.load();

        } ,

        hasLoaded : function () {
            return this.preloader.loaded;
        } ,

        getResult : function ( filename ) {
            return this.preloader.getResult(filename);
        } ,

        onError : function ( evt ) {
            //console.error( "ASSET ERROR: "+evt.item.src );
            this.get(evt.item.id).set({'loaded' : true , 'error' : true});

            this.trigger('load_error' , evt);
        }

    });

    return new Model();

});