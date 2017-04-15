app.controller('ctrlEmpresa', function ($scope, Data, $location) {
    console.log('hola mundo');
});

app.controller('ctrlClientes', function ($scope, Data, $location, $uibModal, $interval, $http, MyService) {
    $scope.clientes = [];
    $scope.totalUsers = 0;
    $scope.usersPerPage = 10; // this should match however many results your API puts on one page
    getResultsPage(1);

    $scope.pagination = {
        current: 1
    };

    $scope.pageChanged = function(newPage) {
        getResultsPage(newPage);
    };

    function getResultsPage(pageNumber) {
        // this is just an example, in reality this stuff should be in a service
        /*$http.get('path/to/api/users?page=' + pageNumber)*/
        Data.get('cliente/','all').then(function (result) {
            $scope.clientes = result.query;
            $scope.totalUsers = result.query.Count
        });
    }

    $scope.exportData = function () {
        alasql('SELECT * INTO XLSX("reporte_clientes.xlsx",{headers:true}) FROM ?',[$scope.clientes]);
    };

    Data.get('cliente/','all').then(function (result) {
        $scope.clientes = result.query;
    });

    $scope.mensaje = function(){
        console.log('entro');
        Data.toast({"status": "error", "message": "LA FACTURA ESTA VACIA...!!!!!!!!!!"});
    }

    $scope.nuevo = function(){
        var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'cliente/load_admin_cliente',
                controller: 'newCliCtrl',
                size: 'lg',
                resolve: {
                    item: function () {
                        //return cliente;
                    }
                }
        });
        modalInstance.result.then(function (selectedItem) {
            if(selectedItem.bandera){
                Data.get('cliente/','all').then(function (result) {
                    $scope.clientes = result.query;
                });
            }else{
                Data.toast(selectedItem);
            }
        });
    }

    $scope.modificar = function(cliente){
        MyService.cliente = cliente;
        var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'cliente/load_admin_cliente',
                controller: 'updateCliCtrl',
                size: 'lg',
                resolve: {
                    item: function () {
                        return cliente;
                    }
                }
        });
        modalInstance.result.then(function (selectedItem) {
            if(selectedItem.rta == "ok"){
                 Data.get('cliente/','all').then(function (result) {
                    $scope.clientes = result.query;
                });
            }
        });
    }
});

app.controller('newCliCtrl', function ($scope, Data, $location, $uibModalInstance) {
    $scope.button_name = 'GUARDAR';
    $scope.accion = "CREAR NUEVO CLIENTE"
    $scope.cancelar = function () {
        $uibModalInstance.dismiss('close');
    };

    $scope.guardar = function (cliente) {
        Data.post('cliente/','nuevo', cliente).then(function (result) {
            $uibModalInstance.close(result);
        });
    };
});

app.controller('updateCliCtrl', function ($scope, Data, $location, $uibModalInstance, MyService) {
    $scope.button_name = 'GUARDAR';
    $scope.accion = "MODIFICAR CLIENTE";
    $scope.cliente = MyService.cliente;
    $scope.cancelar = function () {
        $uibModalInstance.dismiss('close');
    };

    $scope.guardar = function (cliente) {
        var send = [];
        Data.post('cliente/','nuevo', cliente).then(function (result) {
            if(result > 0){
                send.rta = "ok";
            }else{
                send.rta = "fail";
                send.query = result;
            }
            $uibModalInstance.close(send);
        });
    };
});

app.controller('ctrlPemision', function ($scope, Data, $location) {
    console.log('hola mundo');
});

app.controller('ctrlProveedores', function ($scope, Data, $location) {
    console.log('hola mundo');
});