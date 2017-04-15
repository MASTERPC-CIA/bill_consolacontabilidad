var app = angular.module('appAnexos', ['angularUtils.directives.dirPagination','ngRoute', 'ui.bootstrap','ngAnimate']);
app.config(function($routeProvider) {
    $routeProvider
        .when('/', {
          //title: 'Products',
          templateUrl: 'ats/load_view_ats',
          /*controller: 'atsCtrl'*/
        })
        .when('/view', {
          //title: 'Products',
          templateUrl: 'view/load_view_view'
          //controller: 'atsCtrl'
        })
        .otherwise({
          redirectTo: '/'
        });
});