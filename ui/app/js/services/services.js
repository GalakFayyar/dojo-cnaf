(function () {
    'use strict';

    /* Services */
    angular.module('appGeoCaf').factory('AppBanServices', AppBanServices);
    angular.module('appGeoCaf').factory('AppCafServices', AppCafServices);

    AppBanServices.$inject = ['$resource', 'geoCafConfig'];
    function AppBanServices($resource, geoCafConfig) {
        return $resource(geoCafConfig.apis.ban + ':address', {}, {
            locateAllocataire: {
                method: 'GET',
                params: {}
            }
        });
    }

    AppCafServices.$inject = ['$resource', 'geoCafConfig'];
    function AppCafServices($resource, geoCafConfig) {
        return $resource(geoCafConfig.apis.caf + '/:resource/:filtre', {}, {
            getAllocataire: {
                method: 'GET',
                params: {
                    resource: 'getallocataire'
                }
            },
            getPoi: {
                method: 'GET',
                params: {
                    resource: 'getall'
                },
                isArray: true
            },
            getFilteredPoi: {
                method: 'GET',
                params: {
                    resource: 'get'
                },
                isArray: true
            }
        });
    }
})();