(function(){

'use strict';

/**
 * Vimeo IFrame Embed API Angular wrapper
 * For options see: https://github.com/vimeo/player.js
 */
angular.module('ov.directives', [])
    .constant('VM_STATUS', {
        ENDED: 0,
        PLAYING: 1,
        PAUSED: 2,
        SEEKED: 3,
        LOADED: 4,
        CUE_CHANGED: 5
    })
    .constant('VM_EVENT', {
        STOP: 'vm_stop',
        PLAY: 'vm_play',
        PAUSE: 'vm_pause'
    })
    .constant('VM_ERROR', {
        TYPE_ERROR: 0,
        PASSWORD_ERROR: 1,
        PRIVACY_ERROR: 2,
        UNKNKOWN_ERROR: 3
    })
    .directive('ovVimeo', ['$window', 'VM_STATUS', 'VM_EVENT', 'VM_ERROR', function ($window, VM_STATUS, VM_EVENT, VM_ERROR) {
        return {
            restrict: 'E',
            scope: {
                videoId: '@',
                autopause: '@',
                autoplay: '@',
                byline: '@',
                color: '@',
                height: '@',
                loop: '@',
                maxheight: '@',
                maxwidth: '@',
                portrait: '@',
                title: '@',
                width: '@',
                videoClass: '@',
                onStatusChanged: '&',
                onError: '&'
            },
            link: function (scope, element /*, attrs, controller*/) {
                var o = {
                        status: '',
                        error: ''
                    },
                    options = {
                        id: scope.videoId,
                        autopause: scope.autopause || true,
                        autoplay: scope.autoplay || false,
                        byline: scope.byline || true,
                        color: scope.color,
                        height: scope.height,
                        loop: scope.loop || false,
                        maxheight: scope.maxheight,
                        maxwidth: scope.maxwidth,
                        portrait: scope.portrait || true,
                        title: scope.title || true,
                        width: scope.width
                    },
                    player = new Vimeo.Player(element[0], options),
                    onPlay = function (/*data*/) {
                        o.status = VM_STATUS.PLAYING;
                        scope.onStatusChanged(o);
                    },
                    onPause = function (/*data*/) {
                        o.status = VM_STATUS.PAUSED;
                        scope.onStatusChanged(o);
                    },
                    onEnded = function (/*data*/) {
                        o.status = VM_STATUS.ENDED;
                        scope.onStatusChanged(o);
                    },
                    onSeeked = function (/*data*/) {
                        o.status = VM_STATUS.SEEKED;
                        scope.onStatusChanged(o);
                    },
                    onCueChange = function (/*data*/) {
                        o.status = VM_STATUS.CUE_CHANGED;
                        scope.onStatusChanged(o);
                    },
                    onLoaded = function (/*data*/) {
                        o.status = VM_STATUS.LOADED;
                        scope.onStatusChanged(o);
                    };

                // when directive is destroyed turn off listeners
                element.on('$destroy', function () {
                    player.off('play', onPlay);
                    player.off('pause', onPause);
                    player.off('ended', onEnded);
                    player.off('seeked', onSeeked);
                    player.off('cuechange', onCueChange);
                    player.off('loaded', onLoaded);
                });

                // initialize listeners
                player.on('play', onPlay);
                player.on('pause', onPause);
                player.on('ended', onEnded);
                player.on('seeked', onSeeked);
                player.on('cuechange', onCueChange);
                player.on('loaded', onLoaded);

                // on player ready iframe should be available
                player.ready().then(function () {
                    var ifrs = document.getElementsByTagName('iframe');
                    if (scope.videoClass && ifrs && ifrs.length > 0) {
                        angular.element(ifrs[0]).addClass(scope.videoClass);
                    }
                });

                scope.$watch('videoId', function (newValue, oldValue) {
                    if (newValue === oldValue) {
                        return;
                    }

                    player.loadVideo(scope.videoId).then(function (/*id*/) {
                        // the video successfully loaded
                    }).catch(function (error) {
                        switch (error.name) {
                            case 'TypeError':
                                // the id was not a number
                                o.error = VM_ERROR.TYPE_ERROR;
                                scope.onError(o);
                                break;
                            case 'PasswordError':
                                // the video is password-protected and the viewer needs to enter the
                                // password first
                                o.error = VM_ERROR.PASSWORD_ERROR;
                                scope.onError(o);
                                break;
                            case 'PrivacyError':
                                // the video is password-protected or private
                                o.error = VM_ERROR.PRIVACY_ERROR;
                                scope.onError(o);
                                break;
                            default:
                                // some other error occurred
                                o.error = VM_ERROR.UNKNKOWN_ERROR;
                                scope.onError(o);
                                break;
                        }
                    });
                });

                scope.$on(VM_EVENT.STOP, function () {
                    player.unload().then(function () {
                        // the video was unloaded
                    }).catch(function (/*error*/) {
                        // an error occurred
                        o.error = VM_ERROR.UNKNKOWN_ERROR;
                        scope.onError(o);
                    });
                });

                scope.$on(VM_EVENT.PLAY, function () {
                    player.play().then(function () {
                        // the video was played
                    }).catch(function (error) {
                        switch (error.name) {
                            case 'PasswordError':
                                // the video is password-protected and the viewer needs to enter the
                                // password first
                                o.error = VM_ERROR.PASSWORD_ERROR;
                                scope.onError(o);
                                break;
                            case 'PrivacyError':
                                // the video is private
                                o.error = VM_ERROR.PRIVACY_ERROR;
                                scope.onError(o);
                                break;
                            default:
                                // some other error occurred
                                o.error = VM_ERROR.UNKNKOWN_ERROR;
                                scope.onError(o);
                                break;
                        }
                    });
                });

                scope.$on(VM_EVENT.PAUSE, function () {
                    player.pause().then(function () {
                        // the video was paused
                    }).catch(function (error) {
                        switch (error.name) {
                            case 'PasswordError':
                                // the video is password-protected and the viewer needs to enter the
                                // password first
                                o.error = VM_ERROR.PASSWORD_ERROR;
                                scope.onError(o);
                                break;
                            case 'PrivacyError':
                                // the video is private
                                o.error = VM_ERROR.PRIVACY_ERROR;
                                scope.onError(o);
                                break;
                            default:
                                // some other error occurred
                                o.error = VM_ERROR.UNKNKOWN_ERROR;
                                scope.onError(o);
                                break;
                        }
                    });
                });
            }
        };
    }]);


})();