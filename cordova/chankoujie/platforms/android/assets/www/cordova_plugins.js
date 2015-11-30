cordova.define('cordova/plugin_list', function(require, exports, module) {
module.exports = [
    {
        "file": "plugins/cordova-plugin-device/www/device.js",
        "id": "cordova-plugin-device.device",
        "clobbers": [
            "device"
        ]
    },
    {
        "file": "plugins/cordova-plugin-splashscreen/www/splashscreen.js",
        "id": "cordova-plugin-splashscreen.SplashScreen",
        "clobbers": [
            "navigator.splashscreen"
        ]
    },
    {
        "file": "plugins/cordova-plugin-dialogs/www/notification.js",
        "id": "cordova-plugin-dialogs.notification",
        "merges": [
            "navigator.notification"
        ]
    },
    {
        "file": "plugins/cordova-plugin-dialogs/www/android/notification.js",
        "id": "cordova-plugin-dialogs.notification_android",
        "merges": [
            "navigator.notification"
        ]
    },
    {
        "file": "plugins/at.modalog.cordova.plugin.cache/www/Cache.js",
        "id": "at.modalog.cordova.plugin.cache.Cache",
        "clobbers": [
            "cache"
        ]
    },
    {
        "file": "plugins/com.spout.phonegap.plugins.baidulocation/www/baidulocation.js",
        "id": "com.spout.phonegap.plugins.baidulocation.BiaduLocation",
        "clobbers": [
            "window.baiduLocation"
        ]
    }
];
module.exports.metadata = 
// TOP OF METADATA
{
    "cordova-plugin-device": "1.0.1",
    "cordova-plugin-splashscreen": "2.1.0",
    "cordova-plugin-dialogs": "1.1.1",
    "at.modalog.cordova.plugin.cache": "1.0.0",
    "com.spout.phonegap.plugins.baidulocation": "0.1.0"
}
// BOTTOM OF METADATA
});