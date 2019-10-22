define(["backbone"], function (Backbone) {
    var Model = Backbone.Model.extend({



        reset: function () {

            this.maxTravelSpeed = 0;
            this.maxCenterOffset = 100;
            this.minDistanceToDraw = 25;
            this.scaleEaseFactor = 0.01;
            this.maxScale = 1;
            this.amountOfMultiplePoints = 0;
            this.useBrush = false;
            this.colorGroupSize = 3;
            this.timeThreshold = 0.2;
            this.useBeatTriangle = true;
            this.maxAmountOfTrianglesInShape = 10;
            this.beatOffset = 30;
            this.maxBeatOffset = 300;
            this.amountOfHighLights = 3;

            this.currentColors = [];
            this.highlightPool = [];
            this.colorPool = [];


            this.colorPool = this.greyTones;
            this.highlightPool = this.greyTonesHighLights;
        },


        changeColorPools: function (colorpool, highlights) {

            this.colorPool = colorpool;
            this.highlightPool = highlights;

            this.trigger('colorPoolUpdated');
        },


        colorTones: [
            //#pink
            [
                {
                    base: '#540348',
                    gradient: '#280122'
                },
                {
                    base: '#6c0453',
                    gradient: '#290124'
                },
                {
                    base: '#9e005d',
                    gradient: '#410439'
                }
            ],
            [
                {
                    base: '#ffe50f',
                    gradient: '#ecbb0f'
                },
                {
                    base: '#fbd500',
                    gradient: '#e6b81a'
                },
                {
                    base: '#ffba00',
                    gradient: '#f1980b'
                }
            ]

        ],
        greyTones: [

            [
                {
                    base: '#424242',
                    gradient: '#696969'
                },
                {
                    base: '#3e3c3d',
                    gradient: '#252525'

                }
            ],
            [
                {
                    base: '#141414',
                    gradient: '#000000'
                },
                {
                    base: '#171717',
                    gradient: '#0d0d0d'
                },
                {
                    base: '#222222',
                    gradient: '#121212'
                }
            ]

        ],

        greyTonesHighLights: [

            [
                {
                    base: '#f0f0f0',
                    gradient: '#e8e8e8'
                },

                {
                    base: '#dadada',
                    gradient: '#b7b7b7'
                }
            ]

        ]


    });
    var m = new Model();
    m.reset();
    return m;
})
;