var app = angular.module('appVentas', ['ngLoadingSpinner','angularUtils.directives.dirPagination','ngRoute','ui.bootstrap','ngProgress','ngAnimate','toaster','ngTouch','angucomplete-alt']);
app.config(function($routeProvider) {
  $routeProvider
  	.when('/', {
	    templateUrl: 'ventasjs/load_main'
	})
	.when('/login', {
	    templateUrl: 'ventasjs/load_login'
	})
	.otherwise({ redirectTo: '/' });
});