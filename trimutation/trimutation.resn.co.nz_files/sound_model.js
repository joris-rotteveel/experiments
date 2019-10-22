/**
 * User: emlyn
 * Date: 27/06/12
 * Time: 2:16 PM
 */
define([
    "underscore",
    "backbone",
    "config",
    "model/loader_model",
    "model/app_model",
    "libs/createjs/soundjs"
//	"libs/createjs/soundjs-flash"
], function (_, Backbone, Config, LoaderModel, AppModel, SoundJS
             //	createjs
    ) {

    "use strict";


    var Model = Backbone.Model.extend({

        sounds: null,
        currentPlaying: [],

        initialize: function () {

            this.sounds = new Backbone.Collection();
            LoaderModel.on("loaded", this.onItemLoaded, this);
            this.on("change:bgloop", this.onBGLoopChange, this);

        },
        onItemLoaded: function (evt) {



            if (evt.item.type === "sound") {
                this.sounds.add(evt.item);
            }
        },

        play: function (id, options) {
            options = options || {};

            var defaults = {
                interrupt: SoundJS.INTERRUPT_ANY, //# Interupt
                delay: 0,	//# delay
                offset: 0,	//# offset
                loop: 0,	//# loop
                volume: 1,	//# volume
                pan: 0		//# pan

            };

            _.defaults(options, defaults);

            var args = [ id, options.interrupt, options.delay, options.offset, options.loop, options.volume, options.pan ];

            var s = SoundJS.play.apply(SoundJS, args);
            s.addEventListener("complete", _.bind(this.onSoundComplete, this));
            this.currentPlaying.push(s);

            return s;


        },

        onSoundComplete: function (event) {

            this.trigger('soundComplete', event.target);
        },

        stop: function (id) {

            if (this.sounds.get(id)) {
                var srcOfId = this.sounds.get(id).get('src');
                for (var i = 0; i < this.currentPlaying.length; i++) {

                    var sound = this.currentPlaying[i];
                    if (sound.src === srcOfId) {

                        sound.stop();
                        this.currentPlaying.splice(i, 1);
                    }

                }
            }

        },

        mute: function () {
            if (this.isMuted()) {
                this.unMute();
            } else {
                this.setMute();
            }
        },

        setMute: function () {

            SoundJS.setVolume(0);
            this.trigger('mute');

        },

        unMute: function () {


            SoundJS.setVolume(1);
            this.trigger('mute');

        },


        isMuted: function () {
            return SoundJS.getVolume() === 0;
        },

        onBGLoopChange: function () {

            var bgLoop = this.get("bgloop");

            if (this.has("bgloopInstance")) {
                this.get("bgloopInstance").stop();
            }

            if (this.sounds.get(bgLoop)) {

                this.set("bgloopInstance", this.play(bgLoop, { loop: 0 }));
            }
        }


    });

    return new Model();
});