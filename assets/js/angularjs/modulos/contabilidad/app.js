var app = angular.module('appContabilidad', ['angularUtils.directives.dirPagination','ngRoute','ui.bootstrap', 'toaster', 'ngAnimate','ngLoadingSpinner', 'angucomplete-alt','xeditable']);

app.config(function($routeProvider) {
  $routeProvider
      .when('/', {
        //title: 'Products',
        templateUrl: 'diario/index',
        controller: 'diarioCtrl'
      })
      .when('/estado', {
        //title: 'Products',
        templateUrl: 'estado/index',
        controller: 'estadoCtrl'
      })
      .when('/bancos', {
        //title: 'Products',
        templateUrl: 'bancos/index',
        /*controller: 'estadoCtrl'*/
      })
      .when('/login', {
        //title: 'Products',
        templateUrl: 'mayor/login',
        /*controller: 'estadoCtrl'*/
      })
      .when('/pdf', {
        //title: 'Products',
        templateUrl: 'mayor/export_to_pdf',
        controller: 'pdfCtrl'
      })
      .otherwise({ redirectTo: '/' });
});