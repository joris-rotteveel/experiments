define([

    "config",
    "underscore",
    "jquery",
    "router",
    "model/app_model",
    "model/loader_model",
    "model/sound_model" ,
    'util/view_communicator',
    'model/fx_collection',
    "libs/tweenMax",
    "model/beat_model",
    "libs/createjs/soundjs"


], function (Config, _, $, Router, AppModel, LoaderModel, SoundModel, Communicator, FXCollection, TweenMax, BeatModel, SoundJS) {

    "use static";

    LoaderModel.add([
        {
            id: Config.TRACK_NAME,
            src: Config.CDN + "/audio/song.ogg"

        }
    ]);


    var controller = {

        init: function () {

            this.delayedCalls = [];
            AppModel.on("change:pageRendered", this.onPage, this);
            FXCollection.on('add', this.onFXCollectionAdded, this);


        },

        onFXCollectionAdded: function (beatModel) {

            BeatModel.addTrigger(beatModel);

        },



        onPage: function (model, page) {

            switch (page) {
                case AppModel.PAGES.VISUALISER:

                    SoundModel.set({bgloop: Config.TRACK_NAME});
                    BeatModel.start();


                    break;

                default:
                    SoundModel.unset('bgloop');

            }

        }

    };

    controller.init();

    return controller;
});