var app = angular.module('appBarcode', ['ngRoute','ui.bootstrap','ngAnimate']);

app.config(function($routeProvider) {
  $routeProvider
      .when('/', {
        //title: 'Products',
        templateUrl: 'etiquetas/load_transferencia'
        //controller: 'list_price_x_group'
      })
      .when('/producto', {
        //title: 'Products',
        templateUrl: 'etiquetas/load_producto_cantidad',
        controller: 'ctrlProductCant'
      })
      .when('/grupo', {
        //title: 'Products',
        templateUrl: 'etiquetas/load_grupo_producto'
        //controller: 'devolucion'
      })
      .when('/compra', {
        //title: 'Products',
        templateUrl: 'etiquetas/load_factura_compra'
        //controller: 'ingreso'
      })
      .when('/ajusteentrada', {
        //title: 'Products',
        templateUrl: 'etiquetas/load_imprimir_ajuste'
        //controller: 'ingreso'
      })
      .when('/ajusteentradazebra', {
        //title: 'Products',
        templateUrl: 'etiquetas/load_imprimir_ajuste_zebra'
        //controller: 'devolucion'
      })
      .when('/comprazebra', {
        //title: 'Products',
        templateUrl: 'etiquetas/load_factura_compra_zebra'
        //controller: 'devolucion'
      })

      .when('/img', {
        //title: 'Products',
        templateUrl: 'etiquetas/load_img'
        //controller: 'devolucion'
      })
      .otherwise({ redirectTo: '/' });
});