(function () {
    'use strict';

    angular.module('demo', ['ov.directives'])
        .controller('DemoCtrl', function ($scope) {
            $scope.header = 'Demo of ovVimeo';
        });

})();