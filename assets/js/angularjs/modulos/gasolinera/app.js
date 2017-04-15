var app = angular.module('appGasolinera', ['angucomplete-alt','ngLoadingSpinner','angularUtils.directives.dirPagination','ngRoute','ui.bootstrap','ngProgress','ngAnimate','ngCart','toaster']);

app.config(function($routeProvider) {
  $routeProvider
      /*.when('/', {
        templateUrl: 'index/load_checkin',
        controller: 'initCtrl'
      })*/
      .when('/', {
        templateUrl: 'index/load_view_sub_modules',
        controller: 'inicio_submodules'
      })
      .when('/cierrecaja', {
        templateUrl: 'index/load_cierrecaja',
        controller: 'cierrecajaCtrl'
      })
      .otherwise({ redirectTo: '/' });
});