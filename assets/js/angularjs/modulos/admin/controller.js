app.controller('ctrl_login', function ($scope, Data, $location) {
    $scope.error = 0;
    $scope.verificar = function(usuario) {
        Data.post('verificar_usuario', usuario).then(function (result) {
            if(result.count > 0){
                $scope.error = 0;
                $location.path('/clientes');
            }else{
                $scope.error = 1;
            }
        });
    }
});

app.controller('ctrl_main', function ($scope, Data, $location, $uibModal) {
    $scope.init = function() {
        Data.get('load_clientes').then(function (result) {
            $scope.clientes = result.clientes;
        });
    }

    $scope.init();

    $scope.nuevo = function () {
        var cliente = '';
        var modalInstance = $uibModal.open({
            templateUrl: 'welcome/load_admin_clientes',
            controller: 'ctrl_admin_clientes',
            windowClass: 'app-modal-window',
            resolve: {
                item: function () {
                    return cliente;
                }
            }
        });
        modalInstance.result.then(function (selectedObject) {
            if(selectedObject.id_empresa > 0){
                $scope.init();
                //Data.toast({"status": 'ok', "message": 'HA SIDO AGREGADO'});
            }
        });
    };

    $scope.logout = function () {
        Data.post('logout').then(function (result) {
            $location.path('/');
        });
    };
});

app.controller('ctrl_admin_clientes', function ($scope, Data, $location, $uibModalInstance) {
    $scope.save = function (empresa) {
        Data.post('save_cliente', empresa).then(function (result) {
            if(result.id_empresa > 0){
                $uibModalInstance.close(result);
            }
        });
    }

    $scope.cancel = function () {
        $uibModalInstance.dismiss('Close');
    };
});