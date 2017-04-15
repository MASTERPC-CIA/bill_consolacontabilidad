var app = angular.module('appAdmin', ['ngRoute','ui.bootstrap','toaster','angularUtils.directives.dirPagination','ngAnimate', 'ngTouch',]);

app.config(function($routeProvider, $locationProvider) {
  $locationProvider.hashPrefix('');
  $routeProvider
      .when('/', {
        templateUrl: 'index/load_empresa',
        controller: 'ctrlEmpresa'
      })
      .when('/clientes', {
        templateUrl: 'index/load_clientes',
        controller: 'ctrlClientes'
      })
      .when('/proveedores', {
        templateUrl: 'index/load_proveedores',
        controller: 'ctrlProveedores'
      })
      .when('/pemision', {
        templateUrl: 'index/load_pemision',
        controller: 'ctrlPemision'
      })
      .otherwise({ redirectTo: '/' });
});