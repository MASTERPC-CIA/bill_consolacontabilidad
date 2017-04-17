var app = angular.module('app_main', ['ngRoute', 'ui.bootstrap']);

app.config(function($routeProvider) {
  $routeProvider
      .when('/', {
        templateUrl: 'welcome/load_login',
        controller: 'ctrl_login'
      })

      .when('/clientes', {
        templateUrl: 'welcome/load_main',
        controller: 'ctrl_main'
      })

      .otherwise({ redirectTo: '/' });
});