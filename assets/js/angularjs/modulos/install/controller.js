app.controller('CtrlBd', function ($scope, $http) {
    $scope.hostname = '';
    $scope.username = '';
    $scope.password = '';
    $scope.database = '';
    $scope.base_datos_view = true;
    $scope.tablas = false;
    $scope.datos_default = false;
    $scope.title = "CREACION DE BASE DE DATOS";
    $scope.msg = "INGRESE LOS DATOS NECESARIOS";

    $scope.generar = function () {
        send =  { 
                    "hostname":$scope.hostname,
                    "database":$scope.database,
                    "username":$scope.username,
                    "password":$scope.password
                };
        $http.post('index/generar',send).then(function (result) {
            if(result.data.rta){
                $scope.msg = 'OK';
            }
        });
    };
});