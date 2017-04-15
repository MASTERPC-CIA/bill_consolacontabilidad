app.controller('inicio_submodules',function($scope,Data, $filter){
    Data.get('get_sub_modules').then(function (result) {
            $scope.query = result;
        });
});
app.controller('cierrecajaCtrl', function ($scope, Data, $filter, $location, $uibModal, MyService) {

    $scope.init = function () {
        $scope.fec_ini = $filter('date')(new Date(), 'yyyy-MM-dd');
        $scope.fec_fin = $filter('date')(new Date(), 'yyyy-MM-dd');
    };
    $scope.init();

    $scope.consultar = function () {
        send = {"fec_ini": $scope.fec_ini, "fec_fin": $scope.fec_fin};
        Data.post('consultar', send).then(function (result) {
            
        });
    };
});