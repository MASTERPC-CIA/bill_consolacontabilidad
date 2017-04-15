var app = angular.module('appTributario', ['angularUtils.directives.dirPagination','ngRoute', 'ui.bootstrap','ngProgress','ngAnimate']);
app.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
        when('/', {
          title: 'Products',
          templateUrl: 'retenciones/tributario',
          controller: 'customersCtrl'
        })
        .otherwise({
          redirectTo: '/'
        });;
}]);