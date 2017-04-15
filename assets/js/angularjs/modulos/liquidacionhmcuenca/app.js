var app = angular.module('appLiquidacionhmcuenca', ['angularUtils.directives.dirPagination','ngRoute','ui.bootstrap','ngAnimate','ngLoadingSpinner']);

app.config(function($routeProvider) {
  $routeProvider
           
     //Hospital Militar de Cuenca
      .when('/inv_exist_hmc', {
        //title: 'Products',
        templateUrl: 'index/load_prod_x_group_hmc',
        controller: 'ctrl_product_x_group'
      })
      .when('/resumen_comp_vent', {
        templateUrl: 'resumen_comp_vent/load_resumen_view',
      })
       .when('/compras', {
        //title: 'Products',
        templateUrl: 'compras/load_compras',
        //controller: 'ingreso'
      })
      
      .when('/ing_dev', {
        templateUrl: 'ingresos_devoluc/load_search_ing_dev',
      })
      .when('/fact_hosp_hmc', {
        templateUrl: 'facturas_hospit_hmc/load_facturas_hospit',

      })
      //Liquidacion por servicio-departamento
      .when('/inventario_prod', {
        templateUrl: 'index/load_prod_x_servicio_hmc',
        controller:'ctrl_product_x_servicio'

      })
      
      .when('/liqui_servicio', {
        templateUrl: 'liquid_general/liquidacion_general/load_view_search_liquid_servicio',

      })
      
      .when('/honor_medicos', {
        templateUrl: 'liquid_general/liquidacion_general/load_view_search_honor_medicos',

      })
      .when('/honorario_med', {
        templateUrl: 'index/get_honorarios_medicos',

      })
      
      /*CONSULTA EXTERNA*/
       .when('/hm_consulta', {
         templateUrl: 'honorarios/honorarios_med/hm_cons_ext',
       })
       .when('/hm_servicio', {
         templateUrl: 'honorarios/honorarios_med/hm_servicio',
       })
       .when('/hm_proced', {
         templateUrl: 'honorarios/honorarios_med/hm_proced',
       })
       .when('/hm_h_alta', {
         templateUrl: 'honorarios/honorarios_med/hm_h_alta',
       })
       .when('/hm_quirof', {
         templateUrl: 'honorarios/honorarios_med/hm_quirof',
       })
       
      //Liquidaciones Recaudacion
       .when('/ing_diario', {
        templateUrl: 'recaudacion/liquid_recaudacion/load_view_search_ing_diario',

      })
      //Liquidación Tesoreria
       .when('/rep_int', {
        templateUrl: 'tesoreria/reporte_integrado_ing/load_view_search_reporte_int',

      })
      //Estudio de Antiguedades
       .when('/est_cuentas', {
        templateUrl: 'tesoreria/reporte_estudio_antig/load_view_search_estudio_antig',

      })
        
    .otherwise({ redirectTo: '/' });
});