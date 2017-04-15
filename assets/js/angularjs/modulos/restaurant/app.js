var app = angular.module('appRestaurant', ['ngLoadingSpinner','angularUtils.directives.dirPagination','ngRoute','ui.bootstrap','ngProgress','ngAnimate','ngCart','toaster']);

app.config(function($routeProvider) {
  $routeProvider
      .when('/', {
        //title: 'Punto Venta',
        templateUrl: 'index/main',
        controller: 'inicio'
      })
      .when('/menu', {
        //title: 'Products',
        templateUrl: 'index/load_menu_view',
        controller: 'menu_principal'
      })
      .when('/submenu', {
        //title: 'Products',
        templateUrl: 'index/load_submenu_view',
        controller: 'submenu'
      })
      .when('/submenu_img', {
        //title: 'Products',
        templateUrl: 'index/load_image',
        controller: 'img_ctrl'
      })
      .when('/grupos_img', {
        //title: 'Products',
        templateUrl: 'index/load_grupos_image',
        controller: 'grupo_img_ctrl'
      })
      .when('/login', {
        templateUrl: 'index/load_login',
      })
      .when('/print/:venta_id', {
        templateUrl: function(params) {
            var url_complete = 'index/load_print/'+params.venta_id;
            return url_complete;
         },
         controller: 'printCtrl'
      })
      .otherwise({ redirectTo: '/' });
});