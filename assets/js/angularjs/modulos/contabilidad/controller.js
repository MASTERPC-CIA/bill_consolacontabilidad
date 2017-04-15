app.controller('diarioCtrl', function ($scope, Data, $filter) {
    $scope.fechaIni = $filter('date')(new Date(), 'yyyy-MM-dd');
    $scope.fechaFin = $filter('date')(new Date(), 'yyyy-MM-dd');
    $scope.selectedCta = '';
    $scope.selectedTipoComprobante = '';
    $scope.num_doc = '';
    $scope.num_asiento = '';
    $scope.selectedCliente = '';
    $scope.selectedProveedor = '';
    $scope.selectedEmpleado = '';

    Data.post('all_ctas').then(function (data) {
        $scope.ctas = data;
    });

    Data.post('all_comprobantes').then(function (data) {        
        $scope.comprobantes = data;
    });

    Data.post('all_empleados').then(function (data) {
        $scope.empleados = data;
    });

    Data.post('all_proveedores').then(function (data) {
        $scope.proveedores = data;
    });

    /*Data.post('all_clientes').then(function (data) {
        $scope.clientes = data;
    });*/

    $scope.$broadcast('angucomplete-alt:changeInput', 'ex2', 'Hello!');

    $scope.inputChanged = function () {
    };

    $scope.quit_cta = function () {
        $scope.$broadcast('angucomplete-alt:clearInput','ex1');
    };

    $scope.quit_cli = function () {
        $scope.$broadcast('angucomplete-alt:clearInput','ex2');
    };

    $scope.quit_pro = function () {
        $scope.$broadcast('angucomplete-alt:clearInput','ex3');
    };

    $scope.buscar = function () {
        var cta = '';
        var cliente = '';
        var proveedor = '';
        if(($scope.selectedCta!='')&&(!angular.isUndefined($scope.selectedCta))&&(!angular.isUndefined($scope.selectedCta.originalObject))){
            cta = $scope.selectedCta.originalObject.cod;
        }
        if(($scope.selectedCliente!='')&&(!angular.isUndefined($scope.selectedCliente))&&(!angular.isUndefined($scope.selectedCliente.originalObject))){
            cliente = $scope.selectedCliente.originalObject.cod;
        }
        if(($scope.selectedProveedor!='')&&(!angular.isUndefined($scope.selectedProveedor))&&(!angular.isUndefined($scope.selectedProveedor.originalObject))){
            proveedor = $scope.selectedProveedor.originalObject.cod;
        }
        send = {
            'fechaIni':$scope.fechaIni,
            'fechaFin':$scope.fechaFin,
            'cta':cta,
            'comprobante':$scope.selectedTipoComprobante,
            'secuencia':$scope.num_doc,
            'asiento':$scope.num_asiento,
            'cliente':cliente,
            'proveedor':proveedor,
            'empleado':$scope.selectedEmpleado,
        }
        Data.post('buscar', send).then(function (data) {
            if(data.asientos.length > 0){
                $scope.ver_consulta = 1;
                $scope.encabezado = data.encabezado;
                $scope.asientos = data.diario;
            }else{
                $scope.ver_consulta = 0;
            }
        });
    };

    $scope.set_color = function (total) {
        var color_send;
        if(total != 0){
            color_send = 'red';
        }else{
            color_send = 'white';
        }
        return {'background-color': color_send};
    };

    $scope.update_debito = function (id, valor) {
        send = {'id':id,'valor':valor};
        Data.put('update_debito', send).then(function (data) {
            if(data>0){
                Data.toast({"status":"ok","message":"SE HA MODIFICADO"});
            }else{
                Data.toast({"status":"error","message":"NO SE HA REALIZADO NINGUN CAMBIO"});
            }
        });
    };

    $scope.update_credito = function (id, valor) {
        send = {'id':id,'valor':valor};
        Data.put('update_credito', send).then(function (data) {
            if(data>0){
                Data.toast({"status":"ok","message":"SE HA MODIFICADO"});
            }else{
                Data.toast({"status":"error","message":"NO SE HA REALIZADO NINGUN CAMBIO"});
            }
        });
    };

    $scope.update_ctas = function (id, valor) {
        send = {'id':id,'valor':valor};
        Data.put('update_ctas', send).then(function (data) {
            if(data>0){
                Data.toast({"status":"ok","message":"SE HA MODIFICADO"});
            }else{
                Data.toast({"status":"error","message":"NO SE HA REALIZADO NINGUN CAMBIO"});
            }
        });
    };
});

app.controller('mayorCtrl', function ($scope, Data, $filter, $location) {
    $scope.fechaIni = $filter('date')(new Date(), 'yyyy-MM-dd');
    $scope.fechaFin = $filter('date')(new Date(), 'yyyy-MM-dd');
    $scope.selectedCta = '';

    Data.post('all_ctas').then(function (data) {
        $scope.ctas = data;
    });

    $scope.$broadcast('angucomplete-alt:changeInput', 'ex2', 'Hello!');

    $scope.inputChanged = function () {
    };

    $scope.quit_cta = function () {
        $scope.$broadcast('angucomplete-alt:clearInput','ex1');
    };

    $scope.buscar_con_saldo = function () {
        var cta = '';
        if(($scope.selectedCta!='')&&(!angular.isUndefined($scope.selectedCta))&&(!angular.isUndefined($scope.selectedCta.originalObject))){
            cta = $scope.selectedCta.originalObject.cod;
        }
        send = {
            'fechaIni':$scope.fechaIni,
            'fechaFin':$scope.fechaFin,
            'cta':cta
        }
        Data.post('buscar_con_saldo', send).then(function (data) {
            if(data.mayor.query.length > 0){
                $scope.ver_consulta = 1;
                $scope.encabezado = data.encabezado;
                $scope.asientos = data.mayor;
            }else{
                $scope.ver_consulta = 0;
            }
        });
    };

    $scope.buscar_sin_saldo = function () {
        var cta = '';
        if(($scope.selectedCta!='')&&(!angular.isUndefined($scope.selectedCta))&&(!angular.isUndefined($scope.selectedCta.originalObject))){
            cta = $scope.selectedCta.originalObject.cod;
        }
        send = {
            'fechaIni':$scope.fechaIni,
            'fechaFin':$scope.fechaFin,
            'cta':cta
        }
        Data.post('buscar_sin_saldo', send).then(function (data) {
            if(data.mayor.query.length > 0){
                $scope.ver_consulta = 1;
                $scope.encabezado = data.encabezado;
                $scope.asientos = data.mayor;
            }else{
                $scope.ver_consulta = 0;
            }
        });
    };

    $scope.set_color = function (total) {
        var color_send;
        if(total != 0){
            color_send = 'red';
        }else{
            color_send = 'white';
        }
        return {'background-color': color_send};
    };

    $scope.update_debito = function (id, valor) {
        send = {'id':id,'valor':valor};
        Data.put('update_debito', send).then(function (data) {
            if(data>0){
                Data.toast({"status":"ok","message":"SE HA MODIFICADO"});
            }else{
                Data.toast({"status":"error","message":"NO SE HA REALIZADO NINGUN CAMBIO"});
            }
        });
    };

    $scope.update_credito = function (id, valor) {
        send = {'id':id,'valor':valor};
        Data.put('update_credito', send).then(function (data) {
            if(data>0){
                Data.toast({"status":"ok","message":"SE HA MODIFICADO"});
            }else{
                Data.toast({"status":"error","message":"NO SE HA REALIZADO NINGUN CAMBIO"});
            }
        });
    };

    $scope.update_ctas = function (id, valor) {        
        send = {'id':id,'valor':valor};
        Data.put('update_ctas', send).then(function (data) {
            if(data>0){
                Data.toast({"status":"ok","message":"SE HA MODIFICADO"});
            }else{
                Data.toast({"status":"error","message":"NO SE HA REALIZADO NINGUN CAMBIO"});
            }
        });
    };

    $scope.export_pdf = function () {
        $location.path('/pdf');
    };
});

app.controller('estadoCtrl', function ($scope, Data, $filter) {
    $scope.fechaIni = $filter('date')(new Date(), 'yyyy-MM-dd');
    $scope.fechaFin = $filter('date')(new Date(), 'yyyy-MM-dd');
    $scope.total_ventas = 0;
    $scope.costo_ventas = 0;
    $scope.utilidad_bruta_ventas = 0;
    $scope.gastos = [];
    $scope.otros_in = 0;
    $scope.otros_gastos = 0;
    $scope.utilidad = 0;
    $scope.ver_consulta = 0;

    $scope.consultar = function () {
        $scope.fechaIni = $filter('date')($scope.fechaIni, 'yyyy-MM-dd');
        $scope.fechaFin = $filter('date')($scope.fechaFin, 'yyyy-MM-dd');
        send = {fechaIni:$scope.fechaIni,fechaFin:$scope.fechaFin};
        Data.post('estado_pyg',send).then(function (data) {
            $scope.ver_consulta = 1;
            $scope.encabezado = data.encabezado;
            $scope.ventas = data.ventas.query;
            $scope.ventas_total = data.ventas.total;
            $scope.gastos = data.gastos.query;
            $scope.gastos_total = data.gastos.total;
            $scope.utilidad = data.utilidad;
        });
    };

    $scope.ocultar = function(nodo){
        angular.forEach($scope.ventas, function(venta, key) {
          if((venta.cod.indexOf(nodo.cod))&&(venta.color === 0)){
            if(nodo.show === 1){
                nodo.show = 0;
            }else{
                nodo.show = 1;
            }
          }
        });
    };

    $scope.color_nodos = function (valor) {
        var color_send;
        if(valor === 1){
            color_send = 'bold';
        }
        return {'font-weight': color_send};
    }; 
});

app.controller('pdfCtrl', function ($scope, Data, $filter) {
    var cta = '';
    if(($scope.selectedCta!='')&&(!angular.isUndefined($scope.selectedCta))&&(!angular.isUndefined($scope.selectedCta.originalObject))){
        cta = $scope.selectedCta.originalObject.cod;
    }
    send = {
        'fechaIni':$scope.fechaIni,
        'fechaFin':$scope.fechaFin,
        'cta':cta
    }
    Data.post('buscar', send).then(function (data) {
        if(data.mayor.query.length > 0){
            $scope.ver_consulta = 1;
            $scope.encabezado = data.encabezado;
            $scope.asientos = data.mayor;
        }else{
            $scope.ver_consulta = 0;
        }
    });
});

app.controller('generalCtrl', function ($scope, Data, $filter) {
    $scope.fechaIni = $filter('date')(new Date(), 'yyyy-MM-dd');
    $scope.fechaFin = $filter('date')(new Date(), 'yyyy-MM-dd');
    $scope.ver_consulta = 0;
    $scope.total_activos = 0;
    $scope.total_pasivo = 0;
    $scope.total_patrimonio = 0;
    $scope.total = 0;
    $scope.estado = 0;

    $scope.consultar = function () {
        $scope.fechaIni = $filter('date')($scope.fechaIni, 'yyyy-MM-dd');
        $scope.fechaFin = $filter('date')($scope.fechaFin, 'yyyy-MM-dd');
        send = {fechaIni:$scope.fechaIni,fechaFin:$scope.fechaFin};
        Data.post('armar_general',send).then(function (data) {
            $scope.encabezado = data.encabezado;
            $scope.activos = data.activo.query;
            $scope.total_activos = data.activo.total;
            $scope.pasivos = data.pasivo.query;
            $scope.total_pasivo = data.pasivo.total;
            $scope.patrimonios = data.patrimonio.query;
            $scope.estado = data.estado;
            $scope.total_patrimonio = parseFloat(data.patrimonio.total) + parseFloat($scope.estado);
            $scope.total = parseFloat($scope.total_pasivo) + parseFloat($scope.total_patrimonio);
            if(($scope.total_activos > 0) || ($scope.total_pasivo > 0) || ($scope.total_patrimonio > 0) || ($scope.total > 0)){
                $scope.ver_consulta = 1;
            }
        });
    };

    $scope.detalle = function () {
        angular.forEach($scope.activos, function (activo) {
             if(activo.tipo === 0){
                if(activo.ver === 1){
                    activo.ver = 0;
                }else{
                    activo.ver = 1;
                }
             }
         });
        angular.forEach($scope.pasivos, function (pasivo) {
             if(pasivo.tipo === 0){
                if(pasivo.ver === 1){
                    pasivo.ver = 0;
                }else{
                    pasivo.ver = 1;
                }
             }
         });
        angular.forEach($scope.patrimonios, function (patrimonio) {
             if(patrimonio.tipo === 0){
                if(patrimonio.ver === 1){
                    patrimonio.ver = 0;
                }else{
                    patrimonio.ver = 1;
                }
             }
         });
    };

    $scope.color_nodos = function (valor) {
        var color_send;
        if(valor === 1){
            color_send = 'bold';
        }
        return {'font-weight': color_send};
    }; 
});