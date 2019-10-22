/**
 * Created by joris on 29/01/14.
 */
define(['jquery', 'underscore'] , function ( $ , _ ) {

    var input = {

        x : 0 ,
        y : 0 ,

        init : function () {
            $(document).mousemove(_.bind(this.onMouseMove , this));
            $(document).on('touchmove' , _.bind(this.onTouchMove , this));

        } ,

        onMouseMove : function ( e ) {

            this.x = e.pageX;
            this.y = e.pageY;
            e.preventDefault();
        } ,

        onTouchMove : function ( e ) {

            this.x = e.originalEvent.touches[0].pageX;
            this.y = e.originalEvent.touches[0].pageY;

            e.preventDefault();
        }
    };

    input.init();

    return input;
});
