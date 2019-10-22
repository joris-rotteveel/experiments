define(["backbone","underscore", "libs/tweenMax"], function (Backbone, _,TweenMax) {

    var Model = Backbone.Model.extend({

        delayedCalls:[],

        addTrigger: function (beatModel) {

            var clocks = beatModel.get('time');
            // we calculate the Pulses per Quater by  comparing the end clock time in ticks ans the end time in seconds
            // 270secs/ 44461clicks = 160
            var PPQ = 160;
            var delayedCall = TweenMax.delayedCall(clocks / PPQ, _.bind(this.onTriggerBeat, this), [beatModel]);
            delayedCall.pause();


            this.delayedCalls.push(delayedCall);

        },
        onTriggerBeat: function (beatModel) {

            this.set('beat', beatModel);

        }   ,

        start:function(){

            for (var i = 0; i < this.delayedCalls.length; i++) {

                this.delayedCalls[i].restart(true);
            }

        }
    });

    return new Model();
})
;