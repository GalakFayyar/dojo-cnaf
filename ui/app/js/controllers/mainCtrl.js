(function () {
    'use strict';

    angular.module('appGeoCaf').controller('MainCtrl', MainCtrl);

    MainCtrl.$inject = ['$scope', '$rootScope', '$filter', '$timeout', '$compile', '$routeParams', '$modal', 'ngProgress', 'geoCafConfig', 'AppCafServices', 'AppBanServices'];
    function MainCtrl($scope, $rootScope, $filter, $timeout, $compile, $routeParams, $modal, ngProgress, geoCafConfig, AppCafServices, AppBanServices) {
        // Définition des variables AngularJS pour l'outil
        $scope.lang = "fr";
        $scope.version = geoCafConfig.version;
        $scope.loading = { value: false };
        $scope.filtres = {};
        $scope.display = {
            legend: false
        };
        $scope.markers = [];
        $scope.alerts = [];

        var basemap = L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        });

        var markers = {
            agence: { color: 'blue', icon: 'building' },
            antenne: { color: 'brown', icon: 'wifi' },
            centre_des_impots: { color: 'magenta', icon: 'money' },
            //cpam: { color: 'cyan', icon: 'cab' },
            mairie: { color: 'purple', icon: 'institution' },
            permanence: { color: 'orange', icon: 'id-card' },
            //pole_emploi: { color: 'green', icon: 'user-plus' },
            allocataire: { color: 'green', icon: 'user' }
        }

        // Paramétrage et définition de la map Leaflet
        var map = new L.Map('map', {
            layers: [basemap],
            center: [48.853, 2.35],
            zoom: 13,
            zoomControl: false
        });
        L.control.zoom({ position: 'topright' }).addTo(map);

        // Suppression des marqueurs passés en paramètre
        var unload_markers = function (list_markers) {
            list_markers.forEach(function (marker) {
                if (marker && marker != $scope.markers_selected) {
                    map.removeLayer(marker);
                }
            });
        };

        var load_data = function (_adresse) {
            AppBanServices.locateAllocataire({ address: _adresse }, function (results) {
                console.log(results);
                var _tmp_data = {
                    AdresseComplete: results.features[0].properties.label,
                    X: results.features[0].geometry.coordinates[1],
                    Y: results.features[0].geometry.coordinates[0]
                }
                load_marker(_tmp_data, 'allocataire');
                $rootScope.ngProgress.complete();
            }, function (error) {
                $rootScope.ngProgress.reset();
                console.error('Erreur load_data(): ', error);
            });
        }

        var load_marker = function (result, marker_style) {
            var content = null;
            if (marker_style != 'allocataire') {
                content = '<table>' +
                    '			<thead>' +
                    '				<tr>' +
                    '					<th colspan=2 style="white-space:nowrap;"><h2>' + result.Nom + '</h2></th>' +
                    '				</tr>' +
                    '			</thead>' +
                    '			<tbody>' +
                    '				<tr>' +
                    '					<td>Type d\'accueil</td><td>' + result.Type_Libelle + '</td><td></td>' +
                    '				</tr>' +
                    '				<tr>' +
                    '					<td>Adresse</td><td>' + result.Adresse + '</td><td></td>' +
                    '				</tr>' +
                    '					<tr>' +
                    '					<td>Ville</td><td>' + result.Ville + ' ' + result.CodePostal + '</td>' +
                    '				</tr>' +
                    '				<thead>' +
                    '					<tr>' +
                    '						<th colspan=2>MODALITE d\'ACCUEIL</th> ' +
                    '					</tr>' +
                    '				</thead>' +
                    '				<tr>' +
                    '					<td>Jours d\'ouverture</td><td>Lun - Mar - Mer - Jeu - Ven</td>' +
                    '				</tr>' +
                    '				<tr>' +
                    '					<td>Heures d\'ouverture</td><td>8h30 - 16h00</td>' +
                    '				</tr>' +
                    '				<tr>' +
                    '					<td>Acces internet</td><td>OUI</td><td></td>' +
                    '				</tr>' +
                    '				<tr>' +
                    '					<td>Accompagnement Web</td><td>OUI</td>' +
                    '				</tr>' +
                    '				<tr>' +
                    '					<td>Borne interactive</td><td>NON</td>' +
                    '				</tr>' +
                    '				<tr>' +
                    '					<td>Impression - scan</td><td>OUI</td>' +
                    '				</tr>' +
                    '				<thead>' +
                    '					<tr>' +
                    '						<th colspan=2>AFFLUENCE</th>' +
                    '					</tr>' +
                    '				</thead>' +
                    '				<tr>' +
                    '					<td colspan=2><img src="img/affluence.png" alt="plage affluence" width="350" /></td>' +
                    '				</tr>';
                    if (marker_style == 'agence') {
                        content += "<tr><td><button>Prendre un rendez-vous</button></td></tr>";
                    }
                    content += '			</tbody>' +
                    '		</table>';
            } else {
                content = '<b style="white-space:nowrap;">Vous êtes ici</b>';
            }

            var customMarker = null;

            if (marker_style == 'pole_emploi') {
                customMarker = L.icon({
                    iconUrl: 'img/pole_emploi.png'
                });
            } else if (marker_style == 'cpam') {
                customMarker = L.icon({
                    iconUrl: 'img/cpam.png'
                });
            } else {
                customMarker = L.AwesomeMarkers.icon({
                    icon: markers[marker_style].icon,
                    markerColor: markers[marker_style].color,
                    prefix: 'fa',
                    iconColor: 'white'
                });
            }

            if (result.X && result.Y) {
                var marker = L.marker([result.X, result.Y], {
                    icon: customMarker,
                    zIndexOffset: (marker_style != 'allocataire') ? 500 : 700
                }).addTo(map);

                var linkFunction = $compile(angular.element(content)),
                    newScope = $scope.$new();

                var markerPopup = marker.bindPopup(linkFunction(newScope)[0], {
                    maxWidth: "auto",
                    closeButton: true
                });

                if (marker_style == 'allocataire') {
                    map.setView([result.X, result.Y]);
                    markerPopup.openPopup();
                }
            }
        }

        var getDataAllocataire = function () {
            // Appel API CAF
            AppCafServices.getAllocataire({}, function (result) {
                console.log("getDataAllocataire:", result);
                load_data(result.AdresseComplete);
                $rootScope.ngProgress.complete();
            }, function (error) {
                $rootScope.ngProgress.reset();
                console.error('Erreur appel au service : ', error);
            });
        }

        var getDataPOI = function () {
            var filtre = $routeParams.filtre;
            if (filtre) {
                AppCafServices.getFilteredPoi({ filtre: filtre }, function (results) {
                    console.log("getFilteredDataPOI:", results);
                    angular.forEach(results, function (result, key) {
                        load_marker(result, result.Type);
                    });

                    $rootScope.ngProgress.complete();
                }, function (error) {
                    $rootScope.ngProgress.reset();
                    console.error('Erreur appel au service : ', error);
                });
            } else {
                AppCafServices.getPoi({}, function (results) {
                    console.log("getDataPOI:", results);
                    angular.forEach(results, function (result, key) {
                        load_marker(result, result.Type);
                    });

                    $rootScope.ngProgress.complete();
                }, function (error) {
                    $rootScope.ngProgress.reset();
                    console.error('Erreur appel au service : ', error);
                });
            }
        }
        
        getDataAllocataire();
        getDataPOI();
    }
})();