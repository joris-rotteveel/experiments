define([
    'underscore',
    'util/anim_frame',
    'model/app_model',
    'model/settings_model',
    'util/input_recorder'
], function (_, AnimationFrame, AppModel, SettingModel, Input) {

    var controller = {

        init: function () {

            AppModel.set('offsetX', window.innerWidth / 2);
            AppModel.set('offsetY', window.innerHeight / 2);

            AppModel.set('centerX', 100 + Math.random() * 150);
            AppModel.set('centerY', 100 + Math.random() * 150);

            AnimationFrame.on('anim_frame', _.bind(this.onUpdate, this));

        },


        onUpdate: function () {
            var input = {x: Input.x, y: Input.y};
            var maxTravelSpeed = SettingModel.maxTravelSpeed;
            var maxCenterOffset = SettingModel.maxCenterOffset;
            var scaleEaseFactor = SettingModel.scaleEaseFactor;
            var canvasTargetX = AppModel.get('canvasTargetX');
            var canvasTargetY = AppModel.get('canvasTargetY');
            var canvasVelocityX = AppModel.get('canvasVelocityX');
            var canvasVelocityY = AppModel.get('canvasVelocityY');
            var offsetX = AppModel.get('offsetX');
            var offsetY = AppModel.get('offsetY');
            var scale = AppModel.get('scale');
            var maxScale = SettingModel.maxScale;

            var offsetVX = ((input.x / window.innerWidth) - 0.5) * -(maxTravelSpeed);
            var offsetVY = ((input.y / window.innerHeight) - 0.5) * -(maxTravelSpeed);

            var mouseOffsetX = window.innerWidth / 2 + ((input.x / window.innerWidth) - 0.5) * -(maxCenterOffset);
            var mouseOffsetY = window.innerHeight / 2 + ((input.y / window.innerHeight) - 0.5) * -(maxCenterOffset);

            canvasTargetX += offsetVX;
            canvasTargetY += offsetVY;

            var canvasOffsetX = canvasTargetX + mouseOffsetX;
            var canvasOffsetY = canvasTargetY + mouseOffsetY;

            canvasVelocityX += (canvasOffsetX - offsetX) * 0.01;
            canvasVelocityY += (canvasOffsetY - offsetY) * 0.01;

            canvasVelocityX *= 0.9;
            canvasVelocityY *= 0.9;

            offsetX += canvasVelocityX;
            offsetY += canvasVelocityY;

            //var canvasSpeed = Math.sqrt(this.canvasVelocityX * this.canvasVelocityX + this.canvasVelocityY * this.canvasVelocityY);
            var targetScale = maxScale; // (1 + canvasSpeed * 0.5);

            scale += (targetScale - scale) * scaleEaseFactor;

            AppModel.set('mouseOffsetX', mouseOffsetX);
            AppModel.set('mouseOffsetY', mouseOffsetY);
            AppModel.set('offsetX', offsetX);
            AppModel.set('offsetY', offsetY);
            AppModel.set('canvasTargetX', canvasTargetX);
            AppModel.set('canvasTargetY', canvasTargetY);
            AppModel.set('canvasVelocityX', canvasVelocityX);
            AppModel.set('canvasVelocityY', canvasVelocityY);
            AppModel.set('scale', scale);

            AppModel.update();

        }

    };

    controller.init();
    return controller;
});