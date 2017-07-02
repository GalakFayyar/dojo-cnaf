//'use strict'

//var appGeoCaf = angular.module('geocafApp',[
//	"ngSanitize",
//	"ngProgress",
//	"ngResource",
//	"ui.bootstrap"
//	]).constant('geoCafConfig', {
//        "version": "0.0.1",
//        "apis": {
//            "ban": "https://api-adresse.data.gouv.fr/search/?q="
//        }
//	}
//);

(function () {
    'use strict';

    angular.module('appGeoCaf', [
        "ngRoute",
        "ngSanitize",
        "ngProgress",
        "ngResource",
        "ui.bootstrap",
        'ui.router'
    ]).constant('geoCafConfig', {
        "version": "0.0.1",
        "apis": {
            "ban": "https://api-adresse.data.gouv.fr/search/?q=",
            "caf": "http://caffrmapback20170629041333.azurewebsites.net/api/POI"
        }
    });

    angular.module('appGeoCaf').config(appGeoCafConfiguration);

    //appGeoCafConfiguration.$inject = ['$stateProvider', '$urlRouterProvider', '$locationProvider', '$httpProvider', '$routeProvider', 'geoCafConfig'];
    //function appGeoCafConfiguration($stateProvider, $urlRouterProvider, $locationProvider, $httpProvider, $routeProvider, geoCafConfig) {
    //    // MVC routing patterns
    //    $urlRouterProvider.otherwise('/');	// default route
    //    $stateProvider
    //        /******************************************************************/
    //        .state('app', {
    //            url: '/',
    //            templateUrl: 'index.html',
    //            controller: 'MainController'
    //        })
    //        /******************************************************************/
    //        .state('contact', {
    //            url: '/contact',
    //            views: {
    //                'content': {
    //                    templateUrl: 'views/contact.html',
    //                    controller: 'MainController'
    //                }
    //            },
    //            parent: 'app'
    //        })
    //        /******************************************************************/
    //        .state('carto', {
    //            url: '/carto',
    //            views: {
    //                'content': {
    //                    templateUrl: 'views/carto.html',
    //                    controller: 'MainController'
    //                }
    //            },
    //            parent: 'app'
    //        })
    //        /******************************************************************/
    //        .state('demarche', {
    //            url: '/demarche',
    //            views: {
    //                'content': {
    //                    templateUrl: 'views/demarche.html',
    //                    controller: 'MainController'
    //                }
    //            },
    //            parent: 'app'
    //        });
    //    $locationProvider.hashPrefix('!');

    //    $routeProvider
    //        //.when('/', {
    //        //    templateUrl: 'index.html'
    //        //})
    //        .when('/carto', {
    //            templateUrl: 'carto.html',
    //            controller: 'MainCtrl'
    //        })
    //        .when('/demarche', {
    //            templateUrl: 'views/demarche.html',
    //            controller: 'MainCtrl'
    //        })
    //        .otherwise({
    //            redirectTo: '/'
    //        });
    //}

    appGeoCafConfiguration.$inject = ['$locationProvider', '$routeProvider'];
    function appGeoCafConfiguration($locationProvider, $routeProvider) {
        $routeProvider
            .when('/carto', {
                templateUrl: 'views/carto.html',
                controller: 'MainCtrl'
            })
            .when('/demarche', {
                templateUrl: 'views/demarche.html',
                controller: 'DemarcheCtrl'
            })
            .when('/contact', {
                templateUrl: 'views/contact.html',
                controller: 'ContactCtrl'
            })
            .when('/moncompte', {
                templateUrl: 'views/moncompte.html',
                controller: 'MonCompteCtrl'
            })
            .when('/moncompte2', {
                templateUrl: 'views/moncompte2.html',
                controller: 'MonCompteCtrl'
            })
            .otherwise({
                redirectTo: '/'
            });
    }

    angular.module('appGeoCaf').run(appGeoCafRun);

    appGeoCafRun.$inject = ['$rootScope', 'ngProgressFactory'];
    function appGeoCafRun($rootScope, ngProgressFactory) {
        $rootScope.lang = 'fr';

        $rootScope.ngProgress = ngProgressFactory.createInstance();

        $rootScope.ngProgress.setColor('#000');
        $rootScope.ngProgress.setHeight('3px');
    }
})();