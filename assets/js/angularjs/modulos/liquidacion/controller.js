app.controller('list_price_x_group', function ($scope, Data, MyService, $http, $filter) {
    $scope.grupos = [];
    $scope.fecha_ini = {value: $filter('date')(new Date(), 'yyyy-MM-dd')};

    Data.get('load_bodegas').then(function (result) {
            $scope.bodegas = result;
        });

    $scope.consultar = function (bodega,fecha_ini) {
        send = {'fecha_ini':fecha_ini,'bodega':bodega};
        send_bodega = {'bodega':bodega};
        Data.post('find_bodega_x_id',send_bodega).then(function (result) {
            $scope.nombre_bodega = result.nombre;
        });
        Data.post('list_product_x_group',send).then(function (result) {
            $scope.grupos = result.list;
            $scope.total = result.total;
            $scope.subtotal = result.subtotal;
            $scope.iva = result.iva;
            $scope.total_iva0 = result.total_iva0;
            $scope.total_iva12 = result.total_iva12;
            $scope.costo_total = result.costo_total;
        });  
    };  
});

app.controller('facturas_hospitalizacion', function ($scope, Data, MyService, $http, $filter) {
    $scope.total = [];

    $scope.fecha_ini = {value: $filter('date')(new Date(), 'yyyy-MM-dd')};
    $scope.fecha_fin = {value: $filter('date')(new Date(), 'yyyy-MM-dd')};
    
    Data.get('load_bodegas').then(function (result) {
        $scope.bodegas = result;
    });
    $scope.consultar = function (bodega) {
        fecha_ini = $filter('date')($scope.fecha_ini.value, "yyyy-MM-dd");
        fecha_fin = $filter('date')($scope.fecha_fin.value, "yyyy-MM-dd");
        send = {'fecha_ini':fecha_ini,'fecha_fin':fecha_fin,'bodega':bodega};
        send_bodega = {'bodega':bodega};
        Data.post('find_bodega_x_id',send_bodega).then(function (result) {
            $scope.nombre_bodega = result.nombre;
        });
        Data.post('consulta_facturas_hospitalizacion',send).then(function (result) {
            if(result.query != 0){
                if(!angular.isUndefined(result.total)){
                    $scope.facturas = result.query;
                    $scope.total.iva_doce = parseFloat(result.total[0].iva_doce).toFixed(2);
                    $scope.total.iva_cero = parseFloat(result.total[0].iva_cero).toFixed(2);
                    $scope.total.iva = parseFloat(result.total[0].iva).toFixed(2);
                    $scope.total.recargo = parseFloat(result.total[0].recargo).toFixed(2);
                    $scope.total.valor_total = parseFloat(result.total[0].valor_total).toFixed(2);
                }
            }
        }); 
    };   

    $scope.columns = [
                        {text:"Ref.",predicate:"codigofactventa",sortable:true},
                        {text:"Fecha",predicate:"codigofactventa",sortable:true},
                        {text:"Tipo y No.",predicate:"codigofactventa",sortable:true},
                        {text:"Cliente",predicate:"codigofactventa",reverse:true,sortable:true},
                        {text:"Subt. IVA 12 %",predicate:"codigofactventa",reverse:true,sortable:true},
                        {text:"Subt. IVA 0 %",predicate:"codigofactventa",reverse:true,sortable:true},
                        {text:"IVA %",predicate:"codigofactventa",reverse:true,sortable:true},
                        {text:"Recargo",predicate:"codigofactventa",reverse:true,sortable:true},
                        {text:"Total",predicate:"codigofactventa",sortable:false}
                    ];
});

app.controller('devolucion', function ($scope, Data, $filter) {
    $scope.fecha_ini = {value: $filter('date')(new Date(), 'yyyy-MM-dd')};
    $scope.fecha_fin = {value: $filter('date')(new Date(), 'yyyy-MM-dd')};
    $scope.total = [];
    Data.get('load_bodegas').then(function (result) {
        $scope.bodegas = result;
    });
    $scope.consultar = function (bodega) {
        fecha_ini = $filter('date')($scope.fecha_ini.value, "yyyy-MM-dd");
        fecha_fin = $filter('date')($scope.fecha_fin.value, "yyyy-MM-dd");
        send = {'fecha_ini':fecha_ini,'fecha_fin':fecha_fin,'bodega':bodega};
        send_bodega = {'bodega':bodega};
        Data.post('find_bodega_x_id',send_bodega).then(function (result) {
            $scope.nombre_bodega = result.nombre;
        });
        Data.post('consulta_devoluciones',send).then(function (result) {
            if(result.query.length > 0){
                $scope.facturas = result.query;
                $scope.suma = result.suma;
                $scope.admin_farmacia = result.firma.admin_farmacia;
                $scope.contador = result.firma.contador;
                $scope.jefe_farmacia = result.firma.jefe_farmacia;
                $scope.jefe_financiero = result.firma.jefe_financiero;
                $scope.jefe_logistica = result.firma.jefe_logistica;
                $scope.director = result.firma.director;
            }else{
                $scope.facturas = [];
                $scope.suma = [];
            }
        }); 
    };   

    $scope.columns = [
                        {text:"Fecha",predicate:"fecha",sortable:true},
                        {text:"Nombre",predicate:"nombre",sortable:true},
                        {text:"Subtotal",predicate:"subtotal",sortable:true},
                        {text:"IVA",predicate:"iva",reverse:true,sortable:true},
                        {text:"Total",predicate:"total",reverse:true,sortable:true}
                    ];
});

app.controller('ingreso', function ($scope, Data, $filter) {
    $scope.fecha_ini = {value: $filter('date')(new Date(), 'yyyy-MM-dd')};
    $scope.fecha_fin = {value: $filter('date')(new Date(), 'yyyy-MM-dd')};
    $scope.total = [];
     Data.get('load_bodegas').then(function (result) {
        $scope.bodegas = result;
    });
    $scope.consultar = function (bodega) {
        fecha_ini = $filter('date')($scope.fecha_ini.value, "yyyy-MM-dd");
        fecha_fin = $filter('date')($scope.fecha_fin.value, "yyyy-MM-dd");
        send = {'fecha_ini':fecha_ini,'fecha_fin':fecha_fin,'bodega':bodega};
        send_bodega = {'bodega':bodega};
        Data.post('find_bodega_x_id',send_bodega).then(function (result) {
            $scope.nombre_bodega = result.nombre;
        });
        Data.post('consulta_ingresos',send).then(function (result) {
            if(result.query.length > 0){
                $scope.facturas = result.query;
                $scope.suma = result.suma;
                $scope.admin_farmacia = result.firma.admin_farmacia;
                $scope.contador = result.firma.contador;
                $scope.jefe_farmacia = result.firma.jefe_farmacia;
                $scope.jefe_financiero = result.firma.jefe_financiero;
                $scope.jefe_logistica = result.firma.jefe_logistica;
                $scope.director = result.firma.director;
            }else{
                $scope.facturas = [];
                $scope.suma = [];
            }
        }); 
    };   

    $scope.columns = [
                        {text:"Fecha",predicate:"fecha",sortable:true},
                        {text:"Nombre",predicate:"nombre",sortable:true},
                        {text:"Subtotal",predicate:"subtotal",sortable:true},
                        {text:"IVA",predicate:"iva",reverse:true,sortable:true},
                        {text:"Total",predicate:"total",reverse:true,sortable:true}
                    ];
});
