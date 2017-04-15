var app = angular.module('appFactElect', ['angularUtils.directives.dirPagination','ngRoute', 'ui.bootstrap','ngProgress','ngAnimate','ngLoadingSpinner']);
app.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
        when('/', {
          title: 'Products',
          templateUrl: 'factura/inicio',
          controller: 'factCtrl'
        })
        .otherwise({
          redirectTo: '/'
        });;
}]);