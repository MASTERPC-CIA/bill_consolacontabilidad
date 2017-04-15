var app = angular.module('appVenta_alquiler', ['angucomplete-alt','ngLoadingSpinner','angularUtils.directives.dirPagination','ngRoute','ui.bootstrap','ngProgress','ngAnimate','ngCart','toaster']);

app.config(function($routeProvider) {
  $routeProvider
      /*.when('/', {
        //title: 'Punto Venta',
        templateUrl: 'index/main',
        controller: 'inicio'
      })*/
      .when('/menu', {
        //title: 'Products',
        templateUrl: 'index/load_menu_view',
        controller: 'menu_principal'
      })
      
      .when('/venta', {
        //title: 'Products',
        templateUrl: 'index/main',
        controller: 'inicio'
      })
      .when('/reserva', {
        //title: 'Products',
        templateUrl: 'index/reservar',
        controller: 'reservar'
      })
      
      .when('/alquiler', {
        //title: 'Products',
        templateUrl: 'index/alquiler',
        controller: 'alquiler'
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
        
      .when('/reporte', {
            templateUrl: 'ventas/load_view_search_reporte',
            controller: 'search_reporte'
      })
      .when('/existencias', {
            templateUrl: 'existencias/load_view_search',
            controller: 'existencias'
      })
       .when ('/devolucion',{
           templateUrl: 'devolucion/load_view_search_dev',
           controller: 'search_devolucion'
       })
      .otherwise({ redirectTo: '/alquiler' });
});