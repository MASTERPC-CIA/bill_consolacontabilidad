var app = angular.module('appHotel', ['angucomplete-alt','ngLoadingSpinner','angularUtils.directives.dirPagination','ngRoute','ui.bootstrap','ngProgress','ngAnimate','ngCart','toaster']);

app.config(function($routeProvider) {
  $routeProvider
      /*.when('/', {
        templateUrl: 'index/load_checkin',
        controller: 'initCtrl'
      })*/
      .when('/', {
        templateUrl: 'index/load_view_sub_modules',
        controller: 'inicio_submodules'
      })
      .when('/checkin', {
        templateUrl: 'index/load_checkin',
        controller: 'initCtrl'
      })
      .when('/config_tipohab', {
        templateUrl: 'index/load_config_tipohab',
        controller: 'tipoHabCtrl'
      })
      .when('/config_hab', {
        templateUrl: 'index/load_config_hab',
        controller: 'habCtrl'
      })
      .when('/comandas', {
        templateUrl: 'index/load_comandas',
        controller: 'comandaCtrl'
      })
      .when('/checkout', {
        templateUrl: 'index/load_checkout',
        controller: 'checkoutCtrl'
      })
      .when('/print_checkin', {
        templateUrl: 'index/load_print_checkin',
        controller: 'printCheckinCtrl'
      })
      .when('/edit_checkin', {
        templateUrl: 'index/load_edit_checkin',
        controller: 'editCheckinCtrl'
      })
      .when('/print_comanda', {
        templateUrl: 'index/load_print_comanda',
        controller: 'printComandaCtrl'
      })
      .when('/print_comanda_pdf', {
        templateUrl: 'index/load_print_comanda_pdf',
        controller: 'printComandaCtrl_pdf'
      })
      .when('/list_checkin', {
        templateUrl: 'index/load_list_checkin',
        controller: 'listCheckinCtrl'
      })
      .when('/list_comandas', {
        templateUrl: 'index/load_list_comandas',
        controller: 'listComandasCtrl'
      })
      .otherwise({ redirectTo: '/' });
});