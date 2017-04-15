var app = angular.module('appLiquidacion', ['angularUtils.directives.dirPagination','ngRoute','ui.bootstrap','ngAnimate','ngLoadingSpinner']);

app.config(function($routeProvider) {
  $routeProvider
      .when('/price_x_group', {
        //title: 'Products',
        templateUrl: 'index/load_list_price_x_group',
        controller: 'list_price_x_group'
      })
      .when('/fact_hosp', {
        //title: 'Products',
        templateUrl: 'index/load_facturas_hospitalizacion',
        controller: 'facturas_hospitalizacion'
      })
      .when('/devolucion', {
        //title: 'Products',
        templateUrl: 'index/load_devolucion',
        controller: 'devolucion'
      })
      .when('/ingreso', {
        //title: 'Products',
        templateUrl: 'index/load_ingreso',
        controller: 'ingreso'
      })
      .when('/compras', {
        //title: 'Products',
        templateUrl: 'compras/load_compras',
        //controller: 'ingreso'
      })
      
      .when('/ventas_utilidad', {
        //title: 'Products',
        templateUrl: 'ventas/load_ventas_utilidad',
        //controller: 'devolucion'
      })
      .when('/ventas_efectivo', {
        //title: 'Products',
        templateUrl: 'ventas/load_ventas_efectivo',
        //controller: 'devolucion'
      })
      .when('/inventario_anterior', {
        //title: 'Products',
        templateUrl: 'index/load_inventario_anterior',
        //controller: 'devolucion'
      })
    .otherwise({ redirectTo: '/' });
});