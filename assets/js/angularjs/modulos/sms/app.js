var app = angular.module('appSms', ['angularUtils.directives.dirPagination','ngRoute', 'ui.bootstrap','ngProgress','ngAnimate','ngLoadingSpinner','toaster']);

app.config(function($routeProvider) {
  $routeProvider
      .when('/', {
        //title: 'Products',
        templateUrl: 'index/load_envio',
        controller: 'envioCtrl'
      })
      .when('/clientes', {
        //title: 'Products',
        templateUrl: 'index/load_clientes',
        controller: 'clientesCtrl'
      })
      .when('/proveedores', {
        //title: 'Products',
        templateUrl: 'index/load_proveedores',
        controller: 'proveedoresCtrl'
      })
      .when('/empleados', {
        //title: 'Products',
        templateUrl: 'index/load_empleados',
        controller: 'empleadosCtrl'
      })
      .when('/excel', {
        //title: 'Products',
        templateUrl: 'index/load_excel',
        controller: 'excelCtrl'
      })
      .when('/cxc', {
        //title: 'Products',
        templateUrl: 'index/load_cxc',
        controller: 'cxcCtrl'
      })
      .when('/config', {
        //title: 'Products',
        templateUrl: 'index/load_config',
        controller: 'configCtrl'
      })
      .otherwise({ redirectTo: '/' });
});