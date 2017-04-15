var app = angular.module('appPventa', ['angucomplete-alt','angularUtils.directives.dirPagination','ngRoute','ui.bootstrap','ngProgress','ngAnimate','ngCart','toaster']);/*,'ngLoadingSpinner'*/

app.config(function($routeProvider) {
  $routeProvider
      .when('/', {
        templateUrl: 'index/load_main',
        controller: 'initCtrl'
      })
      .when('/generico', {
        templateUrl: 'index/load_generico',
        controller: 'genericoCtrl'
      })
      .when('/list_ordenes', {
        templateUrl: 'index/list_ordenes',
        controller: 'list_ordenes'
      })
      .when('/submenu_img', {
        templateUrl: 'index/load_image',
        controller: 'img_ctrl'
      })
      .when('/nuevo_producto', {
        templateUrl: 'index/load_product_new'
        //controller: 'genericoCtrl'
      })
      .when('/superproductos', {
        templateUrl: 'index/load_superproductos'
        //controller: 'genericoCtrl'
      })
      .when('/mapa', {
        templateUrl: 'index/load_mapa',
        controller: 'mapaImgCtrl'
      })
      .when('/crear_super', {
        templateUrl: 'index/load_view_superProducto',
        //controller: 'mapaImgCtrl'
      })
      .when('/grupos_img', {
        templateUrl: 'index/load_grupos_image',
        controller: 'grupo_img_ctrl'
      })
      .when('/login', {
        templateUrl: 'index/load_login',
      })
      .when('/recetas', {
        templateUrl: 'index/recetas',
      })
      .when('/print/:venta_id', {
        templateUrl: function(params) {
            var url_complete = 'index/load_print/'+params.venta_id;
            return url_complete;
         },
         controller: 'printCtrl'
      })
      
      .when('/admin_mesas', {
        templateUrl: 'index/load_admin_mesas',
        controller: 'mesaCtrl'
      })
    .when('/print_comanda/:comanda_id', {
//        templateUrl: 'index/load_print_comanda',
//        controller: 'printComandaCtrl'
        templateUrl: function(params) {
            var url_complete = 'index/load_print_comanda/'+params.comanda_id;
            return url_complete;
        },
      })
      
      .when('/edit_comanda/:comanda_id', {
          templateUrl: function(params) {
            var url_complete = 'index/load_edit_comanda/'+params.comanda_id;
            return url_complete;
        },
        controller: 'editComandaCtrl'
      })
      
      .otherwise({ redirectTo: '/' });
});