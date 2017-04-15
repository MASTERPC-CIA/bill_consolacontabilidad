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

app.controller('ctrl_product_x_group', function ($scope, Data, $filter) {
    $scope.grupos = [];
    $scope.fecha_ini = {value: $filter('date')(new Date(), 'yyyy-MM-dd')};
    $scope.fecha_fin = {value: $filter('date')(new Date(), 'yyyy-MM-dd')};

    Data.get('load_grupos_farmacia').then(function (result) {
            $scope.grupos_farm = result;
        });
        
    Data.get('load_bodegas').then(function (result) {
        $scope.bodegas = result;
    });

    $scope.consultar = function (fecha_ini,fecha_fin,bodega,grupo_farm) {

        send = {'fecha_ini':fecha_ini,'fecha_fin':fecha_fin,'bodega':bodega,'grupo_farm':grupo_farm};
        Data.post('list_product_group_hmc',send).then(function (result) {
            $scope.list = result.list;
            $scope.tot_final = result.tot_final;
            $scope.tot_inicial = result.tot_inicial;
            $scope.tot_ingresos = result.tot_ingresos;
            $scope.tot_compras=result.tot_compras;
            $scope.tot_devol = result.tot_devol;
            $scope.tot_ventas=result.tot_ventas;

            $scope.nombre_grupo = result.nombre_grupo.nombre;
            $scope.nombre_bodega = result.nombre_bodega.nombre;
        }); 

    };  
});

app.controller('ctrl_product_x_servicio', function ($scope, Data, $filter) {
    $scope.grupos = [];
    $scope.fecha_ini = {value: $filter('date')(new Date(), 'yyyy-MM-dd')};
    $scope.fecha_fin = {value: $filter('date')(new Date(), 'yyyy-MM-dd')};

         
    Data.get('load_servicios_bodega').then(function (result) {
        $scope.bodegas = result;
    });

    $scope.consultarServ = function (fecha_ini,fecha_fin,bodega) {

        send = {'fecha_ini':fecha_ini,'fecha_fin':fecha_fin,'bodega':bodega};
        Data.post('list_product_serv_hmc',send).then(function (result) {
            
                $scope.list = result.list;
                $scope.tot_final = result.tot_final;
                $scope.tot_inicial = result.tot_inicial;
                $scope.tot_ingresos = result.tot_ingresos;
                $scope.tot_devol = result.tot_devol;
                $scope.tot_ventas=result.tot_ventas;
                $scope.tot_pvp=result.tot_pvp;
                
            
            $scope.nombre_bodega = result.nombre_bodega.nombre;
        }); 

    };  
});