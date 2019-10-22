/**
 matt test r194
 * ...
 * @author emlyn@resn.co.nz
 */

define(["jquery", "libs/jquery-swfobject", "console"], function ($) {

    var config = {
        MIDI_NOTES: {
            E1: '40',
            D1: '38',
            C1: '36',
            B0: '35',
            A0: '33',
            G0: '31',
            F0: '29'

        },
        TRACK_NAME: 'number_9',
        SITE_URL: "http://",
        APP_URL: "https://apps.facebook.com/",
        CDN: "CDN_PATH",
        ENV: "local",

        MOBILE: window.screen.width < 768, //|| (navigator.userAgent.match(/mobile/i) && navigator.userAgent.match(/Android/i)) || navigator.userAgent.match(/(webOS|iPhone|iPod|BlackBerry|Windows Phone)/i),
        TABLET: ( window.screen.width > 768 && window.screen.width <= 1024) || navigator.userAgent.toLowerCase().indexOf("ipad") > -1 || (!navigator.userAgent.match(/mobile/i) && navigator.userAgent.match(/Android/i)),
        IPAD: navigator.userAgent.match(/ipad/i),

        NON_IOS_TABLET: navigator.userAgent.match(/(android 3|sch-i800|playbook|tablet|kindle|gt-p1000|sgh-t849|shw-m180s|a510|a511|a100|dell streak|silk|nook)/i),
        FLASH_VESRION: "11.0.0",
        FLASH: null,
        FLASH_BYPASS: window.location.href.match(/bypass/),
        FACEBOOK_APP_IDS: {
            live: "",
            staging: "",
            dev: "",
            local: "205547496221381"
        },
        getFBID: function () {
            return this.FACEBOOK_APP_IDS[this.ENV];
        },
        API_URL: {
            live: "",
            staging: "",
            dev: "",
            local: ""
        },
        getAPI: function () {
            return this.API_URL[this.ENV];
        }

    };

    config.FLASH = $.flash.hasVersion(config.FLASH_VESRION);
    config.BASE_URL = window.location.pathname.substring(0, window.location.pathname.lastIndexOf('/') + 1);

    return config;

});