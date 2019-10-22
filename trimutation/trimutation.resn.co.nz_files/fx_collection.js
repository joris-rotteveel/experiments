
define(["underscore","backbone",'config'],function (_,Backbone,Config) {
    var Collection = Backbone.Collection.extend({

        model: Backbone.Model,
        url: Config.CDN+'/audio/song.json',

        parse : function(response){
            return response.data ;
        }



    });

    return new Collection();
});