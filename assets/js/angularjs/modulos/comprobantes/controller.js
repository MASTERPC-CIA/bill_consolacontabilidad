app.controller('factCtrl', function ($scope, Data, $filter) {
    $scope.pageSize = 5;
    $scope.currentPage = 1;
    $scope.email_prueba = '';
    $scope.firma = {};
    $scope.autorizadas = 0;
    $scope.rechazadas = 0;
    $scope.restantes = 0;
    $scope.envio = false;

    Data.get('consultar_facturas').then(function (data) {
        $scope.pendientes = data.count;
        $scope.facturas = data.facturas;
        $scope.firma.estado = data.msg[0];
        $scope.firma.emision = $filter('date')(new Date(), data.msg[1]);
        $scope.firma.caducidad = $filter('date')(new Date(), data.msg[2]);
        $scope.firma.dias = data.msg[3];
        $scope.firma.serie = data.msg[4];
        $scope.establecimientos = data.establecimiento;
        $scope.puntosemision = data.pemision;
    });

    $scope.columns = [
                        {text:"CODIGO",predicate:"codigofactventa",sortable:true},
                        {text:"SECUENCIA",predicate:"secuenciafactventa",sortable:true},
                        {text:"ESTABLECIMIENTO",predicate:"secuenciafactventa",sortable:true},
                        {text:"P.EMISION",predicate:"secuenciafactventa",sortable:true},
                        {text:"CEDULA",predicate:"PersonaComercio_cedulaRuc",sortable:true},
                        {text:"CLIENTE",predicate:"nombres",reverse:true,sortable:true},
                        {text:"FECHA",predicate:"fechaCreacion",reverse:true,sortable:true},
                        {text:"VALOR",predicate:"totalCompra",reverse:true,sortable:true},
                        {text:"ACCION",predicate:"",reverse:true,sortable:true}
                    ];

    $scope.columns_resumen = [
                                {text:"CODIGO",predicate:"codigofactventa",sortable:true},
                                {text:"NRO",predicate:"",sortable:true},
                                {text:"CEDULA",predicate:"PersonaComercio_cedulaRuc",sortable:true},
                                {text:"CLIENTE",predicate:"nombres",reverse:true,sortable:true},
                                {text:"FECHA",predicate:"fechaCreacion",reverse:true,sortable:true},
                                {text:"VALOR",predicate:"totalCompra",reverse:true,sortable:true},
                                {text:"ESTADO",predicate:"",reverse:true,sortable:true}
                            ];

    $scope.myMethod = function (newPageNumber) {
        console.log('myMethod'+newPageNumber);
    }; 

    $scope.envio_produccion = function () {
        $scope.facturas_send = [];
        angular.forEach($scope.facturas, function(factura) {
            if(factura.select === true){
                $scope.facturas_send.push(factura);
            }
        });
        $scope.total_facturas = $scope.facturas_send.length;
        if($scope.facturas_send.length===0){
            console.log('VACIO...!!!!');
        }else{
            $scope.autorizadas = 0;
            $scope.rechazadas = 0;
            $scope.restantes = 0;
            $scope.envio = true;
            $scope.facturas_final = [];
            Data.post('envio', $scope.facturas_send).then(function (rta) {
                angular.forEach($scope.facturas_send, function(factura) {
                    Data.post('send_lote', factura).then(function (data) {
                        $scope.facturas_final.push(data);
                        console.log(data.estado_autorizacion);
                        if(data.estado_autorizacion==='AUTORIZADO'){
                            $scope.autorizadas += 1;
                            $scope.pendientes -= 1;
                        }
                        if(data.estado_autorizacion==='DEVUELTA'){
                            $scope.rechazadas += 1;
                        }
                        $scope.restantes += 1;
                    });
                });
            });
        }
    }; 

    /*$scope.$watch('restantes', function() {
        var total = $scope.autorizadas + $scope.pendientes + $scope.rechazadas;
        if(total === $scope.facturas_send){
            Data.post('fin_send_lote',rta).then(function (data) {
                console.log("FIN");
            });        
        }
    });*/

    $scope.$watch('select_all', function() {
        if($scope.select_all===true){
            angular.forEach($scope.facturas, function(factura) {
                factura.select = true;
            });
        }else{
            angular.forEach($scope.facturas, function(factura) {
                factura.select = false;
            });
        }
    });
});